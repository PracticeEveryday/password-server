import { Body, HttpStatus, Param, Query, UseInterceptors } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';

import { BookService } from '@apps/server/modules/book/book.service';
import { SearchBookPaginationDto } from '@apps/server/modules/book/dto/api-dto/searchBook.res.dto';
import { TransactionManager } from '@commons/framework/decorator/connectionPool.decorator';
import { Route } from '@commons/framework/decorator/router.decorator';
import { RouteTable } from '@commons/framework/decorator/routerTable.decorator';
import { TransactionInterceptor } from '@commons/framework/interceptor/transaction.interceptor';
import { TryCatchInterceptor } from '@commons/framework/interceptor/tryCatch.interceptor';
import { ResponseDto, UpdatedResDto, DeletedResDto, FindOneByIdReqDto } from '@commons/type/dto/basicApiDto';
import { Method } from '@commons/variable/enum/method.enum';

import * as BookDocs from './docs/book.docs';
import * as BookDtos from './dto';

@RouteTable({
  path: 'books',
  version: '1',
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
      type: BookDtos.FindOneByIdResDto,
      description: BookDocs.findOneByIdSuccMd,
    },
    summary: BookDocs.findOneByIdSummaryMd,
    description: BookDocs.findOneByIdDescriptionMd,
  })
  public async findOneById(@Param() findOneByIdReqDto: FindOneByIdReqDto): Promise<ResponseDto<BookDtos.FindOneByIdResDto>> {
    const book = await this.bookService.findOneById(findOneByIdReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<BookDtos.FindOneByIdResDto>(book);
  }

  @Route({
    request: {
      path: '/',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: SearchBookPaginationDto,
      description: BookDocs.findManyByQueryWithPaginationSuccMd,
    },
    summary: BookDocs.findManyByQueryWithPaginationSummaryMd,
    description: BookDocs.findManyByQueryWithPaginationDescriptionMd,
  })
  public async findManyByQueryWithPagination(
    @Query() searchBookReqDto: BookDtos.SearchBookReqDto,
  ): Promise<ResponseDto<BookDtos.SearchBookPaginationDto>> {
    const book = await this.bookService.findManyByQueryWithPagination(searchBookReqDto);

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
      type: BookDtos.CreateBookResDto,
      description: BookDocs.createOneSuccMd,
    },
    summary: BookDocs.createOneSummaryMd,
    description: BookDocs.createOneDescriptionMd,
  })
  @UseInterceptors(TransactionInterceptor)
  public async createOne(
    @Body() createBookReqDto: BookDtos.CreateBookReqDto,
    @TransactionManager() connectionPool: PoolConnection,
  ): Promise<ResponseDto<BookDtos.CreateBookResDto>> {
    createBookReqDto.setConnectionPool = connectionPool;
    const created = await this.bookService.createOne(createBookReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<BookDtos.CreateBookResDto>(created);
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
      description: BookDocs.updateOneSuccMd,
    },
    summary: BookDocs.updateOneSummaryMd,
    description: BookDocs.updateOneDescriptionMd,
  })
  @UseInterceptors(TransactionInterceptor)
  public async updateOne(
    @Param() findOneByIdReqDto: FindOneByIdReqDto,
    @Body() updateBookReqDto: BookDtos.UpdateBookReqDto,
    @TransactionManager() connectionPool: PoolConnection,
  ): Promise<ResponseDto<UpdatedResDto>> {
    updateBookReqDto.setConnectionPool = connectionPool;
    const updated = await this.bookService.updateOne(updateBookReqDto, findOneByIdReqDto);

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
      description: BookDocs.removeOneSuccMd,
    },
    summary: BookDocs.removeOneSummaryMd,
    description: BookDocs.removeOneDescriptionMd,
  })
  @UseInterceptors(TransactionInterceptor)
  public async removeOne(
    @Param() deleteBookReqDto: BookDtos.DeleteBookReqDto,
    @TransactionManager() connectionPool: PoolConnection,
  ): Promise<ResponseDto<DeletedResDto>> {
    deleteBookReqDto.setConnectionPool = connectionPool;
    const deleted = await this.bookService.removeOne(deleteBookReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<DeletedResDto>(deleted);
  }
}
