import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/prisma/database.module';
import { EvaluatorModule } from '../evaluator/evaluator.module';
import { EstimateRideUseCase } from '../../domain/shopper/use-cases/estimate-ride';

@Module({
  imports: [DatabaseModule, EvaluatorModule],
  providers: [EstimateRideUseCase],
})
export class HttpModule {}
