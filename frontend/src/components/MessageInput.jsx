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
    <div className="p-4 bg-dark-800 border-t border-dark-700 shrink-0">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 bg-dark-900 text-gray-100 border border-dark-600 rounded-full px-4 py-2.5 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-primary-600 text-white p-2.5 rounded-full hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 w-11 h-11"
        >
          <IoSend size={18} className="ml-1" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
