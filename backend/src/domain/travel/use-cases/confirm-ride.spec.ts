import { InMemoryRideRepository } from '../../../../test/repositories/in-memory-ride-repository';
import { ConfirmRideUseCase } from './confirm-ride';

let inMemoryRideRepository: InMemoryRideRepository;
let sut: ConfirmRideUseCase;

describe('Confirm Ride', () => {
  beforeEach(() => {
    inMemoryRideRepository = new InMemoryRideRepository();
    sut = new ConfirmRideUseCase(inMemoryRideRepository);
  });

  it('should be able to confirm a ride', async () => {
    const fakeDriver = {
      id: 1,
      name: 'Homer Simpson',
    };

    const fakeRide = {
      customerId: '1',
      origin: 'São Paulo',
      destination: 'Rio de Janeiro',
      distance: 200,
      driver: fakeDriver,
      duration: '145800',
      value: 50,
    };

    const result = await sut.execute(fakeRide);

    expect(result.isRight()).toBe(true);
    expect(inMemoryRideRepository.items.length).toEqual(1);
    expect(inMemoryRideRepository.items[0].customerId).toEqual('1');
  });
});
