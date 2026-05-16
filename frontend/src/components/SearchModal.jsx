import React, { useState } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-light-800 dark:bg-dark-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-dark-700 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-dark-700 flex items-center justify-between">
          <h2 className="text-xl font-bold bg-nexus-gradient bg-clip-text text-transparent">New Chat</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search by username or name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100"
            />
          </div>
        </div>

        {/* Results */}
        <div className="p-4 flex-1 overflow-y-auto max-h-80 custom-scrollbar text-center text-gray-500 dark:text-gray-400">
          <p className="mt-8 mb-4">Start typing to search users...</p>
          <div className="text-xs opacity-70 p-4 bg-primary-500/10 rounded-lg text-primary-600 dark:text-primary-400">
            Note: Your friend needs to create the backend `/api/users/search` route for these results to actually load!
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
