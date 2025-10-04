import React from "react";
import { PrismaClient } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

const prisma = new PrismaClient();

const Spaces = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    // Handle unauthenticated state, e.g., redirect to login
    return <div>Please log in to view your spaces.</div>;
  }
  const userId = session.user.id;
  const name = session.user.name;

  // Get the spaces which the user created
  const userSpaces = await prisma.room.findMany({
    where: {
      creatorId: userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      isPublic: true,
      maxUsers: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          members: true,
          drawings: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto h-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Creative Spaces
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome back, {name}! Manage and access your collaborative art
            spaces.
          </p>
        </div>

        {userSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* User's Spaces */}
            {userSpaces.map((space) => (
              <div
                key={space.id}
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
                    <span>
                      {new Date(space.updatedAt).toLocaleDateString()}
                    </span>
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
            ))}

            {/* Create New Space Card */}
            <Link
              href="/canvas/create"
              className="group relative bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-200 p-6 flex flex-col items-center justify-center min-h-[240px] cursor-pointer hover:shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Create New Space
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Start a new collaborative art project
              </p>
            </Link>
          </div>
        ) : (
          /* Empty State */
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No spaces yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Create your first collaborative art space to start drawing and
                sharing with others.
              </p>
              <Link
                href="/canvas/create"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Your First Space
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Spaces;
