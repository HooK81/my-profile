import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { Education } from './education.entity';
import { Skill } from './skill.entity';
import { Work } from './work.entity';

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
