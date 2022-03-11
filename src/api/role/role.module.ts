import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PermissionService } from '../permission/permission.service';
import { Permission } from '../permission/entities/permission.entity';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RoleController],
  providers: [RoleService, PermissionService, RolesGuard],
  exports: [RoleService],
})
export class RoleModule {}
