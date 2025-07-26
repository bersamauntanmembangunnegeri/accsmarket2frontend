import ProductCard from './ProductCard'

const CategorySection = ({ category, products, onFilterChange }) => {
  // Extract platform and category from category name
  const getCategoryParts = () => {
    const categoryName = category.name || ''
    
    // Split by common patterns like "Game Accounts Black Desert Mobile"
    if (categoryName.includes('Game Accounts')) {
      return {
        platform: 'Game Accounts',
        categoryName: categoryName.replace('Game Accounts ', '').trim()
      }
    } else if (categoryName.includes('Facebook')) {
      return {
        platform: 'Facebook Accounts',
        categoryName: categoryName.replace('Facebook ', '').trim()
      }
    } else if (categoryName.includes('Instagram')) {
      return {
        platform: 'Instagram Accounts', 
        categoryName: categoryName.replace('Instagram ', '').trim()
      }
    } else {
      // Default fallback
      const parts = categoryName.split(' ')
      if (parts.length > 2) {
        return {
          platform: `${parts[0]} ${parts[1]}`,
          categoryName: parts.slice(2).join(' ')
        }
      }
      return {
        platform: categoryName,
        categoryName: ''
      }
    }
  }

  const { platform, categoryName } = getCategoryParts()

  return (
    <section className="mb-8">
      {/* Category Header - Table Style with Clickable Parts */}
      <div className="bg-gray-700 text-white px-4 py-3 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            <a 
              href={`/?platform=${encodeURIComponent(platform)}`}
              className="cursor-pointer hover:text-blue-300 transition-colors border-b border-transparent hover:border-blue-300"
              title={`Filter by ${platform}`}
            >
              {platform}
            </a>
            {categoryName && (
              <>
                <span className="mx-2">-</span>
                <a 
                  href={`/?category=${encodeURIComponent(categoryName)}`}
                  className="cursor-pointer hover:text-green-300 transition-colors border-b border-transparent hover:border-green-300"
                  title={`Filter by ${categoryName}`}
                >
                  {categoryName}
                </a>
              </>
            )}
          </h2>
          <div className="flex gap-8 text-sm">
            <span>In stock</span>
            <span>Price</span>
          </div>
        </div>
        {category.description && (
          <p className="text-gray-300 text-sm mt-1">{category.description}</p>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-b-lg overflow-hidden">
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isLast={index === products.length - 1}
            onFilterChange={onFilterChange}
          />
        ))}
      </div>

      {/* View All Button */}
      {products.length > 5 && (
        <div className="text-center mt-4">
          <button className="px-6 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
            View all
          </button>
        </div>
      )}
    </section>
  )
}

export default CategorySection

