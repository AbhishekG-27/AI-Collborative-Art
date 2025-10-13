import { getServerSession } from "next-auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json(
      { message: "prompt is required" },
      { status: 402 }
    );
  }

  const project_name = process.env.GOOGLE_CLOUD_PROJECT_NAME;
  const auth_secret = process.env.GOOGLE_CLOUD_AUTH_SECRET;
  const api_body = {
    instances: [
      {
        prompt: prompt,
      },
    ],
    parameters: {
      sampleCount: 1,
    },
  };

  const response = await fetch(
    `https://aiplatform.googleapis.com/v1/projects/${project_name}/locations/global/publishers/google/models/imagen-4.0-generate-001:predict`,
    {
      headers: {
        Authorization: `Bearer ${auth_secret}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(api_body),
    }
  );
}
