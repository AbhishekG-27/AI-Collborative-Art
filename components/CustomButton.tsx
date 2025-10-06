"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const CustomButton = ({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) => {
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (!roomId.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/spaces/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: roomId.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join room");
      }

      router.push(`/canvas/${roomId.trim()}`);
    } catch (error) {
      console.error("Error joining room:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="block w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center justify-center gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </div>
    </button>
  );
};

export default CustomButton;
