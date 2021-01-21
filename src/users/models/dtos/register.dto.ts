import { IsNotEmpty, Matches, IsEnum } from 'class-validator';
import { MountTypeEnum } from 'src/mounts/models/enum/mount-type.enum';

export class RegisterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Matches(new RegExp(/[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}/i))
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(MountTypeEnum, { each: true })
  @IsNotEmpty()
  mountTypes: MountTypeEnum[];
}
