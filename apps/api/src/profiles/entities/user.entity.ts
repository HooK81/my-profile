import { Type } from 'class-transformer';
import { IsEmail, IsString, ValidateNested } from 'class-validator';

import { Address } from './address.entity';
import { Network } from './network.entity';

export class User {
  @IsString()
  lastName: string;

  @IsString()
  firstName: string;

  @IsString()
  fullName: string;

  @IsString()
  occupation: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsString()
  logo: string;

  @IsString()
  bio: string;

  @IsString()
  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @IsString()
  phone?: string;

  @IsString()
  website: string;

  @IsString()
  resumePdf: string;

  @ValidateNested({ each: true })
  @Type(() => Network)
  networks: Network[];
}
