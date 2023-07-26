import { Inject } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';

import { MysqlService } from '../../../../libs/mysql/mysql.service';
import { CustomUnknownException } from '../../common/customExceptions/exception/unknown.exception';
import { FindOneByIdReqDto } from '../../common/dto/findOneById.req.dto';
import { CreateBookReqDto } from '../dto/api-dto/createBook.req.dto';
import { DeleteBookReqDto } from '../dto/api-dto/deleteBook.req.dto';
import { UpdateBookReqDto } from '../dto/api-dto/updateBook.req.dto';

export class BookMetaRepository {
  private ROW_IDX = 0 as const;
  private FILED_IDX = 1 as const;

  constructor(@Inject(MysqlService) private readonly mysqlService: MysqlService) {}

  public async create(createBookReqDto: CreateBookReqDto): Promise<ResultSetHeader> {
    try {
      const query = `INSERT INTO password.book_metas (book_id, author, publisher, page_count, createdAt, updatedAt, deletedAt)
                     VALUES (${createBookReqDto.bookId}, '${createBookReqDto.author}', '${createBookReqDto.publisher}',
                             ${createBookReqDto.pageCount}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)`;
      const createQueryResult = await createBookReqDto.connectionPool.execute<ResultSetHeader>(query);

      return createQueryResult[this.ROW_IDX];
    } catch (error) {
      throw new CustomUnknownException({ title: 'UnknownException', message: 'bookMeta repo create', raw: error });
    }
  }

  public async update(updateBookReqDto: UpdateBookReqDto, param: FindOneByIdReqDto): Promise<ResultSetHeader> {
    const query = `
      UPDATE password.book_metas
      SET author='${updateBookReqDto.author}',
          publisher='${updateBookReqDto.publisher}',
          page_count='${updateBookReqDto.pageCount}'
      WHERE book_id=${param.id}`;

    const updateQueryResult = await updateBookReqDto.connectionPool.execute<ResultSetHeader>(query);
    return updateQueryResult[this.ROW_IDX];
  }

  public async deleteOne(deleteBookReqDto: DeleteBookReqDto): Promise<ResultSetHeader> {
    const query = `DELETE FROM password.book_metas WHERE book_id=${deleteBookReqDto.id}`;

    const deleteQueryResult = await deleteBookReqDto.connectionPool.execute<ResultSetHeader>(query);

    return deleteQueryResult[this.ROW_IDX];
  }
}
