import { IsBoolean, IsInt, IsString } from 'class-validator';

export class Skill {
  @IsString()
  name: string;

  @IsInt()
  level: number;

  @IsBoolean()
  showLevel: boolean = true;
}
