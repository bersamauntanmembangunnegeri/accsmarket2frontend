import { ChevronRight } from 'lucide-react'

const CategoryBreadcrumb = ({ category, subcategory, onFilterChange }) => {
  const handleHomeClick = () => {
    onFilterChange({})
  }

  const handleCategoryClick = () => {
    if (category) {
      onFilterChange({ category: category.name })
    }
  }

  const handleSubcategoryClick = () => {
    if (subcategory) {
      onFilterChange({ subcategory: subcategory.name })
    }
  }

  return (
    <div className="bg-gray-100 px-4 py-2 rounded-lg mb-4">
      <nav className="flex items-center space-x-2 text-sm">
        <button
          onClick={handleHomeClick}
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          Home
        </button>
        
        {category && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button
              onClick={handleCategoryClick}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              {category.name}
            </button>
          </>
        )}
        
        {subcategory && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button
              onClick={handleSubcategoryClick}
              className="text-green-600 hover:text-green-800 hover:underline transition-colors font-medium"
            >
              {subcategory.name}
            </button>
          </>
        )}
      </nav>
    </div>
  )
}

export default CategoryBreadcrumb

