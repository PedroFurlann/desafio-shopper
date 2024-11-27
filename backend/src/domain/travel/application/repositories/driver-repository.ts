import { Driver } from '../../enterprise/entities/Driver';

export abstract class DriverRepository {
  abstract findById(id: number): Promise<Driver | null>;
  abstract findAll(): Promise<Driver[]>;
}
