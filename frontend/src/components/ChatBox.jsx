import React, { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

import { IoArrowBack, IoCallOutline, IoVideocamOutline, IoEllipsisVertical } from 'react-icons/io5';

const ChatBox = ({ selectedUser, onBack }) => {
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
      <div className="flex-1 flex items-center justify-center bg-transparent text-gray-500">
        <div className="text-center p-8 glass-panel rounded-3xl max-w-md mx-4 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-nexus-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20">
            <span className="text-5xl">✨</span>
          </div>
          <h3 className="text-2xl font-bold bg-nexus-gradient bg-clip-text text-transparent mb-2">Welcome to Nexus</h3>
          <p className="text-gray-500 dark:text-gray-400">Select a conversation and start chatting on Nexus.</p>
        </div>
      </div>
    );
  }

  const isTyping = typingUsers.includes(selectedUser._id);
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex flex-col w-full h-full glass-panel m-0 md:m-4 md:ml-4 rounded-none md:rounded-2xl overflow-hidden relative z-10">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-700 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-full"
          >
            <IoArrowBack size={24} />
          </button>
          
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full bg-nexus-gradient flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {selectedUser.username.charAt(0).toUpperCase()}
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-dark-800 rounded-full"></span>
            )}
          </div>
          <div>
            <h3 className="text-gray-800 dark:text-gray-100 font-bold text-lg leading-tight">{selectedUser.username}</h3>
            <span className={`text-xs font-medium ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
           <button className="p-2.5 hover:bg-primary-50 dark:hover:bg-dark-700 rounded-full hover:text-primary-500 transition-colors"><IoCallOutline size={22} /></button>
           <button className="p-2.5 hover:bg-primary-50 dark:hover:bg-dark-700 rounded-full hover:text-primary-500 transition-colors"><IoVideocamOutline size={22} /></button>
           <button className="p-2.5 hover:bg-primary-50 dark:hover:bg-dark-700 rounded-full hover:text-primary-500 transition-colors"><IoEllipsisVertical size={22} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-white/30 dark:bg-dark-900/30">
        {loading ? (
          <div className="flex justify-center py-10"><Loader /></div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 my-10 bg-white/50 dark:bg-dark-800/50 inline-block mx-auto px-6 py-2 rounded-full text-sm backdrop-blur-sm shadow-sm border border-gray-100 dark:border-dark-700">
                Say hey to {selectedUser.username} 👋
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender === user._id;
                return (
                  <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div 
                      className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-5 py-3 ${
                        isMe 
                          ? 'bg-nexus-gradient text-white rounded-br-sm shadow-lg shadow-primary-500/20' 
                          : 'bg-white dark:bg-dark-800 text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-dark-700 shadow-sm'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.content}</p>
                      <span className={`text-[10px] flex justify-end mt-1 font-medium ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400 rounded-2xl rounded-bl-sm px-5 py-3 border border-gray-100 dark:border-dark-700 shadow-sm flex items-center gap-1.5 w-fit">
                   <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></span>
                   <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                   <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 md:p-4 bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm border-t border-gray-100 dark:border-dark-700 shrink-0">
        <MessageInput selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default ChatBox;
