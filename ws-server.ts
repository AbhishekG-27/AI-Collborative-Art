// server.js (in project root)
import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? "https://yourdomain.com"
          : "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Canvas collaboration logic
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join canvas room
    socket.on("join-canvas", (canvasId) => {
      socket.join(canvasId);
      socket.to(canvasId).emit("user-joined", socket.id);
    });

    // Real-time drawing events
    socket.on("drawing-data", (data) => {
      socket.to(data.canvasId).emit("drawing-update", data);
    });

    // AI asset placement
    socket.on("ai-asset-placed", (data) => {
      socket.to(data.canvasId).emit("asset-update", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
