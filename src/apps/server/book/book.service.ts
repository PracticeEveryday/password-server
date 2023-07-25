import { Inject, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import { CreateBookReqDto } from './dto/api-dto/createBook.req.dto';
import { CreateBookResDto } from './dto/api-dto/createBook.res.dto';
import { DeleteBookReqDto } from './dto/api-dto/deleteBook.req.dto';
import { FindOneByIdResDto } from './dto/api-dto/findOneById.res.dto';
import { SearchBookReqDto } from './dto/api-dto/searchBook.req.dto';
import { SearchBookResDto } from './dto/api-dto/searchBook.res.dto';
import { UpdateBookReqDto } from './dto/api-dto/updateBook.req.dto';
import { FindBookByIdDto } from './dto/book-dto/findOneById.req.dto';
import { BookInterface } from './interface/book.interface';
import { BookRepository } from './repository/book.repository';
import { BookMetaRepository } from './repository/bookMeta.repository';
import { MysqlService } from '../../../libs/mysql/mysql.service';
import { InjectionToken } from '../../../libs/mysql/repositories/injectionToken';
import { BookSqlInterface } from '../../../libs/mysql/types/book.type';
import { SqlUtilService } from '../../../libs/utils/sql-util/sql-util.service';
import { CustomConflictException } from '../common/customExceptions/exception/conflict.exception';
import { CustomNotFoundException } from '../common/customExceptions/exception/notFound.exception';
import { makeExceptionScript } from '../common/customExceptions/makeExceptionScript';
import { DeletedResDto } from '../common/dto/deleteResult.res.dto';
import { UpdatedResDto } from '../common/dto/updateResult.res.dto';

@Injectable()
export class BookService {
  constructor(
    private readonly mysqlService: MysqlService,
    private readonly sqlUtilService: SqlUtilService,
    @Inject(InjectionToken.BOOK_REPOSITORY) private readonly bookRepository: BookRepository,
    @Inject(InjectionToken.BOOKMETA_REPOSITORY) private readonly bookMetaRepository: BookMetaRepository,
  ) {}

  /**
   * 책 생성
   * @param createBookReqDto CreateBookReqDto
   */
  public async create(createBookReqDto: CreateBookReqDto): Promise<CreateBookResDto> {
    const selectResult = await this.bookRepository.findOneByWhere({ title: createBookReqDto.title });
    if (selectResult) throw new CustomConflictException(makeExceptionScript('already exist', '해당 타이틀의 책이 존재합니다.'));

    const createdBookResult = await this.bookRepository.create(createBookReqDto);
    createBookReqDto.setBookId = createdBookResult.insertId;

    const createdBookMetaResult = await this.bookMetaRepository.create(createBookReqDto);

    return new CreateBookResDto(createdBookResult.insertId, createdBookMetaResult.insertId);
  }

  /**
   * 책 수정
   */
  public async update(body: UpdateBookReqDto, param: FindBookByIdDto): Promise<UpdatedResDto> {
    const selectResult: RowDataPacket = await this.bookRepository.findOneById(param);
    if (!selectResult) throw new CustomNotFoundException(makeExceptionScript('not found boor', '해당 ID의 책이 없습니다.'));

    const book = this.sqlUtilService.checkTypeAndConvertObj<BookSqlInterface, BookInterface>(selectResult, ['bookMeta'], 'title');
    const updateInfo = body.compareValue(book);

    const bookUpdateResult = await this.bookRepository.update(updateInfo, param);

    if (bookUpdateResult.affectedRows === 1) {
      const bookMetaUpdateResult = await this.bookMetaRepository.update(updateInfo, param);
      return bookMetaUpdateResult.affectedRows === 1 ? new UpdatedResDto(true) : new UpdatedResDto(false);
    }

    new UpdatedResDto(false);
  }

  /**
   * 책 조회 By id
   * @param findBookByIdDto FindBookByIdDto
   */
  public async findOneById(findBookByIdDto: FindBookByIdDto): Promise<FindOneByIdResDto> {
    const selectResult: RowDataPacket = await this.bookRepository.findOneById(findBookByIdDto);
    if (!selectResult) throw new CustomNotFoundException(makeExceptionScript('not found boor', '해당 ID의 책이 없습니다.'));

    const book = this.sqlUtilService.checkTypeAndConvertObj<BookSqlInterface, BookInterface>(selectResult, ['bookMeta'], 'title');
    return new FindOneByIdResDto(book);
  }

  /**
   * 책 검색
   * @param searchBookReqDto SearchBookReqDto
   */
  public async searchBook(searchBookReqDto: SearchBookReqDto): Promise<SearchBookResDto> {
    const selectResultArr: RowDataPacket[] = await this.bookRepository.searchBook(searchBookReqDto);
    if (selectResultArr.length === 0)
      throw new CustomNotFoundException(makeExceptionScript('not found boor', '해당 검색 조건의 책이 없습니다.'));

    return new SearchBookResDto(
      selectResultArr.map((selectResult) => {
        if (!selectResult) throw new CustomNotFoundException(makeExceptionScript('not found boor', '해당 ID의 책이 없습니다.'));
        const book = this.sqlUtilService.checkTypeAndConvertObj<BookSqlInterface, BookInterface>(selectResult, ['bookMeta'], 'title');

        return new FindOneByIdResDto(book);
      }),
    );
  }

  /**
   * 책 단일 삭제
   * @param deleteBookReqDto DeleteBookReqDto
   */
  public async deleteOne(deleteBookReqDto: DeleteBookReqDto): Promise<DeletedResDto> {
    const findBookByIdDto = FindBookByIdDto.toDTO(deleteBookReqDto.id);
    const selectResult: RowDataPacket = await this.bookRepository.findOneById(findBookByIdDto);
    if (!selectResult) throw new CustomNotFoundException(makeExceptionScript('not found boor', '해당 ID의 책이 없습니다.'));

    const deletedBookMetaResult = await this.bookMetaRepository.deleteOne(deleteBookReqDto);
    if (deletedBookMetaResult.affectedRows === 1) {
      const deletedBookResult = await this.bookRepository.deleteOne(deleteBookReqDto);
      return deletedBookResult.affectedRows === 1 ? new DeletedResDto(true) : new DeletedResDto(false);
    }
    return new DeletedResDto(false);
  }
}
