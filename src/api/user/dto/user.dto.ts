import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';
import { IsUnique } from '../../../common/decorators/validation.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  first_name: string;

  @IsNotEmpty()
  @ApiProperty()
  last_name: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  @IsUnique(
    'User',
    'users',
    {},
    {
      message: 'That email is taken',
    },
  )
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @ApiProperty()
  role_id: string;
}

export class CreateBusinessUserDTO {
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  role_id: string;
}

export class CreatePromoterUserDTO {
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  role_id: string;

  @IsNotEmpty()
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  last_name: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  first_name: string;

  @ApiPropertyOptional()
  last_name: string;

  @ApiPropertyOptional()
  @IsUnique(
    'User',
    'users',
    {},
    {
      message: 'That email is taken',
    },
  )
  email: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiPropertyOptional()
  role_id: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  media_id: string;
}

export class UpdateUserProfileDto {
  @ApiPropertyOptional()
  first_name: string;

  @ApiPropertyOptional()
  last_name: string;

  @ApiPropertyOptional()
  @IsUnique(
    'User',
    'users',
    {},
    {
      message: 'That email is taken',
    },
  )
  email: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiPropertyOptional()
  role_id: string;

  @ApiPropertyOptional()
  description: string;
}

export class UserRO {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
}

export class AddPreferencesDto {
  @IsArray()
  @ApiProperty()
  preferences: string[];
}
export class UserRequestObject {
  id?: string;
  first_name: string;
  last_name: string;
  email?: string;
  guest_email?: string;
  guest_name?: string;
  birthday?: Date;
  gender?: string;
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
  phone?: string;
  stripe_customer_id: string;
  card_last4?: string;
  card_brand?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  created_at?: Date;
  role_id?: string;
}

export class UserContactForm {
  @IsNotEmpty()
  full_name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  subject: string;
  @IsNotEmpty()
  message: string;
}
