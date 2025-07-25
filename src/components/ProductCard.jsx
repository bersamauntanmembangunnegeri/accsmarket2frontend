import { Star, Clock, RotateCcw, Package, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 3
    }).format(price)
  }

  const truncateTitle = (title, maxLength = 120) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Product Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between mb-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {product.category?.name || product.account_type}
          </span>
          {product.is_featured && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              Featured
            </span>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-gray-900 leading-tight mb-3">
          {truncateTitle(product.title)}
        </h3>

        {/* Vendor Information */}
        {product.vendor && (
          <div className="flex items-center text-xs text-gray-600 mb-2">
            <User className="w-3 h-3 mr-1" />
            <span>Vendor: {product.vendor.vendor_name}</span>
          </div>
        )}

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(product.price)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Package className="w-4 h-4 mr-1" />
            {product.stock_quantity} in stock
          </div>
        </div>
      </div>

      {/* Product Stats */}
      <div className="p-4 border-b bg-gray-50">
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Rating */}
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium ml-1">{product.rating}</span>
            </div>
            <span className="text-xs text-gray-600">
              {product.total_reviews || 0} reviews
            </span>
          </div>

          {/* Return Rate */}
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <RotateCcw className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium ml-1">
                {product.return_rate || 0}%
              </span>
            </div>
            <span className="text-xs text-gray-600">Return rate</span>
          </div>

          {/* Delivery Time */}
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium ml-1">
                {product.delivery_time || '24h'}
              </span>
            </div>
            <span className="text-xs text-gray-600">Delivery</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
            size="sm"
          >
            Add to Cart
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="px-3"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

