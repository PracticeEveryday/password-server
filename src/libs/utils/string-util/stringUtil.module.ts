import { Module } from '@nestjs/common';

import { StringUtilService } from './stringUtil.service';

@Module({
  providers: [StringUtilService],
  exports: [StringUtilService],
})
export class StringUtilModule {}
