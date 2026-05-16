import { createContext, useState, useEffect, useContext } from 'react';
import socketService from '../services/socket';
import { useAuth } from './AuthContext';

export const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const socket = socketService.getSocket();
    if (!socket) return;

    // Listen for online users updates
    socket.on('getOnlineUsers', (users) => {
      setOnlineUsers(users);
    });

    // Listen for incoming messages
    socket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing events
    socket.on('userTyping', (data) => {
      setTypingUsers((prev) => {
        if (!prev.includes(data.userId)) {
          return [...prev, data.userId];
        }
        return prev;
      });
    });

    socket.on('userStoppedTyping', (data) => {
      setTypingUsers((prev) => prev.filter(id => id !== data.userId));
    });

    return () => {
      socket.off('getOnlineUsers');
      socket.off('newMessage');
      socket.off('userTyping');
      socket.off('userStoppedTyping');
    };
  }, [user]);

  const sendMessage = (receiverId, text) => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('sendMessage', { receiverId, text });
      
      // Optimistically add the message to our local state
      // Normally the backend would echo it back or return it via HTTP
      // Depending on your backend implementation, you might want to skip this
      // and wait for the HTTP response or Socket echo.
    }
  };

  const sendTyping = (receiverId) => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('typing', { receiverId });
    }
  };

  const sendStopTyping = (receiverId) => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('stopTyping', { receiverId });
    }
  };

  const value = {
    onlineUsers,
    messages,
    setMessages,
    typingUsers,
    sendMessage,
    sendTyping,
    sendStopTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
