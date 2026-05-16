import React from 'react';
import { useSocket } from '../context/SocketContext';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const MessageBubble = ({ message }) => {
  const { user } = useAuth();
  
  // Checking if the message is from the current user
  // Adapting to typical backend structures (senderId or sender._id)
  const isOwn = message.senderId === user._id || 
               (message.sender && message.sender._id === user._id) ||
               message.sender === user._id;

  return (
    <div className={`flex flex-col mb-4 ${isOwn ? 'items-end' : 'items-start'}`}>
      <div 
        className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-2 shadow-sm ${
          isOwn 
            ? 'bg-primary-600 text-white rounded-tr-sm' 
            : 'bg-dark-700 text-gray-100 rounded-tl-sm border border-dark-600'
        }`}
      >
        <p className="text-sm md:text-base break-words">{message.text}</p>
      </div>
      <span className="text-xs text-gray-500 mt-1 px-1">
        {formatDate(message.createdAt || new Date())}
      </span>
    </div>
  );
};

export default MessageBubble;
