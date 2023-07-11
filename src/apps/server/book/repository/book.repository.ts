import { Inject, Injectable } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';

import { MysqlService } from '../../../../libs/mysql/mysql.service';
import { CustomUnknownException } from '../../common/customExceptions/exception/unknown.exception';
import { CreateBookReqDto } from '../dto/api-dto/createBook.req.dto';
import { FindBookByIdDto } from '../dto/book-dto/findOneById.req.dto';

@Injectable()
export class BookRepository {
  private ROW_IDX = 0 as const;
  private FILED_IDX = 1 as const;
  constructor(@Inject(MysqlService) private readonly mysqlService: MysqlService) {}

  public async create(createBookReqDto: CreateBookReqDto): Promise<ResultSetHeader> {
    try {
      const query = `INSERT INTO password.books (title, price, book_report, start_date, end_date, createdAt, updatedAt, deletedAt) VALUES ('${createBookReqDto.title}', ${createBookReqDto.price}, null, CURRENT_TIMESTAMP, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null )`;
      const createQueryResult = await createBookReqDto.connectionPool.execute<ResultSetHeader>(query);

      return createQueryResult[this.ROW_IDX];
    } catch (error) {
      throw new CustomUnknownException({ title: 'UnknownException', message: 'book repo create', raw: error });
    }
  }

  public async findOneById(findBookByIdDto: FindBookByIdDto) {
    try {
      const query = `SELECT book.id as bookId, title as title, price as price, book_report as bookReport, start_date as startDate, end_date as endDate, bookMetas.id as bookMetaId, bookMetas.author as author, bookMetas.publisher as publisher, bookMetas.page_count as pageCount
       FROM password.books as book 
       LEFT JOIN password.book_metas as bookMetas 
       ON book_id=${findBookByIdDto.id} 
       WHERE book.id=${findBookByIdDto.id}`;

      const selectQueryResult = await this.mysqlService.executeSingleQuery(query);

      return selectQueryResult[this.ROW_IDX];
    } catch (error) {
      console.log(error);
      throw new CustomUnknownException({ title: 'UnknownException', message: 'book repo findOneById', raw: error });
    }
  }
}
