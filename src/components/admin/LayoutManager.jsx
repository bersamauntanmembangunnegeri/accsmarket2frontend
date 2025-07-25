import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Settings,
  Layout,
  Type,
  Image,
  Link
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const LayoutManager = () => {
  const [layoutData, setLayoutData] = useState({
    header: [],
    main: [],
    footer: []
  })
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingComponent, setEditingComponent] = useState(null)
  const [selectedSection, setSelectedSection] = useState('header')
  const [formData, setFormData] = useState({
    section: 'header',
    component: '',
    content: {},
    is_active: true,
    sort_order: 0
  })

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const componentTypes = [
    { value: 'navigation', label: 'Navigation Menu', icon: Layout },
    { value: 'logo', label: 'Logo', icon: Image },
    { value: 'hero', label: 'Hero Section', icon: Type },
    { value: 'product_grid', label: 'Product Grid', icon: Layout },
    { value: 'stats', label: 'Statistics', icon: Layout },
    { value: 'contact_info', label: 'Contact Info', icon: Type },
    { value: 'social_links', label: 'Social Links', icon: Link },
    { value: 'footer_links', label: 'Footer Links', icon: Link },
    { value: 'custom_html', label: 'Custom HTML', icon: Type }
  ]

  const sections = [
    { value: 'header', label: 'Header' },
    { value: 'main', label: 'Main Content' },
    { value: 'footer', label: 'Footer' }
  ]

  useEffect(() => {
    fetchLayoutData()
  }, [])

  const fetchLayoutData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/layout`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setLayoutData(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching layout data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingComponent 
        ? `${API_BASE_URL}/api/admin/layout/${editingComponent.id}`
        : `${API_BASE_URL}/api/admin/layout`
      
      const method = editingComponent ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          fetchLayoutData()
          setShowModal(false)
          resetForm()
        }
      }
    } catch (error) {
      console.error('Error saving layout component:', error)
    }
  }

  const handleDelete = async (componentId) => {
    if (confirm('Are you sure you want to delete this component?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/layout/${componentId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          fetchLayoutData()
        }
      } catch (error) {
        console.error('Error deleting component:', error)
      }
    }
  }

  const handleEdit = (component) => {
    setEditingComponent(component)
    setFormData({
      section: component.section,
      component: component.component,
      content: component.content || {},
      is_active: component.is_active,
      sort_order: component.sort_order
    })
    setShowModal(true)
  }

  const toggleComponentStatus = async (componentId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/layout/${componentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus })
      })

      if (response.ok) {
        fetchLayoutData()
      }
    } catch (error) {
      console.error('Error toggling component status:', error)
    }
  }

  const resetForm = () => {
    setEditingComponent(null)
    setFormData({
      section: selectedSection,
      component: '',
      content: {},
      is_active: true,
      sort_order: 0
    })
  }

  const renderComponentContent = (component) => {
    const content = component.content || {}
    
    switch (component.component) {
      case 'navigation':
        return (
          <div className="text-sm text-gray-600">
            Menu items: {content.items?.length || 0}
          </div>
        )
      case 'logo':
        return (
          <div className="text-sm text-gray-600">
            {content.text || content.image_url ? 'Configured' : 'Not configured'}
          </div>
        )
      case 'hero':
        return (
          <div className="text-sm text-gray-600">
            Title: {content.title ? `"${content.title.substring(0, 30)}..."` : 'Not set'}
          </div>
        )
      case 'contact_info':
        return (
          <div className="text-sm text-gray-600">
            {content.email || content.phone ? 'Contact details set' : 'No contact details'}
          </div>
        )
      case 'social_links':
        return (
          <div className="text-sm text-gray-600">
            Links: {Object.keys(content).length}
          </div>
        )
      default:
        return (
          <div className="text-sm text-gray-600">
            {Object.keys(content).length > 0 ? 'Configured' : 'Empty'}
          </div>
        )
    }
  }

  const renderContentForm = () => {
    switch (formData.component) {
      case 'navigation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Menu Items (JSON format)
              </label>
              <textarea
                rows={4}
                value={JSON.stringify(formData.content.items || [], null, 2)}
                onChange={(e) => {
                  try {
                    const items = JSON.parse(e.target.value)
                    setFormData({
                      ...formData,
                      content: { ...formData.content, items }
                    })
                  } catch (err) {
                    // Invalid JSON, keep the text for user to fix
                  }
                }}
                placeholder='[{"label": "Home", "url": "/"}, {"label": "Products", "url": "/products"}]'
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>
        )
      
      case 'logo':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo Text
              </label>
              <input
                type="text"
                value={formData.content.text || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, text: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo Image URL
              </label>
              <input
                type="url"
                value={formData.content.image_url || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, image_url: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.content.title || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.content.subtitle || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, subtitle: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Background Image URL
              </label>
              <input
                type="url"
                value={formData.content.background_image || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, background_image: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      
      case 'contact_info':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.content.email || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.content.phone || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                rows={3}
                value={formData.content.address || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, address: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      
      case 'social_links':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.content.facebook || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, facebook: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter URL
              </label>
              <input
                type="url"
                value={formData.content.twitter || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, twitter: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.content.instagram || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  content: { ...formData.content, instagram: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      
      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (JSON format)
            </label>
            <textarea
              rows={6}
              value={JSON.stringify(formData.content, null, 2)}
              onChange={(e) => {
                try {
                  const content = JSON.parse(e.target.value)
                  setFormData({ ...formData, content })
                } catch (err) {
                  // Invalid JSON, keep the text for user to fix
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        )
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading layout...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Layout Manager</h1>
        <Button 
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Component
        </Button>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {sections.map(section => (
            <button
              key={section.value}
              onClick={() => setSelectedSection(section.value)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedSection === section.value
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Components List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map(section => (
          <div 
            key={section.value}
            className={`${selectedSection !== section.value ? 'hidden lg:block' : ''}`}
          >
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">{section.label}</h3>
              </div>
              <div className="p-4 space-y-3">
                {(layoutData[section.value] || []).map(component => (
                  <div key={component.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">
                          {componentTypes.find(t => t.value === component.component)?.label || component.component}
                        </span>
                        <button
                          onClick={() => toggleComponentStatus(component.id, component.is_active)}
                          className={`ml-2 p-1 rounded ${
                            component.is_active
                              ? 'text-green-600 hover:bg-green-100'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {component.is_active ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(component)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(component.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {renderComponentContent(component)}
                    <div className="text-xs text-gray-500 mt-1">
                      Order: {component.sort_order}
                    </div>
                  </div>
                ))}
                
                {(!layoutData[section.value] || layoutData[section.value].length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No components in this section
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Component Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingComponent ? 'Edit Component' : 'Add New Component'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section *
                  </label>
                  <select
                    required
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {sections.map(section => (
                      <option key={section.value} value={section.value}>
                        {section.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Component Type *
                  </label>
                  <select
                    required
                    value={formData.component}
                    onChange={(e) => setFormData({...formData, component: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Component</option>
                    {componentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {formData.component && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Component Content
                  </label>
                  {renderContentForm()}
                </div>
              )}

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingComponent ? 'Update' : 'Create'} Component
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LayoutManager

