"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  Palette,
  Plus,
} from "lucide-react";

const CanvasDetailsComponent = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock data - replace with actual canvas data from props or API
  const canvasData = {
    title: "Collaborative Art Canvas",
    collaborators: 3,
    lastUpdated: "2 minutes ago",
    canvasId: "canvas-123",
    isPublic: true,
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Main Navbar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Canvas Title and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Palette className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                {canvasData.title}
              </h1>
            </div>

            {!isCollapsed && (
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{canvasData.collaborators} collaborators</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {canvasData.lastUpdated}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Actions and Collapse Button */}
          <div className="flex items-center space-x-3">
            {!isCollapsed && (
              <>
                <button
                  title="Share Canvas"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Add Collaborators
                  <Plus className="w-4 h-4 ml-1" />
                </button>
              </>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand navbar" : "Collapse navbar"}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details Section */}
      {!isCollapsed && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Canvas ID:</span>
                <code className="px-2 py-1 bg-gray-200 rounded text-xs font-mono">
                  {canvasData.canvasId}
                </code>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Visibility:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    canvasData.isPublic
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {canvasData.isPublic ? "Public" : "Private"}
                </span>
              </div>
            </div>

            <div className="text-gray-500 text-xs">
              Press Ctrl+H to toggle this navbar
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasDetailsComponent;
