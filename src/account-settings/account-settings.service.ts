import { Injectable } from '@nestjs/common';
import { AccountSetting } from './models/schemas/account-setting.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountSettingDto } from './models/dtos/create-account-setting.dto';
import { UpdateAccountSettingDto } from './models/dtos/update-account-setting.dto';
import { ThrowExceptionUtils } from 'src/utils/throw-exception.utils';

@Injectable()
export class AccountSettingsService {
  private readonly entityType = 'Account Setting';

  constructor(
    @InjectModel(AccountSetting.name)
    private accountSettingModel: Model<AccountSetting>,
  ) {}

  //Create a new accountSetting
  async createAccountSetting(
    userId: string,
    createAccountSettingDto: CreateAccountSettingDto,
  ): Promise<AccountSetting> {
    const newAccountSetting = new this.accountSettingModel(
      createAccountSettingDto,
    );
    newAccountSetting.userId = userId;
    return newAccountSetting.save();
  }

  //Update a existing accountSetting
  async updateAccountSetting(
    id: string,
    updateAccountSettingDto: UpdateAccountSettingDto,
  ): Promise<AccountSetting> {
    const accountSetting = await this.accountSettingModel.findByIdAndUpdate(
      id,
      updateAccountSettingDto,
      { new: true },
    );
    if (!accountSetting) {
      ThrowExceptionUtils.notFoundException(this.entityType, id);
    }
    return accountSetting;
  }

  //Delete a existing accountSetting
  async deleteAccountSetting(id: string): Promise<void> {
    const accountSetting = await this.accountSettingModel.findByIdAndRemove(id).exec();
    if (!accountSetting) {
      ThrowExceptionUtils.notFoundException(this.entityType, id);
    }
    return accountSetting;
  }

  //Get a accountSetting by is id
  async getAccountSettingById(id: string): Promise<AccountSetting> {
    const accountSetting = await this.accountSettingModel.findById(id).exec();
    if (!accountSetting) {
      ThrowExceptionUtils.notFoundException(this.entityType, id);
    }
    return accountSetting;
  }
}
