import { IsOptional, IsString } from 'class-validator';

export class WorkDate {
  @IsString()
  start: string;

  @IsString()
  @IsOptional()
  end: string;
}
