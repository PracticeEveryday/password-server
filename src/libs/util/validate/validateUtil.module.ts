import { Module } from '@nestjs/common';

import { ValidateUtilService } from './validateUtil.service';

@Module({
  providers: [ValidateUtilService],
  exports: [ValidateUtilService],
})
export class ValidateUtilModule {}
