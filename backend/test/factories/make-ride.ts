import {
  RideProps,
  Ride,
} from '../../src/domain/travel/enterprise/entities/ride';
import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '../../src/core/entities/unique-entity-id';

export function makeRide(
  override: Partial<RideProps> = {},
  id?: UniqueEntityID,
) {
  const ride = Ride.create(
    {
      customerId: faker.string.uuid(),
      driverId: faker.number.int({ min: 1, max: 1000 }),
      origin: faker.location.city(),
      destination: faker.location.city(),
      value: faker.number.float({ min: 10, max: 100 }),
      distance: faker.number.float({ min: 1, max: 500 }),
      driverName: faker.person.fullName(),
      duration: faker.string.numeric(2) + ' mins',
      ...override,
    },
    id,
  );

  return ride;
}
