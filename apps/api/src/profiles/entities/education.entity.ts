import { IsString } from 'class-validator';

export class Education {
  @IsString()
  degree: string;

  @IsString()
  school: string;

  @IsString()
  city: string;

  @IsString()
  date: string;
}
