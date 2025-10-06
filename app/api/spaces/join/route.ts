import { NextRequest } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { roomId } = body;

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // get the user id from the session
  const userId = session.user.id;

  // Check if the room exists
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    return new Response(JSON.stringify({ error: "Room not found" }), {
      status: 404,
    });
  }

  // Check if the user is already in a room
  const userRoom = await prisma.room.findFirst({
    where: {
      id: roomId,
    },
    select: {
      members: {
        where: {
          id: userId,
        },
        select: { id: true },
      },
    },
  });

  if (userRoom?.members && userRoom.members.length > 0) {
    return new Response(JSON.stringify({ error: "User already in room" }), {
      status: 409,
    });
  }

  // TODO: Check if the room is full based on maxUsers
  // TODO: Check if the user has permission to join the room if it's private

  // Add user to the room by updating their currentRoomId
  await prisma.user.update({
    where: { id: userId },
    data: { currentRoomId: roomId },
  });

  return new Response(JSON.stringify({ message: "User added to room" }), {
    status: 200,
  });
}
