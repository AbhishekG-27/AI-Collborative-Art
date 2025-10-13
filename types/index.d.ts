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
  type: "FREEHAND";
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

type Tools = "pen" | "eraser" | "ellipse";

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
