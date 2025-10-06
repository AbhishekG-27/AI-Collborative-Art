import React from "react";
import { PrismaClient } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import SpacesCard from "@/components/SpacesCard";
import ModalButton from "@/components/ModalButton";

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Creative Spaces
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome back, {name}! Manage and access your collaborative art
              spaces.
            </p>
          </div>
          <ModalButton />
        </div>

        {userSpaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* User's Spaces */}
            {userSpaces.map((space) => (
              <SpacesCard key={space.id} space={space} />
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
