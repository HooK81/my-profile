import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { Hobby } from './hobby.entity';
import { Resume } from './resume.entity';
import { Tech } from './tech.entity';
import { User } from './user.entity';

export class Profile {
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => User)
  user: User;

  @ValidateNested()
  @Type(() => Resume)
  resume: Resume;

  @ValidateNested({ each: true })
  @Type(() => Hobby)
  hobbies: Hobby[];

  @ValidateNested({ each: true })
  @Type(() => Tech)
  techs: Tech[];
}
