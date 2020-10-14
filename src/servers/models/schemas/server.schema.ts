import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDocument } from 'src/common/models/base-document';

@Schema()
export class Server extends BaseDocument {
  @ApiProperty()
  @Prop({ unique: true })
  serverName: string;
}

export const ServerSchema = SchemaFactory.createForClass(Server);
