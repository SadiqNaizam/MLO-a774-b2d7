import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu, X, Search, Utensils } from 'lucide-react'; // Added Utensils for logo

interface NavigationMenuProps {
  cartItemCount?: number;
  isLoggedIn?: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ cartItemCount = 0, isLoggedIn = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log("Rendering NavigationMenu. Cart items:", cartItemCount, "Logged in:", isLoggedIn);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/restaurants', label: 'Restaurants' },
    { href: '/orders', label: 'My Orders' },
    // Add more links as needed
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-orange-500 hover:text-orange-600">
              <Utensils className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">FoodFleet</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search, Cart, User Icons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-orange-500" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-700 hover:text-orange-500" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link to={isLoggedIn ? "/account" : "/login"}>
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-orange-500" aria-label="User Account">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-orange-500"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full z-40">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-gray-700 hover:bg-orange-50 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationMenu;