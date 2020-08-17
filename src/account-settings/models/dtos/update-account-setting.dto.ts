import { MountTypeEnum } from '../enum/mount-type.enum';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdateAccountSettingDto {
  @IsOptional()
  username: string;

  @IsOptional()
  serverName: string;

  @IsEnum(MountTypeEnum, { each: true })
  @IsOptional()
  mountType: MountTypeEnum[];
}
