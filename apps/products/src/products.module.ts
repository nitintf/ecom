import { appConfig } from '@ecom/common';
import { LoggerModule } from '@ecom/logger';
import { RmqModule } from '@ecom/rmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { rmqConfig } from './config/rmq.config';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
      envFilePath: './apps/products/.env',
    }),
    RmqModule.register(rmqConfig),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
