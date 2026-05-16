import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import OnlineUsers from '../components/OnlineUsers';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="h-screen flex flex-col bg-dark-900 overflow-hidden">
      <Navbar />
      <OnlineUsers />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        <ChatBox selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Chat;
