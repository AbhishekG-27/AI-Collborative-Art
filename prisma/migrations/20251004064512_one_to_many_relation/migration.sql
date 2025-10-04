/*
  Warnings:

  - You are about to drop the `RoomMember` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `Drawing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."DrawingType" AS ENUM ('FREEHAND', 'ELLIPSE', 'AI_ASSET');

-- DropForeignKey
ALTER TABLE "public"."RoomMember" DROP CONSTRAINT "RoomMember_roomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RoomMember" DROP CONSTRAINT "RoomMember_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Drawing" DROP COLUMN "type",
ADD COLUMN     "type" "public"."DrawingType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "currentRoomId" TEXT;

-- DropTable
DROP TABLE "public"."RoomMember";

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_currentRoomId_fkey" FOREIGN KEY ("currentRoomId") REFERENCES "public"."Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
