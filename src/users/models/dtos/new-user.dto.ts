import { IsNotEmpty, Matches, IsEnum, IsOptional } from 'class-validator';
import { UserRoleEnum } from '../enum/user-role.enum';

export class NewUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Matches(new RegExp('^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+.)+[A-Z]{2,}$', 'i'))
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserRoleEnum)
  @IsOptional()
  role: UserRoleEnum;
}
