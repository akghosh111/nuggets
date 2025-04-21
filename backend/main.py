import os
import asyncio
import re
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import feedparser
from newspaper import Article
import httpx
import logging
from dotenv import load_dotenv


load_dotenv()


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI(title="RSS Feed Aggregator with Groq Llama Summarization")


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY not found in environment variables.")


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

class ArticlesResponse(BaseModel):
    category: str
    articles: List[ArticleResponse]

async def fetch_article_content(url: str) -> Optional[str]:
    """Extract the full article content using newspaper3k."""
    try:
        article = Article(url)
        article.download()
        article.parse()
        return article.text
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

async def generate_title_and_summary(content: str) -> tuple[str, str]:
    """Generate both title and summary using Groq Llama API."""
    if not GROQ_API_KEY:
        return "No Groq API key provided", "No Groq API key provided. Summary generation skipped."
    
    if not content or len(content.strip()) < 100:
        return "Content too short", "Content too short or empty to summarize."
    
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
                
                return title, summary
            else:
                error_msg = f"Unexpected Groq API response: {response_data}"
                logger.error(error_msg)
                return "API Error", f"Error generating content: {error_msg}"
    except Exception as e:
        logger.error(f"Error calling Groq API: {str(e)}")
        return "Error", f"Error generating content: {str(e)}"

async def process_rss_feed(feed_url: str, limit: int = 5) -> List[dict]:
    """Parse an RSS feed and extract articles."""
    try:
        feed = feedparser.parse(feed_url)
        source_name = feed.feed.title if hasattr(feed.feed, "title") else feed_url
        
        articles = []
        for entry in feed.entries[:limit]:
            if hasattr(entry, "link"):
                article_dict = {
                    "original_title": entry.title if hasattr(entry, "title") else "No title",
                    "url": entry.link,
                    "published": entry.published if hasattr(entry, "published") else None,
                    "source": source_name
                }
               
                if hasattr(entry, "content") and entry.content:
                    article_dict["rss_content"] = entry.content[0].value if isinstance(entry.content, list) else entry.content
                elif hasattr(entry, "description"):
                    article_dict["rss_content"] = entry.description
                
                articles.append(article_dict)
        
        return articles
    except Exception as e:
        logger.error(f"Error processing feed {feed_url}: {e}")
        return []

async def process_article(article_dict: dict) -> ArticleResponse:
    """Process a single article - get content and generate title & summary."""
    try:
        # First fetch the content
        content = await fetch_article_content(article_dict["url"])
        
        # If content extraction failed but we have RSS content, use that
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
        
        return ArticleResponse(
            title=title,
            url=article_dict["url"],
            content=content,
            summary=summary,
            published=article_dict.get("published"),
            source=article_dict["source"]
        )
    except Exception as e:
        logger.error(f"Error processing article {article_dict['url']}: {e}")
        
        return ArticleResponse(
            title=article_dict["original_title"],
            url=article_dict["url"],
            content=None,
            summary=f"Error processing article: {str(e)}",
            published=article_dict.get("published"),
            source=article_dict["source"]
        )

@app.get("/fetch-articles/", response_model=ArticlesResponse)
async def fetch_articles(
    category: str = Query(..., description="Category of news to fetch"),
    limit: int = Query(3, description="Number of articles to fetch per source", ge=1, le=10)
):
    """Fetch articles from specified category, extract content and generate summaries."""
    if category not in RSS_FEEDS:
        raise HTTPException(status_code=404, detail=f"Category not found. Available categories: {', '.join(RSS_FEEDS.keys())}")
    
    
    feeds = RSS_FEEDS[category]
    all_articles = []
    
    
    for feed_url in feeds:
        articles = await process_rss_feed(feed_url, limit)
        all_articles.extend(articles)
    
   
    tasks = [process_article(article) for article in all_articles]
    processed_articles = await asyncio.gather(*tasks)
    
    return ArticlesResponse(category=category, articles=processed_articles)

@app.get("/categories/")
async def list_categories():
    """List all available news categories."""
    return {"categories": list(RSS_FEEDS.keys())}

@app.get("/")
async def root():
    """Root endpoint with basic API information."""
    return {
        "message": "RSS Feed Aggregator with Groq Llama Summarization API",
        "endpoints": {
            "List categories": "/categories/",
            "Fetch articles": "/fetch-articles/?category=<category_name>&limit=<number>"
        },
        "available_categories": list(RSS_FEEDS.keys())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)