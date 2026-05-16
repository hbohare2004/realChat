import React, { useState, useEffect } from 'react';
import { IoClose, IoHeartOutline, IoCheckmark, IoCloseOutline } from 'react-icons/io5';
import api from '../services/api';
import toast from 'react-hot-toast';

const ActivityModal = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/requests/pending');
      setRequests(response.data.data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (requestId, status) => {
    try {
      await api.patch(`/requests/${requestId}`, { status });
      toast.success(`Request ${status}!`);
      fetchRequests();
      if (status === 'accepted') {
        // Refresh page or update rooms list to show the new chat
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-light-800 dark:bg-dark-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-dark-700 animate-in fade-in zoom-in duration-200">
        
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
        <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar p-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 px-1">Friend Requests</p>
              {requests.map((request) => (
                <div 
                  key={request._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-dark-900/50 border border-gray-100 dark:border-dark-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-nexus-gradient flex items-center justify-center text-white font-bold shadow-md">
                      {request.sender.avatar ? (
                        <img src={request.sender.avatar} alt={request.sender.username} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        request.sender.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100">{request.sender.username}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">wants to chat</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleAction(request._id, 'accepted')}
                      className="w-9 h-9 flex items-center justify-center bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                      title="Accept"
                    >
                      <IoCheckmark size={20} />
                    </button>
                    <button 
                      onClick={() => handleAction(request._id, 'rejected')}
                      className="w-9 h-9 flex items-center justify-center bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Reject"
                    >
                      <IoCloseOutline size={22} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 bg-gray-100 dark:bg-dark-900 rounded-full flex items-center justify-center mb-4">
                <IoHeartOutline size={32} className="text-gray-400 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">No new buzz</h3>
              <p className="text-sm px-4">When you get friend requests or mentions, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
