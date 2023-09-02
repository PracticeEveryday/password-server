import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { CreatePasswordReqDto, GetDomainParamReqDto, GetPasswordsQueryReqDto } from '@apps/server/modules/password/dto';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto/findOneById.req.dto';
import { PasswordSqlInterface } from '@libs/mysql/interface/password.interface';

export interface PasswordRepositoryInterface {
  //create
  createOne(body: CreatePasswordReqDto): Promise<ResultSetHeader>;

  //get
  findOneById(findOneByIdReqDto: FindOneByIdReqDto): Promise<RowDataPacket>;
  findOneByDomain(getDomainQueryReqDto: GetDomainParamReqDto): Promise<RowDataPacket>;
  findManyWithPagination(queryDto: GetPasswordsQueryReqDto): Promise<RowDataPacket[]>;

  //update
  updateOne(password: PasswordSqlInterface): Promise<ResultSetHeader>;

  // delete
  removeOneByDomain(param: GetDomainParamReqDto): Promise<ResultSetHeader>;

  count(): Promise<RowDataPacket>;
}
