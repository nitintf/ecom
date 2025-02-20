import { NestFactory } from '@nestjs/core';

import { PaymentModule } from './payment.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(PaymentModule);
  await app.listen(process.env.port ?? 3000);
}

void bootstrap();
