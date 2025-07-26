'use client';

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import CategorySection from '@/components/CategorySection'
import ProductFilters from '@/components/ProductFilters'
import Footer from '@/components/Footer'
import { Category, Product, Platform, Filters, ApiResponse } from '@/lib/types'
import { API_BASE_URL, buildQueryString, parseUrlParams } from '@/lib/utils'

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersLoading, setFiltersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<Filters>({})

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
    const params = parseUrlParams()
    const filters: Filters = {}
    
    if (params.platform) {
      filters.platform = params.platform
    }
    if (params.category) {
      filters.category = params.category
    }
    if (params.vendor) {
      filters.vendor = params.vendor
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

      const categoriesData: ApiResponse<Category[]> = await categoriesResponse.json()
      const productsData: ApiResponse<Product[]> = await productsResponse.json()
      const platformsData: ApiResponse<Platform[]> = await platformsResponse.json()

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
      setError(error instanceof Error ? error.message : 'Unknown error')
      
      // Fallback to mock data if API fails
      const mockCategories: Category[] = [
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

      const mockProducts: Product[] = [
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

      const mockPlatforms: Platform[] = [
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

  const handleFiltersChange = async (filters: Filters) => {
    try {
      setFiltersLoading(true)
      setActiveFilters(filters)
      
      console.log('Filtering with filters:', filters)
      console.log('Available products (before API call):', products)
      
      // Build query parameters
      const queryString = buildQueryString(filters)
      
      // Update URL with new filters
      const newUrl = `${window.location.pathname}?${queryString}`
      window.history.pushState({ path: newUrl }, '', newUrl)
      console.log('URL updated to:', newUrl)
      
      // Try to fetch filtered products from API first
      try {
        const apiUrl = `${API_BASE_URL}/api/products?${queryString}`
        console.log('Fetching from API:', apiUrl)
        const response = await fetch(apiUrl)
        
        if (response.ok) {
          const data: ApiResponse<Product[]> = await response.json()
          if (data.success) {
            console.log('API filtering successful, products:', data.data)
            setFilteredProducts(data.data)
            return
          }
        }
      } catch (apiError) {
        console.warn('API filtering failed:', apiError)
      }
      
      // If API fails, fall back to client-side filtering
      console.warn('Using client-side filtering')
      const filtered = products.filter(product => {
        console.log('Checking product:', product.title)
        
        if (filters.keyword && !product.title.toLowerCase().includes(filters.keyword.toLowerCase())) {
          console.log('Keyword mismatch')
          return false
        }
        if (filters.category_id && filters.category_id !== 'all' && product.category_id !== parseInt(filters.category_id)) {
          console.log('Category ID mismatch')
          return false
        }
        if (filters.min_price && product.price < parseFloat(filters.min_price)) {
          console.log('Min price mismatch')
          return false
        }
        if (filters.max_price && product.price > parseFloat(filters.max_price)) {
          console.log('Max price mismatch')
          return false
        }
        if (filters.min_quantity && product.stock_quantity < parseInt(filters.min_quantity)) {
          console.log('Min quantity mismatch')
          return false
        }
        if (filters.max_quantity && product.stock_quantity > parseInt(filters.max_quantity)) {
          console.log('Max quantity mismatch')
          return false
        }
        
        // Handle platform filtering - improved logic
        if (filters.platform) {
          const platformFilter = filters.platform.toLowerCase()
          const productTitle = product.title.toLowerCase()
          const categoryName = (product.category?.name || product.account_type || '').toLowerCase()
          
          console.log(`Platform filter: ${platformFilter}`)
          console.log(`Product title: ${productTitle}`)
          console.log(`Category name: ${categoryName}`)
          
          // Check if the platform matches the product
          let platformMatch = false
          
          if (platformFilter.includes('facebook')) {
            platformMatch = productTitle.includes('fb ') || productTitle.includes('facebook') || categoryName.includes('facebook')
          } else if (platformFilter.includes('instagram')) {
            platformMatch = productTitle.includes('ig ') || productTitle.includes('instagram') || categoryName.includes('instagram')
          } else if (platformFilter.includes('game')) {
            platformMatch = productTitle.includes('game') || categoryName.includes('game') || 
                           productTitle.includes('black desert') || productTitle.includes('brawl stars') || 
                           productTitle.includes('call of duty') || productTitle.includes('clash') ||
                           productTitle.includes('genshin') || productTitle.includes('epicgames')
          } else if (platformFilter.includes('discord')) {
            platformMatch = productTitle.includes('discord') || categoryName.includes('discord')
          } else if (platformFilter.includes('twitter')) {
            platformMatch = productTitle.includes('twitter') || categoryName.includes('twitter')
          } else if (platformFilter.includes('youtube')) {
            platformMatch = productTitle.includes('youtube') || categoryName.includes('youtube')
          } else if (platformFilter.includes('tiktok')) {
            platformMatch = productTitle.includes('tiktok') || categoryName.includes('tiktok')
          } else if (platformFilter.includes('linkedin')) {
            platformMatch = productTitle.includes('linkedin') || categoryName.includes('linkedin')
          }
          
          console.log(`Platform match result: ${platformMatch}`)
          
          if (!platformMatch) {
            console.log('Platform mismatch')
            return false
          }
        }
        
        // Handle category filtering
        if (filters.category) {
          const categoryName = product.category?.name || product.account_type || ''
          if (!categoryName.toLowerCase().includes(filters.category.toLowerCase())) {
            console.log('Category mismatch')
            return false
          }
        }
        // Handle vendor filtering
        if (filters.vendor) {
          const vendorName = product.vendor?.vendor_name || (typeof product.vendor === 'string' ? product.vendor : '') || ''
          if (!vendorName.toLowerCase().includes(filters.vendor.toLowerCase())) {
            console.log('Vendor mismatch')
            return false
          }
        }
        return true
      })
      
      console.log('Filtered products (client-side):', filtered)
      setFilteredProducts(filtered)
    } catch (error) {
      console.error('Error filtering products:', error)
      // On any error, just show all products
      setFilteredProducts(products)
    } finally {
      setFiltersLoading(false)
    }
  }

  // New function to handle quick filters from category headers and vendor clicks
  const handleQuickFilter = (filterType: Filters) => {
    console.log('handleQuickFilter called with:', filterType)
    const newFilters = { ...activeFilters, ...filterType }
    console.log('New filters (from quick filter):', newFilters)
    handleFiltersChange(newFilters)
  }

  const getCategoryWithProducts = (category: Category) => {
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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

        {/* Filters */}
        <ProductFilters 
          onFiltersChange={handleFiltersChange} 
          isLoading={filtersLoading}
          platforms={platforms}
          categories={categories}
        />

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

        {/* No Results */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <button 
              onClick={() => handleFiltersChange({})}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

