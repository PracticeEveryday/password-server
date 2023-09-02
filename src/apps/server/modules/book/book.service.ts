import { Inject, Injectable } from '@nestjs/common';

import ErrorResponse from '@apps/server/common/customExceptions/errorResponse';
import { ConflictException } from '@apps/server/common/customExceptions/exception/conflict.exception';
import { NotFoundException } from '@apps/server/common/customExceptions/exception/notFound.exception';
import { toPagination } from '@apps/server/common/helper/pagination.helper';
import { CreateBookReqDto } from '@apps/server/modules/book/dto/api-dto/createBook.req.dto';
import { CreateBookResDto } from '@apps/server/modules/book/dto/api-dto/createBook.res.dto';
import { DeleteBookReqDto } from '@apps/server/modules/book/dto/api-dto/deleteBook.req.dto';
import { FindOneByIdResDto } from '@apps/server/modules/book/dto/api-dto/findOneById.res.dto';
import { SearchBookReqDto } from '@apps/server/modules/book/dto/api-dto/searchBook.req.dto';
import { SearchBookPaginationDto } from '@apps/server/modules/book/dto/api-dto/searchBook.res.dto';
import { UpdateBookReqDto } from '@apps/server/modules/book/dto/api-dto/updateBook.req.dto';
import { BookInterface } from '@apps/server/modules/book/interface/book.interface';
import { BookMetaRepositoryInterface } from '@apps/server/modules/book/interface/bookMetaRepository';
import { BookRepositoryInterface } from '@apps/server/modules/book/interface/bookRepository.interface';
import { BookMetaRepository } from '@apps/server/modules/book/repository/bookMeta.repository';
import { DeletedResDto } from '@commons/dto/basicApiDto/deleteResult.res.dto';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto/findOneById.req.dto';
import { UpdatedResDto } from '@commons/dto/basicApiDto/updateResult.res.dto';
import { BookSqlInterface } from '@libs/mysql/interface/book.interface';
import { MysqlService } from '@libs/mysql/mysql.service';
import { InjectionToken } from '@libs/mysql/repository/injectionToken';
import { SqlUtil } from '@libs/util/sql.util';

@Injectable()
export class BookService {
  constructor(
    private readonly mysqlService: MysqlService,
    @Inject(InjectionToken.BOOK_REPOSITORY) private readonly bookRepository: BookRepositoryInterface,
    @Inject(InjectionToken.BOOK_META_REPOSITORY) private readonly bookMetaRepository: BookMetaRepositoryInterface,
  ) {}

  /**
   * 책 생성
   * @param createBookReqDto CreateBookReqDto
   */
  public async createOne(createBookReqDto: CreateBookReqDto): Promise<CreateBookResDto> {
    const book = await this.bookRepository.findOneByWhere({ title: createBookReqDto.title });
    if (book) throw new ConflictException({ errorResponse: ErrorResponse.BOOK.BOOK_ALREADY_EXIST });

    const createdBookResult = await this.bookRepository.createOne(createBookReqDto);
    createBookReqDto.setBookId = createdBookResult.insertId;

    const createdBookMetaResult = await this.bookMetaRepository.createOne(createBookReqDto);

    return new CreateBookResDto(createdBookResult.insertId, createdBookMetaResult.insertId);
  }

  /**
   * 책 수정
   */
  public async updateOne(body: UpdateBookReqDto, param: FindOneByIdReqDto): Promise<UpdatedResDto> {
    const selectResult = await this.bookRepository.findOneById(param);
    if (!selectResult) {
      throw new NotFoundException({ errorResponse: ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID });
    }

    const book = SqlUtil.checkTypeAndConvertObj<BookSqlInterface, BookInterface>(selectResult, ['bookMeta'], 'title');
    const updateInfo = body.compareValue(book);

    const bookUpdateResult = await this.bookRepository.updateOne(updateInfo, param);

    if (bookUpdateResult.affectedRows === 1) {
      const bookMetaUpdateResult = await this.bookMetaRepository.updateOne(updateInfo, param);
      return bookMetaUpdateResult.affectedRows === 1 ? new UpdatedResDto(true) : new UpdatedResDto(false);
    }

    new UpdatedResDto(false);
  }

  /**
   * 책 조회 By id
   * @param findOneByIdReqDto FindOneByIdReqDto
   */
  public async findOneById(findOneByIdReqDto: FindOneByIdReqDto): Promise<FindOneByIdResDto> {
    const selectResult = await this.bookRepository.findOneById(findOneByIdReqDto);
    if (!selectResult) {
      throw new NotFoundException({ errorResponse: ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID });
    }

    const book = SqlUtil.checkTypeAndConvertObj<BookSqlInterface, BookInterface>(selectResult, ['bookMeta'], 'title');
    return new FindOneByIdResDto(book);
  }

  /**
   * 책 검색
   * @param searchBookReqDto SearchBookReqDto
   */
  public async findManyByQueryWithPagination(searchBookReqDto: SearchBookReqDto): Promise<SearchBookPaginationDto> {
    const bookArr = await this.bookRepository.findManyByQueryWithPagination(searchBookReqDto);
    if (bookArr.length === 0) {
      throw new NotFoundException({ errorResponse: ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID });
    }

    const { totalCount } = await this.bookRepository.count(searchBookReqDto);
    const pagination = toPagination(totalCount, searchBookReqDto.pageNo, searchBookReqDto.pageSize);
    const searchBookResDto = bookArr.map((bookSql) => {
      const book = SqlUtil.checkTypeAndConvertObj<BookSqlInterface, BookInterface>(bookSql, ['bookMeta'], 'title');

      return new FindOneByIdResDto(book);
    });

    return new SearchBookPaginationDto(searchBookResDto, pagination);
  }

  /**
   * 책 단일 삭제
   * @param deleteBookReqDto DeleteBookReqDto
   */
  public async removeOne(deleteBookReqDto: DeleteBookReqDto): Promise<DeletedResDto> {
    const findOneByIdReqDto = FindOneByIdReqDto.toDTO(deleteBookReqDto.id);
    const bookSql = await this.bookRepository.findOneById(findOneByIdReqDto);
    if (!bookSql) {
      throw new NotFoundException({ errorResponse: ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID });
    }

    const deletedBookMetaResult = await this.bookMetaRepository.removeOne(deleteBookReqDto);
    if (deletedBookMetaResult.affectedRows === 1) {
      const deletedBookResult = await this.bookRepository.removeOne(deleteBookReqDto);
      return deletedBookResult.affectedRows === 1 ? new DeletedResDto(true) : new DeletedResDto(false);
    }
    return new DeletedResDto(false);
  }
}
