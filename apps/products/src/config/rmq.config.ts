import type { IRmqModuleOptions } from '@ecom/rmq';
import { ExchangeName, QueueName, RoutingKey, ServiceName } from '@ecom/rmq';

export const rmqConfig: IRmqModuleOptions = {
  exchanges: [
    {
      name: ExchangeName.PRODUCTS,
      type: 'topic',
    },
  ],
  queues: [
    {
      name: QueueName.PRODUCT_CREATED,
      exchange: ExchangeName.PRODUCTS,
      routingKey: RoutingKey.PRODUCT_CREATED,
    },
    {
      name: QueueName.PRODUCT_CREATED,
      exchange: ExchangeName.PRODUCTS,
      routingKey: RoutingKey.PRODUCT_QUANTITY_VALIDATION,
    },
  ],
  service: ServiceName.PRODUCTS,
};
