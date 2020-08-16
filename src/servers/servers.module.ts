import { Module } from '@nestjs/common';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServerSchema, Server } from './models/schemas/server.schema';

@Module({
  imports: [ MongooseModule.forFeature([{ name: Server.name, schema: ServerSchema }]),],
  controllers: [ServersController],
  providers: [ServersService]
})
export class ServersModule {}
