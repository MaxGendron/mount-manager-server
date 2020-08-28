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
  CustomApiForbiddenResponse,
} from 'src/models/api-response';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { AccountSetting } from './models/schemas/account-setting.schema';
import { AccountSettingsService } from './account-settings.service';
import { MongoIdDto } from 'src/models/dtos/mongo-id.dto';
import { Roles } from 'src/models/decorator/roles.decorator';
import { UserRoleEnum } from 'src/users/models/enum/user-role.enum';
import { RolesGuard } from 'src/users/guards/roles.guard';
import { CreateAccountSettingDto } from './models/dtos/create-account-setting.dto';
import { UpdateAccountSettingDto } from './models/dtos/update-account-setting.dto';
import { User } from 'src/models/decorator/user.decorator';

@ApiTags('Account Settings')
@ApiUnexpectedErrorResponse()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('account-settings')
export class AccountSettingsController {
  constructor(private accountSettingsService: AccountSettingsService) {}

  @Roles(UserRoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Post(':userId')
  @ApiOperation({
    summary: 'Create account setting - Admin',
    description: 'Create a new account setting.',
  })
  @ApiCreatedResponse({
    description: 'The account setting has been created',
    type: AccountSetting,
  })
  @CustomApiBadRequestResponse()
  createAccountSetting(
    @Body() createAccountSettingDto: CreateAccountSettingDto,
    @Param('userId') userId: string,
  ): Promise<AccountSetting> {
    return this.accountSettingsService.createAccountSetting(
      userId,
      createAccountSettingDto,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update account setting',
    description: 'Update a existing account setting. - Partial update',
  })
  @ApiOkResponse({
    description: 'The account setting has been updated',
    type: AccountSetting,
  })
  @CustomApiBadRequestResponse()
  @CustomApiForbiddenResponse()
  @CustomApiNotFoundResponse('No account setting found.')
  updateAccountSetting(
    @Param() mongoIdDto: MongoIdDto,
    @Body() updateAccountSettingDto: UpdateAccountSettingDto,
    @User('_id') userId: string,
  ): Promise<AccountSetting> {
    return this.accountSettingsService.updateAccountSetting(
      userId,
      mongoIdDto.id,
      updateAccountSettingDto,
    );
  }

  @Roles(UserRoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete account setting - Admin',
    description: 'Delete a existing account setting.',
  })
  @ApiNoContentResponse({
    description: 'The account setting has been deleted',
  })
  @CustomApiBadRequestResponse()
  @CustomApiForbiddenResponse()
  @CustomApiNotFoundResponse('No account setting found.')
  async deleteAccountSetting(@Param() mongoIdDto: MongoIdDto): Promise<void> {
    await this.accountSettingsService.deleteAccountSetting(mongoIdDto.id);
  }

  @Roles(UserRoleEnum.Admin)
  @UseGuards(RolesGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Get account setting by id - Admin',
    description: 'Get a account setting by is id.',
  })
  @ApiOkResponse({
    description: 'The account setting has been found and returned',
    type: AccountSetting,
  })
  @CustomApiBadRequestResponse()
  @CustomApiNotFoundResponse('No account setting found.')
  @CustomApiForbiddenResponse()
  getAccountSettingById(
    @Param() mongoIdDto: MongoIdDto,
  ): Promise<AccountSetting> {
    return this.accountSettingsService.getAccountSettingById(
      mongoIdDto.id,
    );
  }

  @Get('/find/user-id')
  @ApiOperation({
    summary: 'Get account setting by userId, create if not found',
    description:
      "Get a account setting by the userId in the Auth Token. If there's no account setting for that userId, create a empty one and return it",
  })
  @ApiOkResponse({
    description: 'The account setting has been found and returned',
    type: AccountSetting,
  })
  @CustomApiBadRequestResponse()
  async getAccountSettingByUserId(
    @User('_id') userId: string,
  ): Promise<AccountSetting> {
    let accountSetting = await this.accountSettingsService.getAccountSettingByUserId(
      userId,
    );
    //If there's no setting, create a empty one
    if (!accountSetting) {
      accountSetting = await this.accountSettingsService.createEmptyAccountSetting(
        userId,
      );
    }
    return accountSetting;
  }
}
