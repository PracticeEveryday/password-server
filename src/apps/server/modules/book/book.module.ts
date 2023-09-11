import { Module } from '@nestjs/common';

import { BookController } from '@apps/server/modules/book/book.controller';
import { BookService } from '@apps/server/modules/book/book.service';
import { bookProviders } from '@apps/server/modules/book/provider/book.provider';
import { MysqlModule } from '@libs/adapter/db/mysql/mysql.module';

@Module({
  controllers: [BookController],
  imports: [MysqlModule],
  providers: [BookService, ...bookProviders],
})
export class BookModule {}
