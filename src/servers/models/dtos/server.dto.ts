import { IsNotEmpty } from 'class-validator';

export class ServerDto {
  @IsNotEmpty()
  serverName: string;
}
