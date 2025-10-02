import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password, username } = await req.json();
  if (!email || !password || !username) {
    return NextResponse.json(
      { message: "Email, password, and username are required" },
      { status: 400 }
    );
  }

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: username,
    },
  });

  return NextResponse.json({ user: newUser }, { status: 201 });
}
