import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  // Get RMQ options for microservice configuration
  getOptions(serviceName: string, noAck = false): RmqOptions {
    const RABBIT_MQ_URI =
      this.configService.getOrThrow<string>('RABBIT_MQ_URI');
    const queueName = this.getQueueName(serviceName);

    return {
      transport: Transport.RMQ,
      options: {
        urls: [RABBIT_MQ_URI],
        queue: queueName,
        noAck,
        persistent: true,
      },
    };
  }

  // Get queue name for a service
  getQueueName(serviceName: string): string {
    return (
      this.configService.get<string>(`RABBIT_MQ_${serviceName}_QUEUE`) ??
      `${serviceName.toLowerCase()}-queue`
    );
  }

  // Acknowledge a message
  ack(context: RmqContext): void {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
