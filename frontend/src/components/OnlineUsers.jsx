import React from 'react';
import { useSocket } from '../context/SocketContext';

const OnlineUsers = () => {
  const { onlineUsers } = useSocket();

  return (
    <div className="bg-dark-800 p-2 text-xs text-center border-b border-dark-700 text-green-500 font-medium shrink-0">
      {onlineUsers.length} user{onlineUsers.length !== 1 ? 's' : ''} online
    </div>
  );
};

export default OnlineUsers;
