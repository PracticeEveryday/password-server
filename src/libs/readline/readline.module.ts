import { Module } from '@nestjs/common';

import { MysqlModule } from '@libs/adapter/db/mysql/mysql.module';
import { ReadlineEndService } from '@libs/readline/readlineEnd.service';

import { readlineProvider } from './provider/readline.provider';
import { ReadlineStartService } from './readlineStart.service';

@Module({
  imports: [MysqlModule],
  providers: [ReadlineStartService, ReadlineEndService, ...readlineProvider],
  exports: [ReadlineStartService, ReadlineEndService],
})
export class ReadlineModule {}
