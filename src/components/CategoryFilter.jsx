import React, { useState, useEffect } from 'react';

const CategoryFilter = ({ selectedPlatform, selectedCategory, onCategorySelect, onClearFilters }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlatform) {
      fetchCategoriesForPlatform(selectedPlatform);
    } else {
      setCategories([]);
    }
  }, [selectedPlatform]);

  const fetchCategoriesForPlatform = async (platformName) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
      const data = await response.json();
      
      if (data.success) {
        // Filter categories by platform name
        const platformCategories = data.data.filter(category => 
          category.platform && category.platform.platform_name === platformName
        );
        setCategories(platformCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlatform) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {selectedPlatform} Categories
        </h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Clear Filters
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.category_id}
              onClick={() => onCategorySelect(category)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory?.category_id === category.category_id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.category_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;

