import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { WorkDate } from './work-date.entity';

export class Work {
  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsString()
  city: string;

  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => WorkDate)
  date: WorkDate;
}
