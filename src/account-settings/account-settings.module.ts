import { Module } from '@nestjs/common';
import { AccountSettingsController } from './account-settings.controller';
import { AccountSettingsService } from './account-settings.service';
import { JwtStrategy } from 'src/users/strategy/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccountSetting,
  AccountSettingSchema,
} from './models/schemas/account-setting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountSetting.name, schema: AccountSettingSchema },
    ]),
  ],
  controllers: [AccountSettingsController],
  providers: [AccountSettingsService, JwtStrategy],
})
export class AccountSettingsModule {}
