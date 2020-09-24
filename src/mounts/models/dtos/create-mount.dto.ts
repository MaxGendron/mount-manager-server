import { IsEnum, IsMongoId, IsNotEmpty, MaxLength } from 'class-validator';
import { MountGenderEnum } from '../enum/mount-gender.enum';

export class CreateMountDto {
  @IsNotEmpty()
  @MaxLength(16)
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  colorId: string;

  @IsNotEmpty()
  @IsEnum(MountGenderEnum, { each: true })
  gender: MountGenderEnum;
}
