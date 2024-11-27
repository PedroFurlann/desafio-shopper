import { UniqueEntityID } from '../../../../core/entities/unique-entity-id';
import { Prisma, Driver as PrismaDriver } from '@prisma/client';
import { Driver } from '../../../../domain/travel/enterprise/entities/Driver';

export class PrismaDriverMapper {
  static toDomain(raw: PrismaDriver): Driver {
    return Driver.create(
      {
        name: raw.name,
        description: raw.description,
        vehicle: raw.vehicle,
        tax: Number(raw.tax),
        minKm: Number(raw.minKm),
        rating: Number(raw.rating),
        comment: raw.comment,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? null,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(driver: Driver): Prisma.DriverUncheckedCreateInput {
    return {
      name: driver.name,
      description: driver.description,
      vehicle: driver.vehicle,
      tax: driver.tax,
      minKm: driver.minKm,
      rating: driver.rating,
      comment: driver.comment,
      createdAt: driver.createdAt,
      updatedAt: driver.updatedAt ?? null,
    };
  }
}
