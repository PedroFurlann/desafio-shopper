import { Injectable } from '@nestjs/common';
import { Either, right } from '../../../core/either';
import { RideEvaluator } from '../application/evaluator/rideEvaluator';
import { readFileSync } from 'fs';
import { join } from 'path';

interface EstimatedRideResponse {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: {
      rating: number;
      comment: string;
    };
    value: number;
  }[];
  routeResponse: any;
}

type Driver = {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    comment: string;
  };
  tax: number;
  minKm: number;
};

interface EstimateRideUseCaseRequest {
  customerId: string;
  origin: string;
  destination: string;
}

type EstimateRideUseCaseResponse = Either<
  null,
  { estimatedRide: EstimatedRideResponse }
>;

@Injectable()
export class EstimateRideUseCase {
  constructor(private readonly rideEvaluator: RideEvaluator) {}

  async execute({
    customerId,
    origin,
    destination,
  }: EstimateRideUseCaseRequest): Promise<EstimateRideUseCaseResponse> {
    const data = readFileSync(join(process.cwd(), 'drivers.json'), 'utf8');

    const drivers: Driver[] = JSON.parse(data);

    const estimatedRide = await this.rideEvaluator.getRoute(
      customerId,
      origin,
      destination,
    );

    const travelDistanceInKm = estimatedRide.distance / 1000;

    function calculateDriverValues(drivers: Driver[], distanceKm: number) {
      return drivers
        .filter((driver) => distanceKm >= driver.minKm)
        .map((driver) => ({
          ...driver,
          value: driver.tax * distanceKm,
        }))
        .sort((a, b) => a.value - b.value);
    }

    const driversSortedPerRideValue = calculateDriverValues(
      drivers,
      travelDistanceInKm,
    );

    const estimatedRideResponse = {
      origin: {
        latitude: estimatedRide.origin.latitude,
        longitude: estimatedRide.origin.longitude,
      },
      destination: {
        latitude: estimatedRide.destination.latitude,
        longitude: estimatedRide.destination.longitude,
      },
      distance: Number(travelDistanceInKm.toFixed(2)),
      duration: estimatedRide.duration,
      options: driversSortedPerRideValue.map((driver) => {
        return {
          id: driver.id,
          name: driver.name,
          description: driver.description,
          vehicle: driver.vehicle,
          review: {
            rating: driver.review.rating,
            comment: driver.review.comment,
          },
          value: driver.value,
        };
      }),
      routeResponse: estimatedRide,
    };

    return right({
      estimatedRide: estimatedRideResponse,
    });
  }
}
