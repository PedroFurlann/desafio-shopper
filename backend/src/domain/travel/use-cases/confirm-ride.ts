import { Injectable } from '@nestjs/common';
import { Either } from '../../../core/either';
import { Ride } from '../enterprise/entities/ride';
import { RideRepository } from '../application/repositories/ride-repository';

interface ConfirmRideUseCaseRequest {
  customerId: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

type ConfirmRideUseCaseResponse = Either<null, null>;
@Injectable()
export class ConfirmRideUseCase {
  constructor(private rideRepository: RideRepository) {}

  async execute({
    customerId,
    destination,
    distance,
    driver,
    duration,
    origin,
    value,
  }: ConfirmRideUseCaseRequest): Promise<ConfirmRideUseCaseResponse> {
    const ride = Ride.create({
      customerId,
      destination,
      distance,
      driverId: driver.id,
      driverName: driver.name,
      duration: duration,
      origin: origin,
      value: value,
    });

    await this.rideRepository.create(ride);

    return null;
  }
}
