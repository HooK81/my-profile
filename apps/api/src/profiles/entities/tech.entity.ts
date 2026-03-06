import { IsString } from 'class-validator';

export class Tech {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  desc: string;
}
