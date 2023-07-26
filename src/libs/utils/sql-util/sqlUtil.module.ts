import { Module } from '@nestjs/common';

import { SqlUtilService } from './sqlUtil.service';
import { StringUtilModule } from '../string-util/stringUtil.module';

@Module({
  imports: [StringUtilModule],
  providers: [SqlUtilService],
  exports: [SqlUtilService],
})
export class SqlUtilModule {}
