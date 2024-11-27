import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../core/either';
import { Ride } from '../enterprise/entities/ride';
import { RideRepository } from '../application/repositories/ride-repository';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DriverRepository } from "../application/repositories/Driver-repository";

interface FetchCustomerAndDriverRidesUseCaseRequest {
  customerId: string;
  driverId?: number;
}

interface FetchCustomerAndDriverRidesResponse {
  customerId: string;
  rides: Ride[];
}

type FetchCustomerAndDriverRidesUseCaseResponse = Either<
  Error,
  FetchCustomerAndDriverRidesResponse
>;
@Injectable()
export class FetchCustomerAndDriverRidesUseCase {
  constructor(private readonly rideRepository: RideRepository, private readonly driverRepository: DriverRepository) {}

  async execute({
    customerId,
    driverId,
  }: FetchCustomerAndDriverRidesUseCaseRequest): Promise<FetchCustomerAndDriverRidesUseCaseResponse> {
    const data = readFileSync(join(process.cwd(), 'drivers.json'), 'utf8');

    if (driverId) {
      const driverSelected = await this.driverRepository.findById(driverId);

      if (!driverSelected) {
        return left(new Error('400'));
      }
    }

    const rides = await this.rideRepository.findManyByCustomerIdAndDriverId(
      customerId,
      driverId,
    );

    if (!rides || rides.length === 0) {
      return left(new Error('404'));
    }

    return right({
      customerId,
      rides,
    });
  }
}
