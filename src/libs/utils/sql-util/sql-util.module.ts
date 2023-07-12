import { Module } from '@nestjs/common';

import { SqlUtilService } from './sql-util.service';

@Module({
  providers: [SqlUtilService],
  exports: [SqlUtilService],
})
export class SqlUtilModule {}
