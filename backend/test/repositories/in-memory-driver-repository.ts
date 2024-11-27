import { DriverRepository } from 'src/domain/travel/application/repositories/Driver-repository';
import { Driver } from 'src/domain/travel/enterprise/entities/Driver';

export class InMemoryDriverRepository implements DriverRepository {
  public items: Driver[] = [];

  async findById(id: number): Promise<Driver | null> {
    const driver = this.items.find((driver) => Number(driver.id.toValue()) === id)

    return driver ?? null
  }

  async findAll(): Promise<Driver[]> {
    return this.items;
  }
}
