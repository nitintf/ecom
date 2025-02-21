import type { GlobalConfig } from '@ecom/common';
import { bootstrapApp } from '@ecom/common';
import { Logger } from '@ecom/logger';
import { RmqService } from '@ecom/rmq';
import { ConfigService } from '@nestjs/config';
import type { RmqOptions } from '@nestjs/microservices';

import { ProductsModule } from './products.module';

async function bootstrap(): Promise<void> {
  const app = await bootstrapApp(ProductsModule);

  const configService = app.get(ConfigService<GlobalConfig>);
  const rmqService = app.get<RmqService>(RmqService);
  const logger = app.get(Logger);

  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH', true));

  await app.startAllMicroservices();

  const port = configService.getOrThrow('app.port', { infer: true });
  await app.listen(port);

  const httpUrl = await app.getUrl();
  logger.log(`Auth service is listening on ${httpUrl}`);
}

void bootstrap();
