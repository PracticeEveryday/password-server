import { InjectRepository } from '@nestjs/typeorm';
import { ResultSetHeader } from 'mysql2';
import { Repository } from 'typeorm';

import { CreatePasswordReqDto, GetDomainParamReqDto, GetPasswordsQueryReqDto } from '@apps/server/modules/password/dto';
import { PasswordInterface } from '@apps/server/modules/password/interface/password.interface';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto';
import { PasswordEntity } from '@libs/typeorm/entity/password.entity';

export class PasswordRepository {
  constructor(
    @InjectRepository(PasswordEntity)
    private userRepository: Repository<PasswordEntity>,
  ) {}

  public async count(): Promise<number> {
    return await this.userRepository.count();
  }

  public async createOne(body: CreatePasswordReqDto): Promise<PasswordEntity> {
    const password = new PasswordEntity();
    password.password = body.password;
    password.domain = body.domain;

    return this.userRepository.save(password);
  }

  findManyWithPagination(queryDto: GetPasswordsQueryReqDto): Promise<PasswordInterface[]> {
    return Promise.resolve([]);
  }

  findOneByDomain(getDomainQueryReqDto: GetDomainParamReqDto): Promise<PasswordInterface> {
    return Promise.resolve(undefined);
  }

  findOneById(findOneByIdReqDto: FindOneByIdReqDto): Promise<PasswordInterface> {
    return Promise.resolve(undefined);
  }

  removeOne(param: PasswordInterface): Promise<ResultSetHeader> {
    return Promise.resolve(undefined);
  }

  updateOne(password: PasswordInterface): Promise<ResultSetHeader> {
    return Promise.resolve(undefined);
  }
}
