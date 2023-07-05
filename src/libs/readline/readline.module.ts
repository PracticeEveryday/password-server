import { Module } from '@nestjs/common';
import { ReadlineService } from './readline.service';
import { MysqlModule } from '../mysql/mysql.module';
import { readlineProvider } from './provider/readline.provider';

@Module({
  imports: [MysqlModule],
  providers: [ReadlineService, ...readlineProvider],
  exports: [ReadlineService],
})
export class ReadlineModule {}
