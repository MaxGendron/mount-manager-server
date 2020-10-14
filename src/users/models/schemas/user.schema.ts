import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from 'src/common/models/base-document';
import { UserRoleEnum } from '../enum/user-role.enum';

@Schema()
export class User extends BaseDocument {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: UserRoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
