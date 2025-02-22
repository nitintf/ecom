import type {
  ExchangeName,
  QueueName,
  RoutingKey,
  ServiceName,
} from '../constants';

export interface IRmqExchangeConfig {
  name: ExchangeName;
  type: 'topic' | 'direct' | 'fanout' | 'headers';
}

export interface IRmqQueueConfig {
  name: QueueName;
  exchange: ExchangeName;
  routingKey: RoutingKey;
}

export interface IRmqModuleOptions {
  service: ServiceName;
  uri?: string; // Optional - can be provided via env
  exchanges: IRmqExchangeConfig[];
  queues: IRmqQueueConfig[];
  prefetchCount?: number;
}
