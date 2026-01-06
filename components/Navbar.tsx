import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sprout, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { useApp } from '../context/AppContext';
import { UserType } from '../types';
import AuthModal from './AuthModal';
import { signOut } from '../lib/supabase';

const Navbar: React.FC = () => {
  const { state, logout, getUnreadNotifications } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isLoggedIn = !!state.user;
  const notifications = getUnreadNotifications();
  const dashboardPath = state.user?.type === UserType.FARMER
    ? '/farmer-dashboard'
    : '/buyer-dashboard';

  const handleLogout = async () => {
    await signOut();
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-earth-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <NavLink to="/" className="flex items-center gap-2">
                <div className="bg-nature-600 p-2 rounded-lg text-white">
                  <Sprout size={24} />
                </div>
                <span className="font-serif font-bold text-xl text-earth-900">AgriLoop</span>
              </NavLink>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-6 items-center">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${isActive ? 'text-nature-700 font-bold' : 'text-earth-600 hover:text-nature-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  {/* Notifications */}
                  <Link to={dashboardPath} className="relative p-2 hover:bg-earth-100 rounded-lg">
                    <Bell size={20} className="text-earth-600" />
                    {notifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-earth-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-nature-100 rounded-full flex items-center justify-center">
                        <User size={18} className="text-nature-700" />
                      </div>
                      <span className="text-sm font-medium text-earth-800">
                        {state.user?.name?.split(' ')[0]}
                      </span>
                      <ChevronDown size={16} className="text-earth-500" />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-earth-100 py-2 z-50">
                        <Link
                          to={dashboardPath}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-earth-700 hover:bg-earth-50"
                        >
                          <User size={16} />
                          My Dashboard
                        </Link>
                        <hr className="my-2 border-earth-100" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-nature-600 hover:bg-nature-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              {isLoggedIn && notifications.length > 0 && (
                <Link to={dashboardPath} className="relative p-2">
                  <Bell size={20} className="text-earth-600" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-earth-700 hover:text-nature-700 focus:outline-none"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-earth-100 absolute w-full shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-3 rounded-md text-base font-medium ${isActive ? 'bg-nature-50 text-nature-700' : 'text-earth-600 hover:bg-earth-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <hr className="border-earth-100 my-4" />

              {isLoggedIn ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-3 rounded-md text-base font-medium text-earth-600 hover:bg-earth-50"
                  >
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowAuth(true); setIsOpen(false); }}
                  className="w-full bg-nature-600 text-white px-4 py-3 rounded-lg font-bold shadow-sm"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Navbar;