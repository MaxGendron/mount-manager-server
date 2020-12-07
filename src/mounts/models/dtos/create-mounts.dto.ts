import { Type } from 'class-transformer/decorators';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { CreateMountDto } from './create-mount.dto';

export class CreateMountsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateMountDto)
  createMountDtos: CreateMountDto[];
}
