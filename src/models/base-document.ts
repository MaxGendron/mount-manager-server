import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class BaseDocument extends Document {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  __v: number;
}
