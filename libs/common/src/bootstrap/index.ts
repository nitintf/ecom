import { Logger } from '@ecom/logger';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import type { INestApplication, Type, ValidationError } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import helmet from 'helmet';

import type { GlobalConfig } from '../config/global-config.type';

/**
 * Bootstraps a NestJS application with common settings.
 * @param module - The root module of your application.
 * @returns The initialized NestJS application.
 */
export async function bootstrapApp<T>(
  module: Type<T>,
): Promise<INestApplication<T>> {
  const app = await NestFactory.create(
    module,
    new FastifyAdapter({
      logger: false,
    }),
    {
      bufferLogs: true,
    },
  );

  const appLogger = app.get(Logger);
  app.useLogger(appLogger);

  const configService = app.get(ConfigService<GlobalConfig>);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]): Error => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  // Enable API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable CORS
  app.enableCors({
    origin: configService.getOrThrow('app.corsOrigin', { infer: true }),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });

  // Use Helmet for security
  app.use(helmet());

  // Global Serialization Interceptor
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  return app;
}
