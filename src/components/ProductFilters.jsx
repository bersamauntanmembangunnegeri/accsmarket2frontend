import { useState, useEffect } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

const ProductFilters = ({ onFiltersChange, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [platforms, setPlatforms] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [vendors, setVendors] = useState([])
  
  const [filters, setFilters] = useState({
    keyword: '',
    platform_id: '',
    category_id: '',
    subcategory_id: '',
    vendor_id: '',
    min_price: '',
    max_price: '',
    min_quantity: '',
    max_quantity: ''
  })

  // Fetch filter options
  useEffect(() => {
    fetchPlatforms()
    fetchCategories()
    fetchVendors()
  }, [])

  // Fetch subcategories when category changes
  useEffect(() => {
    if (filters.category_id) {
      fetchSubcategories(filters.category_id)
    } else {
      setSubcategories([])
      setFilters(prev => ({ ...prev, subcategory_id: '' }))
    }
  }, [filters.category_id])

  const fetchPlatforms = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/platforms`)
      const data = await response.json()
      if (data.success) {
        setPlatforms(data.data)
      }
    } catch (error) {
      console.error('Error fetching platforms:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/subcategories?category_id=${categoryId}`)
      const data = await response.json()
      if (data.success) {
        setSubcategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error)
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendors`)
      const data = await response.json()
      if (data.success) {
        setVendors(data.data)
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Apply filters immediately for keyword search
    if (key === 'keyword') {
      onFiltersChange(newFilters)
    }
  }

  const applyFilters = () => {
    onFiltersChange(filters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      keyword: '',
      platform_id: '',
      category_id: '',
      subcategory_id: '',
      vendor_id: '',
      min_price: '',
      max_price: '',
      min_quantity: '',
      max_quantity: ''
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products or vendors..."
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            className="pl-10"
          />
        </div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(value => value !== '').length}
                </span>
              )}
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      {/* Advanced Filters */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Platform Filter */}
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={filters.platform_id} onValueChange={(value) => handleFilterChange('platform_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All platforms</SelectItem>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.platform_id} value={platform.platform_id.toString()}>
                      {platform.platform_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={filters.category_id} onValueChange={(value) => handleFilterChange('category_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory Filter */}
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select 
                value={filters.subcategory_id} 
                onValueChange={(value) => handleFilterChange('subcategory_id', value)}
                disabled={!filters.category_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All subcategories</SelectItem>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vendor Filter */}
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Select value={filters.vendor_id} onValueChange={(value) => handleFilterChange('vendor_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All vendors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All vendors</SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.vendor_id} value={vendor.vendor_id.toString()}>
                      {vendor.vendor_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_price">Min Price ($)</Label>
              <Input
                id="min_price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={filters.min_price}
                onChange={(e) => handleFilterChange('min_price', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_price">Max Price ($)</Label>
              <Input
                id="max_price"
                type="number"
                step="0.01"
                placeholder="999.99"
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
              />
            </div>
          </div>

          {/* Quantity Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_quantity">Min Quantity</Label>
              <Input
                id="min_quantity"
                type="number"
                placeholder="0"
                value={filters.min_quantity}
                onChange={(e) => handleFilterChange('min_quantity', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_quantity">Max Quantity</Label>
              <Input
                id="max_quantity"
                type="number"
                placeholder="1000"
                value={filters.max_quantity}
                onChange={(e) => handleFilterChange('max_quantity', e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={applyFilters} disabled={isLoading} className="flex-1">
              Apply Filters
            </Button>
            <Button 
              variant="outline" 
              onClick={clearFilters} 
              disabled={isLoading || !hasActiveFilters}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default ProductFilters

