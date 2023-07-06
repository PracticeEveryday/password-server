import { Module } from '@nestjs/common';

import { readlineProvider } from './provider/readline.provider';
import { ReadlineService } from './readline.service';
import { MysqlModule } from '../mysql/mysql.module';

@Module({
  imports: [MysqlModule],
  providers: [ReadlineService, ...readlineProvider],
  exports: [ReadlineService],
})
export class ReadlineModule {}
