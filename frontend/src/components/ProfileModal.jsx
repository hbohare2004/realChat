import React, { useState } from 'react';
import { IoClose, IoLogOutOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    description: user?.description || '',
    mobile: user?.mobile || '',
  });

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Here we simulate the API call that the backend dev needs to create
    toast('Profile updated locally! Backend integration required.', { icon: '⚠️' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-light-800 dark:bg-dark-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-dark-700 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-dark-700 flex items-center justify-between">
          <h2 className="text-xl font-bold bg-nexus-gradient bg-clip-text text-transparent">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-nexus-gradient flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-500/30 mb-4">
              {user.username?.charAt(0).toUpperCase()}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100 outline-none" placeholder="Your full name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100 outline-none" />
              {/* Fake Error state for demonstration */}
              <p className="text-xs text-red-500 mt-1 hidden">Username already taken!</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio / Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100 outline-none resize-none" rows="2" placeholder="Available" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
              <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100 outline-none" placeholder="+1 234 567 8900" />
            </div>

            <button type="submit" className="w-full py-3 bg-nexus-gradient text-white font-medium rounded-xl hover:opacity-90 transition-opacity mt-4 shadow-lg shadow-primary-500/20">
              Save Changes
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-700">
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-500 font-medium rounded-xl transition-colors border border-red-200 dark:border-red-500/20">
              <IoLogOutOutline size={20} />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
