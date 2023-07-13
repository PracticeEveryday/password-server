import { Module } from '@nestjs/common';

import { SqlUtilService } from './sql-util.service';
import { StringUtilModule } from '../string-util/string-util.module';

@Module({
  imports: [StringUtilModule],
  providers: [SqlUtilService],
  exports: [SqlUtilService],
})
export class SqlUtilModule {}
