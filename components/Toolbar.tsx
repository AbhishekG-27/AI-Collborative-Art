import { Tools } from "@/types";
import { Eraser, Pen, Trash2, Undo, Circle } from "lucide-react";

interface ToolbarProps {
  tool: string;
  setTool: (tool: Tools) => void;
  handleUndo: () => void;
  handleClear: () => void;
  linesLength: number;
  ellipsesLength: number;
}

export default function Toolbar({
  tool,
  setTool,
  handleUndo,
  handleClear,
  linesLength,
  ellipsesLength,
}: ToolbarProps) {
  return (
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
          disabled={linesLength === 0 && ellipsesLength === 0}
          title="Undo Last Action"
          className="w-12 h-12 rounded-xl font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-300 flex items-center justify-center hover:shadow-sm"
        >
          <Undo size={20} />
        </button>

        <button
          onClick={handleClear}
          disabled={linesLength === 0 && ellipsesLength === 0}
          title="Clear Canvas"
          className="w-12 h-12 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center hover:shadow-md"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
