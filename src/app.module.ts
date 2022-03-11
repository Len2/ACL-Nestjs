import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { RoleModule } from './api/role/role.module';
import { PermissionModule } from './api/permission/permission.module';
import SetUserToContextMiddleware from './common/middlewares/setUserToContext.middleware';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { NestEmitterModule } from 'nest-emitter';
import { EventEmitter } from 'events';
import openRoutes from './common/config/open-routes';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import {
  multerConfig,
  multerOptions,
} from './common/middlewares/multer.middleware';

EventEmitter.defaultMaxListeners = 0;

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../'),
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    NestEmitterModule.forRoot(new EventEmitter()),
    UserModule,
    RoleModule,
    PermissionModule,
    MulterModule.register({
      ...multerConfig,
      ...multerOptions,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SetUserToContextMiddleware)
      .exclude(...openRoutes)
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    // Test middleware showing how to exclude routes when you use a middleware
    // This middleware has no function
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: '/api/users/me', method: RequestMethod.GET })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
