import { appConfig } from '@ecom/common';
import { LoggerModule } from '@ecom/logger';
import { RmqModule } from '@ecom/rmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
    RmqModule.register({
      name: 'PRODUCTS',
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
