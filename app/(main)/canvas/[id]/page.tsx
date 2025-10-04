import CanvasComponent from "@/components/CanvasComponent";
import CanvasDetailsComponent from "@/components/CanvasDetailsComponent";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Canvas = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/api/auth/sign-in");
  }
  const userId = session.user?.id;
  const roomId = (await params).id;

  // TO-DO: check if user is permitted to access the room, if not redirect to home
  // TO-DO: check if the user is already in the room in another tab, if yes prompt to close that tab or continue here
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
