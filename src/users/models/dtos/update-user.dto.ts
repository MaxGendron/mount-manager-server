import { IsOptional, IsEnum, Matches } from 'class-validator';
import { UserRoleEnum } from '../enum/user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  username: string;

  @IsOptional()
  @Matches(new RegExp(/[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}/i))
  email: string;

  @IsOptional()
  password: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  role: UserRoleEnum;
}
