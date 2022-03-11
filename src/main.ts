import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorFilter } from './utils/ErrorFilter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as contextService from 'request-context';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(new ValidationPipe());

  app.use(contextService.middleware('request'));
  const options = new DocumentBuilder()
    .setTitle('ACL')
    .setDescription('kutia.net')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { docExpansion: 'none' },
  });

  app.enableCors();
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Content-Length',
    );
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    contextService.set('request', req);
    next();
  });

  const port = process.env.PORT || 3014;
  await app.listen(port, () => {
    console.log(
      `🚀 Server started at http://localhost:${port}\n🚨️ Environment: ${process.env.NODE_ENV}`,
    );
  });
}

bootstrap();
