import { SortOrderEnum } from './../../../common/models/enum/sort-order.enum';
import { MountTypeEnum } from './../enum/mount-type.enum';
import { MountGenderEnum } from './../enum/mount-gender.enum';
import { MountSortFieldEnum } from '../enum/mount-sort-field.enum';
import { IsMongoId, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchMountDto {
  //Sort
  @IsOptional()
  @ApiProperty({ required: false })
  sortField: MountSortFieldEnum;

  @IsOptional()
  @ApiProperty({ required: false })
  sortOrder: SortOrderEnum;

  //Search
  @IsOptional()
  @MaxLength(16)
  @ApiProperty({ required: false })
  name: string;

  //Filters
  @IsOptional()
  @ApiProperty({ required: false })
  gender: MountGenderEnum;

  @IsOptional()
  @ApiProperty({ required: false })
  type: MountTypeEnum;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ required: false })
  colorId: string;

  @IsOptional()
  @ApiProperty({ required: false })
  hasMaxedChild: boolean;

  @IsOptional()
  @ApiProperty({ required: false })
  hasNoChild: boolean;
}
