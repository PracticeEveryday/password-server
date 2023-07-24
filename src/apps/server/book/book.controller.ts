import { Body, HttpStatus, Param, Query, UseInterceptors } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';

import { BookService } from './book.service';
import {
  createBookDescriptionMd,
  createBookSuccMd,
  createBookSummaryMd,
  findBookByIdDescriptionMd,
  findBookByIdSuccMd,
  findBookByIdSummaryMd,
  searchBookByTitleDescriptionMd,
  searchBookByTitleSuccMd,
  searchBookByTitleSummaryMd,
  updateBookDescriptionMd,
  updateBookSuccMd,
  updateBookSummaryMd,
} from './docs/book.docs';
import { CreateBookReqDto } from './dto/api-dto/createBook.req.dto';
import { CreateBookResDto } from './dto/api-dto/createBook.res.dto';
import { FindOneByIdResDto, FindOneByIdResDtoV2 } from './dto/api-dto/findOneById.res.dto';
import { SearchBookReqDto } from './dto/api-dto/searchBook.req.dto';
import { SearchBookResDto } from './dto/api-dto/searchBook.res.dto';
import { UpdateBookReqDto } from './dto/api-dto/updateBook.req.dto';
import { FindBookByIdDto } from './dto/book-dto/findOneById.req.dto';
import { TransactionManager } from '../common/decorator/connectionPool.decorator';
import { RouteTable } from '../common/decorator/router-table.decorator';
import { Route } from '../common/decorator/router.decorator';
import { ResponseDto } from '../common/dto/response.dto';
import { UpdatedResDto } from '../common/dto/updateResult.res.dto';
import { Method } from '../common/enum/method.enum';
import { TransactionInterceptor } from '../common/interceptor/transaction.interceptor';
import { TryCatchInterceptor } from '../common/interceptor/tryCatch.interceptor';

@RouteTable({
  path: 'books',
  tag: {
    title: '📖 책 API',
    category: 'public',
  },
})
@UseInterceptors(TryCatchInterceptor)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // --GET
  @Route({
    request: {
      method: Method.GET,
      path: '/:id',
    },
    response: {
      code: HttpStatus.OK,
      type: FindOneByIdResDtoV2,
      description: findBookByIdSuccMd,
    },
    description: findBookByIdDescriptionMd,
    summary: findBookByIdSummaryMd,
  })
  public async findOneById(@Param() findBookByIdDto: FindBookByIdDto): Promise<ResponseDto<FindOneByIdResDtoV2>> {
    const book = await this.bookService.findOneById(findBookByIdDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<FindOneByIdResDtoV2>(book);
  }

  @Route({
    request: {
      method: Method.GET,
      path: '/',
    },
    response: {
      code: HttpStatus.OK,
      type: SearchBookResDto,
      description: searchBookByTitleSuccMd,
    },
    description: searchBookByTitleDescriptionMd,
    summary: searchBookByTitleSummaryMd,
  })
  public async searchBook(@Query() searchBookReqDto: SearchBookReqDto): Promise<ResponseDto<SearchBookResDto>> {
    const book = await this.bookService.searchBook(searchBookReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<SearchBookResDto>(book);
  }

  // -- POST
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
  ): Promise<ResponseDto<CreateBookResDto>> {
    createBookReqDto.setConnectionPool = connectionPool;
    const created = await this.bookService.create(createBookReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<CreateBookResDto>(created);
  }

  // -- PUT

  @Route({
    request: {
      method: Method.PUT,
      path: '/:id',
    },
    response: {
      code: HttpStatus.OK,
      type: UpdatedResDto,
      description: updateBookSuccMd,
    },
    description: updateBookDescriptionMd,
    summary: updateBookSummaryMd,
  })
  @UseInterceptors(TransactionInterceptor)
  public async update(
    @Param() findBookByIdDto: FindBookByIdDto,
    @Body() updateBookReqDto: UpdateBookReqDto,
    @TransactionManager() connectionPool: PoolConnection,
  ): Promise<ResponseDto<UpdatedResDto>> {
    updateBookReqDto.setConnectionPool = connectionPool;
    const updated = await this.bookService.update(updateBookReqDto, findBookByIdDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<UpdatedResDto>(updated);
  }

  // -- DELETE
}
