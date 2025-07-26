import { useState, useEffect } from 'react'

const SubcategoryFilter = ({ category, activeSubcategory, onFilterChange }) => {
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category && category.id) {
      fetchSubcategories(category.id)
    } else {
      setSubcategories([])
    }
  }, [category])

  const fetchSubcategories = async (categoryId) => {
    try {
      setLoading(true)
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      const response = await fetch(`${API_BASE_URL}/api/subcategories?category_id=${categoryId}`)
      const data = await response.json()
      
      if (data.success) {
        setSubcategories(data.data)
      } else {
        console.error('Failed to fetch subcategories:', data.message)
        setSubcategories([])
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      setSubcategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubcategoryClick = (subcategory) => {
    if (activeSubcategory === subcategory.name) {
      // If clicking the same subcategory, clear the filter
      onFilterChange({ subcategory: null })
    } else {
      // Apply the subcategory filter
      onFilterChange({ subcategory: subcategory.name })
    }
  }

  const handleAllClick = () => {
    onFilterChange({ subcategory: null })
  }

  if (!category || subcategories.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Filter by {category.name} Type
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {/* All button */}
        <button
          onClick={handleAllClick}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !activeSubcategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All {category.name}
        </button>
        
        {/* Subcategory buttons */}
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            onClick={() => handleSubcategoryClick(subcategory)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubcategory === subcategory.name
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {subcategory.icon && (
              <span className="text-base">{subcategory.icon}</span>
            )}
            {subcategory.name}
            {subcategory.product_count > 0 && (
              <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
                {subcategory.product_count}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {loading && (
        <div className="text-center py-2">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading subcategories...</span>
        </div>
      )}
    </div>
  )
}

export default SubcategoryFilter

