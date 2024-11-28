import { InMemoryDriverRepository } from "../../../../test/repositories/in-memory-driver-repository";
import { makeRide } from '../../../../test/factories/make-ride';
import { InMemoryRideRepository } from '../../../../test/repositories/in-memory-ride-repository';
import { FetchCustomerAndDriverRidesUseCase } from './fetch-customer-and-driver-rides';

let inMemoryRideRepository: InMemoryRideRepository;
let inMemoryDriverRepository: InMemoryDriverRepository;
let sut: FetchCustomerAndDriverRidesUseCase;

describe('Fetch customer and driver rides', () => {
  beforeEach(() => {
    inMemoryRideRepository = new InMemoryRideRepository();
    inMemoryDriverRepository = new InMemoryDriverRepository()
    sut = new FetchCustomerAndDriverRidesUseCase(inMemoryRideRepository, inMemoryDriverRepository);
  });

  it('should be able to fetch all customer rides', async () => {
    const fakeDriver1 = {
      id: 1,
      name: 'Homer Simpson',
    };

    const fakeDriver2 = {
      id: 2,
      name: 'Dominic Toretto',
    };

    const fakeRide1 = makeRide({
      customerId: '1',
      driverId: fakeDriver1.id,
    });

    const fakeRide2 = makeRide({
      customerId: '1',
      driverId: fakeDriver2.id,
    });

    await inMemoryRideRepository.create(fakeRide1);
    await inMemoryRideRepository.create(fakeRide2);

    const result = await sut.execute({
      customerId: '1',
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.rides).toEqual([
      fakeRide1,
      fakeRide2,
    ]);
  });

  it('should be able to fetch customer rides made by Dominic Toretto', async () => {
    const fakeDriver1 = {
      id: 1,
      name: 'Homer Simpson',
    };

    const fakeDriver2 = {
      id: 2,
      name: 'Dominic Toretto',
    };

    const fakeRide1 = makeRide({
      customerId: '1',
      driverId: fakeDriver1.id,
    });

    const fakeRide2 = makeRide({
      customerId: '1',
      driverId: fakeDriver2.id,
    });

    await inMemoryRideRepository.create(fakeRide1);
    await inMemoryRideRepository.create(fakeRide2);

    const result = await sut.execute({
      customerId: '1',
      driverId: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.isRight() && result.value.rides).toEqual([fakeRide2]);
  });
});
