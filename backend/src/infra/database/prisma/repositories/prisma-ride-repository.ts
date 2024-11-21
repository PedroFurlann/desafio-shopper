import { Injectable } from '@nestjs/common';
import { PrismaRideMapper } from '../mappers/prisma-ride-mapper';
import { Ride } from '../../../../domain/shopper/enterprise/entities/ride';
import { RideRepository } from '../../../../domain/shopper/application/repositories/ride-repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaRideRepository implements RideRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(ride: Ride): Promise<void> {
    const data = PrismaRideMapper.toPersistence(ride);

    await this.prismaService.ride.create({
      data,
    });
  }

  async findManyByCustomerIdAndDriverId(
    customerId: string,
    driverId?: number,
  ): Promise<Ride[] | null> {
    if (driverId) {
      const data = await this.prismaService.ride.findMany({
        where: {
          customer_id: customerId,
          driver_id: driverId,
        },
      });

      if (!data) return null;

      return data.map(PrismaRideMapper.toDomain);
    } else {
      const data = await this.prismaService.ride.findMany({
        where: {
          customer_id: customerId,
        },
      });

      if (!data) return null;

      return data.map(PrismaRideMapper.toDomain);
    }
  }
}
