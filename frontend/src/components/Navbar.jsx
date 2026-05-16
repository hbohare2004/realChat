import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';
import { BsChatDotsFill } from 'react-icons/bs';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-dark-800 border-b border-dark-700 h-16 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2 text-primary-500 font-bold text-xl">
        <BsChatDotsFill size={24} />
        <span>RealChat</span>
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-gray-200 font-medium hidden sm:block">
              {user.username}
            </span>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-dark-700 rounded-full transition-colors"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
