import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { MountGenderEnum } from '../enum/mount-gender.enum';

export class UpdateMountDto {
  @IsOptional()
  @MaxLength(16)
  name: string;

  @IsOptional()
  @IsMongoId()
  colorId: string;

  @IsOptional()
  @IsEnum(MountGenderEnum, { each: true })
  gender: MountGenderEnum;

  @IsOptional()
  @IsNotEmpty()
  maxNumberOfChild: number;
}
