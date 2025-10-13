// server.js (in project root)
import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { CollaborationManager } from "./lib/CollaborationManager.ts";
import { removeUserFromRoomById, uploadDrawingData } from "./lib/client.ts";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const collaborationManager = new CollaborationManager();

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

    socket.on("joinRoom", async ({ roomId, userId }) => {
      await socket.join(roomId);
      collaborationManager.addUserToRoom(roomId, userId, socket.id);
    });

    socket.on("draw", async ({ roomId, userId, data }) => {
      // Broadcast the drawing data to other users in the same room
      // console.log(data);
      await uploadDrawingData(data.data, roomId, userId); // upload the drawing data to db.
      socket.to(roomId).emit("draw", { userId, data });
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      collaborationManager.removeUserFromRoom(socket.id);

      // Also remove the user from the room in the database
      const userId = collaborationManager.getUserIdBySocketId(socket.id);
      if (userId) {
        const updatedUser = await removeUserFromRoomById(userId);
        if (updatedUser.success) {
          console.log(`User ${userId} removed from room in DB`);
        } else {
          console.error(`Failed to remove user ${userId} from room in DB`);
        }
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
