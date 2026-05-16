import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { onlineUsers } = useSocket();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users'); // Assuming you have a route to get users
        // Filter out the current user
        setUsers(response.data.filter(u => u._id !== currentUser._id));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  if (loading) {
    return <div className="w-64 md:w-80 border-r border-dark-700 bg-dark-900 h-full flex"><Loader /></div>;
  }

  return (
    <aside className="w-20 md:w-80 border-r border-dark-700 bg-dark-900 h-full flex flex-col transition-all duration-300">
      <div className="p-4 border-b border-dark-700">
        <h2 className="text-gray-200 font-semibold text-lg hidden md:block">Chats</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {users.length === 0 ? (
          <div className="p-4 text-gray-400 text-center hidden md:block">No users available</div>
        ) : (
          users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;
            
            return (
              <div 
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`p-3 md:p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-dark-800 ${
                  isSelected ? 'bg-dark-700' : 'hover:bg-dark-800'
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold shrink-0">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-dark-900 rounded-full"></span>
                  )}
                </div>
                
                <div className="hidden md:flex flex-col overflow-hidden">
                  <span className="text-gray-200 font-medium truncate">{user.username}</span>
                  <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
