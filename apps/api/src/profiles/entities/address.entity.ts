import { IsString } from 'class-validator';

export class Address {
  @IsString()
  street?: string;

  @IsString()
  city?: string;

  @IsString()
  zip?: string;

  @IsString()
  country?: string;
}
