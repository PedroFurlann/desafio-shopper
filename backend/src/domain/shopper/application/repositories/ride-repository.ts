import { Ride } from '../../enterprise/entities/ride';

export abstract class AthleteRepository {
  abstract create(ride: Ride): Promise<void>;
  abstract findManyByCustomerIdAndDriverId(
    customerId: string,
    driverId?: string,
  ): Promise<Ride[] | null>;
}
