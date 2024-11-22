import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class InvalidDataValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDescription = error.errors
          .map((e) => `${e.path.join('.')} - ${e.message}`)
          .join('; ');

        throw new BadRequestException({
          error_code: 'INVALID_DATA',
          error_description: errorDescription,
        });
      }

      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'Validation failed due to an unknown error.',
      });
    }
  }
}
