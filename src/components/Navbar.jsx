import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Don't show public navbar if user is Admin or HR (they use sidebar)
  if (user && (user.role === 'admin' || user.role === 'hr')) {
    return null; 
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-mint-green flex items-center gap-2">
              <i className="bi bi-buildings"></i> Apex Manpower
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8 items-center mt-4 md:mt-0">
            <Link to="/" className="text-space-blue hover:text-mint-green transition-colors font-medium">Home</Link>
            <Link to="/about" className="text-space-blue hover:text-mint-green transition-colors font-medium">About Us</Link>
            <Link to="/careers" className="text-space-blue hover:text-mint-green transition-colors font-medium">Careers</Link>
            <Link to="/news" className="text-space-blue hover:text-mint-green transition-colors font-medium">News & Update</Link>
            
            {!user ? (
              <Link to="/login" className="bg-mint-green text-space-blue px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
                Login
              </Link>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-mint-green" />
                  <i className="bi bi-chevron-down text-sm text-gray-500"></i>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-space-blue">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link to="/employee/account" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="bi bi-person mr-2"></i> Account Information</Link>
                    <Link to="/employee/resume" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="bi bi-file-earmark-arrow-up mr-2"></i> Upload Resume</Link>
                    <Link to="/employee/requirements" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="bi bi-list-check mr-2"></i> Check Requirements</Link>
                    <Link to="/employee/jobs" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="bi bi-briefcase mr-2"></i> Track Applied Jobs</Link>
                    <Link to="/employee/saved" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="bi bi-bookmark mr-2"></i> Save Jobs</Link>
                    <Link to="/employee/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><i className="bi bi-gear mr-2"></i> Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"><i className="bi bi-box-arrow-right mr-2"></i> Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
