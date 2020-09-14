/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomError } from 'src/common/models/custom-error';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  //Override handleRequest to return proper error message when missing credentials
  handleRequest(err, user, info, context, status) {
    if (info && info.message === 'Missing credentials') {
      throw new HttpException(
        new CustomError(HttpStatus.BAD_REQUEST, 'UndefinedParameter', 'ValidationError'),
        HttpStatus.BAD_REQUEST,
      );
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
