import { getServerSession } from "next-auth";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";
import { Client } from "minio";

const model_name = process.env.GOOGLE_CLOUD_PROJECT_MODEL!;
const prisma = new PrismaClient();
const GoogleAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  vertexai: true,
});

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

  // Fix 4: Add error handling for environment variables
  if (!model_name) {
    console.error("Missing required environment variables");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const result = await GoogleAI.models.generateImages({
    model: model_name,
    prompt: prompt,
    config: {
      numberOfImages: 1,
    },
  });

  const generatedImages = result.generatedImages;
  if (!generatedImages || generatedImages.length <= 0) {
    return NextResponse.json(
      { message: "Failed to generate images" },
      { status: 403 }
    );
  }

  let imgBytes = generatedImages[0].image?.imageBytes;
  if (!imgBytes) {
    return NextResponse.json(
      { message: "Failed to generate images" },
      { status: 403 }
    );
  }

  // const buffer = Buffer.from(imgBytes, "base64");

  return NextResponse.json(
    { message: "Image generated successfully", imageBuffer: imgBytes },
    { status: 200 }
  );
}
