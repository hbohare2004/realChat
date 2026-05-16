import React, { useState, useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import { useSocket } from '../context/SocketContext';

const MessageInput = ({ selectedUser }) => {
  const [text, setText] = useState('');
  const { sendMessage, sendTyping, sendStopTyping } = useSocket();
  const typingTimeoutRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;

    sendMessage(selectedUser._id, text.trim());
    setText('');
    sendStopTyping(selectedUser._id);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    
    if (!selectedUser) return;

    // Emit typing event
    sendTyping(selectedUser._id);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      sendStopTyping(selectedUser._id);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!selectedUser) return null;

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="flex-1 relative">
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="w-full bg-light-900 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-400"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </button>
      </div>
      <button
        type="submit"
        disabled={!text.trim()}
        className="bg-nexus-gradient text-white rounded-full hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 w-12 h-12 shadow-lg shadow-primary-500/30"
      >
        <IoSend size={20} className="ml-1" />
      </button>
    </form>
  );
};

export default MessageInput;
