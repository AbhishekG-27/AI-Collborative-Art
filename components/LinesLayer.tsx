import { LineData } from "@/types";
import React from "react";
import { Layer, Line } from "react-konva";

const LinesLayer = ({
  lines,
  isDraggable,
  onDragEnd,
}: {
  lines: LineData[];
  isDraggable: boolean;
  onDragEnd: (line: LineData, index: number) => void;
}) => {
  return (
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
            line.type === "ERASER" ? "destination-out" : "source-over"
          }
          draggable={isDraggable}
          onDragEnd={(e) => {
            const { x, y } = e.target.position();
            line.points = line.points.map((point, index) => {
              if (index % 2 === 0) {
                // X coordinate
                return point + x;
              } else {
                // Y coordinate
                return point + y;
              }
            });
            onDragEnd(line, i);
          }}
        />
      ))}
    </Layer>
  );
};

export default LinesLayer;
