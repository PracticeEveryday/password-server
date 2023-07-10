import { Module } from '@nestjs/common';

import { BookController } from './book.controller';
import { BookService } from './book.service';
import { bookProviders } from './providers/book.provider';

@Module({
  controllers: [BookController],
  providers: [BookService, ...bookProviders],
})
export class BookModule {}
