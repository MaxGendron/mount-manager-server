import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomError } from '../models/custom-error';

/* Utility class to serve static method for throwing error that are
frequently used */
@Injectable()
export class ThrowExceptionUtils {
  static notFoundException(entityType: string, value: string = null, attribute = 'id'): void {
    const message = value === null ? `No ${entityType}s found` : `No ${entityType} found for ${attribute}: ${value}`;
    throw new HttpException(new CustomError(HttpStatus.NOT_FOUND, 'NotFound', message), HttpStatus.NOT_FOUND);
  }

  static forbidden(): void {
    throw new HttpException(
      new CustomError(HttpStatus.FORBIDDEN, 'Forbidden', 'Forbidden resource'),
      HttpStatus.FORBIDDEN,
    );
  }

  static badParameter(message: string): void {
    this.badRequest('BadParameter', message);
  }

  static cannotInsert(message: string): void {
    this.badRequest('CannotInsert', message);
  }

  static badRequest(name: string, message: string): void {
    throw new HttpException(new CustomError(HttpStatus.BAD_REQUEST, name, message), HttpStatus.BAD_REQUEST);
  }
}
