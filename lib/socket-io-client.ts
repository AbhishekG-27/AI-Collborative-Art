import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const socket = io(
      process.env.NODE_ENV === "production"
        ? "https://your-production-domain.com"
        : "http://localhost:3000"
    );
    setSocket(socket);
    setConnected(true);
  }, []);

  return { socket, connected };
};

export default useSocket;
