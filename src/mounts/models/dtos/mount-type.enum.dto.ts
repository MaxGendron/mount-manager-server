import { IsEnum, IsNotEmpty } from 'class-validator';
import { MountTypeEnum } from '../enum/mount-type.enum';

export class MountTypeEnumDto {
  @IsNotEmpty()
  @IsEnum(MountTypeEnum, { each: true })
  mountType: MountTypeEnum;
}
