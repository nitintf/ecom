import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { ExchangeName, RoutingKey } from './constants';
import { MessageOptionsDto } from './dtos/message-options.dto';

@Injectable()
export class RmqService {
  private readonly logger = new Logger(RmqService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  /**
   * Publish a message to an exchange with a routing key
   */
  async publish<T>(
    exchange: ExchangeName,
    routingKey: RoutingKey,
    message: T,
    options: MessageOptionsDto = {},
  ): Promise<void> {
    try {
      const defaultOptions: MessageOptionsDto = {
        persistent: true,
        messageId: uuidv4(),
        timestamp: Date.now(),
        ...options,
      };

      await this.amqpConnection.publish(
        exchange,
        routingKey,
        message,
        defaultOptions,
      );

      this.logger.debug(
        `Message published to exchange: ${exchange}, routing key: ${routingKey}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish message to exchange: ${exchange}, routing key: ${routingKey}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Send a message and wait for a response (RPC pattern)
   */
  async request<T, R>(
    exchange: ExchangeName,
    routingKey: RoutingKey,
    message: T,
    options: MessageOptionsDto = {},
  ): Promise<R> {
    try {
      const response = await this.amqpConnection.request<R>({
        exchange,
        routingKey,
        payload: message,
        timeout: 10000, // 10 seconds
        ...options,
      });

      this.logger.debug(
        `RPC request completed for exchange: ${exchange}, routing key: ${routingKey}`,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `RPC request failed for exchange: ${exchange}, routing key: ${routingKey}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Create a dead letter exchange and queue for error handling
   */
  async setupDeadLetterQueue(
    exchange: ExchangeName,
    queueName: string,
  ): Promise<void> {
    const deadLetterExchange = `${exchange}.dlx`;
    const deadLetterQueue = `${queueName}.dlq`;

    try {
      await this.amqpConnection.channel.assertExchange(
        deadLetterExchange,
        'direct',
        { durable: true },
      );

      await this.amqpConnection.channel.assertQueue(deadLetterQueue, {
        durable: true,
      });

      await this.amqpConnection.channel.bindQueue(
        deadLetterQueue,
        deadLetterExchange,
        '#',
      );

      this.logger.log(
        `Dead letter queue setup completed for exchange: ${exchange}, queue: ${queueName}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to setup dead letter queue for exchange: ${exchange}, queue: ${queueName}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Retry failed messages with exponential backoff
   */
  async retryMessage<T>(
    exchange: ExchangeName,
    routingKey: RoutingKey,
    message: T,
    attempt = 1,
    maxAttempts = 3,
    baseDelay = 1000,
  ): Promise<void> {
    if (attempt > maxAttempts) {
      this.logger.warn(
        `Max retry attempts (${maxAttempts}) reached for message`,
        message,
      );
      return;
    }

    const delay = baseDelay * Math.pow(2, attempt - 1);

    try {
      await new Promise((resolve) => setTimeout(resolve, delay));
      await this.publish(exchange, routingKey, message, {
        headers: {
          'x-retry-count': attempt,
        },
      });
    } catch (error) {
      this.logger.warn(
        `Retry attempt ${attempt} failed for exchange: ${exchange}, routing key: ${routingKey}`,
        error,
      );
      await this.retryMessage(
        exchange,
        routingKey,
        message,
        attempt + 1,
        maxAttempts,
        baseDelay,
      );
    }
  }

  /**
   * Check if connection is healthy
   */
  healthCheck(): boolean {
    try {
      return this.amqpConnection.connected;
    } catch (error) {
      this.logger.error('Health check failed', error);
      return false;
    }
  }
}
