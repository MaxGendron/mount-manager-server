import { MountTypeEnum } from '../../enum/mount-type.enum';

export class MountGenderCountResponseDto {
  male: number;
  female: number;
  type: MountTypeEnum;
}
