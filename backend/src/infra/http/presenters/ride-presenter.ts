import { Ride } from '../../../domain/travel/enterprise/entities/ride';

export class RidePresenter {
  static toHTTP(ride: Ride) {
    return {
      id: Number(ride.id.toString().replace(/[^0-9]/g, '')),
      date: ride.createdAt,
      origin: ride.origin,
      destination: ride.destination,
      distance: ride.distance,
      duration: ride.duration,
      driver: {
        id: ride.driverId,
        name: ride.driverName,
      },
      value: ride.value,
    };
  }
}
