import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, Length } from 'class-validator';
import { SameAs } from '../../../../common/decorators/validation.decorator';

export class RegisterUserDto {
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  first_name: string;

  @IsNotEmpty()
  @ApiProperty()
  last_name: string;

  @ApiPropertyOptional()
  latitude: number;

  @ApiPropertyOptional()
  longitude: number;

  @ApiPropertyOptional()
  location_id: number;

  @IsNotEmpty()
  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  role_id: string;

  @IsNotEmpty()
  @IsDefined()
  @Length(6)
  @ApiProperty()
  @SameAs('password_confirm', {
    message: "Password confirmation doesn't match.",
  })
  password: string;

  @IsNotEmpty()
  @IsDefined()
  @Length(6)
  @ApiProperty()
  password_confirm: string;

  @ApiPropertyOptional()
  preferences: string[];
}

export class LoginUserDto {
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsDefined()
  @Length(6)
  @ApiProperty()
  password: string;
}
