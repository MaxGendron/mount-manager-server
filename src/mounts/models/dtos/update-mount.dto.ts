import { IsEnum, IsOptional } from 'class-validator';
import { MountGenderEnum } from '../enum/mount-gender.enum';

export class UpdateMountDto {
  @IsOptional()
  name: string;

  @IsOptional()
  colorId: string;

  @IsOptional()
  @IsEnum(MountGenderEnum, { each: true })
  gender: MountGenderEnum;
}
