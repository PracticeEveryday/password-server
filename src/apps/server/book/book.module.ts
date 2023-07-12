import { Module } from '@nestjs/common';

import { BookController } from './book.controller';
import { BookService } from './book.service';
import { bookProviders } from './providers/book.provider';
import { MysqlModule } from '../../../libs/mysql/mysql.module';
import { SqlUtilModule } from '../../../libs/utils/sql-util/sql-util.module';

@Module({
  imports: [MysqlModule, SqlUtilModule],
  controllers: [BookController],
  providers: [BookService, ...bookProviders],
})
export class BookModule {}
