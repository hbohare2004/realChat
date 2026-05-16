import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const Sidebar = ({ selectedRoom, setSelectedRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { onlineUsers } = useSocket();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/rooms');
        setRooms(response.data.data.rooms || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchRooms();
    }
  }, [currentUser]);

  if (loading) {
    return <div className="w-64 md:w-80 border-r border-dark-700 bg-dark-900 h-full flex"><Loader /></div>;
  }

  return (
    <aside className="w-full h-full flex flex-col transition-all duration-300 bg-white/50 dark:bg-dark-800/50 backdrop-blur-md">
      <div className="p-4 border-b border-gray-100 dark:border-dark-700">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="w-full bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-gray-100 text-sm"
          />
          <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
      </div>
      
      <div className="p-4 pt-5 pb-2 flex justify-between items-center">
        <h2 className="text-gray-800 dark:text-gray-200 font-bold text-lg">All Chats</h2>
        <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{rooms.length}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
        {rooms.length === 0 ? (
          <div className="p-4 text-gray-500 text-center text-sm mt-10">No conversations yet</div>
        ) : (
          rooms.map((room) => {
            // Determine display user for direct messages
            let displayUser = null;
            if (room.type === 'direct') {
              displayUser = room.participants.find(p => p._id !== currentUser._id);
            }
            
            // Fallback to room name if group, or if somehow participant not found
            const displayName = displayUser ? displayUser.username : room.name;
            const displayAvatar = displayUser?.avatar; // Can be added later
            
            const isOnline = displayUser ? onlineUsers.includes(displayUser._id) : false;
            const isSelected = selectedRoom?._id === room._id;
            const lastMessage = room.lastMessage;
            
            return (
              <div 
                key={room._id}
                onClick={() => setSelectedRoom(room)}
                className={`p-3 mx-2 mb-1 flex items-center gap-3 cursor-pointer transition-all rounded-xl ${
                  isSelected 
                    ? 'bg-nexus-gradient text-white shadow-lg shadow-primary-500/20' 
                    : 'hover:bg-gray-100 dark:hover:bg-dark-700/50 text-gray-800 dark:text-gray-200'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-primary-100 dark:bg-dark-700 text-primary-600 dark:text-primary-400'
                  }`}>
                    {displayAvatar ? (
                      <img src={displayAvatar} alt={displayName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      displayName ? displayName.charAt(0).toUpperCase() : '?'
                    )}
                  </div>
                  {isOnline && (
                    <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 rounded-full ${
                      isSelected ? 'border-primary-600' : 'border-white dark:border-dark-800'
                    }`}></span>
                  )}
                </div>
                
                <div className="flex flex-col overflow-hidden w-full">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold truncate">{displayName}</span>
                    {lastMessage && (
                      <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                        {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs truncate ${isSelected ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                    {lastMessage ? lastMessage.message : 'Click to view conversation...'}
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
