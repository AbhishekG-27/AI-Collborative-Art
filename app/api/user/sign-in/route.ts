import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if ((await bcrypt.compare(password, user.password)) === false) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
