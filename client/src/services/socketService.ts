import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  /**
   * Initialize Socket.io connection
   */
  connect(authToken?: string) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    console.log('🔌 Connecting to Socket.io server:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: authToken ? { token: authToken } : undefined,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  /**
   * Disconnect from Socket.io server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Check if socket is connected
   */
  get connected() {
    return this.isConnected;
  }

  /**
   * Get socket instance
   */
  getSocket() {
    return this.socket;
  }

  /**
   * Join a room (e.g., for collaborative editing)
   */
  joinRoom(roomId: string) {
    if (this.socket?.connected) {
      this.socket.emit('join-room', roomId);
      console.log(`🚪 Joined room: ${roomId}`);
    }
  }

  /**
   * Leave a room
   */
  leaveRoom(roomId: string) {
    if (this.socket?.connected) {
      this.socket.emit('leave-room', roomId);
      console.log(`🚪 Left room: ${roomId}`);
    }
  }

  /**
   * Listen for itinerary updates
   */
  onItineraryUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('itinerary-updated', callback);
    }
  }

  /**
   * Listen for price drop alerts
   */
  onPriceAlert(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('price-alert', callback);
    }
  }

  /**
   * Emit itinerary change (for collaborative editing)
   */
  emitItineraryChange(itineraryId: string, changes: any) {
    if (this.socket?.connected) {
      this.socket.emit('itinerary-change', {
        itineraryId,
        changes,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();

export default socketService;
