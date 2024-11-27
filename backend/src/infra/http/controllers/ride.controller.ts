import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { EstimateRideUseCase } from '../../../domain/travel/use-cases/estimate-ride';
import { z } from 'zod';
import { InvalidDataException } from '../errors/InvalidDataException';
import { InvalidDataValidationPipe } from '../pipes/invalid-data-validation.pipe';
import { DriverNotFoundException } from '../errors/DriverNotFoundException';
import { ConfirmRideUseCase } from '../../../domain/travel/use-cases/confirm-ride';
import { FetchCustomerAndDriverRidesUseCase } from '../../../domain/travel/use-cases/fetch-customer-and-driver-rides';
import { RidesNotFoundException } from '../errors/RidesNotFoundException';
import { RidePresenter } from '../presenters/ride-presenter';
import { InvalidDistanceException } from '../errors/InvalidDistanceException';
import { InvalidDriverException } from '../errors/InvalidDriverException';

const estimateRideBodySchema = z.object({
  customer_id: z.string().trim().min(1, 'O customer ID não pode ser nulo'),
  origin: z.string().trim().min(1, 'A origem não pode ser nula'),
  destination: z.string().trim().min(1, 'O destino não pode ser nulo'),
});

type EstimateRideBodySchemaType = z.infer<typeof estimateRideBodySchema>;

const confirmRideBodySchema = z.object({
  customer_id: z.string().trim().min(1, 'O customer ID não pode ser nulo'),
  origin: z.string().trim().min(1, 'A origem não pode ser nula'),
  destination: z.string().trim().min(1, 'O destino não pode ser nulo'),
  distance: z.number().min(1, 'A distância deve ser não nula e maior que 0'),
  duration: z
    .string()
    .trim()
    .min(1, 'A duração deve ser não nula e maior que 0'),
  driver: z.object({
    id: z.number().min(1, 'O id do motorista não pode ser nulo'),
    name: z.string().trim().min(1, 'O nome do motorista não pode ser nulo'),
  }),
  value: z.number().min(1, 'O valor da viagem deve ser maior que 0'),
});

type ConfirmRideBodySchemaType = z.infer<typeof confirmRideBodySchema>;

@Controller('/ride')
export class RideController {
  constructor(
    private readonly estimateRideUseCase: EstimateRideUseCase,
    private readonly confirmRideUseCase: ConfirmRideUseCase,
    private readonly fetchCustomerAndDriverRidesUseCase: FetchCustomerAndDriverRidesUseCase,
  ) {}

  @Post('/estimate')
  @HttpCode(200)
  @UsePipes(new InvalidDataValidationPipe(estimateRideBodySchema))
  async estimateRide(@Body() body: EstimateRideBodySchemaType): Promise<any> {
    const { customer_id, origin, destination } = body;

    if (origin === destination) {
      throw new InvalidDataException(
        'Os dados fornecidos no corpo da requisição são inválidos',
      );
    }

    const result = await this.estimateRideUseCase.execute({
      customerId: customer_id,
      origin,
      destination,
    });

    if (result.isLeft()) {
      throw new InvalidDataException(
        'Os dados fornecidos no corpo da requisição são inválidos',
      );
    }

    const { estimatedRide } = result.value;

    return estimatedRide;
  }

  @Patch('/confirm')
  @HttpCode(200)
  @UsePipes(new InvalidDataValidationPipe(confirmRideBodySchema))
  async confirmRide(@Body() body: ConfirmRideBodySchemaType): Promise<any> {
    const {
      customer_id,
      origin,
      destination,
      distance,
      driver,
      duration,
      value,
    } = body;

    if (origin === destination) {
      throw new InvalidDataException(
        'Os dados fornecidos no corpo da requisição são inválidos',
      );
    }

    const result = await this.confirmRideUseCase.execute({
      customerId: customer_id,
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
        throw new InvalidDistanceException(
          'Quilometragem inválida para o motorista',
        );
      }
    }

    return { success: true };
  }

  @Get('/:customer_id')
  @HttpCode(200)
  async fetchCustomerAndDriverRides(
    @Param('customer_id') customerId: string,
    @Query('driver_id') driverId?: number,
  ): Promise<any> {
    const result = await this.fetchCustomerAndDriverRidesUseCase.execute({
      customerId,
      driverId: Number(driverId),
    });

    if (result.isLeft()) {
      const error = result.value;
      if (error.message === '404') {
        throw new RidesNotFoundException('Nenhum registro encontrado');
      } else if (error.message === '400') {
        throw new InvalidDriverException('Motorista invalido');
      }
    }

    const ridesFormatted = result.isRight()
      ? result.value.rides.map((ride) => RidePresenter.toHTTP(ride))
      : [];

    return {
      customer_id: customerId,
      rides: ridesFormatted,
    };
  }
}
