import type { IRmqModuleOptions } from '@ecom/rmq';
import { ExchangeName, QueueName, RoutingKey, ServiceName } from '@ecom/rmq';

export const rmqConfig: IRmqModuleOptions = {
  exchanges: [
    {
      name: ExchangeName.AUTH,
      type: 'topic',
    },
  ],
  queues: [
    {
      name: QueueName.AUTH_VALIDATION,
      exchange: ExchangeName.AUTH,
      routingKey: RoutingKey.AUTH_VALIDATION,
    },
  ],
  service: ServiceName.AUTH,
};
