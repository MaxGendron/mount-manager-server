/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { CustomError } from 'src/models/custom-error';
import { HttpExceptionFilter } from './http-exception.filter';

@Catch(MongoError)
export class MongoExceptionFilter extends HttpExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    let error;
    if (exception.code === 11000) {
      error = new HttpException(
        new CustomError(
          HttpStatus.BAD_REQUEST,
          'CannotInsert',
          'Cannot Insert the requested item, duplicate key error on a attribute',
        ),
        HttpStatus.BAD_REQUEST,
      );
    } else {
      error = new HttpException(
        new CustomError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'UnexpectedError',
          'An unexpected error has occured.',
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    super.catch(error, host);
  }
}
