import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class SearchCouplingDto {
  @IsOptional()
  @MaxLength(16)
  @ApiProperty({ required: false })
  fatherName: string;

  @IsOptional()
  @MaxLength(16)
  @ApiProperty({ required: false })
  motherName: string;

  @IsOptional()
  @MaxLength(16)
  @ApiProperty({ required: false })
  childName: string;
}
