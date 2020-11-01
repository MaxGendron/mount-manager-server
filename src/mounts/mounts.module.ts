import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSettingsModule } from 'src/accounts-settings/accounts-settings.module';
import { Mount, MountSchema } from './models/schemas/mount.schema';
import { MountColorsModule } from './mount-colors/mount-colors.module';
import { MountsController } from './mounts.controller';
import { MountsService } from './mounts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Mount.name, schema: MountSchema }]),
    MountColorsModule,
    AccountSettingsModule,
  ],
  controllers: [MountsController],
  providers: [MountsService],
  exports: [MountsService],
})
export class MountsModule {}
