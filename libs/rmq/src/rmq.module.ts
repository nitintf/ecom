import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RmqService } from './rmq.service';

interface IRmqModuleOptions {
  name: string;
  exchanges?: Array<{
    name: string;
    type: 'topic' | 'direct' | 'fanout' | 'headers';
  }>;
  queues?: Array<{
    name: string;
    exchange: string;
    routingKey: string;
  }>;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({
    name,
    exchanges = [],
    queues = [],
  }: IRmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        RabbitMQModule.forRootAsync({
          useFactory: (configService: ConfigService): RabbitMQConfig => {
            const RABBIT_MQ_URI =
              configService.getOrThrow<string>('RABBIT_MQ_URI');

            // Set up a default exchange if none provided
            const defaultExchanges =
              exchanges.length > 0
                ? exchanges
                : [
                    {
                      name: `${name.toLowerCase()}-exchange`,
                      type: 'topic',
                    },
                  ];

            // Set up a default queue if none provided
            let serviceQueues = queues;
            if (queues.length === 0) {
              const RABBIT_MQ_QUEUE =
                configService.get<string>(
                  `RABBIT_MQ_${name.toUpperCase()}_QUEUE`,
                ) ?? `${name.toLowerCase()}-queue`;
              serviceQueues = [
                {
                  name: RABBIT_MQ_QUEUE,
                  exchange: defaultExchanges[0].name,
                  routingKey: '#',
                },
              ];
            }

            return {
              uri: RABBIT_MQ_URI,
              connectionInitOptions: { wait: false },
              exchanges: defaultExchanges,
              queues: serviceQueues,
              prefetchCount: 1,
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
