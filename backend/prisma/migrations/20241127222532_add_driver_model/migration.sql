-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "tax" DECIMAL(65,30) NOT NULL,
    "minKm" DECIMAL(65,30) NOT NULL,
    "rating" DECIMAL(65,30) NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
