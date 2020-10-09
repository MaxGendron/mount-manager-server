import { MountColor } from './../../schemas/mount-color.schema';
import { MountTypeEnum } from 'src/mounts/models/enum/mount-type.enum';
export class MountColorGroupedByResponseDto {
  type: MountTypeEnum;
  colors: MountColor[];
}
