import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MountTypeEnum } from '../enum/mount-type.enum';
import { ObjectId } from 'mongoose';
import { BaseDocument } from 'src/models/base-document';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class AccountSetting extends BaseDocument {
  @ApiProperty()
  @Prop({ unique: true })
  userId: ObjectId;

  @ApiProperty()
  @Prop()
  username: string;

  @ApiProperty()
  @Prop()
  server: string;

  @ApiProperty()
  @Prop([String])
  mountType: MountTypeEnum[];
}

export const AccountSettingSchema = SchemaFactory.createForClass(
  AccountSetting,
);
