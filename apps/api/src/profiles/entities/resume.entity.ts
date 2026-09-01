import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { Education } from './education.entity.js';
import { Skill } from './skill.entity.js';
import { Work } from './work.entity.js';

export class Resume {
  @ValidateNested({ each: true })
  @Type(() => Work)
  works: Work[];

  @ValidateNested({ each: true })
  @Type(() => Education)
  educations: Education[];

  @ValidateNested({ each: true })
  @Type(() => Skill)
  skills: Skill[];
}
