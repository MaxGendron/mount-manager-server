import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class CustomError {
  @ApiProperty()
  statusCode: HttpStatus;

  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;

  constructor(statusCode: HttpStatus, name: string, message: string) {
    this.statusCode = statusCode;
    this.name = name;
    this.message = message;
  }
}
