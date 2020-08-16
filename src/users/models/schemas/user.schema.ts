import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseDocument } from 'src/models/base-document';

@Schema()
export class User extends BaseDocument {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
