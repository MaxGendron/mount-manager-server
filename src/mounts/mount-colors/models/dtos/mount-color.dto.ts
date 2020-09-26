import { ColorLocalizeDto } from './color-localize.dto';
import { Type } from 'class-transformer/decorators';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { MountTypeEnum } from 'src/mounts/models/enum/mount-type.enum';

export class MountColorDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ColorLocalizeDto)
  color: ColorLocalizeDto;

  @IsNotEmpty()
  @IsEnum(MountTypeEnum)
  mountType: MountTypeEnum;
}
