import { AccountSettings } from './../accounts-settings/models/schemas/account-settings.schema';
import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './models/schemas/user.schema';
import { RegisterDto } from './models/dtos/register.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoggedUserResponseDto } from './models/dtos/responses/logged-user.response.dto';
import { ExistReponseDto } from './models/dtos/responses/exist.response.dto';
import { UserRoleEnum } from './models/enum/user-role.enum';
import { AccountSettingsService } from 'src/accounts-settings/accounts-settings.service';
import { ThrowExceptionUtils } from 'src/common/utils/throw-exception.utils';
import { UserResponseDto } from './models/dtos/responses/user.response.dto';
import { UpdateUserDto } from './models/dtos/update-user.dto';
import { Mount } from 'src/mounts/models/schemas/mount.schema';
import { Coupling } from 'src/mounts/couplings/models/schemas/coupling.schema';

@Injectable()
export class UsersService {
  private readonly entityType = 'User';

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(AccountSettings.name) private accountSettingsModel: Model<AccountSettings>,
    @InjectModel(Mount.name) private mountModel: Model<Mount>,
    @InjectModel(Coupling.name) private couplingModel: Model<Coupling>,
    private configService: ConfigService,
    private jwtService: JwtService,
    private accountSettingsService: AccountSettingsService,
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
      ThrowExceptionUtils.cannotInsert('Cannot Insert the requested user, verify your information');
    }

    //Hash the password
    registerDto.password = await this.hashPassword(registerDto.password);

    //Save the user
    const newUser = new this.userModel(registerDto);
    newUser.role = newUser.role ?? UserRoleEnum.User;
    newUser.save();

    //Create a empty accountSettings with only userId & mountTypes & autoFillChildName to false
    await this.accountSettingsService.createNewAccountSettings(newUser._id, registerDto.mountTypes);

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
    const count = await this.userModel.countDocuments({ username: username }).exec();
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

  //Get a user by a userId (_id  of the doc)
  async getUserByUserId(userId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      ThrowExceptionUtils.notFoundException(this.entityType, userId);
    }
    return new UserResponseDto(user._id, user.username, user.email);
  }

  //Update the given user with passed values
  async updateUser(id: string, updateUserDto: UpdateUserDto, authUser: User): Promise<UserResponseDto> {
    let countQuery: any;
    //Set the query accordingly with what is requested to be updated
    if (updateUserDto.username != null && updateUserDto.email != null) {
      countQuery = {
        $or: [{ username: updateUserDto.username }, { email: updateUserDto.email }],
      };
    } else if (updateUserDto.username != null) {
      countQuery = { username: updateUserDto.username };
    } else if (updateUserDto.email != null) {
      countQuery = { email: updateUserDto.email };
    }

    if (countQuery) {
      //Check if the user already exist, if so return error
      const count = await this.userModel.countDocuments(countQuery).exec();

      if (count > 0) {
        ThrowExceptionUtils.cannotInsert('Cannot Insert the requested user, verify your information');
      }
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      ThrowExceptionUtils.notFoundException(this.entityType, id);
    }
    //If the user who requested isn't the same as the one returned and if it's not an admin, throw exception
    if (user._id != authUser._id && authUser.role != UserRoleEnum.Admin) {
      ThrowExceptionUtils.forbidden();
    }

    //If the password is being updated, need to hash it
    if (updateUserDto.password != null) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    //Set the role to user if the requester isn't admin, we don't want user to set their own role
    if (updateUserDto.role != null && authUser.role != UserRoleEnum.Admin) {
      updateUserDto.role = user.role;
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });

    return new UserResponseDto(updatedUser._id, updatedUser.username, updatedUser.email);
  }

  async hashPassword(plainPassword: string): Promise<string> {
    //Hash the password
    const salt = await bcrypt.genSalt(+this.configService.get<number>('BCRYPT_ROUND'));
    return await bcrypt.hash(plainPassword, salt);
  }

  /* Delete the user & everything related to that Id.
  "userId" is the _id of the user to delete and "requester" is the auth user of the request.
  Only throw an error if we cannot delete from the users table, otherwise
  we only log it, it's just stuff in the DB but doesn't impact the app. */
  async deleteUser(userId: string, authUser: User): Promise<void> {
    //Throw an error if the authUser._id isn't the same as the given userId
    //and if the authUser isn't an admin (admin can delete everything)
    if (userId != authUser._id && authUser.role != UserRoleEnum.Admin) {
      ThrowExceptionUtils.forbidden();
    }

    //Delete the user
    const user = await this.userModel.findByIdAndRemove(userId).exec();
    if (!user) {
      ThrowExceptionUtils.notFoundException(this.entityType, userId);
    }

    //Delete the accountSettings of that user
    try {
      await this.accountSettingsModel
        .deleteMany({
          userId: new Types.ObjectId(`${userId}`),
        })
        .exec();
    } catch (e) {
      Logger.error(`Error deleting the accountSettings for the userId: ${userId}.`);
    }

    //Delete all the mounts of that user
    try {
      await this.mountModel
        .deleteMany({
          userId: new Types.ObjectId(`${userId}`),
        })
        .exec();
    } catch (e) {
      Logger.error(`Error deleting the mounts for the userId: ${userId}.`);
    }

    //Delete all the couplings of that user
    try {
      await this.couplingModel
        .deleteMany({
          userId: new Types.ObjectId(`${userId}`),
        })
        .exec();
    } catch (e) {
      Logger.error(`Error deleting the coupplings for the userId: ${userId}.`);
    }
  }
}
