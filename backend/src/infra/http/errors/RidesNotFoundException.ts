import { HttpException, HttpStatus } from '@nestjs/common';

export class RidesNotFoundException extends HttpException {
  constructor(errorDescription: string) {
    super(
      {
        error_code: 'NO_RIDES_FOUND',
        error_description: errorDescription,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
