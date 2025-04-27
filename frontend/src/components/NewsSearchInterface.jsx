import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000'; // Base URL for all API calls

const NewsSearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categories fetched:', data); // Debug log
        
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          // Automatically select the first category to show initial content
          setSelectedCategory(data.categories[0]);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(`Failed to fetch categories: ${err.message}`);
      }
    };

    fetchCategories();
  }, []);

  // Fetch articles based on category
  useEffect(() => {
    const fetchArticles = async () => {
      if (!selectedCategory) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/fetch-articles/?category=${selectedCategory}&limit=5`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Articles fetched:', data); // Debug log
        
        if (data.articles) {
          setArticles(data.articles);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(`Failed to fetch articles: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  // Filter articles based on search query
  const filteredArticles = searchQuery
    ? articles.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      {/* Search Bar */}
      <div className="mt-10 sm:mt-20 relative w-full max-w-xl mx-auto mb-6 sm:mb-8 px-2">
        <input
          type="text"
          placeholder="Search today's nuggets... politics, AI, cricket — you name it..."
          className="w-full rounded-full py-2 px-4 pr-10 bg-white text-gray-800"
          value={searchQuery}
          onChange={handleSearch}
          aria-label="Search news"
        />
        <div className="absolute right-5 top-2 text-gray-500">
          <Search size={20} />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8 sm:mb-10 px-2">
        <h2 className="text-lg sm:text-xl text-center mb-3 sm:mb-4">Select from categories</h2>
        <div className="mt-4 sm:mt-9 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-2xl mx-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`py-1 sm:py-2 px-2 sm:px-3 rounded-full text-xs sm:text-sm ${
                selectedCategory === category 
                  ? "bg-indigo-600" 
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
              aria-pressed={selectedCategory === category}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* News Section */}
      <div>
        <h2 className="mt-10 sm:mt-20 mb-6 sm:mb-10 text-xl sm:text-2xl text-center">
          {searchQuery 
            ? `Results for "${searchQuery}"` 
            : selectedCategory 
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News` 
              : "Featured Today"}
        </h2>
        
        {loading && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-400">Loading...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10">
            <p className="text-xl text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && filteredArticles.length > 0 ? (
          <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-2">
            {filteredArticles.map((article, index) => (
              <div key={index} className="bg-gray-700 rounded-md overflow-hidden shadow-lg">
                <img 
                  src={article.image_url || "/api/placeholder/400/300"}
                  alt={article.title}
                  className="floatingText w-full h-40 sm:h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/400/300";
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                />
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="inline-block px-2 py-1 bg-indigo-600 text-xs rounded">
                      {article.source}
                    </span>
                    {article.published && (
                      <span className="text-xs text-gray-400">
                        {new Date(article.published).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="floatingText text-base sm:text-lg font-medium mb-1 sm:mb-2">
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-indigo-400"
                    >
                      {article.title}
                    </a>
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {article.summary || article.content || "No summary available"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <div className="text-center py-10">
              <p className="text-xl text-gray-400">No results found</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NewsSearchInterface;