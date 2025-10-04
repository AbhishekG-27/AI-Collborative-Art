import CanvasComponent from "@/components/CanvasComponent";
import CanvasDetailsComponent from "@/components/CanvasDetailsComponent";
import { authOptions } from "@/lib/auth";
import { addUserToRoom } from "@/lib/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import CanvasError from "@/components/CanvasError";

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
        <CanvasError errorMessage="You are already in another room. Please leave that room before joining a new one." />
      );
    } else if (updateduser.errorType === "ROOM_NOT_FOUND") {
      return (
        <CanvasError errorMessage="The room you are trying to access does not exist. Please check the link or create a new space." />
      );
    }
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
