import { Module } from '@nestjs/common';
import { ReadlineService } from './readline.service';

@Module({
  providers: [ReadlineService],
  exports: [ReadlineService],
})
export class ReadlineModule {}
