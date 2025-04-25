import os
import asyncio
import re
import json
from typing import List, Optional, Dict, Any
from datetime import timedelta
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import feedparser
from newspaper import Article
import httpx
import logging
from dotenv import load_dotenv
import redis.asyncio as redis


load_dotenv()


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI(title="RSS Feed Aggregator with Groq Llama Summarization")


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY not found in environment variables.")


REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = redis.from_url(REDIS_URL)

CACHE_EXPIRATION = int(os.getenv("CACHE_EXPIRATION", 3600))


RSS_FEEDS = {
    "technology": [
        "https://indianexpress.com/section/technology/feed/",
        "https://www.livemint.com/rss/technology",
        "https://tech.hindustantimes.com/rss/rssfeed"
    ],
    "business": [
        "https://indianexpress.com/section/business/feed/",
        "https://www.livemint.com/rss/companies",
        "https://www.hindustantimes.com/business/rssfeed.xml"
    ],
    "sports": [
        "https://indianexpress.com/section/sports/feed/",
        "https://www.livemint.com/rss/sports",
        "https://www.hindustantimes.com/sports/rssfeed.xml"
    ],
    "india": [
        "https://indianexpress.com/section/india/feed/",
        "https://www.livemint.com/rss/politics",
        "https://www.hindustantimes.com/india-news/rssfeed.xml"
    ]
}

# Pydantic models
class ArticleResponse(BaseModel):
    title: str
    url: str
    content: Optional[str] = None
    summary: Optional[str] = None
    published: Optional[str] = None
    source: str
    image_url: Optional[str] = None  # Added image URL field

class ArticlesResponse(BaseModel):
    category: str
    articles: List[ArticleResponse]

async def get_from_cache(key: str) -> Optional[Dict[str, Any]]:
    """Get data from Redis cache."""
    try:
        data = await redis_client.get(key)
        if data:
            logger.info(f"Cache hit for: {key}")
            return json.loads(data)
        logger.info(f"Cache miss for: {key}")
        return None
    except Exception as e:
        logger.error(f"Redis get error: {e}")
        return None

async def set_in_cache(key: str, value: Dict[str, Any], expiration: int = CACHE_EXPIRATION) -> bool:
    """Set data in Redis cache with expiration."""
    try:
        await redis_client.set(key, json.dumps(value), ex=expiration)
        logger.info(f"Cached: {key}, expires in {expiration}s")
        return True
    except Exception as e:
        logger.error(f"Redis set error: {e}")
        return False

async def fetch_article_content(url: str) -> Optional[str]:
    """Extract the full article content using newspaper3k with caching."""
    
    cache_key = f"article_content:{url}"
    
    
    cached_content = await get_from_cache(cache_key)
    if cached_content:
        return cached_content.get("content")
    
   
    try:
        article = Article(url)
        article.download()
        article.parse()
        content = article.text
        
       
        if content:
            await set_in_cache(cache_key, {"content": content})
        
        return content
    except Exception as e:
        logger.error(f"Error extracting content from {url}: {e}")
        return None

def clean_text(text: str) -> str:
    """Clean text by removing extra whitespace and newlines."""
    if not text:
        return ""
    
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_image_url(entry: Any) -> Optional[str]:
    """Extract image URL from a feed entry."""
    try:
        # Try to get image from media_content
        if hasattr(entry, 'media_content') and entry.media_content:
            for media in entry.media_content:
                if 'url' in media:
                    return media['url']
        
        # Try to get image from media_thumbnail
        if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
            for media in entry.media_thumbnail:
                if 'url' in media:
                    return media['url']
        
        # Try to get image from enclosures
        if hasattr(entry, 'enclosures') and entry.enclosures:
            for enclosure in entry.enclosures:
                if 'href' in enclosure and enclosure.get('type', '').startswith('image/'):
                    return enclosure['href']
        
        # Try to extract image from content or description using regex
        content_to_check = []
        if hasattr(entry, 'content') and entry.content:
            content_text = entry.content[0].value if isinstance(entry.content, list) else entry.content
            content_to_check.append(content_text)
        if hasattr(entry, 'description'):
            content_to_check.append(entry.description)
        
        for text in content_to_check:
            img_matches = re.findall(r'<img[^>]+src="([^">]+)"', text)
            if img_matches:
                return img_matches[0]
        
        # No image found
        return None
    except Exception as e:
        logger.error(f"Error extracting image URL: {e}")
        return None

