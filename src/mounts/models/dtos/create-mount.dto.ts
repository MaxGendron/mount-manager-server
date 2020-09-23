import { IsEnum, IsNotEmpty } from 'class-validator';
import { MountGenderEnum } from '../enum/mount-gender.enum';

export class CreateMountDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  colorId: string;

  @IsNotEmpty()
  @IsEnum(MountGenderEnum, { each: true })
  gender: MountGenderEnum;
}
