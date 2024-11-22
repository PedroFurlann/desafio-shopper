import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { RideEvaluator } from '../../domain/shopper/application/evaluator/rideEvaluator';
import { MapsEvaluator } from './maps-evaluator';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: RideEvaluator,
      useClass: MapsEvaluator,
    },
  ],
  exports: [RideEvaluator],
})
export class EvaluatorModule {}
