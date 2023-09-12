import { PasswordDomain } from '@apps/server/modules/password/domain/password.domain';
import { CreatePasswordReqDto, GetDomainParamReqDto, GetPasswordsQueryReqDto } from '@apps/server/modules/password/dto';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto/findOneById.req.dto';

export interface PasswordRepositoryInterface {
  //create
  createOne(body: CreatePasswordReqDto): Promise<number>;

  //get
  findOneById(findOneByIdReqDto: FindOneByIdReqDto): Promise<PasswordDomain>;
  findOneByDomain(getDomainQueryReqDto: GetDomainParamReqDto): Promise<PasswordDomain>;
  findManyWithPagination(queryDto: GetPasswordsQueryReqDto): Promise<PasswordDomain[]>;

  //update
  updateOne(password: PasswordDomain): Promise<number>;

  // delete
  removeOne(param: PasswordDomain): Promise<number>;

  count(): Promise<number>;
}
