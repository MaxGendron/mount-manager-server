import { MountTypeEnum } from '../../../mounts/models/enum/mount-type.enum';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdateAccountSettingsDto {
  @IsOptional()
  igUsername: string;

  @IsOptional()
  serverName: string;

  @IsEnum(MountTypeEnum, { each: true })
  @IsOptional()
  mountTypes: MountTypeEnum[];

  @IsOptional()
  autoFillChildName: boolean;
}
