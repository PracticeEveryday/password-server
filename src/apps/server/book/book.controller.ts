import { Body, HttpStatus } from '@nestjs/common';

import { BookService } from './book.service';
import { createBookDescriptionMd, createBookSuccMd, createBookSummaryMd } from './docs/book.docs';
import { CreateBookReqDto } from './dto/api-dto/createBook.req.dto';
import { RouteTable } from '../common/decorator/router-table.decorator';
import { Route } from '../common/decorator/router.decorator';
import { Method } from '../common/enum/method.enum';

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
      // type: GetPasswordsResDto,
      description: createBookSuccMd,
    },
    description: createBookDescriptionMd,
    summary: createBookSummaryMd,
  })
  public async create(@Body() createBookReqDto: CreateBookReqDto) {
    return await this.bookService.create(createBookReqDto);
  }
}
