import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">AccsMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-green-600 transition-colors">
              Categories
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search accounts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-700">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
            </Button>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <Link to="/" className="text-gray-700 hover:text-green-600 py-2">
                  Home
                </Link>
                <Link to="/categories" className="text-gray-700 hover:text-green-600 py-2">
                  Categories
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-green-600 py-2">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-green-600 py-2">
                  Contact
                </Link>
                <Link to="/admin" className="text-gray-700 hover:text-green-600 py-2">
                  Admin
                </Link>
              </nav>

              {/* Mobile Actions */}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="ghost" className="justify-start text-gray-700">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button className="justify-start bg-green-600 hover:bg-green-700">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

