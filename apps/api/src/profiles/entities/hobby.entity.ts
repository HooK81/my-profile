import { IsString } from 'class-validator';

export class Hobby {
  @IsString()
  title: string;

  @IsString()
  image: string;

  @IsString()
  icon: string;
}
