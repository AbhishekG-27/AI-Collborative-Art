import { LineData } from "@/types";
import React from "react";
import { Layer, Line } from "react-konva";

const LinesLayer = ({ lines }: { lines: LineData[] }) => {
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
          draggable
        />
      ))}
    </Layer>
  );
};

export default LinesLayer;
