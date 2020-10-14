import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDocument } from 'src/common/models/base-document';
import { MountTypeEnum } from 'src/mounts/models/enum/mount-type.enum';
import { ColorLocalize } from '../color-localize';

@Schema()
export class MountColor extends BaseDocument {
  @ApiProperty()
  @Prop(ColorLocalize)
  color: ColorLocalize;

  @ApiProperty()
  @Prop()
  mountType: MountTypeEnum;
}

export const MountColorSchema = SchemaFactory.createForClass(MountColor);
