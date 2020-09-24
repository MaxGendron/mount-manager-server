import { IsEnum, IsNotEmpty } from 'class-validator';
import { MountTypeEnum } from 'src/mounts/models/enum/mount-type.enum';

export class MountColorDto {
  @IsNotEmpty()
  color: string;

  @IsNotEmpty()
  @IsEnum(MountTypeEnum)
  mountType: MountTypeEnum;
}
