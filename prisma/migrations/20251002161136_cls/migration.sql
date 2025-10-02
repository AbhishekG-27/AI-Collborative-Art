-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "avatar" TEXT;

-- CreateTable
CREATE TABLE "public"."Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "maxUsers" INTEGER NOT NULL DEFAULT 10,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoomMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RoomMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Drawing" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'freehand',
    "layer" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drawing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserCursor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#ffffff',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCursor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Room_creatorId_idx" ON "public"."Room"("creatorId");

-- CreateIndex
CREATE INDEX "RoomMember_roomId_idx" ON "public"."RoomMember"("roomId");

-- CreateIndex
CREATE INDEX "RoomMember_userId_idx" ON "public"."RoomMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomMember_userId_roomId_key" ON "public"."RoomMember"("userId", "roomId");

-- CreateIndex
CREATE INDEX "Drawing_roomId_idx" ON "public"."Drawing"("roomId");

-- CreateIndex
CREATE INDEX "Drawing_userId_idx" ON "public"."Drawing"("userId");

-- CreateIndex
CREATE INDEX "Drawing_createdAt_idx" ON "public"."Drawing"("createdAt");

-- CreateIndex
CREATE INDEX "UserCursor_roomId_idx" ON "public"."UserCursor"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCursor_userId_roomId_key" ON "public"."UserCursor"("userId", "roomId");

-- AddForeignKey
ALTER TABLE "public"."Room" ADD CONSTRAINT "Room_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomMember" ADD CONSTRAINT "RoomMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoomMember" ADD CONSTRAINT "RoomMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Drawing" ADD CONSTRAINT "Drawing_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Drawing" ADD CONSTRAINT "Drawing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserCursor" ADD CONSTRAINT "UserCursor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserCursor" ADD CONSTRAINT "UserCursor_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
