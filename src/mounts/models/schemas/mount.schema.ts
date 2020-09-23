import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDocument } from 'src/common/models/base-document';
import { MountTypeEnum } from 'src/mounts/models/enum/mount-type.enum';
import { MountGenderEnum } from '../enum/mount-gender.enum';

@Schema()
export class Mount extends BaseDocument {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  gender: MountGenderEnum;

  @ApiProperty()
  @Prop()
  color: string;

  @ApiProperty()
  @Prop()
  userId: string;

  @ApiProperty()
  @Prop()
  type: MountTypeEnum;
}

export const MountSchema = SchemaFactory.createForClass(Mount);
