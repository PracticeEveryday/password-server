import { PasswordDomain } from '@apps/server/modules/password/domain/password.domain';
import { CreatePasswordReqDto, GetDomainParamReqDto, GetPasswordsQueryReqDto } from '@apps/server/modules/password/dto';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto/findOneById.req.dto';

export interface PasswordRepositoryInterface<T> {
  //create
  createOne(body: CreatePasswordReqDto): Promise<T>;

  //get
  findOneById(findOneByIdReqDto: FindOneByIdReqDto): Promise<PasswordDomain>;
  findOneByDomain(getDomainQueryReqDto: GetDomainParamReqDto): Promise<PasswordDomain>;
  findManyWithPagination(queryDto: GetPasswordsQueryReqDto): Promise<PasswordDomain[]>;

  //update
  updateOne(password: PasswordDomain): Promise<T>;

  // delete
  removeOne(param: PasswordDomain): Promise<T>;

  count(): Promise<number>;
}
