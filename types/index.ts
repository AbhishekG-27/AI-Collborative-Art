export type LineData = {
  id: string;
  type: "FREEHAND" | "ERASER";
  points: number[];
  stroke: string;
  strokeWidth: number;
};

export type EllipseData = {
  id: string;
  type: "ELLIPSE";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  stroke: string;
  strokeWidth: number;
};

export type Tools = "pen" | "eraser" | "ellipse" | "ai" | "grab";

export type SpaceType = {
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
export type Drawing = {
  id: string;
  data: EllipseData | LineData; // This will be LineData | EllipseData | any other drawing data
  type: "FREEHAND" | "ERASER" | "ELLIPSE" | "AI_ASSET";
  layer: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
};
