import React, { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ChatBox = ({ selectedUser }) => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, typingUsers, onlineUsers } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      
      setLoading(true);
      try {
        const response = await api.get(`/messages/${selectedUser._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, setMessages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-dark-900 text-gray-500">
        <div className="text-center">
          <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-dark-700">
            <span className="text-4xl text-primary-500">👋</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-200">Welcome to RealChat</h3>
          <p className="mt-2 text-gray-400">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  const isTyping = typingUsers.includes(selectedUser._id);
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex-1 flex flex-col h-full bg-dark-900 w-full">
      {/* Header */}
      <div className="bg-dark-800 p-4 border-b border-dark-700 flex items-center gap-3 shrink-0">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
            {selectedUser.username.charAt(0).toUpperCase()}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-dark-800 rounded-full"></span>
          )}
        </div>
        <div>
          <h3 className="text-gray-200 font-semibold">{selectedUser.username}</h3>
          <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-500'}`}>
            {isOnline ? 'Active Now' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 my-10">
                No messages yet. Send a message to start the conversation!
              </div>
            ) : (
              messages.map((msg, index) => (
                <MessageBubble key={msg._id || index} message={msg} />
              ))
            )}
            
            {isTyping && (
              <div className="mb-4">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <MessageInput selectedUser={selectedUser} />
    </div>
  );
};

export default ChatBox;
