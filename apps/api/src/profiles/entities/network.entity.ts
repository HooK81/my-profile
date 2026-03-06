import { IsString } from 'class-validator';

export class Network {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  icon: string;
}
