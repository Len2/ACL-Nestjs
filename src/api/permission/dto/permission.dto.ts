import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from '../../../common/decorators/validation.decorator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  @IsUnique(
    'Permission',
    'permissions',
    {},
    {
      message: 'permission with this slug already exists',
    },
  )
  slug: string;
}

export class UpdatePermissionDto {
  @IsString()
  @ApiPropertyOptional({ required: false })
  name: string;

  @ApiPropertyOptional()
  @IsUnique(
    'Permission',
    'permissions',
    {},
    {
      message: 'permission with this slug already exists',
    },
  )
  slug: string;
}

export class AddPermissionsDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  permissions: string[];
}

export class RolePermissionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  permission_id: string;
}

export class PermissionRO {
  id: string;
  name: string;
  slug: string;
}
