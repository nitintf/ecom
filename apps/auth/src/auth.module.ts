import { appConfig } from '@ecom/common/config';
import { LoggerModule } from '@ecom/logger';
import { RmqModule } from '@ecom/rmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { rmqConfig } from './config/rmq.config';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
      envFilePath: './apps/auth/.env',
    }),
    RmqModule.register(rmqConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
