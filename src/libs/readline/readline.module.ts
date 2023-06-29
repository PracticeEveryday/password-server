import { Module } from '@nestjs/common';
import { ReadlineService } from './readline.service';
import { MysqlModule } from '../mysql/mysql.module';

@Module({
  imports: [MysqlModule],
  providers: [ReadlineService],
  exports: [ReadlineService],
})
export class ReadlineModule {}