async def generate_title_and_summary(content: str) -> tuple[str, str]:
    """Generate both title and summary using Groq Llama API with caching."""
    if not GROQ_API_KEY:
        return "No Groq API key provided", "No Groq API key provided. Summary generation skipped."
    
    if not content or len(content.strip()) < 100:
        return "Content too short", "Content too short or empty to summarize."
    
    
    content_hash = hash(content)
    cache_key = f"summary:{content_hash}"
    
    
    cached_summary = await get_from_cache(cache_key)
    if cached_summary:
        return cached_summary.get("title", ""), cached_summary.get("summary", "")
    
    try:
        logger.info("Calling Groq API for title and summary generation")
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama3-8b-8192",  
                    "messages": [
                        {"role": "system", "content": "You are an expert news editor who creates accurate titles and summaries based on article content. Provide direct, clear responses without introductory phrases."},
                        {"role": "user", "content": f"Based on the following article content, generate:\n1. A concise, accurate title (one line)\n2. A brief 2-3 sentence summary\n\nFormat your response exactly like this:\nTITLE: [your generated title]\nSUMMARY: [your generated summary]\n\nHere's the article content:\n{content[:4000]}"}
                    ],
                    "max_tokens": 300
                }
            )
            
            response_data = response.json()
            logger.info(f"Groq API response status: {response.status_code}")
            
            if response.status_code == 200 and "choices" in response_data and len(response_data["choices"]) > 0:
                result = response_data["choices"][0]["message"]["content"].strip()
                
                title_match = re.search(r"TITLE:\s*(.*?)(?:\n|$)", result, re.IGNORECASE)
                summary_match = re.search(r"SUMMARY:\s*(.*)", result, re.IGNORECASE | re.DOTALL)
                
                title = title_match.group(1).strip() if title_match else "Title extraction failed"
                summary = summary_match.group(1).strip() if summary_match else "Summary extraction failed"
                
                title = clean_text(title)
                summary = clean_text(summary)
                
                logger.info(f"Generated title: {title}")
                logger.info(f"Generated summary: {summary[:50]}...")
                
               
                await set_in_cache(cache_key, {"title": title, "summary": summary})
                
                return title, summary
            else:
                error_msg = f"Unexpected Groq API response: {response_data}"
                logger.error(error_msg)
                return "API Error", f"Error generating content: {error_msg}"
    except Exception as e:
        logger.error(f"Error calling Groq API: {str(e)}")
        return "Error", f"Error generating content: {str(e)}"

async def extract_image_with_newspaper3k(url: str) -> Optional[str]:
    """Extract image URL from article using newspaper3k."""
    cache_key = f"article_image:{url}"
    
    cached_image = await get_from_cache(cache_key)
    if cached_image:
        return cached_image.get("image_url")
    
    try:
        article = Article(url)
        article.download()
        article.parse()
        
        if article.top_image:
            await set_in_cache(cache_key, {"image_url": article.top_image})
            return article.top_image
        return None
    except Exception as e:
        logger.error(f"Error extracting image with newspaper3k from {url}: {e}")
        return None

async def process_rss_feed(feed_url: str, limit: int = 5) -> List[dict]:
    """Parse an RSS feed and extract articles with caching."""
 
    cache_key = f"rss_feed:{feed_url}:{limit}"
    
    cached_feed = await get_from_cache(cache_key)
    if cached_feed:
        return cached_feed.get("articles", [])
    
    try:
        feed = feedparser.parse(feed_url)
        source_name = feed.feed.title if hasattr(feed.feed, "title") else feed_url
        
        articles = []
        for entry in feed.entries[:limit]:
            if hasattr(entry, "link"):
                # Extract image URL from RSS feed
                image_url = extract_image_url(entry)
                
                article_dict = {
                    "original_title": entry.title if hasattr(entry, "title") else "No title",
                    "url": entry.link,
                    "published": entry.published if hasattr(entry, "published") else None,
                    "source": source_name,
                    "image_url": image_url  # Add image URL to article dict
                }
               
                if hasattr(entry, "content") and entry.content:
                    article_dict["rss_content"] = entry.content[0].value if isinstance(entry.content, list) else entry.content
                elif hasattr(entry, "description"):
                    article_dict["rss_content"] = entry.description
                
                articles.append(article_dict)
        
        
        await set_in_cache(cache_key, {"articles": articles}, expiration=1800)  # 30 minutes
        
        return articles
    except Exception as e:
        logger.error(f"Error processing feed {feed_url}: {e}")
        return []

