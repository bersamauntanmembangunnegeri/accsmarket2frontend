'use client';

import { useState, useEffect } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Platform, Category, Filters } from '@/lib/types'

interface ProductFiltersProps {
  onFiltersChange: (filters: Filters) => void;
  isLoading?: boolean;
  platforms?: Platform[];
  categories?: Category[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ 
  onFiltersChange, 
  isLoading = false,
  platforms = [],
  categories = []
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const [filters, setFilters] = useState<Filters>({
    keyword: '',
    platform: '',
    category: '',
    min_price: '',
    max_price: '',
    min_quantity: '',
    max_quantity: ''
  })

  // Handle filter changes
  const handleFilterChange = (key: keyof Filters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Debounce the API call for text inputs
    if (key === 'keyword') {
      const timeoutId = setTimeout(() => {
        onFiltersChange(newFilters)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      onFiltersChange(newFilters)
    }
  }

  // Clear all filters
  const clearFilters = () => {
    const clearedFilters: Filters = {
      keyword: '',
      platform: '',
      category: '',
      min_price: '',
      max_price: '',
      min_quantity: '',
      max_quantity: ''
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'all')

  return (
    <div className="bg-white rounded-lg shadow-sm border mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            {isOpen ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search accounts..."
            value={filters.keyword || ''}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Collapsible Filters */}
      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Platform Filter */}
            <div>
              <Label htmlFor="platform">Platform</Label>
              <select
                id="platform"
                value={filters.platform || ''}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              >
                <option value="">All Platforms</option>
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.name}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <Label>Price Range</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.min_price || ''}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  className="w-full"
                  step="0.001"
                  min="0"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.max_price || ''}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  className="w-full"
                  step="0.001"
                  min="0"
                />
              </div>
            </div>

            {/* Quantity Range */}
            <div>
              <Label>Stock Quantity</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.min_quantity || ''}
                  onChange={(e) => handleFilterChange('min_quantity', e.target.value)}
                  className="w-full"
                  min="0"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.max_quantity || ''}
                  onChange={(e) => handleFilterChange('max_quantity', e.target.value)}
                  className="w-full"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={() => onFiltersChange(filters)}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Applying...' : 'Apply Filters'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductFilters

