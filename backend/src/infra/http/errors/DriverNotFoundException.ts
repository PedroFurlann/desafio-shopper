import { HttpException, HttpStatus } from '@nestjs/common';

export class DriverNotFoundException extends HttpException {
  constructor(errorDescription: string) {
    super(
      {
        error_code: 'DRIVER_NOT_FOUND',
        error_description: errorDescription,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
