import { Inject, Injectable } from '@nestjs/common';

import { CreateBookReqDto } from './dto/api-dto/createBook.req.dto';
import { CreateBookResDto } from './dto/api-dto/createBook.res.dto';
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
}
