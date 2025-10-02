"use client";

import { LineData, EllipseData, Tools } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { Stage, Ellipse, Layer } from "react-konva";
import { Pen, Circle, Eraser, Undo, Trash2, ZoomIn } from "lucide-react";
import LinesLayer from "./LinesLayer";

const CanvasComponent = () => {
  const [lines, setLines] = useState<LineData[]>([]);
  const [ellipses, setEllipses] = useState<EllipseData[]>([]);
  const [tool, setTool] = useState<Tools>("pen");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1); // Zoom level (0.1 to 3.0)
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 }); // Pan position

  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const stageRef = useRef<any>(null);

  // Handle window dimensions safely
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial dimensions
    updateDimensions();

    // Update on resize
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();

    // Adjust position for zoom and pan
    const adjustedPos = {
      x: (pos.x - stagePosition.x) / zoom,
      y: (pos.y - stagePosition.y) / zoom,
    };

    startPos.current = adjustedPos;

    if (tool === "ellipse") {
      // Start creating ellipse
      setEllipses([
        ...ellipses,
        {
          x: adjustedPos.x,
          y: adjustedPos.y,
          radiusX: 0,
          radiusY: 0,
          stroke: "#374151",
          strokeWidth: 2,
        },
      ]);
    } else if (tool === "pen") {
      setLines([
        ...lines,
        {
          tool,
          points: [adjustedPos.x, adjustedPos.y],
          stroke: tool === "pen" ? "#374151" : "#ffffff",
          strokeWidth: tool === "pen" ? 3 : 20,
        },
      ]);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    // Adjust position for zoom and pan
    const adjustedPoint = {
      x: (point.x - stagePosition.x) / zoom,
      y: (point.y - stagePosition.y) / zoom,
    };

    if (tool === "ellipse") {
      // Update ellipse dimensions
      const lastEllipse = ellipses[ellipses.length - 1];
      const radiusX = Math.abs(adjustedPoint.x - startPos.current.x) / 2;
      const radiusY = Math.abs(adjustedPoint.y - startPos.current.y) / 2;

      lastEllipse.x = (startPos.current.x + adjustedPoint.x) / 2;
      lastEllipse.y = (startPos.current.y + adjustedPoint.y) / 2;
      lastEllipse.radiusX = radiusX;
      lastEllipse.radiusY = radiusY;

      ellipses.splice(ellipses.length - 1, 1, lastEllipse);
      setEllipses(ellipses.concat());
    } else if (tool === "pen") {
      // Get the last line
      const lastLine = lines[lines.length - 1];

      // Add new point to the line
      lastLine.points = lastLine.points.concat([
        adjustedPoint.x,
        adjustedPoint.y,
      ]);

      // Replace the last line with updated points
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleWheel = (e: any) => {
    // Only zoom when Ctrl key is pressed
    if (!e.evt.ctrlKey) {
      return;
    }

    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    // Limit zoom range
    const clampedScale = Math.max(0.1, Math.min(3, newScale));

    setZoom(clampedScale);

    // Calculate new position to zoom towards pointer
    const newPos = {
      x: pointer.x - (pointer.x - stagePosition.x) * (clampedScale / oldScale),
      y: pointer.y - (pointer.y - stagePosition.y) * (clampedScale / oldScale),
    };

    setStagePosition(newPos);
  };
  const handleClear = () => {
    setLines([]);
    setEllipses([]);
  };

  const handleUndo = () => {
    if (tool === "ellipse" && ellipses.length > 0) {
      const newEllipses = ellipses.slice(0, -1);
      setEllipses(newEllipses);
    } else if (lines.length > 0) {
      const newLines = lines.slice(0, -1);
      setLines(newLines);
    }
  };

  // Don't render until dimensions are set
  if (dimensions.width === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-gray-800">Loading Canvas...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-white overflow-hidden">
      {/* Canvas Area - Full Screen */}
      <div
        className="w-full h-full"
        style={{
          background: `
            radial-gradient(circle, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      >
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          scaleX={zoom}
          scaleY={zoom}
          x={stagePosition.x}
          y={stagePosition.y}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          onWheel={handleWheel}
          className="cursor-crosshair"
        >
          <LinesLayer lines={lines} />
          <Layer>
            {ellipses.map((ellipse, i) => (
              <Ellipse
                key={i}
                x={ellipse.x}
                y={ellipse.y}
                radiusX={ellipse.radiusX}
                radiusY={ellipse.radiusY}
                stroke={ellipse.stroke}
                strokeWidth={ellipse.strokeWidth}
                fill="transparent"
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Floating Toolbar - Left Center */}
      <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-10">
        <div className="flex flex-col gap-2 p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
          <button
            onClick={() => setTool("pen")}
            title="Pen Tool"
            className={`w-12 h-12 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
              tool === "pen"
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:shadow-sm"
            }`}
          >
            <Pen size={20} />
          </button>

          <button
            onClick={() => setTool("ellipse")}
            title="Ellipse Tool"
            className={`w-12 h-12 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
              tool === "ellipse"
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:shadow-sm"
            }`}
          >
            <Circle size={20} />
          </button>

          <button
            onClick={() => setTool("eraser")}
            title="Eraser Tool"
            className={`w-12 h-12 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
              tool === "eraser"
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:shadow-sm"
            }`}
          >
            <Eraser size={20} />
          </button>

          <div className="h-px w-8 bg-gray-300 my-1" />

          <button
            onClick={handleUndo}
            disabled={lines.length === 0 && ellipses.length === 0}
            title="Undo Last Action"
            className="w-12 h-12 rounded-xl font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-300 flex items-center justify-center hover:shadow-sm"
          >
            <Undo size={20} />
          </button>

          <button
            onClick={handleClear}
            disabled={lines.length === 0 && ellipses.length === 0}
            title="Clear Canvas"
            className="w-12 h-12 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center hover:shadow-md"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Zoom Control Slider - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-10">
        <div className="flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 min-w-[280px]">
          <ZoomIn className="w-4 h-4 text-gray-600" />
          <div className="flex items-center gap-3 flex-1">
            <span className="text-sm text-gray-600 font-medium min-w-[60px]">
              {Math.round(zoom * 100)}%
            </span>
            <input
              type="range"
              min="10"
              max="300"
              value={zoom * 100}
              onChange={(e) => {
                const newZoom = Number(e.target.value) / 100;
                setZoom(newZoom);
                // Center the view when changing zoom via slider
                setStagePosition({
                  x: (dimensions.width - dimensions.width * newZoom) / 2,
                  y: (dimensions.height - dimensions.height * newZoom) / 2,
                });
              }}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                  ((zoom * 100 - 10) / 290) * 100
                }%, #e5e7eb ${((zoom * 100 - 10) / 290) * 100}%, #e5e7eb 100%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default CanvasComponent;
