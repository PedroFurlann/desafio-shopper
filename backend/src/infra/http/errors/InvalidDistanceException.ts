import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidDistanceException extends HttpException {
  constructor(errorDescription: string) {
    super(
      {
        error_code: 'INVALID_DISTANCE',
        error_description: errorDescription,
      },
      HttpStatus.NOT_ACCEPTABLE,
    );
  }
}
