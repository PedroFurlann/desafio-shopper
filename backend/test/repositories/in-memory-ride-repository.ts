import { RideRepository } from 'src/domain/shopper/application/repositories/ride-repository';
import { Ride } from 'src/domain/shopper/enterprise/entities/ride';

export class InMemoryRideRepository implements RideRepository {
  public items: Ride[] = [];

  async create(ride: Ride): Promise<void> {
    this.items.push(ride);
  }

  async findManyByCustomerIdAndDriverId(
    customerId: string,
    driverId?: number,
  ): Promise<Ride[] | null> {
    if (driverId) {
      const rides = this.items.filter(
        (ride) => ride.customerId === customerId && ride.driverId === driverId,
      );

      if (!rides) return null;

      return rides;
    } else {
      const rides = this.items.filter((ride) => ride.customerId === customerId);

      if (!rides) return null;

      return rides;
    }
  }
}
