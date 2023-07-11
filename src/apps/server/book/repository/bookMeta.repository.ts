import { Inject } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';

import { MysqlService } from '../../../../libs/mysql/mysql.service';
import { CustomUnknownException } from '../../common/customExceptions/exception/unknown.exception';
import { CreateBookReqDto } from '../dto/api-dto/createBook.req.dto';

export class BookMetaRepository {
  private ROW_IDX = 0 as const;
  private FILED_IDX = 1 as const;

  constructor(@Inject(MysqlService) private readonly mysqlService: MysqlService) {}

  public async create(createBookReqDto: CreateBookReqDto): Promise<ResultSetHeader> {
    try {
      const query = `INSERT INTO password.book_metas (book_id, author, publisher, page_count, createdAt, updatedAt, deletedAt) VALUES (${createBookReqDto.bookId}, '${createBookReqDto.author}', '${createBookReqDto.publisher}', ${createBookReqDto.pageCount},  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null )`;
      const createQueryResult = await createBookReqDto.connectionPool.execute<ResultSetHeader>(query);

      return createQueryResult[this.ROW_IDX];
    } catch (error) {
      throw new CustomUnknownException({ title: 'UnknownException', message: 'bookMeta repo create', raw: error });
    }
  }
}
