import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const isPublic = formData.get("isPublic") === "true";
    const maxUsers = parseInt(formData.get("maxUsers") as string) || 10;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Space name is required" },
        { status: 400 }
      );
    }

    // Create the new space
    const newSpace = await prisma.room.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        isPublic,
        maxUsers,
        creatorId: session.user.id,
      },
    });

    // Redirect to the new space
    return NextResponse.redirect(
      new URL(`/canvas/${newSpace.id}`, request.url)
    );
  } catch (error) {
    console.error("Error creating space:", error);
    return NextResponse.json(
      { error: "Failed to create space" },
      { status: 500 }
    );
  }
}
