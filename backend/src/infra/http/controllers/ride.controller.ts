import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
} from '@nestjs/common';
import { EstimateRideUseCase } from '../../../domain/shopper/use-cases/estimate-ride';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';

const estimateRideBodySchema = z.object({
  customerId: z.string(),
  origin: z.string(),
  destination: z.string(),
});

type EstimateRideBodySchemaType = z.infer<typeof estimateRideBodySchema>;

@Controller('/ride')
export class RideController {
  constructor(private readonly estimateRideUseCase: EstimateRideUseCase) {}

  @Post('/estimate')
  @UsePipes(new ZodValidationPipe(estimateRideBodySchema))
  async estimateRide(@Body() body: EstimateRideBodySchemaType): Promise<any> {
    const { customerId, origin, destination } = body;

    const result = await this.estimateRideUseCase.execute({
      customerId,
      origin,
      destination,
    });

    if (result.isLeft()) {
      throw new BadRequestException('Erro ao estimar corrida');
    }

    const { estimatedRide } = result.value;

    return estimatedRide;
  }
}
