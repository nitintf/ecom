import { Module } from '@nestjs/common';

import { AuthnService } from './authn.service';

@Module({
  providers: [AuthnService],
  exports: [AuthnService],
})
export class AuthnModule {}
