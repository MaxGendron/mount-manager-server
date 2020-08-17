/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  UseGuards,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  Get,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger/dist';
import {
  ApiUnexpectedErrorResponse,
  CustomApiBadRequestResponse,
  CustomApiNotFoundResponse,
} from 'src/models/api-response';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { AccountSetting } from './models/schemas/account-setting.schema';
import { AccountSettingsService } from './account-settings.service';
import { MongoIdDto } from 'src/models/dtos/mongo-id.dto';
import { Roles } from 'src/models/roles.decorator';
import { UserRoleEnum } from 'src/users/models/enum/user-role.enum';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { CreateAccountSettingDto } from './models/dtos/create-account-setting.dto';
import { UpdateAccountSettingDto } from './models/dtos/update-account-setting.dto';

@ApiTags('Account Settings')
@ApiUnexpectedErrorResponse()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('account-settings')
export class AccountSettingsController {
  constructor(private accountSettingsService: AccountSettingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create account setting',
    description: 'Create a new account setting.',
  })
  @ApiCreatedResponse({
    description: 'The account setting has been created',
    type: AccountSetting,
  })
  @CustomApiBadRequestResponse()
  createAccountSetting(
    @Body() createAccountSettingDto: CreateAccountSettingDto,
    @Request() req: any,
  ): Promise<AccountSetting> {
    return this.accountSettingsService.createAccountSetting(
      req.user._id,
      createAccountSettingDto,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update account setting',
    description: 'Update a existing account setting.',
  })
  @ApiOkResponse({
    description: 'The account setting has been updated',
    type: AccountSetting,
  })
  @CustomApiBadRequestResponse()
  @CustomApiNotFoundResponse('No account setting found.')
  updateAccountSetting(
    @Param() mongoIdDto: MongoIdDto,
    @Body() updateAccountSettingDto: UpdateAccountSettingDto,
  ): Promise<AccountSetting> {
    return this.accountSettingsService.updateAccountSetting(
      mongoIdDto.id,
      updateAccountSettingDto,
    );
  }

  @Roles(UserRoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete account setting',
    description: 'Delete a existing account setting.',
  })
  @ApiNoContentResponse({
    description: 'The account setting has been deleted',
  })
  @CustomApiBadRequestResponse()
  @CustomApiNotFoundResponse('No account setting found.')
  async deleteAccountSetting(@Param() mongoIdDto: MongoIdDto): Promise<void> {
    await this.accountSettingsService.deleteAccountSetting(mongoIdDto.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get account setting by id',
    description: 'Get a account setting by is id.',
  })
  @ApiOkResponse({
    description: 'The account setting has been found and returned',
    type: AccountSetting,
  })
  @CustomApiBadRequestResponse()
  @CustomApiNotFoundResponse('No account setting found.')
  getAccountSettingById(
    @Param() mongoIdDto: MongoIdDto,
  ): Promise<AccountSetting> {
    return this.accountSettingsService.getAccountSettingById(mongoIdDto.id);
  }
}
