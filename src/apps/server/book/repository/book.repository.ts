import { ResultSetHeader } from 'mysql2';

import { MysqlService } from '../../../../libs/mysql/mysql.service';
import { CustomUnknownException } from '../../common/customExceptions/exception/unknown.exception';
import { CreateBookReqDto } from '../dto/api-dto/createBook.req.dto';

export class BookRepository {
  private ROW_IDX = 0 as const;
  private FILED_IDX = 1 as const;
  constructor(private readonly mysqlService: MysqlService) {}

  public async create(createBookReqDto: CreateBookReqDto): Promise<ResultSetHeader> {
    try {
      const query = `INSERT INTO password.books (title, price, book_report, start_date, end_date, createdAt, updatedAt, deletedAt) VALUES ('${createBookReqDto.title}', ${createBookReqDto.price}, null, CURRENT_TIMESTAMP, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null )`;
      const createQueryResult = await createBookReqDto.connectionPool.execute<ResultSetHeader>(query);

      return createQueryResult[this.ROW_IDX];
    } catch (error) {
      throw new CustomUnknownException({ title: 'UnknownException', message: 'book repo create', raw: error });
    }
  }
}
