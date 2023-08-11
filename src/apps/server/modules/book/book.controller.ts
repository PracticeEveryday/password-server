import { Body, HttpStatus, Param, Query, UseInterceptors } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';

import { TransactionManager } from '@apps/server/common/decorator/connectionPool.decorator';
import { Route } from '@apps/server/common/decorator/router.decorator';
import { RouteTable } from '@apps/server/common/decorator/routerTable.decorator';
import { DeletedResDto } from '@apps/server/common/dto/basic-api-dto/deleteResult.res.dto';
import { FindOneByIdReqDto } from '@apps/server/common/dto/basic-api-dto/findOneById.req.dto';
import { UpdatedResDto } from '@apps/server/common/dto/basic-api-dto/updateResult.res.dto';
import { ResponseDto } from '@apps/server/common/dto/response.dto';
import { Method } from '@apps/server/common/enum/method.enum';
import { TransactionInterceptor } from '@apps/server/common/interceptor/transaction.interceptor';
import { TryCatchInterceptor } from '@apps/server/common/interceptor/tryCatch.interceptor';
import { CreateBookReqDto } from '@apps/server/modules/book/dto/api-dto/createBook.req.dto';
import { CreateBookResDto } from '@apps/server/modules/book/dto/api-dto/createBook.res.dto';
import { DeleteBookReqDto } from '@apps/server/modules/book/dto/api-dto/deleteBook.req.dto';
import { FindOneByIdResDto } from '@apps/server/modules/book/dto/api-dto/findOneById.res.dto';
import { SearchBookReqDto } from '@apps/server/modules/book/dto/api-dto/searchBook.req.dto';
import { SearchBookPaginationDto } from '@apps/server/modules/book/dto/api-dto/searchBook.res.dto';
import { UpdateBookReqDto } from '@apps/server/modules/book/dto/api-dto/updateBook.req.dto';

import { BookService } from './book.service';
import * as BookDocs from './docs/book.docs';

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
      type: FindOneByIdResDto,
      description: BookDocs.findOneByIdSuccMd,
    },
    summary: BookDocs.findOneByIdSummaryMd,
    description: BookDocs.findOneByIdDescriptionMd,
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
      description: BookDocs.findManyByQueryWithPaginationSuccMd,
    },
    summary: BookDocs.findManyByQueryWithPaginationSummaryMd,
    description: BookDocs.findManyByQueryWithPaginationDescriptionMd,
  })
  public async findManyByQueryWithPagination(@Query() searchBookReqDto: SearchBookReqDto): Promise<ResponseDto<SearchBookPaginationDto>> {
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
      type: CreateBookResDto,
      description: BookDocs.createOneSuccMd,
    },
    summary: BookDocs.createOneSummaryMd,
    description: BookDocs.createOneDescriptionMd,
  })
  @UseInterceptors(TransactionInterceptor)
  public async createOne(
    @Body() createBookReqDto: CreateBookReqDto,
    @TransactionManager() connectionPool: PoolConnection,
  ): Promise<ResponseDto<CreateBookResDto>> {
    createBookReqDto.setConnectionPool = connectionPool;
    const created = await this.bookService.createOne(createBookReqDto);

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
      description: BookDocs.updateOneSuccMd,
    },
    summary: BookDocs.updateOneSummaryMd,
    description: BookDocs.updateOneDescriptionMd,
  })
  @UseInterceptors(TransactionInterceptor)
  public async updateOne(
    @Param() findOneByIdReqDto: FindOneByIdReqDto,
    @Body() updateBookReqDto: UpdateBookReqDto,
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
    @Param() deleteBookReqDto: DeleteBookReqDto,
    @TransactionManager() connectionPool: PoolConnection,
  ): Promise<ResponseDto<DeletedResDto>> {
    deleteBookReqDto.setConnectionPool = connectionPool;
    const deleted = await this.bookService.removeOne(deleteBookReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<DeletedResDto>(deleted);
  }
}
