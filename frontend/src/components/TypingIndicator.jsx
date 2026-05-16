import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 p-3 max-w-[fit-content] rounded-2xl bg-dark-700 rounded-bl-sm border border-dark-600">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

export default TypingIndicator;
