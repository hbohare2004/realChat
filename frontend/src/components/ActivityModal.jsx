import React from 'react';
import { IoClose, IoHeartOutline } from 'react-icons/io5';

const ActivityModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-light-800 dark:bg-dark-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-dark-700 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-dark-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IoHeartOutline className="text-accent-500" size={24} />
            <h2 className="text-xl font-bold bg-nexus-gradient bg-clip-text text-transparent">Buzz</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 min-h-[300px]">
          <div className="w-16 h-16 bg-gray-100 dark:bg-dark-900 rounded-full flex items-center justify-center mb-4">
            <IoHeartOutline size={32} className="text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">No new buzz</h3>
          <p className="text-sm">When you get friend requests or mentions, they will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
