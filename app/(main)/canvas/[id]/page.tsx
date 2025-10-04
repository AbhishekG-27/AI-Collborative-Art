import CanvasComponent from "@/components/CanvasComponent";
import CanvasDetailsComponent from "@/components/CanvasDetailsComponent";
import { authOptions } from "@/lib/auth";
import { addUserToRoom } from "@/lib/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

const Canvas = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/sign-in");
  }
  const userId = session.user?.id;
  const roomId = (await params).id;

  // TO-DO: check if the user is already in the room in another tab, if yes prompt to close that tab or continue here
  const updateduser = await addUserToRoom(roomId, userId);
  if (updateduser.success === false) {
    // If user is already in a room, show a specific message
    if (updateduser.errorType === "USER_ALREADY_IN_ROOM") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Already in a Room
            </h2>
            <p className="text-gray-600 mb-6">
              You are currently in another room
              {updateduser.currentRoom
                ? ` "${updateduser.currentRoom.name}"`
                : ""}
              . You can only be in one room at a time.
            </p>
            <div className="space-y-3">
              {updateduser.currentRoom && (
                <Link
                  href={`/canvas/${updateduser.currentRoom.id}`}
                  className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Go to Current Room
                </Link>
              )}
              <Link
                href="/canvas"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Spaces
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // For other errors (room not found, etc.), redirect to spaces with error
    console.error(updateduser.message);
    return redirect("/canvas");
  }

  // TO-DO: check if user is permitted to access the room, if not redirect to home
  // To-DO: Fetch room details from DB to show in CanvasDetailsComponent
  // To-DO: Handle invalid roomId (room not found) case
  // To-DO: Handle loading and error states

  return (
    <div>
      <CanvasDetailsComponent />
      <CanvasComponent roomId={roomId} userId={userId} />
    </div>
  );
};

export default Canvas;
