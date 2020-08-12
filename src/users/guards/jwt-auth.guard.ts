/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomError } from 'src/models/custom-error';

//Use this JwtAuthGuard if you wanna restreint a route to a logged in user
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

  //Override handleRequest to return proper error message in case of unauthorized
  handleRequest(err, user, info, context, status) {
    if (err || !user) {
      throw err || new HttpException(
        new CustomError(HttpStatus.UNAUTHORIZED,'Unauthorized', 'Unauthorized'),
        HttpStatus.UNAUTHORIZED
      );
    }
    return user;
  }
}