-- CreateEnum
CREATE TYPE "TemperaturePreference" AS ENUM ('Celsius', 'Farenheit', 'Kelvin');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperaturePreference" "TemperaturePreference" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstructionList" (
    "id" TEXT NOT NULL,
    "light" TEXT NOT NULL,
    "humidity" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "wateringInstructionsId" TEXT NOT NULL,
    "soilInstructionsId" TEXT NOT NULL,
    "environmentInstructionsId" TEXT NOT NULL,

    CONSTRAINT "InstructionList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoilInstructions" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "SoilInstructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentInstructions" (
    "id" TEXT NOT NULL,
    "humidity" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "light" TEXT NOT NULL,

    CONSTRAINT "EnvironmentInstructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WateringInstructions" (
    "id" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "interval" INTEGER NOT NULL,
    "intervalType" TEXT NOT NULL,

    CONSTRAINT "WateringInstructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scientificName" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "instructionListId" TEXT NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_friends" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_friends_AB_unique" ON "_friends"("A", "B");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructionList" ADD CONSTRAINT "InstructionList_soilInstructionsId_fkey" FOREIGN KEY ("soilInstructionsId") REFERENCES "SoilInstructions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructionList" ADD CONSTRAINT "InstructionList_environmentInstructionsId_fkey" FOREIGN KEY ("environmentInstructionsId") REFERENCES "EnvironmentInstructions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructionList" ADD CONSTRAINT "InstructionList_wateringInstructionsId_fkey" FOREIGN KEY ("wateringInstructionsId") REFERENCES "WateringInstructions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_instructionListId_fkey" FOREIGN KEY ("instructionListId") REFERENCES "InstructionList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
