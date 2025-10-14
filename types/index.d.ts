import NextAuth, { DefaultSession } from "next-auth";

export interface AuthFormtypes {
  type: "sign-in" | "sign-up";
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
  }
}

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

type Tools = "pen" | "eraser" | "ellipse" | "ai" | "select";

type SpaceType = {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  maxUsers: number;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    members: number;
    drawings: number;
  };
};

// Drawing Model Interface
export interface Drawing {
  id: string;
  data: EllipseData | LineData; // This will be LineData | EllipseData | any other drawing data
  type: DrawingType;
  layer: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Drawing Type Enum (matching your Prisma schema)
export enum DrawingType {
  FREEHAND = "FREEHAND",
  ERASER = "ERASER",
  ELLIPSE = "ELLIPSE",
  AI_ASSET = "AI_ASSET",
}
