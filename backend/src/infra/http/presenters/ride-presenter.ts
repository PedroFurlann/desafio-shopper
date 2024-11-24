import { Ride } from '../../../domain/travel/enterprise/entities/ride';

const extractFourDigitsFromUUID = (uuid: string): number => {
  const numericString = uuid.replace(/\D+/g, '');

  const fourDigits = numericString.slice(0, 4);

  return parseFloat(fourDigits);
};

export class RidePresenter {
  static toHTTP(ride: Ride) {
    return {
      id: extractFourDigitsFromUUID(ride.id.toString()),
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
