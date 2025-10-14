import { PrismaClient } from "./generated/prisma/index.js";

type LineData = {
  type: "FREEHAND" | "ERASER";
  points: number[];
  stroke: string;
  strokeWidth: number;
};

type EllipseData = {
  type: "ELLIPSE";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  stroke: string;
  strokeWidth: number;
};

const prisma = new PrismaClient();

export const getDrawingsByRoomId = async (roomId: string) => {
  const drawings = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    select: {
      drawings: {
        omit: {
          roomId: true,
          userId: true,
        },
      },
    },
  });

  return drawings;
};

export const uploadDrawingData = async (
  data: LineData | EllipseData,
  roomId: string,
  userId: string
) => {
  // console.log(data);
  try {
    const updatedRoom = await prisma.drawing.create({
      data: {
        type: data.type,
        roomId: roomId,
        userId: userId,
        data: data,
      },
    });

    if (!updatedRoom) {
      return { success: false, message: "Failed to create drawings." };
    }

    return { success: true, message: "Successfully created drawings." };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create drawings." };
  }
};

export const checkIfUserInRoom = async (userId: string, roomId: string) => {
  // heck if the room exists
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    return { success: false, message: "Room not found" };
  }

  // check if the user is in the room
  const user = await prisma.user.findUnique({
    where: { id: userId, AND: { currentRoomId: roomId } },
  });

  if (!user) {
    return { success: false, message: "You have not joined this room" };
  }

  return { success: true, message: "User is in the room" };
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

    // check if the room is private or public and if private, ask for password
    // if (!room.isPublic) {
    //   return {
    //     success: false,
    //     message: "Room is private",
    //     errorType: "ROOM_IS_PRIVATE",
    //   };
    // }

    // check if the user is already in a room
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentRoomId: true,
        currentRoom: { select: { id: true, name: true } },
      },
    });

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
