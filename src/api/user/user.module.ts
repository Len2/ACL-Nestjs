import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthServiceGeneral } from '../../services/auth/AuthService';
import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';
import { HashService } from '../../services/hash/HashService';
import { Permission } from '../permission/entities/permission.entity';
import { RolesGuard } from '../../common/guards/roles.guard';

import { MulterModule } from '@nestjs/platform-express';
import {
  multerConfig,
  multerOptions,
} from '../../common/middlewares/multer.middleware';

// import { UserGateway } from './user.gateway';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role, Permission]),
    MulterModule.register({
      ...multerConfig,
      ...multerOptions,
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserService,
    AuthService,
    AuthServiceGeneral,
    HashService,
    RoleService,
    RolesGuard,
  ],
  exports: [UserService],
})
export class UserModule {}
