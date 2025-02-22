import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IRmqModuleOptions } from './dtos/rmq-config.type';
import { RmqService } from './rmq.service';

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register(options: IRmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        RabbitMQModule.forRootAsync({
          useFactory: (configService: ConfigService): RabbitMQConfig => {
            const RABBIT_MQ_URI =
              options.uri ?? configService.getOrThrow<string>('RABBIT_MQ_URI');

            return {
              uri: RABBIT_MQ_URI,
              connectionInitOptions: { wait: false },
              exchanges: options.exchanges,
              queues: options.queues,
              prefetchCount: options.prefetchCount ?? 1,
              enableControllerDiscovery: true,
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [RmqService],
      exports: [RabbitMQModule, RmqService],
    };
  }
}
