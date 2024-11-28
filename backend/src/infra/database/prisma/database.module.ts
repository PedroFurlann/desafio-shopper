import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RideRepository } from '../../../domain/travel/application/repositories/ride-repository';
import { PrismaRideRepository } from './repositories/prisma-ride-repository';
import { DriverRepository } from '../../../domain/travel/application/repositories/driver-repository';
import { PrismaDriverRepository } from './repositories/prisma-driver-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: RideRepository,
      useClass: PrismaRideRepository,
    },
    {
      provide: DriverRepository,
      useClass: PrismaDriverRepository,
    },
  ],
  exports: [PrismaService, RideRepository, DriverRepository],
})
export class DatabaseModule {}
