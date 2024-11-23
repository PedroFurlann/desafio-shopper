import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { EstimateRideUseCase } from '../../../domain/travel/use-cases/estimate-ride';
import { z } from 'zod';
import { InvalidDataException } from '../errors/InvalidDataException';
import { InvalidDataValidationPipe } from '../pipes/invalid-data-validation.pipe';
import { DriverNotFoundException } from '../errors/DriverNotFoundException';
import { InvalidDriverException } from '../errors/InvalidDriverException';
import { ConfirmRideUseCase } from '../../../domain/travel/use-cases/confirm-ride';

const estimateRideBodySchema = z.object({
  customerId: z.string().min(1, 'O customer ID não pode ser nulo'),
  origin: z.string().min(1, 'A origem não pode ser nula'),
  destination: z.string().min(1, 'O destino não pode ser nulo'),
});

type EstimateRideBodySchemaType = z.infer<typeof estimateRideBodySchema>;

const confirmRideBodySchema = z.object({
  customerId: z.string().min(1, 'O customer ID não pode ser nulo'),
  origin: z.string().min(1, 'A origem não pode ser nula'),
  destination: z.string().min(1, 'O destino não pode ser nulo'),
  distance: z.number().min(1, 'A distância deve ser não nula e maior que 0'),
  duration: z.string().min(1, 'A duração deve ser não nula e maior que 0'),
  driver: z.object({
    id: z.number().min(1, 'O id do motorista não pode ser nulo'),
    name: z.string().min(1, 'O nome do motorista não pode ser nulo'),
  }),
  value: z.number().min(1, 'O valor da viagem deve ser maior que 0'),
});

type ConfirmRideBodySchemaType = z.infer<typeof confirmRideBodySchema>;

@Controller('/ride')
export class RideController {
  constructor(
    private readonly estimateRideUseCase: EstimateRideUseCase,
    private readonly confirmRideUseCase: ConfirmRideUseCase,
  ) {}

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

  @Patch('/confirm')
  @HttpCode(200)
  @UsePipes(new InvalidDataValidationPipe(confirmRideBodySchema))
  async confirmRide(@Body() body: ConfirmRideBodySchemaType): Promise<any> {
    const {
      customerId,
      origin,
      destination,
      distance,
      driver,
      duration,
      value,
    } = body;

    const result = await this.confirmRideUseCase.execute({
      customerId,
      origin,
      destination,
      distance,
      driver,
      duration,
      value,
    });

    if (result.isLeft()) {
      const error = result.value;
      if (error.message === '404') {
        throw new DriverNotFoundException('Motorista não encontrado');
      } else if (error.message === '406') {
        throw new InvalidDriverException(
          'Quilometragem inválida para o motorista',
        );
      }
    }

    return { success: true };
  }
}
