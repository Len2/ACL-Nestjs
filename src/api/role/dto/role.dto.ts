import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from '../../../common/decorators/validation.decorator';

export class CreateRoleDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsUnique(
    'Role',
    'roles',
    {},
    {
      message: 'role with this slug already exists',
    },
  )
  slug: string;
}

export class UpdateRoleDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  @IsUnique(
    'Role',
    'roles',
    {},
    {
      message: 'role with this slug already exists',
    },
  )
  slug: string;
}
export class RoleRO {
  id: string;
  name: string;
  slug: string;
}
