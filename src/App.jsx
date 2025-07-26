import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import CategorySection from './components/CategorySection'
import ProductFilters from './components/ProductFilters'
import Footer from './components/Footer'
import AdminPage from './pages/AdminPage'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersLoading, setFiltersLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeFilters, setActiveFilters] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch categories and products from backend API
      const [categoriesResponse, productsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/categories`),
        fetch(`${API_BASE_URL}/api/products`)
      ])

      if (!categoriesResponse.ok || !productsResponse.ok) {
        throw new Error('Failed to fetch data from server')
      }

      const categoriesData = await categoriesResponse.json()
      const productsData = await productsResponse.json()

      if (categoriesData.success) {
        setCategories(categoriesData.data)
      } else {
        throw new Error('Failed to load categories')
      }

      if (productsData.success) {
        setProducts(productsData.data)
        setFilteredProducts(productsData.data)
      } else {
        throw new Error('Failed to load products')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.message)
      
      // Fallback to mock data if API fails
      const mockCategories = [
        {
          id: 1,
          name: "Facebook Accounts",
          slug: "facebook-accounts",
          description: "High-quality Facebook accounts for various purposes",
          children: [
            { id: 2, name: "Facebook Softregs", slug: "facebook-softregs" },
            { id: 3, name: "Facebook With friends", slug: "facebook-with-friends" }
          ]
        },
        {
          id: 6,
          name: "Instagram Accounts",
          slug: "instagram-accounts", 
          description: "Premium Instagram accounts with various features",
          children: [
            { id: 7, name: "Instagram Softreg", slug: "instagram-softreg" },
            { id: 8, name: "Instagram Aged", slug: "instagram-aged" }
          ]
        }
      ]

      const mockProducts = [
        {
          id: 1,
          category_id: 2,
          title: "FB Accounts | Verified by e-mail, there is no email in the set. Male or female. The account profiles may be empty or have limited entries such as photos and other information. 2FA included. Cookies are included. Accounts are registered in United Kingdom IP.",
          description: "High quality Facebook accounts verified by email",
          price: 0.278,
          stock_quantity: 345,
          rating: 4.6,
          total_reviews: 89,
          account_type: "Facebook Softreg",
          category: { name: "Facebook Softregs" }
        },
        {
          id: 4,
          category_id: 7,
          title: "IG Accounts | Verified by email, email NOT included. Male or female. The profiles information is partially filled. 2FA included. UserAgent, cookies included. Registered from USA IP.",
          description: "Instagram soft registered accounts from USA",
          price: 0.183,
          stock_quantity: 99,
          rating: 4.9,
          total_reviews: 156,
          account_type: "Instagram Softreg",
          category: { name: "Instagram Softreg" }
        }
      ]
      
      setCategories(mockCategories)
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = async (filters) => {
    try {
      setFiltersLoading(true)
      setActiveFilters(filters)
      
      // Build query parameters
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined && value !== 'all') {
          params.append(key, value)
        }
      })
      
      // Try to fetch filtered products from API
      const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setFilteredProducts(data.data)
          return
        }
      }
      
      // If API fails, fall back to client-side filtering
      console.warn('API filtering failed, using client-side filtering')
      const filtered = products.filter(product => {
        if (filters.keyword && !product.title.toLowerCase().includes(filters.keyword.toLowerCase())) {
          return false
        }
        if (filters.category_id && filters.category_id !== 'all' && product.category_id !== parseInt(filters.category_id)) {
          return false
        }
        if (filters.min_price && product.price < parseFloat(filters.min_price)) {
          return false
        }
        if (filters.max_price && product.price > parseFloat(filters.max_price)) {
          return false
        }
        if (filters.min_quantity && product.stock_quantity < parseInt(filters.min_quantity)) {
          return false
        }
        if (filters.max_quantity && product.stock_quantity > parseInt(filters.max_quantity)) {
          return false
        }
        // Handle platform filtering
        if (filters.platform) {
          const categoryName = product.category?.name || product.account_type || ''
          const platformMatch = categoryName.toLowerCase().includes(filters.platform.toLowerCase().replace(' accounts', ''))
          if (!platformMatch) {
            return false
          }
        }
        // Handle category filtering
        if (filters.category) {
          const categoryName = product.category?.name || product.account_type || ''
          if (!categoryName.toLowerCase().includes(filters.category.toLowerCase())) {
            return false
          }
        }
        // Handle vendor filtering
        if (filters.vendor) {
          const vendorName = product.vendor?.vendor_name || product.vendor || ''
          if (!vendorName.toLowerCase().includes(filters.vendor.toLowerCase())) {
            return false
          }
        }
        return true
      })
      setFilteredProducts(filtered)
    } catch (error) {
      console.error('Error filtering products:', error)
      // Fallback to client-side filtering on any error
      const filtered = products.filter(product => {
        if (filters.keyword && !product.title.toLowerCase().includes(filters.keyword.toLowerCase())) {
          return false
        }
        if (filters.category_id && filters.category_id !== 'all' && product.category_id !== parseInt(filters.category_id)) {
          return false
        }
        if (filters.min_price && product.price < parseFloat(filters.min_price)) {
          return false
        }
        if (filters.max_price && product.price > parseFloat(filters.max_price)) {
          return false
        }
        if (filters.min_quantity && product.stock_quantity < parseInt(filters.min_quantity)) {
          return false
        }
        if (filters.max_quantity && product.stock_quantity > parseInt(filters.max_quantity)) {
          return false
        }
        // Handle platform filtering
        if (filters.platform) {
          const categoryName = product.category?.name || product.account_type || ''
          const platformMatch = categoryName.toLowerCase().includes(filters.platform.toLowerCase().replace(' accounts', ''))
          if (!platformMatch) {
            return false
          }
        }
        // Handle category filtering
        if (filters.category) {
          const categoryName = product.category?.name || product.account_type || ''
          if (!categoryName.toLowerCase().includes(filters.category.toLowerCase())) {
            return false
          }
        }
        // Handle vendor filtering
        if (filters.vendor) {
          const vendorName = product.vendor?.vendor_name || product.vendor || ''
          if (!vendorName.toLowerCase().includes(filters.vendor.toLowerCase())) {
            return false
          }
        }
        return true
      })
      setFilteredProducts(filtered)
    } finally {
      setFiltersLoading(false)
    }
  }

  // New function to handle quick filters from category headers and vendor clicks
  const handleQuickFilter = (filterType) => {
    console.log('handleQuickFilter called with:', filterType)
    const newFilters = { ...activeFilters, ...filterType }
    console.log('New filters:', newFilters)
    handleFiltersChange(newFilters)
  }

  const getCategoryWithProducts = (category) => {
    // Get products for this category and its children
    const categoryIds = [category.id, ...(category.children || []).map(child => child.id)]
    const categoryProducts = filteredProducts.filter(product => 
      categoryIds.includes(product.category_id)
    )
    return categoryProducts
  }

  const hasActiveFilters = Object.entries(activeFilters).some(([key, value]) => {
    if (key === 'keyword' || key.includes('price') || key.includes('quantity')) {
      return value !== '' && value !== null && value !== undefined
    }
    return value !== 'all' && value !== '' && value !== null && value !== undefined
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AccsMarket...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <Routes>
          <Route path="/" element={
            <main className="max-w-7xl mx-auto px-4 py-8">
              {/* API Status Indicator */}
              {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        <strong>API Connection Issue:</strong> Using demo data. Backend: {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Welcome Section */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Buy or Sell Social Media Accounts
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Your trusted marketplace for high-quality, verified social media accounts. 
                  Browse our extensive collection of Facebook, Instagram, and other platform accounts.
                </p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredProducts.length}+
                  </div>
                  <div className="text-sm text-gray-600">
                    {hasActiveFilters ? 'Filtered Results' : 'Products Available'}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-gray-600">Secure</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-orange-600">Fast</div>
                  <div className="text-sm text-gray-600">Delivery</div>
                </div>
              </div>

              {/* Product Filters */}
              <ProductFilters 
                onFiltersChange={handleFiltersChange}
                isLoading={filtersLoading}
              />

              {/* Loading indicator for filters */}
              {filtersLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Filtering products...</p>
                </div>
              )}

              {/* Categories and Products */}
              <div className="space-y-8">
                {categories.map(category => {
                  const categoryProducts = getCategoryWithProducts(category)
                  if (categoryProducts.length === 0) return null
                  
                  return (
                    <CategorySection
                      key={category.id}
                      category={category}
                      products={categoryProducts}
                      onFilterChange={handleQuickFilter}
                    />
                  )
                })}
              </div>

              {/* No Products Message */}
              {filteredProducts.length === 0 && !filtersLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {hasActiveFilters 
                      ? 'No products match your current filters. Try adjusting your search criteria.'
                      : 'No products available at the moment.'
                    }
                  </p>
                </div>
              )}
            </main>
          } />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  )
}

export default App

