import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountSettingsService } from 'src/accounts-settings/accounts-settings.service';
import { ThrowExceptionUtils } from 'src/common/utils/throw-exception.utils';
import { CreateMountDto } from './models/dtos/create-mount.dto';
import { MountGenderCountResponseDto } from './models/dtos/responses/mount-gender-count.response.dto';
import { UpdateMountDto } from './models/dtos/update-mount.dto';
import { Mount } from './models/schemas/mount.schema';
import { MountColorsService } from './mount-colors/mount-colors.service';

@Injectable()
export class MountsService {
  private readonly entityType = 'Mount';

  constructor(
    @InjectModel(Mount.name) private mountModel: Model<Mount>,
    private accountSettingsService: AccountSettingsService,
    private mountColorsService: MountColorsService,
  ) {}

  //Create mount
  async createMount(createMountDto: CreateMountDto, userId: string): Promise<Mount> {
    const mountColor = await this.mountColorsService.getMountColorById(createMountDto.colorId);

    //Check if mountType is in list of user mountTypes (in account-settings)
    const accountSettings = await this.accountSettingsService.getAccountSettingsByUserId(userId);
    this.accountSettingsService.verifyMountTypes(accountSettings.mountTypes, mountColor.mountType);

    //Create mount
    const newMount = new this.mountModel(createMountDto);
    newMount.color = mountColor.color;
    newMount.type = mountColor.mountType;
    newMount.userId = userId;
    return newMount.save();
  }

  //Update mount
  async updateMount(updateMountDto: UpdateMountDto, mountId: string, userId: string): Promise<Mount> {
    const mount = await this.getMountById(mountId, userId);

    if (updateMountDto.colorId) {
      const mountColor = await this.mountColorsService.getMountColorById(updateMountDto.colorId);

      //Check if mountType is in list of user mountTypes (in account-settings)
      const accountSettings = await this.accountSettingsService.getAccountSettingsByUserId(userId);
      this.accountSettingsService.verifyMountTypes(accountSettings.mountTypes, mountColor.mountType);

      mount.color = mountColor.color;
      mount.type = mountColor.mountType;
    }

    mount.name = updateMountDto.name ?? mount.name;
    mount.gender = updateMountDto.gender ?? mount.gender;

    return this.mountModel.findByIdAndUpdate(mountId, mount, { new: true }).exec();
  }

  //Delete mount
  async deleteMount(mountId: string, userId: string): Promise<void> {
    await this.getMountById(mountId, userId);
    await this.mountModel.findByIdAndRemove(mountId).exec();
  }

  //Get a mount by is id then validate that it exist and the userIds are the same
  async getMountById(mountId: string, userId: string): Promise<Mount> {
    const mount = await this.mountModel.findById(mountId).exec();
    if (!mount) {
      ThrowExceptionUtils.notFoundException(this.entityType, mountId);
    }
    //If the user who requested isn't the same as the one returned, throw exception
    if (mount.userId != userId) {
      ThrowExceptionUtils.forbidden();
    }
    return mount;
  }

  //Get the list of mounts associated to a userId
  getMountsForUserId(userId: string): Promise<Mount[]> {
    return this.mountModel.find({ userId: userId }).exec();
  }

  /*
  Group by type & userId, then get the sum of male/female
  based on if the record is equal to male or female.
  Then take the field "type" from the _id and put it at the root
  of the document.
  */
  genderCountByTypeForUserId(userId: string): Promise<MountGenderCountResponseDto[]> {
    return this.mountModel
      .aggregate([
        {
          $group: {
            _id: {
              type: '$type',
              userId: `${userId}`,
            },
            male: {
              $sum: {
                $cond: [
                  {
                    $eq: ['Male', '$gender'],
                  },
                  1,
                  0,
                ],
              },
            },
            female: {
              $sum: {
                $cond: [
                  {
                    $eq: ['Female', '$gender'],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            type: '$_id.type',
            _id: 0,
            male: 1,
            female: 1,
          },
        },
        {
          $sort: {
            type: 1,
          },
        },
      ])
      .exec();
  }
}
