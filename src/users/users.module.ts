import { AccountSettings, AccountSettingSchema } from './../accounts-settings/models/schemas/account-settings.schema';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/schemas/user.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './strategy/local.strategy';
import { AccountSettingsModule } from 'src/accounts-settings/accounts-settings.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { Mount, MountSchema } from 'src/mounts/models/schemas/mount.schema';
import { Coupling, CouplingSchema } from 'src/mounts/couplings/models/schemas/coupling.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: AccountSettings.name, schema: AccountSettingSchema },
      { name: Mount.name, schema: MountSchema },
      { name: Coupling.name, schema: CouplingSchema },
    ]),
    AccountSettingsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, LocalStrategy, JwtStrategy],
})
export class UsersModule {}
