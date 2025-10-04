export class CollaborationManager {
  private rooms: Map<string, Set<string>>; // roomId -> Set of userIds
  private users: Map<string, string>; // userId -> socketId
  private userRooms: Map<string, string>; // userId -> roomId

  addUserToRoom(roomId: string, userId: string, socketId: string): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    this.rooms.get(roomId)?.add(userId);
    this.users.set(userId, socketId);
    this.userRooms.set(userId, roomId); // Track which room the user is in
  }

  removeUserFromRoom(socketId: string): void {
    const userId = this.getUserIdBySocketId(socketId);
    if (!userId) return console.error("User not found for socketId:", socketId);

    const roomId = this.userRooms.get(userId);
    if (roomId) {
      // Remove user from their specific room only
      const userIds = this.rooms.get(roomId);
      if (userIds) {
        userIds.delete(userId);
        if (userIds.size === 0) {
          this.rooms.delete(roomId);
        }
      }
      this.userRooms.delete(userId);
    }

    this.users.delete(socketId);
  }

  getUserIdBySocketId(socketId: string): string | null {
    for (const [userId, sId] of this.users.entries()) {
      if (sId === socketId) {
        return userId;
      }
    }
    return null;
  }

  constructor() {
    this.rooms = new Map();
    this.users = new Map();
    this.userRooms = new Map(); // Add this new tracking
  }
}
