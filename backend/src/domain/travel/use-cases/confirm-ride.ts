import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../core/either';
import { Ride } from '../enterprise/entities/ride';
import { RideRepository } from '../application/repositories/ride-repository';
import { DriverRepository } from '../application/repositories/driver-repository';

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

type ConfirmRideUseCaseResponse = Either<Error, null>;
@Injectable()
export class ConfirmRideUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly driverRepository: DriverRepository,
  ) {}

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

    const driverSelected = await this.driverRepository.findById(driver.id);

    if (
      !driverSelected ||
      driverSelected.name.toLowerCase() !== driver.name.toLowerCase()
    ) {
      return left(new Error('404'));
    }

    if (driverSelected.minKm > distance) {
      return left(new Error('406'));
    }

    await this.rideRepository.create(ride);

    return right(null);
  }
}
