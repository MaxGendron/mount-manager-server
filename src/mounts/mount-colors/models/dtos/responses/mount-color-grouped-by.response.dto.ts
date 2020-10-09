import { ColorLocalizeDto } from './../color-localize.dto';
import { MountTypeEnum } from 'src/mounts/models/enum/mount-type.enum';
export class MountColorGroupedByResponseDto {
  type: MountTypeEnum;
  color: ColorLocalizeDto[]
}