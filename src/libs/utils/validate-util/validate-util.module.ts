import { Module } from '@nestjs/common';
import { ValidateUtilService } from './validate-util.service';

@Module({
  providers: [ValidateUtilService],
  exports: [ValidateUtilService],
})
export class ValidateUtilModule {}
