import CanvasComponent from "@/components/CanvasComponent";
import CanvasDetailsComponent from "@/components/CanvasDetailsComponent";
import { authOptions } from "@/lib/auth";
import { addUserToRoom, checkIfUserInRoom } from "@/lib/client";
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

  // check if the user is part of the room in db
  const isUserInRoom = await checkIfUserInRoom(userId, roomId);
  if (!isUserInRoom) {
    return (
      <CanvasError
        heading="Access Denied"
        subHeading="You are not a member of this room."
      />
    );
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
