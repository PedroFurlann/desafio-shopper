import { Driver } from '../../enterprise/entities/driver';

export abstract class DriverRepository {
  abstract findById(id: number): Promise<Driver | null>;
  abstract findAll(): Promise<Driver[]>;
}
