'use client';

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
import { API_BASE_URL } from '@/lib/utils'

interface Stats {
  categories: { total: number };
  products: { total: number; active: number; inactive: number };
  orders: { total: number; pending: number; completed: number };
  revenue: { total: number };
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<Stats>({
    categories: { total: 0 },
    products: { total: 0, active: 0, inactive: 0 },
    orders: { total: 0, pending: 0, completed: 0 },
    revenue: { total: 0 }
  })

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
      // Set mock data for demo
      setStats({
        categories: { total: 8 },
        products: { total: 156, active: 142, inactive: 14 },
        orders: { total: 1247, pending: 23, completed: 1224 },
        revenue: { total: 12847.32 }
      })
    }
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'layout', label: 'Layout Manager', icon: Settings },
    { id: 'products', label: 'Product Manager', icon: Package },
    { id: 'orders', label: 'Order Manager', icon: ShoppingCart },
    { id: 'users', label: 'User Manager', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.products.total}</p>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.products.active} active, {stats.products.inactive} inactive
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.orders.total}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.orders.pending} pending, {stats.orders.completed} completed
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.categories.total}</p>
            </div>
            <LayoutDashboard className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.revenue.total.toFixed(2)}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600">New order #1247 received</p>
              <span className="text-xs text-gray-400">2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Product "FB Accounts" updated</p>
              <span className="text-xs text-gray-400">15 minutes ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Low stock alert for "IG Accounts"</p>
              <span className="text-xs text-gray-400">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'layout':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Layout Manager</h2>
            <p className="text-gray-600">Manage website layout and appearance settings.</p>
          </div>
        )
      case 'products':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Product Manager</h2>
            <p className="text-gray-600">Manage products, categories, and inventory.</p>
          </div>
        )
      case 'orders':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Order Manager</h2>
            <p className="text-gray-600">View and manage customer orders.</p>
          </div>
        )
      case 'users':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">User Manager</h2>
            <p className="text-gray-600">Manage user accounts and permissions.</p>
          </div>
        )
      case 'analytics':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-600">View sales analytics and performance metrics.</p>
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
          </div>
          
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
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

