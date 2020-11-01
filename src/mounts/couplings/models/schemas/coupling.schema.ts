import { Mount } from './../../../models/schemas/mount.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDocument } from 'src/common/models/base-document';

@Schema()
export class Coupling extends BaseDocument {
  @ApiProperty()
  @Prop(Mount)
  father: Mount;

  @ApiProperty()
  @Prop(Mount)
  mother: Mount;

  @ApiProperty()
  @Prop()
  childName: string;

  @ApiProperty({ type: String })
  @Prop()
  userId: ObjectId;
}

export const CouplingSchema = SchemaFactory.createForClass(Coupling);
