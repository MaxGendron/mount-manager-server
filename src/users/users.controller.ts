/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, Body, UseGuards, Request, HttpCode, Get, Query, Put, Param } from '@nestjs/common';
import { RegisterDto } from './models/dtos/register.dto';
import { UsersService } from './users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './models/dtos/login.dto';
import { ApiTags, ApiBody, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoggedUserResponseDto } from './models/dtos/responses/logged-user.response.dto';
import { ExistReponseDto } from './models/dtos/responses/exist.response.dto';
import {
  ApiUnexpectedErrorResponse,
  CustomApiBadRequestResponse,
  CustomApiNotFoundResponse,
  CustomApiUnauthorizedResponse,
  CustomApiForbiddenResponse,
} from 'src/models/api-response';
import { ValidateUserPropertyValueDto } from './models/dtos/validate-user-property-value.dto';
import { UserPropertyEnum } from './models/enum/user-property.enum';
import { UserResponseDto } from './models/dtos/responses/user.response.dto';
import { User } from 'src/models/decorator/user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MongoIdDto } from 'src/models/dtos/mongo-id.dto';
import { UpdateUserDto } from './models/dtos/update-user.dto';

@ApiTags('Users')
@ApiUnexpectedErrorResponse()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Register',
    description: 'Create a new User & a new account-settings with the right typeOfMount.',
  })
  @ApiCreatedResponse({
    description: 'The user has been registered',
    type: LoggedUserResponseDto,
  })
  @CustomApiBadRequestResponse('Cannot Insert the requested user, verify your information.')
  register(@Body() newUserDto: RegisterDto): Promise<LoggedUserResponseDto> {
    return this.usersService.register(newUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOperation({
    summary: 'Login a user',
    description: 'Try to login the user by validating if he exist or not.',
  })
  @ApiOkResponse({
    description: 'The user exist and has a token was created',
    type: LoggedUserResponseDto,
  })
  @CustomApiNotFoundResponse('No user was found for the given credentials.')
  @CustomApiBadRequestResponse()
  login(@Request() req: any): Promise<LoggedUserResponseDto> {
    return this.usersService.login(req.user);
  }

  @Get('validate')
  @ApiOperation({
    summary: 'Validate if a user property value exist',
    description: 'Validate if the value of the requested property alredy exist for a user.',
  })
  @ApiOkResponse({
    description: 'The user property value exist.',
    type: ExistReponseDto,
  })
  @CustomApiBadRequestResponse()
  validateUserPropertyValue(@Query() query: ValidateUserPropertyValueDto): Promise<ExistReponseDto> {
    if (query.property === UserPropertyEnum.Email) return this.usersService.validateEmail(query.value);
    else if (query.property === UserPropertyEnum.Username) return this.usersService.validateUsername(query.value);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/find/user-id')
  @ApiOperation({
    summary: 'Get user by userId',
    description: 'Get a user by the userId in the Auth Token',
  })
  @ApiOkResponse({
    description: 'The user has been found and returned.',
    type: UserResponseDto,
  })
  @CustomApiUnauthorizedResponse()
  @CustomApiNotFoundResponse('No user found for the requested userId.')
  getUserByUserId(@User('_id') userId: string): Promise<UserResponseDto> {
    return this.usersService.getUserByUserId(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update a existing user. - Partial update',
  })
  @ApiOkResponse({
    description: 'The user has been updated',
    type: UserResponseDto,
  })
  @CustomApiBadRequestResponse()
  @CustomApiForbiddenResponse()
  @CustomApiUnauthorizedResponse()
  @CustomApiNotFoundResponse('No user found.')
  updateAccountSetting(
    @Param() mongoIdDto: MongoIdDto,
    @Body() updateUserDto: UpdateUserDto,
    @User('_id') userId: string,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(mongoIdDto.id, updateUserDto, userId);
  }
}
