import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

const getDrawingsByRoomId = async (roomId: string) => {
  const drawings = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    select: {
      drawings: true,
    },
  });

  return drawings;
};

export const addUserToRoom = async (roomId: string, userId: string) => {
  try {
    // Check if the room exists
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return {
        success: false,
        message: "Room not found",
        errorType: "ROOM_NOT_FOUND",
      };
    }

    // check if the user is already in a room
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentRoomId: true,
        currentRoom: { select: { id: true, name: true } },
      },
    });

    // The room the user is trying to join is the same as the current room
    if (user?.currentRoomId === roomId) {
      return {
        success: true,
        message: "User already in the room",
        updatedUser: user,
      };
    }

    if (user?.currentRoomId) {
      return {
        success: false,
        message: "User is already in a room",
        errorType: "USER_ALREADY_IN_ROOM",
        currentRoom: user.currentRoom,
      };
    }

    // Add user to the room by updating their currentRoomId
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { currentRoomId: roomId },
      select: { currentRoomId: true },
    });

    return { success: true, message: "User added to room", updatedUser };
  } catch (error) {
    console.error("Error adding user to room:", error);
    return {
      success: false,
      message: "Failed to add user to room",
      errorType: "UNKNOWN_ERROR",
    };
  }
};

export const removeUserFromRoomById = async (userId: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { currentRoomId: null },
    });
    return { success: true, message: "User removed from room", updatedUser };
  } catch (error) {
    console.error("Error removing user from room:", error);
    return { success: false, message: "Failed to remove user from room" };
  }
};
