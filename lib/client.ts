import { PrismaClient } from "./generated/prisma";

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
