import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class ColorLocalize {
  @ApiProperty()
  @Prop()
  en: string;

  @ApiProperty()
  @Prop()
  fr: string;
}
