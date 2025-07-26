import { Star, Clock, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ProductCard = ({ product, isLast, onFilterChange }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 3
    }).format(price)
  }

  const truncateTitle = (title, maxLength = 100) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + '...'
  }

  // Get platform icon based on category
  const getPlatformIcon = () => {
    const categoryName = product.category?.name?.toLowerCase() || product.account_type?.toLowerCase() || ''
    
    if (categoryName.includes('facebook')) {
      return (
        <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">
          f
        </div>
      )
    } else if (categoryName.includes('instagram')) {
      return (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded flex items-center justify-center text-white font-bold text-lg">
          ig
        </div>
      )
    } else if (categoryName.includes('discord')) {
      return (
        <div className="w-12 h-12 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-lg">
          D
        </div>
      )
    } else if (categoryName.includes('game')) {
      return (
        <div className="w-12 h-12 bg-green-600 rounded flex items-center justify-center text-white font-bold text-lg">
          G
        </div>
      )
    } else {
      return (
        <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
      )
    }
  }

  const handleVendorClick = () => {
    if (onFilterChange && product.vendor) {
      onFilterChange({ vendor: product.vendor.vendor_name || product.vendor })
    }
  }

  // Get vendor name from different possible sources
  const getVendorName = () => {
    if (product.vendor?.vendor_name) {
      return product.vendor.vendor_name
    } else if (product.vendor) {
      return product.vendor
    } else {
      // Generate a mock vendor name for demo purposes
      const vendors = ['Future Systems', 'Global Tech', 'Innovate Solutions']
      return vendors[product.id % vendors.length]
    }
  }

  const vendorName = getVendorName()

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4">
      {/* Platform Icon */}
      <div className="flex justify-center mb-4">
        {getPlatformIcon()}
      </div>

      {/* Product Title/Description */}
      <h3 className="text-sm font-medium text-gray-900 mb-3 leading-relaxed text-center">
        {truncateTitle(product.title)}
      </h3>

      {/* Vendor Name - Clickable */}
      <div className="mb-3 text-center">
        <span className="text-xs text-gray-600">Vendor: </span>
        <a 
          onClick={handleVendorClick}
          className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 hover:underline transition-colors"
          title={`Filter by vendor: ${vendorName}`}
        >
          {vendorName}
        </a>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-600 mb-4">
        {/* Time indicator */}
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-green-600" />
          <span className="text-green-600">48h</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span>{product.rating || '4.6'}</span>
        </div>
      </div>

      {/* Stock */}
      <div className="text-center mb-3">
        <div className="text-sm font-medium text-gray-900">
          {product.stock_quantity} pcs.
        </div>
        <div className="text-xs text-gray-600">Available</div>
      </div>

      {/* Price */}
      <div className="text-center mb-4">
        <div className="text-xs text-gray-600 mb-1">Price per pc</div>
        <div className="text-lg font-bold text-gray-900">
          from {formatPrice(product.price)}
        </div>
      </div>

      {/* Buy Button */}
      <div className="text-center">
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm w-full"
          size="sm"
        >
          Buy Now
        </Button>
      </div>
    </div>
  )
}

export default ProductCard

