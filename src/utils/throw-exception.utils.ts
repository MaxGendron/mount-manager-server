import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomError } from '../models/custom-error';

/* Utility class to serve static method for throwing error that are
frequently used */
@Injectable()
export class ThrowExceptionUtils {
  static notFoundException(
    entityType: string,
    value: string = null,
    attribute = 'id',
  ): void {
    const message =
      value === null
        ? `No ${entityType}s found`
        : `No ${entityType} found for ${attribute}: ${value}`;
    throw new HttpException(
      new CustomError(HttpStatus.NOT_FOUND, 'NotFound', message),
      HttpStatus.NOT_FOUND,
    );
  }
}
