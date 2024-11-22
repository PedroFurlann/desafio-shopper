import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { EstimateRideUseCase } from '../../../domain/travel/use-cases/estimate-ride';
import { z } from 'zod';
import { InvalidDataException } from '../errors/InvalidDataException';
import { InvalidDataValidationPipe } from '../pipes/invalid-data-validation.pipe';

const estimateRideBodySchema = z.object({
  customerId: z.string().min(1, 'O customer ID não pode ser nulo'),
  origin: z.string().min(1, 'A origem não pode ser nula'),
  destination: z.string().min(1, 'O destino não pode ser nulo'),
});

type EstimateRideBodySchemaType = z.infer<typeof estimateRideBodySchema>;

@Controller('/ride')
export class RideController {
  constructor(private readonly estimateRideUseCase: EstimateRideUseCase) {}

  @Post('/estimate')
  @HttpCode(200)
  @UsePipes(new InvalidDataValidationPipe(estimateRideBodySchema))
  async estimateRide(@Body() body: EstimateRideBodySchemaType): Promise<any> {
    const { customerId, origin, destination } = body;

    if (origin === destination) {
      throw new InvalidDataException(
        'A origem e o destino não podem ser iguais.',
      );
    }

    const result = await this.estimateRideUseCase.execute({
      customerId,
      origin,
      destination,
    });

    if (result.isLeft()) {
      throw new InvalidDataException('Erro ao estimar corrida.');
    }

    const { estimatedRide } = result.value;

    return estimatedRide;
  }
}
