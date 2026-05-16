import React, { useState } from 'react';
import LeftNav from '../components/LeftNav';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';

const Chat = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-light-900 dark:bg-dark-900 transition-colors relative">
      {/* Background glowing blobs */}
      <div className="nexus-bg-blob w-96 h-96 bg-primary-500 top-[-10%] left-[-5%] hidden md:block"></div>
      <div className="nexus-bg-blob w-[500px] h-[500px] bg-accent-500 bottom-[-10%] right-[-5%] hidden md:block"></div>
      
      {/* 1. Far Left Navigation */}
      <LeftNav />

      {/* 2. Chat List Sidebar */}
      <div className={`${selectedRoom ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] shrink-0 z-10 glass-panel md:m-4 md:mr-0 rounded-none md:rounded-2xl overflow-hidden`}>
        <Sidebar selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
      </div>

      {/* 3. Main Chat Area */}
      <div className={`${!selectedRoom ? 'hidden md:flex' : 'flex'} flex-1 z-10`}>
        <ChatBox selectedRoom={selectedRoom} onBack={() => setSelectedRoom(null)} />
      </div>
    </div>
  );
};

export default Chat;
