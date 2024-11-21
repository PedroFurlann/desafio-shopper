import { Ride } from '../../enterprise/entities/ride';

export abstract class RideRepository {
  abstract create(ride: Ride): Promise<void>;
  abstract findManyByCustomerIdAndDriverId(
    customerId: string,
    driverId?: number,
  ): Promise<Ride[] | null>;
}
