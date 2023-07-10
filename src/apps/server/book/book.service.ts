import { Inject, Injectable } from '@nestjs/common';

import { CreateBookReqDto } from './dto/api-dto/createBook.req.dto';
import { BookRepository } from './repository/book.repository';
import { BookMetaRepository } from './repository/bookMeta.repository';
import { MysqlService } from '../../../libs/mysql/mysql.service';
import { InjectionToken } from '../../../libs/mysql/repositories/injectionToken';
import { CustomBadRequestException } from '../common/customExceptions/exception/badRequest.exception';
import { CustomUnknownException } from '../common/customExceptions/exception/unknown.exception';

@Injectable()
export class BookService {
  constructor(
    private readonly mysqlService: MysqlService,
    @Inject(InjectionToken.BOOK_REPOSITORY) private readonly bookRepository: BookRepository,
    @Inject(InjectionToken.BOOKMETA_REPOSITORY) private readonly bookMetaRepository: BookMetaRepository,
  ) {}

  public async create(createBookReqDto: CreateBookReqDto) {
    try {
      const connectionPool = await this.mysqlService.getConnectionPool();
      createBookReqDto.setConnectionPool = connectionPool;

      try {
        await connectionPool.beginTransaction();
        const createdBookResult = await this.bookRepository.create(createBookReqDto);
        createBookReqDto.setBookId = createdBookResult.insertId;

        await this.bookMetaRepository.create(createBookReqDto);
        await connectionPool.commit();
      } catch (error) {
        await connectionPool.rollback();
        throw new CustomBadRequestException({ title: 'BadRequestException', message: '타입을 확인해주세요', raw: error });
      } finally {
        if (connectionPool) {
          this.mysqlService.releaseConnectionPool(connectionPool);
        }
      }
    } catch (error) {
      throw new CustomUnknownException({ title: 'UnknownException', message: 'book create', raw: error });
    }
  }
}
