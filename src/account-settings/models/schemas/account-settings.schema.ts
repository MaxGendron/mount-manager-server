import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MountTypeEnum } from '../enum/mount-type.enum';
import { ObjectId } from 'mongoose';
import { BaseDocument } from 'src/models/base-document';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class AccountSettings extends BaseDocument {
  @ApiProperty({ type: String })
  @Prop({ unique: true })
  userId: ObjectId;

  @ApiProperty()
  @Prop()
  username: string;

  @ApiProperty()
  @Prop()
  serverName: string;

  @ApiProperty()
  @Prop([String])
  mountTypes: MountTypeEnum[];
}

export const AccountSettingSchema = SchemaFactory.createForClass(AccountSettings);
