import { Module } from '@nestjs/common';
import { AccountSettingsController } from './accounts-settings.controller';
import { AccountSettingsService } from './accounts-settings.service';
import { JwtStrategy } from 'src/users/strategy/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSettings, AccountSettingSchema } from './models/schemas/account-settings.schema';
import { ServersModule } from 'src/servers/servers.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: AccountSettings.name, schema: AccountSettingSchema }]), ServersModule],
  controllers: [AccountSettingsController],
  providers: [AccountSettingsService, JwtStrategy],
  exports: [AccountSettingsService],
})
export class AccountSettingsModule {}
