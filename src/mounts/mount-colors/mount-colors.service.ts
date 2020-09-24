import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ThrowExceptionUtils } from 'src/common/utils/throw-exception.utils';
import { MountTypeEnum } from 'src/mounts/models/enum/mount-type.enum';
import { MountColorDto } from './models/dtos/mount-color.dto';
import { MountColor } from './models/schemas/mount-color.schema';

@Injectable()
export class MountColorsService {
  private readonly entityType = 'MountColor';

  constructor(@InjectModel(MountColor.name) private mountColorModel: Model<MountColor>) {}

  //Create a new mountColor
  createMountColor(mountColorDto: MountColorDto): Promise<MountColor> {
    const newMountColor = new this.mountColorModel(mountColorDto);
    return newMountColor.save();
  }

  //Update a existing mountColor
  async updateMountColor(mountColorId: string, mountColorDto: MountColorDto): Promise<MountColor> {
    const mountColor = await this.mountColorModel.findByIdAndUpdate(mountColorId, mountColorDto, { new: true }).exec();
    if (!mountColor) {
      ThrowExceptionUtils.notFoundException(this.entityType, mountColorId);
    }
    return mountColor;
  }

  //Delete a existing mountColor
  async deleteMountColor(mountColorId: string): Promise<void> {
    const mountColor = await this.mountColorModel.findByIdAndRemove(mountColorId).exec();
    if (!mountColor) {
      ThrowExceptionUtils.notFoundException(this.entityType, mountColorId);
    }
    return mountColor;
  }

  //Get all the mountColors for a mountType
  getMountColorsByMountType(mountType: MountTypeEnum): Promise<MountColor[]> {
    return this.mountColorModel.find({ mountType: mountType }).exec();
  }

  //Get a mountColor by is id
  async getMountColorById(mountColorId: string): Promise<MountColor> {
    const mountColor = await this.mountColorModel.findById(mountColorId).exec();
    if (!mountColor) {
      ThrowExceptionUtils.notFoundException(this.entityType, mountColorId);
    }
    return mountColor;
  }
}
