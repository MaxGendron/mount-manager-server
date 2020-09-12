import { Module } from '@nestjs/common';
import { AccountSettingsController } from './account-settings.controller';
import { AccountSettingsService } from './account-settings.service';
import { JwtStrategy } from 'src/users/strategy/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSetting, AccountSettingSchema } from './models/schemas/account-setting.schema';
import { ServersModule } from 'src/servers/servers.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: AccountSetting.name, schema: AccountSettingSchema }]), ServersModule],
  controllers: [AccountSettingsController],
  providers: [AccountSettingsService, JwtStrategy],
  exports: [AccountSettingsService],
})
export class AccountSettingsModule {}
