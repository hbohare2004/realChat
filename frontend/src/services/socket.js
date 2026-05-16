import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    const token = localStorage.getItem('token');
    
    if (!this.socket && token) {
      this.socket = io(SOCKET_URL, {
        auth: {
          token
        },
        transports: ['websocket'],
      });
      
      this.socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

const socketService = new SocketService();
export default socketService;
