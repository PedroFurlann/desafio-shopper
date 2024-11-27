import { Injectable } from '@nestjs/common';
import { Either, right } from '../../../core/either';
import { RideEvaluator } from '../application/evaluator/rideEvaluator';
import { DriverRepository } from '../application/repositories/driver-repository';
import { Driver } from '../enterprise/entities/driver';

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

type DriverProps = {
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
  constructor(
    private readonly rideEvaluator: RideEvaluator,
    private readonly driverRepository: DriverRepository,
  ) {}

  async execute({
    customerId,
    origin,
    destination,
  }: EstimateRideUseCaseRequest): Promise<EstimateRideUseCaseResponse> {
    const drivers = await this.driverRepository.findAll();

    const estimatedRide = await this.rideEvaluator.getRoute(
      customerId,
      origin,
      destination,
    );

    const convertDriverToHttpFormat = (driver: Driver): DriverProps => {
      return {
        id: Number(driver.id.toValue()),
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: {
          rating: driver.rating,
          comment: driver.comment,
        },
        tax: driver.tax,
        minKm: driver.minKm,
      };
    };

    const driversFormatted = drivers.map(convertDriverToHttpFormat);

    const travelDistanceInKm = estimatedRide.distance / 1000;

    function calculateDriverValues(drivers: DriverProps[], distanceKm: number) {
      return drivers
        .filter((driver) => distanceKm >= driver.minKm)
        .map((driver) => ({
          ...driver,
          value: driver.tax * distanceKm,
        }))
        .sort((a, b) => a.value - b.value);
    }

    const driversSortedPerRideValue = calculateDriverValues(
      driversFormatted,
      travelDistanceInKm,
    );

    console.log(driversSortedPerRideValue);

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
          value: Number(driver.value.toFixed(2)),
        };
      }),
      routeResponse: estimatedRide,
    };

    return right({
      estimatedRide: estimatedRideResponse,
    });
  }
}
