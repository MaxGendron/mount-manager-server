import { IsMongoId, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCouplingDto {
  @IsNotEmpty()
  @MaxLength(16)
  childName: string;

  @IsNotEmpty()
  @IsMongoId()
  dadId: string;

  @IsNotEmpty()
  @IsMongoId()
  momId: string;
}
