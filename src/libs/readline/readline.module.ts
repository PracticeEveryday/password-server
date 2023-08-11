import { Module } from '@nestjs/common';

import { ReadlineEndService } from '@libs/readline/readlineEnd.service';

import { readlineProvider } from './provider/readline.provider';
import { ReadlineStartService } from './readlineStart.service';

import { MysqlModule } from '../mysql/mysql.module';

@Module({
  imports: [MysqlModule],
  providers: [ReadlineStartService, ReadlineEndService, ...readlineProvider],
  exports: [ReadlineStartService, ReadlineEndService],
})
export class ReadlineModule {}
