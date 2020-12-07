import { CreateMountsDto } from './models/dtos/create-mounts.dto';
import { MountSortFieldEnum } from './models/enum/mount-sort-field.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AccountSettingsService } from 'src/accounts-settings/accounts-settings.service';
import { ThrowExceptionUtils } from 'src/common/utils/throw-exception.utils';
import { CreateMountDto } from './models/dtos/create-mount.dto';
import { MountGenderCountResponseDto } from './models/dtos/responses/mount-gender-count.response.dto';
import { SearchMountDto } from './models/dtos/search-mount.dto';
import { UpdateMountDto } from './models/dtos/update-mount.dto';
import { Mount } from './models/schemas/mount.schema';
import { MountColorsService } from './mount-colors/mount-colors.service';
import { SortOrderEnum } from 'src/common/models/enum/sort-order.enum';
import { MountTypeEnum } from './models/enum/mount-type.enum';

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
    const newMount = await this.createMountModel(createMountDto, userId);
    return newMount.save();
  }

  //Create multiple mounts in one call
  async createMounts(createMountsDto: CreateMountsDto, userId: string): Promise<Mount[]> {
    const docs = [];
    for (const createMountDto of createMountsDto.createMountDtos) {
      const newMount = await this.createMountModel(createMountDto, userId);
      docs.push(newMount);
    }
    return this.mountModel.insertMany(docs);
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
      mount.colorId = mountColor._id;
      mount.type = mountColor.mountType;
    }

    mount.name = updateMountDto.name ?? mount.name;
    mount.gender = updateMountDto.gender ?? mount.gender;
    if (updateMountDto.maxNumberOfChild) {
      //Check if maxNumberOfChild is valid
      this.validateMaxNumberOfChild(updateMountDto.maxNumberOfChild, mount.type);
      mount.maxNumberOfChild = updateMountDto.maxNumberOfChild;
    }

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

  /*
  Get the list of mounts associated to a userId
  Filter/sort if needed. Default sorting is name ASC
  */
  async getMountsForUserId(searchMountDto: SearchMountDto, userId: string): Promise<Mount[]> {
    const query = await this.createSearchQuery(searchMountDto);

    //Set sort
    const sortField = searchMountDto.sortField ?? MountSortFieldEnum.Name;
    const sortOrder = +(searchMountDto.sortOrder ?? SortOrderEnum.Asc);

    return this.mountModel
      .aggregate([
        {
          $match: {
            userId: new Types.ObjectId(`${userId}`),
            $and: query,
          },
        },
        {
          $sort: {
            [sortField]: sortOrder,
          },
        },
      ])
      .exec();
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
          $match: {
            userId: new Types.ObjectId(`${userId}`),
          },
        },
        {
          $group: {
            _id: '$type',
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
            type: '$_id',
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

  //Update the mount numberOfChild if it's smaller than the maxNumberOfChild
  async updateNumberOfChild(mount: Mount): Promise<void> {
    mount.numberOfChild = ++mount.numberOfChild;
    if (mount.numberOfChild > mount.maxNumberOfChild) {
      ThrowExceptionUtils.cannotInsert(`Exceeding maxNumberOfChild for mountId: ${mount._id}.`);
    }
    this.mountModel.findByIdAndUpdate(mount._id, mount, { new: true }).exec();
  }

  //Create the MountModel for a new mount, used by both createMount & createMounts
  private async createMountModel(createMountDto: CreateMountDto, userId: string): Promise<any> {
    const mountColor = await this.mountColorsService.getMountColorById(createMountDto.colorId);

    //Check if mountType is in list of user mountTypes (in account-settings)
    const accountSettings = await this.accountSettingsService.getAccountSettingsByUserId(userId);
    this.accountSettingsService.verifyMountTypes(accountSettings.mountTypes, mountColor.mountType);

    //Check if maxNumberOfChild is valid
    this.validateMaxNumberOfChild(createMountDto.maxNumberOfChild, mountColor.mountType);

    //Create mount
    const newMount = new this.mountModel(createMountDto);
    newMount.color = mountColor.color;
    newMount.type = mountColor.mountType;
    newMount.userId = userId;
    //0 child by default
    newMount.numberOfChild = 0;

    return newMount;
  }

  private async createSearchQuery(searchMountDto: SearchMountDto) {
    // eslint-disable-next-line prefer-const
    let query = [];

    //Set filters
    if (searchMountDto.colorId) {
      const mountColor = await this.mountColorsService.getMountColorById(searchMountDto.colorId);
      const q = { colorId: mountColor._id };
      query.push(q);
    }
    if (searchMountDto.gender) {
      const q = `{ "gender": "${searchMountDto.gender}" }`;
      query.push(JSON.parse(q));
    }
    if (searchMountDto.type) {
      const q = `{ "type": "${searchMountDto.type}" }`;
      query.push(JSON.parse(q));
    }
    if (searchMountDto.name) {
      const q = `{ "name": { "$regex": "^${searchMountDto.name}", "$options": "i"} }`;
      query.push(JSON.parse(q));
    }
    if (searchMountDto.hasMaxedChild) {
      const q = `{ "$expr": { "$eq": ["$maxNumberOfChild", "$numberOfChild"] } }`;
      query.push(JSON.parse(q));
    }
    if (searchMountDto.hasNoChild) {
      const q = `{ "numberOfChild": { "$eq": 0 } }`;
      query.push(JSON.parse(q));
    }
    //Check if array is empty (mongo don't accept empty array)
    return query.length === 0 ? [{}] : query;
  }

  private validateMaxNumberOfChild(maxNumberOfChild: number, mountType: MountTypeEnum): void {
    let isValid = true;
    switch (mountType) {
      case MountTypeEnum.Dragodinde:
        isValid = maxNumberOfChild == 5;
        break;
      case MountTypeEnum.Muldo:
        isValid = maxNumberOfChild <= 4 && maxNumberOfChild >= 2;
        break;
      case MountTypeEnum.Volkorne:
        isValid = maxNumberOfChild == 2;
        break;
    }
    if (!isValid) {
      ThrowExceptionUtils.badParameter('maxNumberOfChild value is invalid.');
    }
  }
}
