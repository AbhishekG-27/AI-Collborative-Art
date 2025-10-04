import React from "react";
import { PrismaClient } from "@/lib/generated/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const prisma = new PrismaClient();

const CreateSpace = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/api/auth/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/canvas"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Spaces
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Space
          </h1>
          <p className="text-gray-600 text-lg">
            Set up a new collaborative art space for you and your team.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form action="/api/spaces/create" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Space Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter space name..."
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                placeholder="Describe your space and what you'll be creating..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Visibility
              </label>
              <div className="space-y-3">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="isPublic"
                    value="true"
                    defaultChecked
                    className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      Public
                    </div>
                    <div className="text-sm text-gray-500">
                      Anyone can discover and join this space
                    </div>
                  </div>
                </label>
                <label className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="isPublic"
                    value="false"
                    className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      Private
                    </div>
                    <div className="text-sm text-gray-500">
                      Only invited users can access this space
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="maxUsers"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Maximum Users
              </label>
              <select
                id="maxUsers"
                name="maxUsers"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="5">5 users</option>
                <option value="10" defaultValue={5}>
                  10 users
                </option>
                <option value="20">20 users</option>
                <option value="50">50 users</option>
              </select>
            </div>

            <div className="flex space-x-4 pt-4">
              <Link
                href="/canvas"
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Space
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSpace;
