/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Controller, UseGuards, Body, Put, Param, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger/dist';
import {
  ApiUnexpectedErrorResponse,
  CustomApiBadRequestResponse,
  CustomApiNotFoundResponse,
  CustomApiForbiddenResponse,
  CustomApiUnauthorizedResponse,
} from 'src/models/api-response';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { AccountSetting } from './models/schemas/account-setting.schema';
import { AccountSettingsService } from './account-settings.service';
import { MongoIdDto } from 'src/models/dtos/mongo-id.dto';
import { UpdateAccountSettingDto } from './models/dtos/update-account-setting.dto';
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

  @Get('/find/user-id')
  @ApiOperation({
    summary: 'Get account setting by userId',
    description: 'Get a account setting by the userId in the Auth Token',
  })
  @ApiOkResponse({
    description: 'The account setting has been found and returned',
    type: AccountSetting,
  })
  @CustomApiNotFoundResponse(
    'No account setting found for the requested userId.',
  )
  async getAccountSettingByUserId(
    @User('_id') userId: string,
  ): Promise<AccountSetting> {
    return await this.accountSettingsService.getAccountSettingByUserId(userId);
  }
}
