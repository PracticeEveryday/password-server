import { RowDataPacket } from 'mysql2';

import { CreatePasswordReqDto, GetDomainParamReqDto, GetPasswordsQueryReqDto } from '@apps/server/modules/password/dto';
import { PasswordInterface } from '@apps/server/modules/password/interface/password.interface';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto/findOneById.req.dto';

export interface PasswordRepositoryInterface<T> {
  //create
  createOne(body: CreatePasswordReqDto): Promise<T>;

  //get
  findOneById(findOneByIdReqDto: FindOneByIdReqDto): Promise<PasswordInterface>;
  findOneByDomain(getDomainQueryReqDto: GetDomainParamReqDto): Promise<PasswordInterface>;
  findManyWithPagination(queryDto: GetPasswordsQueryReqDto): Promise<PasswordInterface[]>;

  //update
  updateOne(password: PasswordInterface): Promise<T>;

  // delete
  removeOne(param: PasswordInterface): Promise<T>;

  count(): Promise<RowDataPacket>;
}
