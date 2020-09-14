import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServersModule } from './servers/servers.module';
import { AccountSettingsModule } from './accounts-settings/accounts-settings.module';
import { MountsModule } from './mounts/mounts.module';
import { MountsColorModule } from './mounts/mounts-colors/mounts-colors.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGOBD_STRING'),
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    ServersModule,
    AccountSettingsModule,
    MountsModule,
    MountsColorModule
  ],
})
export class AppModule {}
