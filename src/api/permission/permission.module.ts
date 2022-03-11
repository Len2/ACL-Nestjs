import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Permission } from './entities/permission.entity';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [PermissionService, RolesGuard],
  exports: [PermissionService],
})
export class PermissionModule {}
