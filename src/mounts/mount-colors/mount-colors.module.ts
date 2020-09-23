import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/users/strategy/jwt.strategy';
import { MountColor, MountColorSchema } from './models/schemas/mount-color.schema';
import { MountColorsController } from './mount-colors.controller';
import { MountColorsService } from './mount-colors.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: MountColor.name, schema: MountColorSchema }])],
  controllers: [MountColorsController],
  providers: [MountColorsService, JwtStrategy],
  exports: [MountColorsService],
})
export class MountColorsModule {}
