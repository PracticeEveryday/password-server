import { Inject, Injectable } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { MysqlService } from '../../../../libs/mysql/mysql.service';
import { SqlUtilService } from '../../../../libs/utils/sql-util/sql-util.service';
import { FindOneByIdReqDto } from '../../common/dto/basic-api-dto/findOneById.req.dto';
import { CreateBookReqDto } from '../dto/api-dto/createBook.req.dto';
import { DeleteBookReqDto } from '../dto/api-dto/deleteBook.req.dto';
import { SearchBookReqDto } from '../dto/api-dto/searchBook.req.dto';
import { UpdateBookReqDto } from '../dto/api-dto/updateBook.req.dto';
import * as Book from '../interface/book.interface';

@Injectable()
export class BookRepository {
  private ROW_IDX = 0 as const;
  private FILED_IDX = 1 as const;
  constructor(
    @Inject(MysqlService) private readonly mysqlService: MysqlService,
    @Inject(SqlUtilService) private readonly sqlUtilService: SqlUtilService,
  ) {}

  public async create(createBookReqDto: CreateBookReqDto): Promise<ResultSetHeader> {
    const query = `INSERT INTO password.books (title, price, book_report, start_date, end_date, createdAt, updatedAt, deletedAt) VALUES ('${createBookReqDto.title}', ${createBookReqDto.price}, null, CURRENT_TIMESTAMP, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null )`;

    const createQueryResult = await createBookReqDto.connectionPool.execute<ResultSetHeader>(query);

    return createQueryResult[this.ROW_IDX];
  }

  public async findOneById(findOneByIdReqDto: FindOneByIdReqDto) {
    const query = `
       SELECT 
           book.id as id, 
           title as title,
           price as price,
           book_report as bookReport,
           start_date as startDate,
           end_date as endDate,
           bookMetas.id as bookMetaId,
           bookMetas.author as bookMetaAuthor,
           bookMetas.publisher as bookMetaPublisher,
           bookMetas.page_count as bookMetaPageCount
       FROM password.books as book 
       LEFT JOIN password.book_metas as bookMetas 
       ON book_id=${findOneByIdReqDto.id} 
       WHERE book.id=${findOneByIdReqDto.id}`;

    const selectQueryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return selectQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  public async searchBook(searchBookReqDto: SearchBookReqDto) {
    const query = `
      SELECT
        book.id as id,
        title as title,
        price as price,
        book_report as bookReport,
        start_date as startDate,
        end_date as endDate,
        bookMetas.id as bookMetaId,
        bookMetas.author as bookMetaAuthor,
        bookMetas.publisher as bookMetaPublisher,
        bookMetas.page_count as bookMetaPageCount
      FROM password.books as book
      LEFT JOIN password.book_metas as bookMetas 
        ON book.id = bookMetas.book_id
      WHERE ${this.sqlUtilService.makeWhereLikeQuery(searchBookReqDto.makeWhereObj())}
      LIMIT ${searchBookReqDto.pageSize} OFFSET ${(searchBookReqDto.pageNo - 1) * searchBookReqDto.pageSize}
    `;

    const selectQueryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return selectQueryResult[this.ROW_IDX];
  }

  public async count(searchBookReqDto: SearchBookReqDto) {
    const query = `
      SELECT COUNT(*) as totalCount
        FROM password.books as book
      LEFT JOIN password.book_metas as bookMetas 
        ON book.id = bookMetas.book_id
      WHERE ${this.sqlUtilService.makeWhereLikeQuery(searchBookReqDto.makeWhereObj())}
    `;

    const selectQueryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return selectQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  public async findOneByWhere(where: Book.BookWhereInterface) {
    const query = `SELECT * FROM password.books WHERE ${this.sqlUtilService.makeWhereEqualQuery<Book.BookWhereInterface>(where)}`;
    const selectQueryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return selectQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  public async update(updateBookReqDto: UpdateBookReqDto, param: FindOneByIdReqDto): Promise<ResultSetHeader> {
    const query = `
        UPDATE password.books 
        SET title='${updateBookReqDto.title}',
            price=${updateBookReqDto.price},
            book_report='${updateBookReqDto.bookReport}',
            end_date='${updateBookReqDto.endDate.toISOString().slice(0, 19)}',
            start_date='${updateBookReqDto.startDate.toISOString().slice(0, 19)}'
        WHERE id=${param.id}`;

    const updateQueryResult = await updateBookReqDto.connectionPool.execute<ResultSetHeader>(query);
    return updateQueryResult[this.ROW_IDX];
  }

  public async deleteOne(deleteBookReqDto: DeleteBookReqDto): Promise<ResultSetHeader> {
    const query = `DELETE FROM password.books WHERE id=${deleteBookReqDto.id}`;
    const deleteQueryResult = await deleteBookReqDto.connectionPool.execute<ResultSetHeader>(query);

    return deleteQueryResult[this.ROW_IDX];
  }
}
