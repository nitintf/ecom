import { Injectable } from '@nestjs/common';

@Injectable()
export class StoresService {
  getHello(): string {
    return 'Hello World!';
  }
}
