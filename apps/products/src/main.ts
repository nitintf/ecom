import type { GlobalConfig } from '@ecom/common';
import { bootstrapApp } from '@ecom/common';
import { Logger } from '@ecom/logger';
import { ConfigService } from '@nestjs/config';

import { ProductsModule } from './products.module';

async function bootstrap(): Promise<void> {
  const app = await bootstrapApp(ProductsModule);

  const configService = app.get(ConfigService<GlobalConfig>);
  const logger = app.get(Logger);

  const port = configService.getOrThrow('app.port', { infer: true });
  await app.listen(port);

  const httpUrl = await app.getUrl();
  logger.log(`Auth service is listening on ${httpUrl}`);
}

void bootstrap();
