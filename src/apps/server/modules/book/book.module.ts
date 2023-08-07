import { Module } from '@nestjs/common';

import { BookController } from '@apps/server/modules/book/book.controller';
import { BookService } from '@apps/server/modules/book/book.service';
import { bookProviders } from '@apps/server/modules/book/provider/book.provider';
import { MysqlModule } from '@libs/mysql/mysql.module';
import { SqlUtilModule } from '@libs/util/sql/sqlUtil.module';

@Module({
  controllers: [BookController],
  imports: [MysqlModule, SqlUtilModule],
  providers: [BookService, ...bookProviders],
})
export class BookModule {}