async def process_article(article_dict: dict) -> ArticleResponse:
    """Process a single article - get content and generate title & summary."""
    
    cache_key = f"processed_article:{article_dict['url']}"
    
    
    cached_article = await get_from_cache(cache_key)
    if cached_article:
        return ArticleResponse(**cached_article)
    
    try:
        
        content = await fetch_article_content(article_dict["url"])
        
       
        if not content and "rss_content" in article_dict:
            logger.info(f"Using RSS content for article: {article_dict['original_title']}")
            content = article_dict["rss_content"]
        
        title = article_dict["original_title"] 
        summary = None
        
        if content:
            ai_title, summary = await generate_title_and_summary(content)
            title = ai_title
            
            logger.info(f"Original title: '{article_dict['original_title']}'")
            logger.info(f"AI-generated title: '{title}'")
            logger.info(f"Summary length: {len(summary) if summary else 0}")
        else:
            logger.warning(f"No content extracted for article: '{article_dict['original_title']}'")
        
        # Try to get image from the article if not available in RSS
        image_url = article_dict.get("image_url")
        if not image_url:
            image_url = await extract_image_with_newspaper3k(article_dict["url"])
            logger.info(f"Using newspaper3k to extract image for article: {article_dict['original_title']}")
        
        article_response = ArticleResponse(
            title=title,
            url=article_dict["url"],
            content=content,
            summary=summary,
            published=article_dict.get("published"),
            source=article_dict["source"],
            image_url=image_url  # Include image URL in response
        )
        
        
        await set_in_cache(cache_key, article_response.dict())
        
        return article_response
    except Exception as e:
        logger.error(f"Error processing article {article_dict['url']}: {e}")
        
        return ArticleResponse(
            title=article_dict["original_title"],
            url=article_dict["url"],
            content=None,
            summary=f"Error processing article: {str(e)}",
            published=article_dict.get("published"),
            source=article_dict["source"],
            image_url=article_dict.get("image_url")  # Include image URL even in error case
        )

@app.get("/fetch-articles/", response_model=ArticlesResponse)
async def fetch_articles(
    category: str = Query(..., description="Category of news to fetch"),
    limit: int = Query(3, description="Number of articles to fetch per source", ge=1, le=10),
    refresh_cache: bool = Query(False, description="Force refresh cache")
):
    """Fetch articles from specified category, extract content and generate summaries."""
    if category not in RSS_FEEDS:
        raise HTTPException(status_code=404, detail=f"Category not found. Available categories: {', '.join(RSS_FEEDS.keys())}")
    
    
    cache_key = f"category_response:{category}:{limit}"
    
    
    if not refresh_cache:
        cached_response = await get_from_cache(cache_key)
        if cached_response:
            return ArticlesResponse(**cached_response)
    
    feeds = RSS_FEEDS[category]
    all_articles = []
    
    for feed_url in feeds:
        articles = await process_rss_feed(feed_url, limit)
        all_articles.extend(articles)
    
    tasks = [process_article(article) for article in all_articles]
    processed_articles = await asyncio.gather(*tasks)
    
    response = ArticlesResponse(category=category, articles=processed_articles)
    
    
    await set_in_cache(cache_key, response.dict())
    
    return response

@app.get("/categories/")
async def list_categories():
    """List all available news categories."""
    return {"categories": list(RSS_FEEDS.keys())}

@app.get("/clear-cache/")
async def clear_cache(pattern: str = "*"):
    """Clear cache by pattern (admin endpoint)."""
    try:
       
        cursor = 0
        keys_to_delete = []
        
        while True:
            cursor, keys = await redis_client.scan(cursor, match=pattern, count=100)
            keys_to_delete.extend(keys)
            if cursor == 0:
                break
        
       
        if keys_to_delete:
            await redis_client.delete(*keys_to_delete)
            return {"message": f"Successfully cleared {len(keys_to_delete)} cache entries"}
        return {"message": "No cache entries found matching the pattern"}
    except Exception as e:
        logger.error(f"Error clearing cache: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to clear cache: {str(e)}")

@app.get("/cache-stats/")
async def cache_stats():
    """Get cache statistics."""
    try:
        info = await redis_client.info()
        keys_count = await redis_client.dbsize()
        memory_used = info.get("used_memory_human", "unknown")
        
        return {
            "keys_count": keys_count,
            "memory_used": memory_used,
            "uptime_seconds": info.get("uptime_in_seconds", 0)
        }
    except Exception as e:
        logger.error(f"Error getting cache stats: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get cache stats: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint with basic API information."""
    return {
        "message": "RSS Feed Aggregator with Groq Llama Summarization API",
        "endpoints": {
            "List categories": "/categories/",
            "Fetch articles": "/fetch-articles/?category=<category_name>&limit=<number>&refresh_cache=<bool>",
            "Clear cache": "/clear-cache/?pattern=<pattern>",
            "Cache stats": "/cache-stats/"
        },
        "available_categories": list(RSS_FEEDS.keys())
    }

@app.on_event("startup")
async def startup_event():
    """Check Redis connection on startup."""
    try:
        await redis_client.ping()
        logger.info("Successfully connected to Redis")
    except Exception as e:
        logger.error(f"Failed to connect to Redis: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Close Redis connection on shutdown."""
    try:
        await redis_client.close()
        logger.info("Redis connection closed")
    except Exception as e:
        logger.error(f"Error closing Redis connection: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)