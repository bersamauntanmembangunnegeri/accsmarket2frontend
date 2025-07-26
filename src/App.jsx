import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import CategorySection from './components/CategorySection'
import ProductFilters from './components/ProductFilters'
import PlatformBreadcrumb from './components/PlatformBreadcrumb'
import CategoryFilter from './components/CategoryFilter'
import { Button } from "@/components/ui/button"
import Footer from './components/Footer'
import ProductCard from './components/ProductCard'
import AdminPage from './pages/AdminPage'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filtersLoading, setFiltersLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeFilters, setActiveFilters] = useState({})

  useEffect(() => {
    fetchData()
    // Check URL parameters on page load and on URL change
    const handleUrlChange = () => {
      checkUrlParameters()
    }
    window.addEventListener("popstate", handleUrlChange)
    return () => {
      window.removeEventListener("popstate", handleUrlChange)
    }
  }, [])

  const checkUrlParameters = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const filters = {}
    
    if (urlParams.get('platform')) {
      filters.platform = urlParams.get('platform')
    }
    if (urlParams.get('category')) {
      filters.category = urlParams.get('category')
    }
    if (urlParams.get('vendor')) {
      filters.vendor = urlParams.get('vendor')
    }
    
    if (Object.keys(filters).length > 0) {
      setActiveFilters(filters)
      handleFiltersChange(filters)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching initial data...')
      // Fetch categories, products, and platforms from backend API
      const [categoriesResponse, productsResponse, platformsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/categories`),
        fetch(`${API_BASE_URL}/api/products`),
        fetch(`${API_BASE_URL}/api/platforms`)
      ])

      if (!categoriesResponse.ok || !productsResponse.ok || !platformsResponse.ok) {
        throw new Error("Failed to fetch data from server")
      }

      const categoriesData = await categoriesResponse.json()
      const productsData = await productsResponse.json()
      const platformsData = await platformsResponse.json()

      console.log('Categories data:', categoriesData)
      console.log('Products data:', productsData)
      console.log('Platforms data:', platformsData)

      if (categoriesData.success) {
        setCategories(categoriesData.data)
      } else {
        throw new Error("Failed to load categories")
      }

      if (productsData.success) {
        setProducts(productsData.data)
        setFilteredProducts(productsData.data)
      } else {
        throw new Error("Failed to load products")
      }

      if (platformsData.success) {
        setPlatforms(platformsData.data)
      } else {
        throw new Error("Failed to load platforms")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
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

      const mockPlatforms = [
        { id: 1, name: "Facebook Accounts" },
        { id: 2, name: "Instagram Accounts" },
        { id: 3, name: "Game Accounts" },
        { id: 4, name: "Discord Accounts" },
        { id: 5, name: "Twitter Accounts" },
        { id: 6, name: "YouTube Accounts" },
        { id: 7, name: "TikTok Accounts" },
        { id: 8, name: "LinkedIn Accounts" }
      ]
      
      setCategories(mockCategories)
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setPlatforms(mockPlatforms)
    } finally {
      setLoading(false)
      console.log('Loading set to false')
    }
  }

  const handleFiltersChange = async (filters) => {
    try {
      setFiltersLoading(true)
      setActiveFilters(filters)
      
      console.log('Filtering with filters:', filters)
      
      // Build query parameters for API call
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined && value !== 'all') {
          params.append(key, value)
        }
      })
      
      // Update URL with new filters
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.pushState({ path: newUrl }, '', newUrl)
      console.log('URL updated to:', newUrl)
      
      // Make API call to backend with filters
      const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch filtered products from server")
      }
      const data = await response.json()
      
      if (data.success) {
        setFilteredProducts(data.data)
        setProducts(data.data) // Update main products state as well
      } else {
        throw new Error(data.message || "Failed to filter products")
      }
    } catch (error) {
      console.error('Error filtering products:', error)
      setError(error.message)
      setFilteredProducts([]) // Clear products on error
    } finally {
      setFiltersLoading(false)
    }
  }

  // New function to handle quick filters from category headers and vendor clicks
  const handleQuickFilter = (filterType) => {
    console.log('handleQuickFilter called with:', filterType)
    
    // Map platform filters to category filters for proper component rendering
    let newFilters = { ...activeFilters }
    
    if (filterType.platform) {
      // Set selected platform and clear category
      setSelectedPlatform(filterType.platform)
      setSelectedCategory(null)
      
      // Map platform name to category name
      const platformToCategory = {
        'Facebook Accounts': 'Facebook Accounts',
        'Instagram Accounts': 'Instagram Accounts',
        'Game Accounts': 'Game Accounts',
        'Discord Accounts': 'Discord Accounts',
        'Twitter Accounts': 'Twitter Accounts',
        'YouTube Accounts': 'YouTube Accounts',
        'TikTok Accounts': 'TikTok Accounts',
        'LinkedIn Accounts': 'LinkedIn Accounts'
      }
      
      newFilters.platform = filterType.platform
      newFilters.category = platformToCategory[filterType.platform] || filterType.platform
    } else {
      // Handle other filter types
      newFilters = { ...newFilters, ...filterType }
    }
    
    console.log('New filters (from quick filter):', newFilters)
    handleFiltersChange(newFilters)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    const newFilters = {
      ...activeFilters,
      category_id: category.category_id
    }
    handleFiltersChange(newFilters)
  }

  const handleNavigate = (type, data) => {
    if (type === 'home') {
      setSelectedPlatform(null)
      setSelectedCategory(null)
      setActiveFilters({})
      fetchData() // Re-fetch all data when navigating to home
      window.history.pushState({ path: '/' }, '', '/')
    } else if (type === 'platform') {
      setSelectedPlatform(data)
      setSelectedCategory(null)
      handleQuickFilter({ platform: data })
    } else if (type === 'category') {
      setSelectedCategory(data)
      handleCategorySelect(data)
    }
  }

  const handleClearFilters = () => {
    setSelectedPlatform(null)
    setSelectedCategory(null)
    setActiveFilters({})
    fetchData() // Re-fetch all data when clearing filters
    window.history.pushState({ path: '/' }, '', '/')
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Buy or Sell Social Media Accounts</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Your trusted marketplace for high-quality, verified social media accounts. Browse our
                  extensive collection of Facebook, Instagram, and other platform accounts.
                </p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center border">
                  <p className="text-green-600 text-3xl font-bold">{products.length}+</p>
                  <p className="text-gray-500">Products Available</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center border">
                  <p className="text-blue-600 text-3xl font-bold">24/7</p>
                  <p className="text-gray-500">Support</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center border">
                  <p className="text-purple-600 text-3xl font-bold">100%</p>
                  <p className="text-gray-500">Secure</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center border">
                  <p className="text-orange-600 text-3xl font-bold">Fast</p>
                  <p className="text-gray-500">Delivery</p>
                </div>
              </div>

              {/* Browse by Platform Section */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Browse by Platform</h2>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <Button
                      key={platform.platform_id}
                      variant="outline"
                      className="rounded-full px-4 py-2 text-sm"
                      onClick={() => handleNavigate('platform', platform.platform_name)}
                    >
                      {platform.platform_name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Product Filters */}
              <ProductFilters onFiltersChange={handleFiltersChange} isLoading={filtersLoading} />

              {/* Breadcrumbs */}
              {(selectedPlatform || selectedCategory || hasActiveFilters) && (
                <div className="mb-6 flex items-center space-x-2 text-sm text-gray-500">
                  <span className="cursor-pointer hover:text-gray-700" onClick={() => handleNavigate('home')}>Home</span>
                  <span className="mx-1">/</span>
                  {selectedPlatform && (
                    <>
                      <PlatformBreadcrumb platformName={selectedPlatform} />
                      <span className="mx-1">/</span>
                    </>
                  )}
                  {selectedCategory && (
                    <>
                      <CategoryBreadcrumb categoryName={selectedCategory.category_name} />
                      <span className="mx-1">/</span>
                    </>
                  )}
                  {hasActiveFilters && (
                    <span className="text-gray-700">Filtered Results</span>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} className="ml-auto text-red-500 hover:bg-red-50 hover:text-red-600">
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Product Listing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onFilterChange={handleQuickFilter} />
                  ))
                ) : (
                  <p className="text-gray-600 col-span-full text-center">No products found matching your criteria.</p>
                )}
              </div>
            </main>
          }
          />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App


