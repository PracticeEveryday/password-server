import { ResultSetHeader } from 'mysql2';

import { CreateBookReqDto } from '@apps/server/modules/book/dto/api-dto/createBook.req.dto';
import { DeleteBookReqDto } from '@apps/server/modules/book/dto/api-dto/deleteBook.req.dto';
import { UpdateBookReqDto } from '@apps/server/modules/book/dto/api-dto/updateBook.req.dto';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto/findOneById.req.dto';

export interface BookMetaRepositoryInterface {
  // create
  createOne(createBookReqDto: CreateBookReqDto): Promise<ResultSetHeader>;

  // update
  updateOne(updateBookReqDto: UpdateBookReqDto, param: FindOneByIdReqDto): Promise<ResultSetHeader>;

  // delete
  removeOne(deleteBookReqDto: DeleteBookReqDto): Promise<ResultSetHeader>;
}
