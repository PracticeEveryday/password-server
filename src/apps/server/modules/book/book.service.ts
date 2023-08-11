import { Inject, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import ErrorResponse from '@apps/server/common/customExceptions/errorResponse';
import { CustomConflictException } from '@apps/server/common/customExceptions/exception/conflict.exception';
import { CustomNotFoundException } from '@apps/server/common/customExceptions/exception/notFound.exception';
import { DeletedResDto } from '@apps/server/common/dto/basic-api-dto/deleteResult.res.dto';
import { FindOneByIdReqDto } from '@apps/server/common/dto/basic-api-dto/findOneById.req.dto';
import { UpdatedResDto } from '@apps/server/common/dto/basic-api-dto/updateResult.res.dto';
import { toPagination } from '@apps/server/common/helper/pagination.helper';
import { CreateBookReqDto } from '@apps/server/modules/book/dto/api-dto/createBook.req.dto';
import { CreateBookResDto } from '@apps/server/modules/book/dto/api-dto/createBook.res.dto';
import { DeleteBookReqDto } from '@apps/server/modules/book/dto/api-dto/deleteBook.req.dto';
import { FindOneByIdResDto } from '@apps/server/modules/book/dto/api-dto/findOneById.res.dto';
import { SearchBookReqDto } from '@apps/server/modules/book/dto/api-dto/searchBook.req.dto';
import { SearchBookPaginationDto } from '@apps/server/modules/book/dto/api-dto/searchBook.res.dto';
import { UpdateBookReqDto } from '@apps/server/modules/book/dto/api-dto/updateBook.req.dto';
import { BookInterface } from '@apps/server/modules/book/interface/book.interface';
import { BookRepository } from '@apps/server/modules/book/repository/book.repository';
import { BookMetaRepository } from '@apps/server/modules/book/repository/bookMeta.repository';
import { MysqlService } from '@libs/mysql/mysql.service';
import { InjectionToken } from '@libs/mysql/repository/injectionToken';
import { BookSqlInterface } from '@libs/mysql/type/book.type';
import { SqlUtilService } from '@libs/util/sql/sqlUtil.service';

@Injectable()
export class BookService {
  constructor(
    private readonly mysqlService: MysqlService,
    private readonly sqlUtilService: SqlUtilService,
    @Inject(InjectionToken.BOOK_REPOSITORY) private readonly bookRepository: BookRepository,
    @Inject(InjectionToken.BOOK_META_REPOSITORY) private readonly bookMetaRepository: BookMetaRepository,
  ) {}

  /**
   * 책 생성
   * @param createBookReqDto CreateBookReqDto
   */
  public async createOne(createBookReqDto: CreateBookReqDto): Promise<CreateBookResDto> {
    const selectResult = await this.bookRepository.findOneByWhere({ title: createBookReqDto.title });
    if (selectResult) throw new CustomConflictException({ errorResponse: ErrorResponse.BOOK.BOOK_ALREADY_EXIST });

    const createdBookResult = await this.bookRepository.createOne(createBookReqDto);
    createBookReqDto.setBookId = createdBookResult.insertId;

    const createdBookMetaResult = await this.bookMetaRepository.createOne(createBookReqDto);

    return new CreateBookResDto(createdBookResult.insertId, createdBookMetaResult.insertId);
  }

  /**
   * 책 수정
   */
  public async updateOne(body: UpdateBookReqDto, param: FindOneByIdReqDto): Promise<UpdatedResDto> {
    const selectResult: RowDataPacket = await this.bookRepository.findOneById(param);
    if (!selectResult) {
      throw new CustomNotFoundException({ errorResponse: ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID });
    }

    const book = this.sqlUtilService.checkTypeAndConvertObj<BookSqlInterface, BookInterface>(selectResult, ['bookMeta'], 'title');
    const updateInfo = body.compareValue(book);

    const bookUpdateResult = await this.bookRepository.update(updateInfo, param);

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
    const selectResult: RowDataPacket = await this.bookRepository.findOneById(findOneByIdReqDto);
    if (!selectResult) {
      throw new CustomNotFoundException({ errorResponse: ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID });
    }

    const book = this.sqlUtilService.checkTypeAndConvertObj<BookSqlInterface, BookInterface>(selectResult, ['bookMeta'], 'title');
    return new FindOneByIdResDto(book);
  }

  /**
   * 책 검색
   * @param searchBookReqDto SearchBookReqDto
   */
  public async findManyByQueryWithPagination(searchBookReqDto: SearchBookReqDto): Promise<SearchBookPaginationDto> {
    const selectResultArr: RowDataPacket[] = await this.bookRepository.findManyByQueryWithPagination(searchBookReqDto);
    if (selectResultArr.length === 0) {
      throw new CustomNotFoundException({ errorResponse: ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID });
    }

    const { totalCount } = await this.bookRepository.count(searchBookReqDto);
    const pagination = toPagination(totalCount, searchBookReqDto.pageNo, searchBookReqDto.pageSize);
    const searchBookResDto = selectResultArr.map((selectResult) => {
      if (!selectResult) {
        throw new CustomNotFoundException({ errorResponse: ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID });
      }
      const book = this.sqlUtilService.checkTypeAndConvertObj<BookSqlInterface, BookInterface>(selectResult, ['bookMeta'], 'title');

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
    const selectResult: RowDataPacket = await this.bookRepository.findOneById(findOneByIdReqDto);
    if (!selectResult) {
      throw new CustomNotFoundException({ errorResponse: ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID });
    }

    const deletedBookMetaResult = await this.bookMetaRepository.removeOne(deleteBookReqDto);
    if (deletedBookMetaResult.affectedRows === 1) {
      const deletedBookResult = await this.bookRepository.removeOne(deleteBookReqDto);
      return deletedBookResult.affectedRows === 1 ? new DeletedResDto(true) : new DeletedResDto(false);
    }
    return new DeletedResDto(false);
  }
}
