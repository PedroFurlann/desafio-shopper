import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidDriverException extends HttpException {
  constructor(errorDescription: string) {
    super(
      {
        error_code: 'INVALID_DRIVER',
        error_description: errorDescription,
      },
      HttpStatus.NOT_ACCEPTABLE,
    );
  }
}
