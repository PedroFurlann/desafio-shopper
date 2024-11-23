import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class InvalidDataValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDescription =
          'Os dados fornecidos no corpo da requisição são inválidos';

        throw new BadRequestException({
          error_code: 'INVALID_DATA',
          error_description: errorDescription,
        });
      }

      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'Validation falhou devido a um erro desconhecido',
      });
    }
  }
}
