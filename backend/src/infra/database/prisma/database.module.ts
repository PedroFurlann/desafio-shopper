import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RideRepository } from '../../../domain/travel/application/repositories/ride-repository';
import { PrismaRideRepository } from './repositories/prisma-ride-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: RideRepository,
      useClass: PrismaRideRepository,
    },
  ],
  exports: [PrismaService, RideRepository],
})
export class DatabaseModule {}
