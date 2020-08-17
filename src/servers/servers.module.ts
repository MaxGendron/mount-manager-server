import { Module } from '@nestjs/common';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServerSchema, Server } from './models/schemas/server.schema';
import { JwtStrategy } from 'src/users/strategy/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Server.name, schema: ServerSchema }]),
  ],
  controllers: [ServersController],
  providers: [ServersService, JwtStrategy],
  exports: [ServersService],
})
export class ServersModule {}
