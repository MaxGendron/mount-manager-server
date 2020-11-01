import { IsMongoId, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCouplingDto {
  @IsNotEmpty()
  @MaxLength(16)
  childName: string;

  @IsNotEmpty()
  @IsMongoId()
  fatherId: string;

  @IsNotEmpty()
  @IsMongoId()
  motherId: string;
}
