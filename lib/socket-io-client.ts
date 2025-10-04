import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(
      process.env.NODE_ENV === "production"
        ? "https://your-production-domain.com"
        : "http://localhost:3000"
    );

    setSocket(socketInstance);

    // Handle connection events
    socketInstance.on("connect", () => {
      setConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, connected };
};

export default useSocket;
