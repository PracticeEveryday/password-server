import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { CreateBookReqDto } from '@apps/server/modules/book/dto/api-dto/createBook.req.dto';
import { DeleteBookReqDto } from '@apps/server/modules/book/dto/api-dto/deleteBook.req.dto';
import { SearchBookReqDto } from '@apps/server/modules/book/dto/api-dto/searchBook.req.dto';
import { UpdateBookReqDto } from '@apps/server/modules/book/dto/api-dto/updateBook.req.dto';
import * as Book from '@apps/server/modules/book/interface/book.interface';
import { BookInterface } from '@apps/server/modules/book/interface/book.interface';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto/findOneById.req.dto';
import { BookSqlInterface } from '@libs/adapter/db/mysql/interface/book.interface';

export interface BookRepositoryInterface {
  // post
  createOne(createBookReqDto: CreateBookReqDto): Promise<ResultSetHeader>;

  //get
  findOneByWhere(where: Book.BookWhereInterface): Promise<BookInterface>;
  findOneById(findOneByIdReqDto: FindOneByIdReqDto): Promise<BookSqlInterface>;
  findManyByQueryWithPagination(searchBookReqDto: SearchBookReqDto): Promise<BookSqlInterface[]>;
  // update

  updateOne(updateBookReqDto: UpdateBookReqDto, param: FindOneByIdReqDto): Promise<ResultSetHeader>;
  //delete

  removeOne(deleteBookReqDto: DeleteBookReqDto): Promise<ResultSetHeader>;

  count(searchBookReqDto: SearchBookReqDto): Promise<RowDataPacket>;
}
