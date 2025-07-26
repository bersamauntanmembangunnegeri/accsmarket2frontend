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

  const truncateTitle = (title, maxLength = 200) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + '...'
  }

  // Get platform icon based on category
  const getPlatformIcon = () => {
    const categoryName = product.category?.name?.toLowerCase() || product.account_type?.toLowerCase() || ''
    
    if (categoryName.includes('facebook')) {
      return (
        <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">
          f
        </div>
      )
    } else if (categoryName.includes('instagram')) {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded flex items-center justify-center text-white font-bold text-lg">
          ig
        </div>
      )
    } else if (categoryName.includes('discord')) {
      return (
        <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-lg">
          D
        </div>
      )
    } else {
      return (
        <div className="w-10 h-10 bg-gray-600 rounded flex items-center justify-center text-white font-bold text-lg">
          G
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
    <div className={`p-4 ${!isLast ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition-colors`}>
      <div className="flex items-start gap-4">
        {/* Platform Icon */}
        <div className="flex-shrink-0">
          {getPlatformIcon()}
        </div>

        {/* Product Content */}
        <div className="flex-1 min-w-0">
          {/* Product Title/Description */}
          <p className="text-sm text-gray-900 leading-relaxed mb-2">
            {truncateTitle(product.title)}
          </p>

          {/* Vendor Name - Clickable */}
          <div className="mb-2">
            <span className="text-xs text-gray-600">Vendor: </span>
            <span 
              className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 hover:underline transition-colors"
              onClick={handleVendorClick}
              title={`Filter by vendor: ${vendorName}`}
            >
              {vendorName}
            </span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 text-xs text-gray-600">
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

            {/* Additional stats */}
            <div className="flex items-center gap-1">
              <span className="text-blue-600">2.1%</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-gray-400">0-10</span>
            </div>
          </div>
        </div>

        {/* Stock and Price Section */}
        <div className="flex items-center gap-8 text-sm">
          {/* Stock */}
          <div className="text-center min-w-[80px]">
            <div className="font-medium text-gray-900">
              {product.stock_quantity} pcs.
            </div>
          </div>

          {/* Price per piece */}
          <div className="text-center min-w-[100px]">
            <div className="text-xs text-gray-600 mb-1">Price per pc</div>
            <div className="font-medium text-gray-900">
              from {formatPrice(product.price)}
            </div>
          </div>

          {/* Buy Button */}
          <div className="min-w-[80px]">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm"
              size="sm"
            >
              Buy
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

