import { IsNotEmpty, IsEnum } from 'class-validator';

export enum UserPropertyEnum {
  Username = 'username',
  Email = 'email',
}

export class ValidateUserPropertyValueDto {
  @IsNotEmpty()
  @IsEnum(UserPropertyEnum)
  property: UserPropertyEnum;
  @IsNotEmpty()
  value: string;
}
