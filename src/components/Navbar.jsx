import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current URL path
  
  // States for dropdowns
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show public navbar if user is Admin or HR (they use sidebar)
  if (user && (user.role === 'admin' || user.role === 'hr')) {
    return null; 
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Handlers to prevent both menus from being open at the same time
  const toggleProfile = () => {
    setDropdownOpen(!dropdownOpen);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setDropdownOpen(false);
  };

  // Helper functions to dynamically apply active classes
  const getDesktopLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `text-sm transition-colors ${
      isActive ? 'text-mint-green font-bold' : 'text-space-blue hover:text-mint-green font-medium'
    }`;
  };

  const getMobileLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `block text-base transition-colors ${
      isActive ? 'text-mint-green font-bold' : 'text-space-blue hover:text-mint-green font-medium'
    }`;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold text-mint-green flex items-center gap-1 sm:gap-2">
              <i className="bi bi-buildings"></i> 
              <span className="hidden sm:inline">Apex Manpower</span>
              <span className="sm:hidden">Apex</span>
            </Link>
          </div>

          {/* Right Side Nav Items */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-8 mt-0">
            
            {/* Desktop Links (Hidden on mobile) */}
            <div className="hidden sm:flex gap-4 md:gap-8">
              <Link to="/" className={getDesktopLinkClass('/')}>Home</Link>
              <Link to="/about" className={getDesktopLinkClass('/about')}>About Us</Link>
              <Link to="/careers" className={getDesktopLinkClass('/careers')}>Careers</Link>
              <Link to="/news" className={getDesktopLinkClass('/news')}>News</Link>
            </div>
            
            {/* Login / Profile Dropdown */}
            {!user ? (
              <Link to="/login" className="bg-mint-green text-space-blue px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors text-xs sm:text-sm">
                Login
              </Link>
            ) : (
              <div className="static sm:relative">
                <button 
                  onClick={toggleProfile}
                  className="flex items-center gap-1 sm:gap-2 focus:outline-none"
                >
                  <img src={user.photoURL} alt="Profile" className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border-2 border-mint-green" />
                  <i className="bi bi-chevron-down text-xs sm:text-sm text-gray-500 hidden sm:inline"></i>
                </button>

                {/* Profile Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute left-0 sm:left-auto right-0 top-[64px] sm:top-auto sm:mt-2 w-full sm:w-56 bg-white sm:rounded-md shadow-md sm:shadow-lg py-2 sm:py-1 z-50 border-t sm:border border-gray-100">
                    <div className="px-4 py-3 sm:py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-space-blue truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="space-y-1 sm:space-y-0 pt-1 sm:pt-0 pb-2 sm:pb-0">
                      <Link to="/employee" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 sm:py-2 text-base sm:text-sm text-gray-700 hover:bg-gray-100 font-semibold sm:border-b border-gray-100"><i className="bi bi-speedometer2 mr-2"></i> Dashboard</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 sm:py-2 text-base sm:text-sm text-red-600 hover:bg-red-50"><i className="bi bi-box-arrow-right mr-2"></i> Logout</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger Toggle Button (Mobile Only) */}
            <button 
              className="sm:hidden text-space-blue hover:text-mint-green focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Hamburger Links) */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 shadow-md absolute w-full left-0 top-[64px] z-40">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/')}>Home</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/about')}>About Us</Link>
            <Link to="/careers" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/careers')}>Careers</Link>
            <Link to="/news" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/news')}>News</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;