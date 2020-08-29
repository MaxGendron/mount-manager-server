import * as bcrypt from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/schemas/user.schema';
import { RegisterDto } from './models/dtos/register.dto';
import { CustomError } from 'src/models/custom-error';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoggedUserResponseDto } from './models/dtos/responses/logged-user.response.dto';
import { ExistReponseDto } from './models/dtos/responses/exist.response.dto';
import { UserRoleEnum } from './models/enum/user-role.enum';
import { AccountSettingsService } from 'src/account-settings/account-settings.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private accountSettingsService: AccountSettingsService
  ) {}

  //Create a new user
  async register(registerDto: RegisterDto): Promise<LoggedUserResponseDto> {
    //Check if the user already exist, if so return error
    //Sanity check, shouldn't happens since we're validating on the UI
    const count = await this.userModel
      .countDocuments({
        $or: [{ username: registerDto.username }, { email: registerDto.email }],
      })
      .exec();

    if (count > 0) {
      throw new HttpException(
        new CustomError(
          HttpStatus.BAD_REQUEST,
          'CannotInsert',
          'Cannot Insert the requested user, verify your information',
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    //Encrypt the password
    const salt = await bcrypt.genSalt(
      +this.configService.get<number>('BCRYPT_ROUND'),
    );
    registerDto.password = await bcrypt.hash(registerDto.password, salt);

    //Save the user
    const newUser = new this.userModel(registerDto);
    newUser.role = newUser.role ?? UserRoleEnum.User;
    newUser.save();

    //Create a empty account-settings with only userId & mountTypes
    await this.accountSettingsService.createNewAccountSetting(newUser._id, registerDto.mountTypes);

    //Log the user
    return this.login(newUser);
  }

  //Return a JWT Token and the username of the user
  async login(user: User): Promise<LoggedUserResponseDto> {
    const token = this.jwtService.sign(
      { username: user.username, sub: user._id, role: user.role },
      {
        algorithm: 'HS512',
        expiresIn: '24h',
        issuer: this.configService.get<string>('JWT_ISSUER'),
      },
    );
    return new LoggedUserResponseDto(user.username, token);
  }

  //Validate if the email already exist
  async validateEmail(email: string): Promise<ExistReponseDto> {
    const count = await this.userModel.countDocuments({ email: email }).exec();
    return new ExistReponseDto(count > 0);
  }

  //Validate if the username already exist
  async validateUsername(username: string): Promise<ExistReponseDto> {
    const count = await this.userModel
      .countDocuments({ username: username })
      .exec();
    return new ExistReponseDto(count > 0);
  }

  //Validate if the given credentials exist in the system
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.findOneUser(username);
    //Verify password
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  //Look for the associated doc in the DB, username can be the email or the username
  findOneUser(username: string): Promise<User> {
    return this.userModel
      .findOne({
        $or: [{ username: username }, { email: username }],
      })
      .exec();
  }
}
