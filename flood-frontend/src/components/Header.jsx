import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Live Map', path: '/map' },
  { name: 'Report', path: '/report' },
  { name: 'Resources', path: '/resources' },
  { name: 'Data', path: '/analytics' },
  { name: 'About', path: '/about' },
];

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">        <div className="relative flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700"
            >
              <span className="sr-only">Toggle navigation menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden md:block'} mt-2 md:mt-4`}>
          <div className="hidden md:flex md:justify-between md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center flex-1 ${
                  location.pathname === item.path
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                    : 'text-white hover:bg-blue-700/50 hover:shadow-md'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden grid grid-cols-2 gap-2 pb-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                  location.pathname === item.path
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-blue-700/50 hover:shadow-md'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;