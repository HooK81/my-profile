import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { Hobby } from './hobby.entity.js';
import { Resume } from './resume.entity.js';
import { Tech } from './tech.entity.js';
import { User } from './user.entity.js';

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
