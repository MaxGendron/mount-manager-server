import { IsNotEmpty, IsEnum } from 'class-validator';
import { UserPropertyEnum } from '../enum/user-property.enum';

export class ValidateUserPropertyValueDto {
  @IsNotEmpty()
  @IsEnum(UserPropertyEnum)
  property: UserPropertyEnum;

  @IsNotEmpty()
  value: string;
}
