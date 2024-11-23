import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../core/either';
import { Ride } from '../enterprise/entities/ride';
import { RideRepository } from '../application/repositories/ride-repository';
import { readFileSync } from 'fs';
import { join } from 'path';

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

type ConfirmRideUseCaseResponse = Either<Error, null>;
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

    const data = readFileSync(join(process.cwd(), 'drivers.json'), 'utf8');

    const drivers: Driver[] = JSON.parse(data);

    const driverSelected = drivers.find(
      (driverChoosed) =>
        driverChoosed.id === driver.id && driverChoosed.name === driver.name,
    );

    if (!driverSelected) {
      return left(new Error('404'));
    }

    if (driverSelected.minKm > distance) {
      return left(new Error('406'));
    }

    await this.rideRepository.create(ride);

    return right(null);
  }
}
