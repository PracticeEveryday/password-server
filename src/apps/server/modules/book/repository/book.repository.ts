import { Inject, Injectable } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { FindOneByIdReqDto } from '@commons/type/dto/basicApiDto';
import { BookSqlInterface } from '@libs/adapter/db/mysql/interface/book.interface';
import { MysqlService } from '@libs/adapter/db/mysql/mysql.service';
import { SqlUtil } from '@libs/util/sql.util';

import * as BookDtos from '../dto';
import * as Book from '../interface/book.interface';
import { BookInterface } from '../interface/book.interface';
import { BookRepositoryInterface } from '../interface/bookRepository.interface';

@Injectable()
export class BookRepository implements BookRepositoryInterface {
  private ROW_IDX = 0 as const;

  private FILED_IDX = 1 as const;

  constructor(@Inject(MysqlService) private readonly mysqlService: MysqlService) {}

  public async createOne(createBookReqDto: BookDtos.CreateBookReqDto): Promise<ResultSetHeader> {
    const query = `INSERT INTO password.book (title, price, book_report, start_date, end_date, created_at, updated_at, deleted_at) VALUES ('${createBookReqDto.title}', ${createBookReqDto.price}, null, CURRENT_TIMESTAMP, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null )`;

    const createQueryResult = await createBookReqDto.connectionPool.execute<ResultSetHeader>(query);

    return createQueryResult[this.ROW_IDX];
  }

  public async findOneById(findOneByIdReqDto: FindOneByIdReqDto): Promise<BookSqlInterface> {
    const query = `
       SELECT 
           book.id as id, 
           title as title,
           price as price,
           book_report as bookReport,
           start_date as startDate,
           end_date as endDate,
           bookMeta.id as bookMetaId,
           bookMeta.author as bookMetaAuthor,
           bookMeta.publisher as bookMetaPublisher,
           bookMeta.page_count as bookMetaPageCount
       FROM password.book as book 
       LEFT JOIN password.book_meta as bookMeta 
       ON book_id=${findOneByIdReqDto.id} 
       WHERE book.id=${findOneByIdReqDto.id}`;

    const selectQueryResult = await this.mysqlService.executeSingleQuery<BookSqlInterface[]>(query);

    return selectQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  public async findManyByQueryWithPagination(searchBookReqDto: BookDtos.SearchBookReqDto): Promise<BookSqlInterface[]> {
    const query = `
      SELECT
        book.id as id,
        title as title,
        price as price,
        book_report as bookReport,
        start_date as startDate,
        end_date as endDate,
        bookMeta.id as bookMetaId,
        bookMeta.author as bookMetaAuthor,
        bookMeta.publisher as bookMetaPublisher,
        bookMeta.page_count as bookMetaPageCount
      FROM password.book as book
      LEFT JOIN password.book_meta as bookMeta 
        ON book.id = bookMeta.book_id
      WHERE ${SqlUtil.makeWhereLikeQuery(searchBookReqDto.makeWhereObj())}
      LIMIT ${searchBookReqDto.pageSize} OFFSET ${(searchBookReqDto.pageNo - 1) * searchBookReqDto.pageSize}
    `;

    const selectQueryResult = await this.mysqlService.executeSingleQuery<BookSqlInterface[]>(query);

    return selectQueryResult[this.ROW_IDX];
  }

  public async count(searchBookReqDto: BookDtos.SearchBookReqDto): Promise<RowDataPacket> {
    const query = `
      SELECT COUNT(*) as totalCount
        FROM password.book as book
      LEFT JOIN password.book_meta as bookMeta 
        ON book.id = bookMeta.book_id
      WHERE ${SqlUtil.makeWhereLikeQuery(searchBookReqDto.makeWhereObj())}
    `;

    const selectQueryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return selectQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  public async findOneByWhere(where: Book.BookWhereInterface): Promise<BookInterface> {
    const query = `SELECT * FROM password.book WHERE ${SqlUtil.makeWhereEqualQuery<Book.BookWhereInterface>(where)}`;
    const selectQueryResult = await this.mysqlService.executeSingleQuery<BookInterface[]>(query);

    return selectQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  public async updateOne(updateBookReqDto: BookDtos.UpdateBookReqDto, param: FindOneByIdReqDto): Promise<ResultSetHeader> {
    const query = `
        UPDATE password.book 
        SET title='${updateBookReqDto.title}',
            price=${updateBookReqDto.price},
            book_report='${updateBookReqDto.bookReport}',
            end_date='${updateBookReqDto.endDate.toISOString().slice(0, 19)}',
            start_date='${updateBookReqDto.startDate.toISOString().slice(0, 19)}'
        WHERE id=${param.id}`;

    const updateQueryResult = await updateBookReqDto.connectionPool.execute<ResultSetHeader>(query);
    return updateQueryResult[this.ROW_IDX];
  }

  public async removeOne(deleteBookReqDto: BookDtos.DeleteBookReqDto): Promise<ResultSetHeader> {
    const query = `DELETE FROM password.book WHERE id=${deleteBookReqDto.id}`;
    const deleteQueryResult = await deleteBookReqDto.connectionPool.execute<ResultSetHeader>(query);

    return deleteQueryResult[this.ROW_IDX];
  }
}
