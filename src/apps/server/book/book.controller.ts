import { Body, HttpStatus, Param, Query, UseInterceptors } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';

import { BookService } from './book.service';
import {
  createBookDescriptionMd,
  createBookSuccMd,
  createBookSummaryMd,
  deleteBookDescriptionMd,
  deleteBookSuccMd,
  deleteBookSummaryMd,
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
import { DeleteBookReqDto } from './dto/api-dto/deleteBook.req.dto';
import { FindOneByIdResDto } from './dto/api-dto/findOneById.res.dto';
import { SearchBookReqDto } from './dto/api-dto/searchBook.req.dto';
import { SearchBookPaginationDto } from './dto/api-dto/searchBook.res.dto';
import { UpdateBookReqDto } from './dto/api-dto/updateBook.req.dto';
import { TransactionManager } from '../common/decorator/connectionPool.decorator';
import { RouteTable } from '../common/decorator/router-table.decorator';
import { Route } from '../common/decorator/router.decorator';
import { DeletedResDto } from '../common/dto/basic-api-dto/deleteResult.res.dto';
import { FindOneByIdReqDto } from '../common/dto/basic-api-dto/findOneById.req.dto';
import { UpdatedResDto } from '../common/dto/basic-api-dto/updateResult.res.dto';
import { ResponseDto } from '../common/dto/response.dto';
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
      path: '/:id',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: FindOneByIdResDto,
      description: findBookByIdSuccMd,
    },
    summary: findBookByIdSummaryMd,
    description: findBookByIdDescriptionMd,
  })
  public async findOneById(@Param() findOneByIdReqDto: FindOneByIdReqDto): Promise<ResponseDto<FindOneByIdResDto>> {
    const book = await this.bookService.findOneById(findOneByIdReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<FindOneByIdResDto>(book);
  }

  @Route({
    request: {
      path: '/',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: SearchBookPaginationDto,
      description: searchBookByTitleSuccMd,
    },
    summary: searchBookByTitleSummaryMd,
    description: searchBookByTitleDescriptionMd,
  })
  public async searchBook(@Query() searchBookReqDto: SearchBookReqDto): Promise<ResponseDto<SearchBookPaginationDto>> {
    const book = await this.bookService.searchBook(searchBookReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<SearchBookPaginationDto>(book);
  }

  // -- POST
  @Route({
    request: {
      path: '/',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
      type: CreateBookResDto,
      description: createBookSuccMd,
    },
    summary: createBookSummaryMd,
    description: createBookDescriptionMd,
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
      path: '/:id',
      method: Method.PUT,
    },
    response: {
      code: HttpStatus.OK,
      type: UpdatedResDto,
      description: updateBookSuccMd,
    },
    summary: updateBookSummaryMd,
    description: updateBookDescriptionMd,
  })
  @UseInterceptors(TransactionInterceptor)
  public async update(
    @Param() findOneByIdReqDto: FindOneByIdReqDto,
    @Body() updateBookReqDto: UpdateBookReqDto,
    @TransactionManager() connectionPool: PoolConnection,
  ): Promise<ResponseDto<UpdatedResDto>> {
    updateBookReqDto.setConnectionPool = connectionPool;
    const updated = await this.bookService.update(updateBookReqDto, findOneByIdReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<UpdatedResDto>(updated);
  }

  // -- DELETE

  @Route({
    request: {
      path: '/:id',
      method: Method.DELETE,
    },
    response: {
      code: HttpStatus.OK,
      type: DeletedResDto,
      description: deleteBookSuccMd,
    },
    summary: deleteBookSummaryMd,
    description: deleteBookDescriptionMd,
  })
  @UseInterceptors(TransactionInterceptor)
  public async deleteOne(
    @Param() deleteBookReqDto: DeleteBookReqDto,
    @TransactionManager() connectionPool: PoolConnection,
  ): Promise<ResponseDto<DeletedResDto>> {
    deleteBookReqDto.setConnectionPool = connectionPool;
    const deleted = await this.bookService.deleteOne(deleteBookReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<DeletedResDto>(deleted);
  }
}
