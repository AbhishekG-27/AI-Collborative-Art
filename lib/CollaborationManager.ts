export class CollaborationManager {
  private rooms: Map<string, Set<string>>; // roomId -> Set of userIds
  private users: Map<string, string>; // socketId -> userId
  private userRooms: Map<string, string>; // userId -> roomId

  addUserToRoom(roomId: string, userId: string, socketId: string): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    this.rooms.get(roomId)?.add(userId);
    this.users.set(socketId, userId);
    this.userRooms.set(userId, roomId); // Track which room the user is in

    console.log("Added: ", this.rooms);
  }

  removeUserFromRoom(socketId: string): void {
    const userId = this.users.get(socketId);
    if (!userId) return;

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
    console.log("Deleted: ", this.rooms);
  }

  constructor() {
    this.rooms = new Map();
    this.users = new Map();
    this.userRooms = new Map(); // Add this new tracking
  }
}
