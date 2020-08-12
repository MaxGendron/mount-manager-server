/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, Post, Body, UseGuards, Request, HttpCode, Get, Query } from '@nestjs/common';
import { NewUserDto } from './models/dtos/new-user.dto';
import { UsersService } from './users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './models/dtos/login.dto';
import { ApiTags, ApiBody, ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { LoggedUserResponseDto } from './models/dtos/responses/logged-user.response.dto';
import { ExistReponseDto } from './models/dtos/responses/exist.response.dto';
import { ApiUnexpectedErrorResponse, CustomApiBadRequestResponse, CustomApiNotFoundResponse } from 'src/models/api-response';
import { ValidateUserPropertyValueDto, UserPropertyEnum } from './models/dtos/validate-user-property-value.dto';

@ApiTags('Users')
@ApiUnexpectedErrorResponse()
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create User', description: 'Create a new User.' })
  @ApiCreatedResponse({ description: 'The user has been created', type: LoggedUserResponseDto})
  @CustomApiBadRequestResponse('Cannot Insert the requested user, verify your information.')
  create(@Body() newUserDto: NewUserDto): Promise<LoggedUserResponseDto> {
    return this.usersService.create(newUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiBody({type: LoginDto})
  @ApiOperation({ summary: 'Login a user', description: 'Try to login the user by validating if he exist or not.' })
  @CustomApiNotFoundResponse('No user was found for the given credentials.')
  @ApiOkResponse({ description: 'The user exist and has a token was created', type: LoggedUserResponseDto})
  login(@Request() req: any): Promise<LoggedUserResponseDto> {
    return this.usersService.login(req.user);
  }

  @Get('validate')
  @ApiOperation({ summary: 'Validate if a user property value exist', description: 'Validate if the value of the requested property alredy exist for a user.' })
  @ApiOkResponse({ description: 'The user property value exist.', type: ExistReponseDto})
  @CustomApiBadRequestResponse()
  validatePropertyValue(@Query() query: ValidateUserPropertyValueDto): Promise<ExistReponseDto> {
    if (query.property === UserPropertyEnum.Email)
      return this.usersService.validateEmail(query.value);
    else if (query.property === UserPropertyEnum.Username)
      return this.usersService.validateUsername(query.value);
  }
}
