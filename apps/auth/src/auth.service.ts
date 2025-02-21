import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHello() {
    return {
      message: 'Hello World!',
    };
  }
}
