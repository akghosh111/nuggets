import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const NewsSearchInterface = () => {
  // Enhanced mock news data with image placeholders
  const mockNews = [
    { id: 1, title: "Global Climate Summit Results", category: "politics", image: "/api/placeholder/400/300", content: "World leaders agreed on new climate targets at the summit." },
    { id: 2, title: "New AI Breakthrough Announced", category: "tech", image: "/api/placeholder/400/300", content: "Researchers reveal groundbreaking AI model with human-like reasoning." },
    { id: 3, title: "SpaceX Launches New Satellite", category: "space", image: "/api/placeholder/400/300", content: "SpaceX successfully deployed its latest communication satellite into orbit." },
    { id: 4, title: "Cricket World Cup Highlights", category: "sports", image: "/api/placeholder/400/300", content: "Stunning performances marked the latest World Cup matches." },
    { id: 5, title: "Economic Forecast Released", category: "business", image: "/api/placeholder/400/300", content: "Analysts predict moderate growth in the coming quarter." },
    { id: 6, title: "New Healthcare Policy Announced", category: "health", image: "/api/placeholder/400/300", content: "Government unveils comprehensive healthcare reform package." },
    { id: 7, title: "Tech Giants Announce Merger", category: "tech", image: "/api/placeholder/400/300", content: "Industry shakeup as two major tech companies join forces." },
    { id: 8, title: "International Film Festival Winners", category: "entertainment", image: "/api/placeholder/400/300", content: "Surprise winners at this year's prestigious film awards." },
    { id: 9, title: "New Discovery in Quantum Physics", category: "science", image: "/api/placeholder/400/300", content: "Scientists report breakthrough that could revolutionize computing." }
  ];

  // Categories for filter buttons
  const categories = [
    "politics", "tech", "business", "sports", 
    "health", "space", "science", "entertainment"
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredNews, setFilteredNews] = useState(mockNews);

  // Improved filter function to handle case-insensitive search across title and content
  useEffect(() => {
    let results = mockNews;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    } else if (selectedCategory) {
      results = results.filter(item => 
        item.category === selectedCategory
      );
    }
    
    setFilteredNews(results);
  }, [searchQuery, selectedCategory]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setSelectedCategory(""); // Clear category selection when searching
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when selecting category
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      {/* Search Bar */}
      <div className="mt-10 sm:mt-20 relative w-full max-w-xl mx-auto mb-6 sm:mb-8 px-2">
        <input
          type="text"
          placeholder="Search today's nuggets... politics,AI, cricket — you name it..."
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

      {/* Featured News Section */}
      <div>
        <h2 className="mt-10 sm:mt-20 mb-6 sm:mb-10 text-xl sm:text-2xl text-center">
          {searchQuery 
            ? `Results for "${searchQuery}"` 
            : selectedCategory 
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News` 
              : "Featured Today"}
        </h2>
        
        {filteredNews.length > 0 ? (
          <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-2">
            {filteredNews.map((item) => (
              <div key={item.id} className="bg-gray-700 rounded-md overflow-hidden shadow-lg">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className=" floatingText w-full h-40 sm:h-48 object-cover"
                />
                <div className="p-3 sm:p-4">
                  <span className="inline-block px-2 py-1 bg-indigo-600 text-xs rounded mb-2">
                    {item.category}
                  </span>
                  <h3 className=" floatingText text-base sm:text-lg font-medium mb-1 sm:mb-2">{item.title}</h3>
                  <p className=" text-gray-300 text-xs sm:text-sm">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-400">No results found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsSearchInterface;