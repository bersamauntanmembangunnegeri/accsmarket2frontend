import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import LayoutManager from '../components/admin/LayoutManager'
import ProductManager from '../components/admin/ProductManager'
import OrderManager from '../components/admin/OrderManager'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    categories: { total: 0 },
    products: { total: 0, active: 0, inactive: 0 },
    orders: { total: 0, pending: 0, completed: 0 },
    revenue: { total: 0 }
  })

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    }
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'layout', label: 'Layout Manager', icon: Settings },
    { id: 'products', label: 'Product Manager', icon: Package },
    { id: 'orders', label: 'Order Manager', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.categories.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.products.total}</p>
              <p className="text-xs text-green-600">{stats.products.active} active</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.orders.total}</p>
              <p className="text-xs text-orange-600">{stats.orders.pending} pending</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.revenue.total.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">No recent activity to display.</p>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'layout':
        return <LayoutManager />
      case 'products':
        return <ProductManager />
      case 'orders':
        return <OrderManager />
      case 'users':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">User Manager</h1>
            <p className="text-gray-600">User management interface will be implemented here.</p>
          </div>
        )
      case 'analytics':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Analytics dashboard will be implemented here.</p>
          </div>
        )
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminPage

