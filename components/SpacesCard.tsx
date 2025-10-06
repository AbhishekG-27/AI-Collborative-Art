import { SpaceType } from "@/types";
import Link from "next/link";
import React from "react";

const SpacesCard = ({ space }: { space: SpaceType }) => {
  return (
    <div
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200"
    >
      {/* Space Preview/Thumbnail */}
      <div className="h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              space.isPublic
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {space.isPublic ? "Public" : "Private"}
          </span>
        </div>
      </div>

      {/* Space Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 truncate">
          {space.name}
        </h3>
        {space.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {space.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              {space._count.members}
            </span>
            <span className="flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              {space._count.drawings}
            </span>
          </div>
          <span>{new Date(space.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Action Button */}
        <Link
          href={`/canvas/${space.id}`}
          className="block w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-center"
        >
          Open Space
        </Link>
      </div>
    </div>
  );
};

export default SpacesCard;
