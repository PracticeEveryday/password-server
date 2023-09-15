import { Inject, Injectable } from '@nestjs/common';

import { toPagination } from '@apps/server/common/helper/pagination.helper';
import ErrorResponse from '@commons/exception/errorResponse';
import { ConflictException } from '@commons/exception/exception/conflict.exception';
import { NotFoundException } from '@commons/exception/exception/notFound.exception';
import { UpdatedResDto, DeletedResDto, FindOneByIdReqDto } from '@commons/type/dto/basicApiDto';
import { BookSqlInterface } from '@libs/adapter/db/mysql/interface/book.interface';
import { MysqlService } from '@libs/adapter/db/mysql/mysql.service';
import { InjectionToken } from '@libs/adapter/db/mysql/repository/injectionToken';
import { SqlUtil } from '@libs/util/sql.util';

import * as BookDtos from './dto';
import { BookInterface } from './interface/book.interface';
import { BookMetaRepositoryInterface } from './interface/bookMetaRepository';
import { BookRepositoryInterface } from './interface/bookRepository.interface';

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
  public async createOne(createBookReqDto: BookDtos.CreateBookReqDto): Promise<BookDtos.CreateBookResDto> {
    const book = await this.bookRepository.findOneByWhere({ title: createBookReqDto.title });
    if (book) throw new ConflictException(ErrorResponse.BOOK.BOOK_ALREADY_EXIST);

    const createdBookResult = await this.bookRepository.createOne(createBookReqDto);
    createBookReqDto.setBookId = createdBookResult.insertId;

    const createdBookMetaResult = await this.bookMetaRepository.createOne(createBookReqDto);

    return new BookDtos.CreateBookResDto(createdBookResult.insertId, createdBookMetaResult.insertId);
  }

  /**
   * 책 수정
   */
  public async updateOne(body: BookDtos.UpdateBookReqDto, param: FindOneByIdReqDto): Promise<UpdatedResDto> {
    const selectResult = await this.bookRepository.findOneById(param);
    if (!selectResult) {
      throw new NotFoundException(ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID(param.id));
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
  public async findOneById(findOneByIdReqDto: FindOneByIdReqDto): Promise<BookDtos.FindOneByIdResDto> {
    const selectResult = await this.bookRepository.findOneById(findOneByIdReqDto);
    if (!selectResult) {
      throw new NotFoundException(ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID(findOneByIdReqDto.id));
    }

    const book = SqlUtil.checkTypeAndConvertObj<BookSqlInterface, BookInterface>(selectResult, ['bookMeta'], 'title');
    return new BookDtos.FindOneByIdResDto(book);
  }

  /**
   * 책 검색
   * @param searchBookReqDto SearchBookReqDto
   */
  public async findManyByQueryWithPagination(searchBookReqDto: BookDtos.SearchBookReqDto): Promise<BookDtos.SearchBookPaginationDto> {
    const bookArr = await this.bookRepository.findManyByQueryWithPagination(searchBookReqDto);

    const { totalCount } = await this.bookRepository.count(searchBookReqDto);
    const pagination = toPagination(totalCount, searchBookReqDto.pageNo, searchBookReqDto.pageSize);
    const searchBookResDto = bookArr.map((bookSql) => {
      const book = SqlUtil.checkTypeAndConvertObj<BookSqlInterface, BookInterface>(bookSql, ['bookMeta'], 'title');

      return new BookDtos.FindOneByIdResDto(book);
    });

    return new BookDtos.SearchBookPaginationDto(searchBookResDto, pagination);
  }

  /**
   * 책 단일 삭제
   * @param deleteBookReqDto DeleteBookReqDto
   */
  public async removeOne(deleteBookReqDto: BookDtos.DeleteBookReqDto): Promise<DeletedResDto> {
    const findOneByIdReqDto = FindOneByIdReqDto.toDTO(deleteBookReqDto.id);
    const bookSql = await this.bookRepository.findOneById(findOneByIdReqDto);
    if (!bookSql) {
      throw new NotFoundException(ErrorResponse.BOOK.NOT_FOUND_BOOK_BY_ID(deleteBookReqDto.id));
    }

    const deletedBookMetaResult = await this.bookMetaRepository.removeOne(deleteBookReqDto);
    if (deletedBookMetaResult.affectedRows === 1) {
      const deletedBookResult = await this.bookRepository.removeOne(deleteBookReqDto);
      return deletedBookResult.affectedRows === 1 ? new DeletedResDto(true) : new DeletedResDto(false);
    }
    return new DeletedResDto(false);
  }
}
