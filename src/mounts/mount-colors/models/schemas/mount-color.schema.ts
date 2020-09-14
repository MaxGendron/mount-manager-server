import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDocument } from 'src/common/models/base-document';
import { MountTypeEnum } from 'src/mounts/models/enum/mount-type.enum';

@Schema()
export class MountColor extends BaseDocument {
  @ApiProperty()
  @Prop()
  colorName: string;

  @ApiProperty()
  @Prop()
  mountType: MountTypeEnum;
}

export const MountColorSchema = SchemaFactory.createForClass(MountColor);
