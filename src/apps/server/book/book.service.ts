import { Inject, Injectable } from '@nestjs/common';

import { CreateBookReqDto } from './dto/api-dto/createBook.req.dto';
import { CreateBookResDto } from './dto/api-dto/createBook.res.dto';
import { SearchBookReqDto } from './dto/api-dto/searchBook.req.dto';
import { FindBookByIdDto } from './dto/book-dto/findOneById.req.dto';
import { BookRepository } from './repository/book.repository';
import { BookMetaRepository } from './repository/bookMeta.repository';
import { MysqlService } from '../../../libs/mysql/mysql.service';
import { InjectionToken } from '../../../libs/mysql/repositories/injectionToken';
import { CustomUnknownException } from '../common/customExceptions/exception/unknown.exception';

@Injectable()
export class BookService {
  constructor(
    private readonly mysqlService: MysqlService,
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
  public async findOneById(findBookByIdDto: FindBookByIdDto) {
    try {
      return await this.bookRepository.findOneById(findBookByIdDto);
    } catch (error) {
      throw new CustomUnknownException({ title: 'UnknownException', message: 'book findOneById', raw: error });
    }
  }

  /**
   * 책을 조회하는 메서드
   * @param searchBookReqDto SearchBookReqDto
   */
  public async searchBook(searchBookReqDto: SearchBookReqDto) {
    try {
      return await this.bookRepository.searchBook(searchBookReqDto);
    } catch (error) {
      throw new CustomUnknownException({ title: 'UnknownException', message: 'book searchBook', raw: error });
    }
  }
}
