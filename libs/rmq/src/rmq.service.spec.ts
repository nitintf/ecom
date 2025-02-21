import { ConfigService } from '@nestjs/config';
import type { RmqContext } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { RmqService } from './rmq.service';

describe('RmqService', () => {
  let service: RmqService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RmqService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'RABBIT_MQ_test_QUEUE') return 'test_queue';
              return null;
            }),
            getOrThrow: jest.fn().mockImplementation((key: string) => {
              if (key === 'RABBIT_MQ_URI') return 'amqp://localhost:5672';
              throw new Error(`Configuration ${key} not found`);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RmqService>(RmqService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOptions', () => {
    it('should return proper RMQ options with default noAck', () => {
      const options = service.getOptions('test');

      expect(options).toEqual({
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'test_queue',
          noAck: false,
          persistent: true,
        },
      });
    });

    it('should return proper RMQ options with custom noAck', () => {
      const options = service.getOptions('test', true);

      expect(options).toEqual({
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'test_queue',
          noAck: true,
          persistent: true,
        },
      });
    });

    it('should throw error if RABBIT_MQ_URI is not configured', () => {
      jest.spyOn(configService, 'getOrThrow').mockImplementation(() => {
        throw new Error('Configuration RABBIT_MQ_URI not found');
      });

      expect(() => service.getOptions('test')).toThrow(
        'Configuration RABBIT_MQ_URI not found',
      );
    });
  });

  describe('ack', () => {
    it('should call channel.ack with the original message', () => {
      const channel = { ack: jest.fn() };
      const message = { content: Buffer.from('test') };
      const context = {
        getChannelRef: jest.fn().mockReturnValue(channel),
        getMessage: jest.fn().mockReturnValue(message),
      } as unknown as RmqContext;

      service.ack(context);

      expect(context.getChannelRef()).toHaveBeenCalled();
      expect(context.getMessage()).toHaveBeenCalled();
      expect(channel.ack).toHaveBeenCalledWith(message);
    });
  });
});
