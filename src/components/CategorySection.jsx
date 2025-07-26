import ProductCard from './ProductCard'

const CategorySection = ({ category, products }) => {
  return (
    <section className="mb-8">
      {/* Category Header - Table Style */}
      <div className="bg-gray-700 text-white px-4 py-3 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {category.name}
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

