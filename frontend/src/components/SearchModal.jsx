import React, { useState, useEffect } from 'react';
import { IoClose, IoSearch, IoPersonAdd } from 'react-icons/io5';
import api from '../services/api';
import toast from 'react-hot-toast';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`/users/search?q=${query}`);
        setResults(response.data.data.users || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSendRequest = async (userId) => {
    try {
      await api.post('/requests', {
        recipientId: userId
      });
      
      toast.success('Request sent!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

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
              placeholder="Search by username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="p-4 flex-1 overflow-y-auto max-h-80 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((user) => (
                <div 
                  key={user._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-dark-600"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-nexus-gradient flex items-center justify-center text-white font-bold">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{user.username}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Available to chat</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSendRequest(user._id)}
                    className="p-2 bg-primary-500/10 text-primary-600 hover:bg-primary-500 hover:text-white rounded-lg transition-all"
                    title="Send Friend Request"
                  >
                    <IoPersonAdd size={20} />
                  </button>
                </div>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No users found matching "{query}"</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Start typing to search users...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
