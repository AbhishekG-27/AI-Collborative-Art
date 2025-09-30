import { io } from "socket.io-client";

export const socket = io(
  process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com"
    : "http://localhost:3000"
);
