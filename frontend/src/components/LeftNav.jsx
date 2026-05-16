import React, { useState } from 'react';
import { IoChatbubbles, IoPeople, IoCall, IoBookmark, IoSettingsOutline, IoHeart, IoAdd, IoSunny, IoMoon } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SearchModal from './SearchModal';
import ActivityModal from './ActivityModal';
import ProfileModal from './ProfileModal';

const LeftNav = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="w-20 md:w-64 h-full bg-light-800 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 flex flex-col transition-colors z-10 shrink-0">
        
        {/* Logo */}
        <div className="h-20 flex items-center justify-center md:justify-start md:px-6 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-nexus-gradient flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
            N
          </div>
          <span className="hidden md:block ml-3 font-bold text-2xl tracking-tight text-gray-800 dark:text-gray-100">
            NEXUS
          </span>
        </div>

        {/* Action Button */}
        <div className="px-3 md:px-6 py-4 shrink-0">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-center md:justify-start gap-3 bg-nexus-gradient text-white py-3 px-0 md:px-4 rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:-translate-y-0.5"
          >
            <IoAdd size={24} />
            <span className="hidden md:block font-medium">New Chat</span>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 md:px-4 py-2 space-y-1">
          <NavItem icon={<IoChatbubbles size={22} />} label="Chats" active />
          <NavItem icon={<IoPeople size={22} />} label="Groups" />
          <NavItem icon={<IoCall size={22} />} label="Calls" />
          
          <div className="relative">
            <NavItem 
              icon={<IoHeart size={22} />} 
              label="Buzz" 
              onClick={() => setIsActivityOpen(true)}
              badge={3} 
            />
          </div>
          
          <NavItem icon={<IoBookmark size={22} />} label="Saved" />
          <NavItem icon={<IoSettingsOutline size={22} />} label="Settings" />
        </div>

        {/* Bottom Section */}
        <div className="p-3 md:p-6 border-t border-gray-200 dark:border-dark-700 space-y-4 shrink-0">
          
          {/* Profile Quick Access */}
          <div 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center justify-center md:justify-start gap-3 cursor-pointer p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shrink-0">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-light-800 dark:border-dark-800 rounded-full"></div>
            </div>
            <div className="hidden md:block overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.name || user?.username}</p>
              <p className="text-xs text-green-500 font-medium">Online</p>
            </div>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-center md:justify-start gap-3 p-3 rounded-xl bg-gray-100 dark:bg-dark-900 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            {theme === 'dark' ? <IoSunny size={20} /> : <IoMoon size={20} />}
            <span className="hidden md:block text-sm font-medium">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

        </div>
      </div>

      {/* Modals */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ActivityModal isOpen={isActivityOpen} onClose={() => setIsActivityOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};

const NavItem = ({ icon, label, active, onClick, badge }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-center md:justify-between p-3 md:px-4 md:py-3 rounded-xl transition-all ${
        active 
          ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-700/50 hover:text-gray-800 dark:hover:text-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="hidden md:block">{label}</span>
      </div>
      {badge && (
        <span className="hidden md:flex bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
};

export default LeftNav;
