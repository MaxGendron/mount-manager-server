/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { CustomError } from 'src/models/custom-error';

@Catch(MongoError)
export class MongoFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (exception.code === 11000) {
      const error = new HttpException(
        new CustomError(
          HttpStatus.BAD_REQUEST,
          'CannotInsert',
          'Cannot Insert the requested item, duplicate key error on a attribute',
        ),
        HttpStatus.BAD_REQUEST,
      );
      response.status(400).json(error.getResponse());
    } else {
      const error = new HttpException(
        new CustomError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'UnexpectedError',
          'An unexpected error has occured.',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      response.status(500).json(error.getResponse());
    }
  }
}
