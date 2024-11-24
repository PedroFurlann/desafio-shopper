import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { Prisma, Ride as PrismaRide } from '@prisma/client';
import { Ride } from '../../../../domain/travel/enterprise/entities/ride';

export class PrismaRideMapper {
  static toDomain(raw: PrismaRide): Ride {
    return Ride.create(
      {
        customerId: raw.customer_id,
        destination: raw.destination,
        distance: Number(raw.distance),
        driverId: raw.driver_id,
        driverName: raw.driver_name,
        duration: raw.duration,
        origin: raw.origin,
        value: Number(raw.value),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(ride: Ride): Prisma.RideUncheckedCreateInput {
    return {
      id: ride.id.toString(),
      customer_id: ride.customerId,
      destination: ride.destination,
      distance: ride.distance,
      driver_id: ride.driverId,
      driver_name: ride.driverName,
      duration: ride.duration,
      origin: ride.origin,
      value: ride.value,
      createdAt: ride.createdAt,
      updatedAt: ride.updatedAt ?? null,
    };
  }
}
