# 💬 RealChat - Real-Time Chat Application

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

Welcome to the frontend repository of **RealChat**, a beautiful, dark-themed, and highly responsive real-time messaging web application. 

## ✨ Key Features

- 🔒 **Secure Authentication**: User login and registration with JWT.
- ⚡ **Real-Time Messaging**: Instant message delivery using Socket.io.
- 🟢 **Live Online Status**: See exactly who is online in real-time.
- ⌨️ **Typing Indicators**: Visual feedback when a user is typing a message.
- 🎨 **Modern UI/UX**: Premium dark mode aesthetic built with Tailwind CSS.
- 📱 **Fully Responsive**: Flawless experience on both desktop and mobile devices.

## 🛠️ Tech Stack

- **Framework**: React 18 (Hooks & Context API)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **Routing**: React Router DOM
- **Network Requests**: Axios
- **WebSockets**: Socket.io-client
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## 🚀 Getting Started

Follow these steps to run the frontend application on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### 1. Installation

Clone the repository and navigate to the `frontend` directory, then install the dependencies:

```bash
npm install
```

### 2. Environment Variables

Check the `.env` file in the root of the `frontend` folder to ensure it points to your backend API and Socket URLs:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
*(Ensure your backend is running on the corresponding port!)*

### 3. Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

Your application will now be running on `http://localhost:3000/` (or whichever port Vite provides in the terminal). 

## 📁 Folder Structure

- `src/components/` - Reusable UI components (Sidebar, Navbar, ChatBox, etc.)
- `src/context/` - Global state management (AuthContext, SocketContext)
- `src/pages/` - Main view layouts (Login, Register, Chat)
- `src/services/` - External connections (Axios instances, Socket initialization)git git commit
- `src/utils/` - Helper functions (Date formatting)

---
*Built with ❤️ for seamless real-time communication.*
