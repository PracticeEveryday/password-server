import { Inject, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import { CreateBookReqDto } from './dto/api-dto/createBook.req.dto';
import { CreateBookResDto } from './dto/api-dto/createBook.res.dto';
import { FindOneByIdResDto } from './dto/api-dto/findOneById.res.dto';
import { SearchBookReqDto } from './dto/api-dto/searchBook.req.dto';
import { SearchBookResDto } from './dto/api-dto/searchBook.res.dto';
import { FindBookByIdDto } from './dto/book-dto/findOneById.req.dto';
import { BookRepository } from './repository/book.repository';
import { BookMetaRepository } from './repository/bookMeta.repository';
import { MysqlService } from '../../../libs/mysql/mysql.service';
import { InjectionToken } from '../../../libs/mysql/repositories/injectionToken';
import { SqlUtilService } from '../../../libs/utils/sql-util/sql-util.service';
import { BaseException } from '../common/customExceptions/exception/base.exception';
import { CustomNotFoundException } from '../common/customExceptions/exception/notFound.exception';
import { CustomUnknownException } from '../common/customExceptions/exception/unknown.exception';
import { makeExceptionScript } from '../common/customExceptions/makeExceptionScript';

@Injectable()
export class BookService {
  constructor(
    private readonly mysqlService: MysqlService,
    private readonly sqlUtilService: SqlUtilService,
    @Inject(InjectionToken.BOOK_REPOSITORY) private readonly bookRepository: BookRepository,
    @Inject(InjectionToken.BOOKMETA_REPOSITORY) private readonly bookMetaRepository: BookMetaRepository,
  ) {}

  /**
   * 책 정보를 생성하는 메서드입니다.
   * @param createBookReqDto CreateBookReqDto
   */
  public async create(createBookReqDto: CreateBookReqDto): Promise<CreateBookResDto> {
    try {
      const createdBookResult = await this.bookRepository.create(createBookReqDto);
      createBookReqDto.setBookId = createdBookResult.insertId;

      const createdBookMetaResult = await this.bookMetaRepository.create(createBookReqDto);

      return new CreateBookResDto(createdBookResult.insertId, createdBookMetaResult.insertId);
    } catch (error) {
      throw new CustomUnknownException({ title: 'UnknownException', message: 'book create', raw: error });
    }
  }

  /**
   * ID에 따른 book을 찾는 메서드입니다.
   * @param findBookByIdDto FindBookByIdDto
   */
  public async findOneById(findBookByIdDto: FindBookByIdDto): Promise<FindOneByIdResDto> {
    try {
      const selectResult: RowDataPacket = await this.bookRepository.findOneById(findBookByIdDto);
      if (!selectResult) throw new CustomNotFoundException(makeExceptionScript('not found boor', '해당 ID의 책이 없습니다.'));
      const book = this.sqlUtilService.checkBookType(selectResult);
      return new FindOneByIdResDto(book);
    } catch (error) {
      throw new CustomUnknownException({ title: 'UnknownException', message: 'book findOneById', raw: error });
    }
  }

  /**
   * 책을 조회하는 메서드
   * @param searchBookReqDto SearchBookReqDto
   */
  public async searchBook(searchBookReqDto: SearchBookReqDto): Promise<SearchBookResDto> {
    try {
      const selectResultArr: RowDataPacket[] = await this.bookRepository.searchBook(searchBookReqDto);
      if (selectResultArr.length === 0)
        throw new CustomNotFoundException(makeExceptionScript('not found boor', '해당 검색 조건의 책이 없습니다.'));

      return new SearchBookResDto(
        selectResultArr.map((selectResult) => {
          if (!selectResult) throw new CustomNotFoundException(makeExceptionScript('not found boor', '해당 ID의 책이 없습니다.'));
          const book = this.sqlUtilService.checkBookType(selectResult);
          return new FindOneByIdResDto(book);
        }),
      );
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new CustomUnknownException({ title: 'UnknownException', message: 'book searchBook', raw: error });
    }
  }
}
