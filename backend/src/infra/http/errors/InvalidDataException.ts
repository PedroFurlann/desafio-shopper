import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidDataException extends HttpException {
  constructor(errorDescription: string) {
    super(
      {
        error_code: 'INVALID_DATA',
        error_description: errorDescription,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
