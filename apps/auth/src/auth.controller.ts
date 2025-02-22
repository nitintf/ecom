import { ExchangeName, RmqService, RoutingKey } from '@ecom/rmq';
import { Controller, Get } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  async getHello(): Promise<{ message: string }> {
    await this.rmqService.publish(
      ExchangeName.PRODUCTS,
      RoutingKey.PRODUCT_CREATED,
      {
        hello: 'nitin',
      },
    );
    return this.authService.getHello();
  }
}
