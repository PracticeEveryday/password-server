import { Body, HttpStatus, UseInterceptors } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';

import { BookService } from './book.service';
import { createBookDescriptionMd, createBookSuccMd, createBookSummaryMd } from './docs/book.docs';
import { CreateBookReqDto } from './dto/api-dto/createBook.req.dto';
import { CreateBookResDto } from './dto/api-dto/createBook.res.dto';
import { TransactionManager } from '../common/decorator/connectionPool.decorator';
import { RouteTable } from '../common/decorator/router-table.decorator';
import { Route } from '../common/decorator/router.decorator';
import { Method } from '../common/enum/method.enum';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';

@RouteTable({
  path: 'books',
  tag: {
    title: '📖 책 API',
    category: 'public',
  },
})
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Route({
    request: {
      method: Method.POST,
      path: '/',
    },
    response: {
      code: HttpStatus.CREATED,
      type: CreateBookResDto,
      description: createBookSuccMd,
    },
    description: createBookDescriptionMd,
    summary: createBookSummaryMd,
  })
  @UseInterceptors(TransactionInterceptor)
  public async create(
    @Body() createBookReqDto: CreateBookReqDto,
    @TransactionManager() connectionPool: PoolConnection,
  ): Promise<CreateBookResDto> {
    createBookReqDto.setConnectionPool = connectionPool;
    return await this.bookService.create(createBookReqDto);
  }
}
