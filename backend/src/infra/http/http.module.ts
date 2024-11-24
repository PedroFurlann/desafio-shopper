import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/prisma/database.module';
import { EvaluatorModule } from '../evaluator/evaluator.module';
import { EstimateRideUseCase } from '../../domain/travel/use-cases/estimate-ride';
import { RideController } from './controllers/ride.controller';
import { ConfirmRideUseCase } from '../../domain/travel/use-cases/confirm-ride';
import { FetchCustomerAndDriverRidesUseCase } from '../../domain/travel/use-cases/fetch-customer-and-driver-rides';

@Module({
  controllers: [RideController],
  imports: [DatabaseModule, EvaluatorModule],
  providers: [
    EstimateRideUseCase,
    ConfirmRideUseCase,
    FetchCustomerAndDriverRidesUseCase,
  ],
})
export class HttpModule {}
