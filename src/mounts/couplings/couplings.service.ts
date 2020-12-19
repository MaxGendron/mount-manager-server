import { MountsService } from './../mounts.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ThrowExceptionUtils } from 'src/common/utils/throw-exception.utils';
import { CreateCouplingDto } from './models/dtos/create-coupling.dto';
import { Coupling } from './models/schemas/coupling.schema';
import { SearchCouplingDto } from './models/dtos/search-coupling.dto';
import { MountGenderEnum } from '../models/enum/mount-gender.enum';

@Injectable()
export class CouplingsService {
  private readonly entityType = 'Coupling';
  private readonly queryLimit = 10;

  constructor(
    @InjectModel(Coupling.name) private couplingModel: Model<Coupling>,
    private mountsService: MountsService,
  ) {}

  //Get a coupling by is id then validate that it exist and the userIds are the same
  async getCouplingById(couplingId: string, userId: string): Promise<Coupling> {
    const coupling = await this.couplingModel.findById(couplingId).exec();
    if (!coupling) {
      ThrowExceptionUtils.notFoundException(this.entityType, couplingId);
    }
    //If the user who requested isn't the same as the one returned, throw exception
    if (coupling.userId != userId) {
      ThrowExceptionUtils.forbidden();
    }
    return coupling;
  }

  //CreateCoupling
  async createCoupling(createCouplingDto: CreateCouplingDto, userId: string): Promise<Coupling> {
    const fatherMount = await this.mountsService.getMountById(createCouplingDto.fatherId, userId);
    const motherMount = await this.mountsService.getMountById(createCouplingDto.motherId, userId);

    if (fatherMount.gender !== MountGenderEnum.Male) {
      ThrowExceptionUtils.badParameter('Father mount have wrong gender.');
    }
    if (motherMount.gender !== MountGenderEnum.Female) {
      ThrowExceptionUtils.badParameter('Mother mount have wrong gender.');
    }
    if (fatherMount.type !== motherMount.type) {
      ThrowExceptionUtils.badParameter(`Mounts types aren't the same.`);
    }

    //Update number of child
    await this.mountsService.updateNumberOfChild(fatherMount);
    await this.mountsService.updateNumberOfChild(motherMount);

    //Create coupling
    const newCoupling = new this.couplingModel(createCouplingDto);
    newCoupling.father = fatherMount;
    newCoupling.mother = motherMount;
    newCoupling.userId = userId;
    return newCoupling.save();
  }

  //Delete coupling
  async deleteCoupling(couplingId: string, userId: string): Promise<void> {
    await this.getCouplingById(couplingId, userId);
    await this.couplingModel.findByIdAndRemove(couplingId).exec();
  }

  async getCouplingsForUserId(searchCouplingDto: SearchCouplingDto, userId: string): Promise<Coupling[]> {
    const query = await this.createSearchQuery(searchCouplingDto);
    const limit = searchCouplingDto.limit ?? this.queryLimit;

    return this.couplingModel
      .aggregate([
        {
          $match: {
            userId: new Types.ObjectId(`${userId}`),
            $and: query,
          },
        },
        {
          $limit: +limit
        },
      ])
      .exec();
  }

  private async createSearchQuery(searchCouplingDto: SearchCouplingDto) {
    // eslint-disable-next-line prefer-const
    let query = [];

    if (searchCouplingDto.childName) {
      const q = `{ "childName": { "$regex": "^${searchCouplingDto.childName}", "$options": "i"} }`;
      query.push(JSON.parse(q));
    }
    if (searchCouplingDto.fatherName) {
      const q = `{ "father.name": { "$regex": "^${searchCouplingDto.fatherName}", "$options": "i"} }`;
      query.push(JSON.parse(q));
    }
    if (searchCouplingDto.motherName) {
      const q = `{ "mother.name": { "$regex": "^${searchCouplingDto.motherName}", "$options": "i"} }`;
      query.push(JSON.parse(q));
    }
    //Check if array is empty (mongo don't accept empty array)
    return query.length === 0 ? [{}] : query;
  }
}
