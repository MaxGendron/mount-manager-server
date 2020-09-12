/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, UseGuards, Body, Put, Param, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger/dist';
import {
  ApiUnexpectedErrorResponse,
  CustomApiBadRequestResponse,
  CustomApiNotFoundResponse,
  CustomApiForbiddenResponse,
  CustomApiUnauthorizedResponse,
} from 'src/models/api-response';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { AccountSettings } from './models/schemas/account-settings.schema';
import { AccountSettingsService } from './account-settings.service';
import { MongoIdDto } from 'src/models/dtos/mongo-id.dto';
import { UpdateAccountSettingsDto } from './models/dtos/update-account-settings.dto';
import { User } from 'src/models/decorator/user.decorator';

@ApiTags('Account Settings')
@ApiUnexpectedErrorResponse()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@CustomApiUnauthorizedResponse()
@Controller('account-settings')
export class AccountSettingsController {
  constructor(private accountSettingsService: AccountSettingsService) {}

  @Put(':id')
  @ApiOperation({
    summary: 'Update account setting',
    description: 'Update a existing account setting. - Partial update',
  })
  @ApiOkResponse({
    description: 'The account setting has been updated',
    type: AccountSettings,
  })
  @CustomApiBadRequestResponse()
  @CustomApiForbiddenResponse()
  @CustomApiNotFoundResponse('No account setting found.')
  updateAccountSettings(
    @Param() mongoIdDto: MongoIdDto,
    @Body() updateAccountSettingDto: UpdateAccountSettingsDto,
    @User('_id') userId: string,
  ): Promise<AccountSettings> {
    return this.accountSettingsService.updateAccountSettings(userId, mongoIdDto.id, updateAccountSettingDto);
  }

  @Get('/find/user-id')
  @ApiOperation({
    summary: 'Get account setting by userId',
    description: 'Get a account setting by the userId in the Auth Token',
  })
  @ApiOkResponse({
    description: 'The account setting has been found and returned',
    type: AccountSettings,
  })
  @CustomApiNotFoundResponse('No account setting found for the requested userId.')
  async getAccountSettingsByUserId(@User('_id') userId: string): Promise<AccountSettings> {
    return await this.accountSettingsService.getAccountSettingsByUserId(userId);
  }
}
