import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AccountSetting } from './models/schemas/account-setting.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateAccountSettingDto } from './models/dtos/update-account-setting.dto';
import { ThrowExceptionUtils } from 'src/utils/throw-exception.utils';
import { ServersService } from 'src/servers/servers.service';
import { CustomError } from 'src/models/custom-error';
import { MountTypeEnum } from './models/enum/mount-type.enum';

@Injectable()
export class AccountSettingsService {
  private readonly entityType = 'Account Setting';

  constructor(
    @InjectModel(AccountSetting.name)
    private accountSettingModel: Model<AccountSetting>,
    private serversService: ServersService,
  ) {}

  //Update a existing accountSetting
  async updateAccountSetting(
    userId: string,
    id: string,
    updateAccountSettingDto: UpdateAccountSettingDto,
  ): Promise<AccountSetting> {
    //Validate the server, only if updated
    if (updateAccountSettingDto.serverName)
      await this.validateServerName(updateAccountSettingDto.serverName);

    const accountSetting = await this.accountSettingModel.findByIdAndUpdate(
      id,
      updateAccountSettingDto,
      { new: true },
    );

    if (!accountSetting)
      ThrowExceptionUtils.notFoundException(this.entityType, id);
    //If the user who requested isn't the same as the one returned, throw exception
    if (accountSetting.userId != userId) {
       ThrowExceptionUtils.forbidden();
    }
    return accountSetting;
  }

  //Validate that the requested server exist
  async validateServerName(serverName: string): Promise<void> {
    const server = await this.serversService.getServerByName(serverName);
    if (!server) {
      throw new HttpException(
        new CustomError(
          HttpStatus.BAD_REQUEST,
          'BadParameter',
          `serverName is invalid, the requested server doesn't exist`,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Get a accountSetting by a userId
  async getAccountSettingByUserId(userId: string): Promise<AccountSetting> {
    return await this.accountSettingModel.findOne({ userId: userId }).exec();
  }

  //Create a new accountSetting with only userId & mountTypes
  async createNewAccountSetting(
    userId: string,
    mountTypes: MountTypeEnum[],
  ): Promise<AccountSetting> {
    const newAccountSetting = new this.accountSettingModel();
    newAccountSetting.userId = userId;
    newAccountSetting.mountType = mountTypes;
    return newAccountSetting.save();
  }
}
