import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServersModule } from './servers/servers.module';
import { AccountSettingsModule } from './accounts-settings/accounts-settings.module';
import { MountsModule } from './mounts/mounts.module';
import { MountColorsModule } from './mounts/mount-colors/mount-colors.module';
import { CouplingsModule } from './mounts/couplings/couplings.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
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
    MountColorsModule,
    CouplingsModule,
  ],
})
export class AppModule {}
