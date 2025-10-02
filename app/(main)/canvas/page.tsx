import React from "react";
import { PrismaClient } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

const Spaces = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    // Handle unauthenticated state, e.g., redirect to login
    return <div>Please log in to view your spaces.</div>;
  }
  const userId = session.user.id;
  const userEmail = session.user.email;
  const name = session.user.name;

  // Get the spaces which the user is part of / owns
  const spaces = await prisma.user.findMany({
    where: {
      id: userId,
    },
    select: {
      roomMembers: {
        select: {
          room: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
      createdRooms: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
  return <div>Spaces</div>;
};

export default Spaces;
