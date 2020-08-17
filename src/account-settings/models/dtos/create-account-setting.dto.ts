import { MountTypeEnum } from '../enum/mount-type.enum';
import { IsNotEmpty, IsEnum } from 'class-validator';

export class CreateAccountSettingDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  server: string;

  @IsEnum(MountTypeEnum, { each: true })
  @IsNotEmpty()
  mountType: MountTypeEnum[];
}
