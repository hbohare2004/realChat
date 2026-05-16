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
    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    // Listen for incoming messages
    socket.on('new-message', (message) => {
      setMessages((prev) => {
        // Prevent duplicate messages if any
        if (prev.some(m => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    // Listen for typing events
    socket.on('user-typing', (data) => {
      setTypingUsers((prev) => {
        if (!prev.includes(data.userId)) {
          return [...prev, data.userId];
        }
        return prev;
      });
    });

    socket.on('user-stop-typing', (data) => {
      setTypingUsers((prev) => prev.filter(id => id !== data.userId));
    });

    return () => {
      socket.off('online-users');
      socket.off('new-message');
      socket.off('user-typing');
      socket.off('user-stop-typing');
    };
  }, [user]);

  const sendMessage = (roomId, receiverId, text) => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('send-message', { roomId, receiverId, message: text });
    }
  };

  const sendTyping = (roomId) => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('typing', { roomId });
    }
  };

  const sendStopTyping = (roomId) => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.emit('stop-typing', { roomId });
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

