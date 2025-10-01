"use client";

import React, { useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";

interface LineData {
  tool: string;
  points: number[];
  stroke: string;
  strokeWidth: number;
}

const CanvasComponent = () => {
  const [lines, setLines] = useState<LineData[]>([]);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const isDrawing = useRef(false);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      {
        tool,
        points: [pos.x, pos.y],
        stroke: tool === "pen" ? "#ffffff" : "#1a1a1a",
        strokeWidth: tool === "pen" ? 3 : 20,
      },
    ]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    // Get the last line
    const lastLine = lines[lines.length - 1];

    // Add new point to the line
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // Replace the last line with updated points
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleUndo = () => {
    const newLines = lines.slice(0, -1);
    setLines(newLines);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-4 bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => setTool("pen")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tool === "pen"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Pen
        </button>
        <button
          onClick={() => setTool("eraser")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tool === "eraser"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Eraser
        </button>
        <div className="h-8 w-px bg-gray-600" />
        <button
          onClick={handleUndo}
          disabled={lines.length === 0}
          className="px-4 py-2 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Undo
        </button>
        <button
          onClick={handleClear}
          disabled={lines.length === 0}
          className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear CanvasComponent
        </button>
        <div className="ml-auto text-gray-400 text-sm">
          Lines: {lines.length}
        </div>
      </div>

      {/* CanvasComponent Area */}
      <div className="flex-1 overflow-hidden">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 72}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          className="cursor-crosshair"
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CanvasComponent;
