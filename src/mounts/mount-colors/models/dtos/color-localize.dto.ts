import { IsNotEmpty } from "class-validator";

export class ColorLocalizeDto {
  @IsNotEmpty()
  en: string;

  @IsNotEmpty()
  fr: string;
}