import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import useLoggerFactory from './logger.factory';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: useLoggerFactory,
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
