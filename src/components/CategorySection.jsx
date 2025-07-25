import ProductCard from './ProductCard'

const CategorySection = ({ category, products }) => {
  return (
    <section className="mb-12">
      {/* Category Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {category.name}
        </h2>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
        
        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {category.children.map(subcategory => (
              <span
                key={subcategory.id}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
              >
                {subcategory.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View More Button */}
      {products.length > 6 && (
        <div className="text-center mt-6">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            View More {category.name}
          </button>
        </div>
      )}
    </section>
  )
}

export default CategorySection

