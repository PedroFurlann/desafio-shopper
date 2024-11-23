import { Injectable } from '@nestjs/common';
import { Either, left, right } from '../../../core/either';
import { Ride } from '../enterprise/entities/ride';
import { RideRepository } from '../application/repositories/ride-repository';
import { readFileSync } from 'fs';
import { join } from 'path';

interface FetchCustomerAndDriverRidesUseCaseRequest {
  customerId: string;
  driverId?: number;
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
  constructor(private rideRepository: RideRepository) {}

  async execute({
    customerId,
    driverId,
  }: FetchCustomerAndDriverRidesUseCaseRequest): Promise<FetchCustomerAndDriverRidesUseCaseResponse> {
    const data = readFileSync(join(process.cwd(), 'drivers.json'), 'utf8');

    const drivers: Driver[] = JSON.parse(data);

    if (driverId) {
      const driverSelected = drivers.find(
        (driverChoosed) => driverChoosed.id === driverId,
      );

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
