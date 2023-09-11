import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePasswordReqDto, GetDomainParamReqDto, GetPasswordsQueryReqDto } from '@apps/server/modules/password/dto';
import { PasswordInterface } from '@apps/server/modules/password/interface/password.interface';
import { PasswordRepositoryInterface } from '@apps/server/modules/password/interface/PasswordRepository.interface';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto';
import { PasswordEntity } from '@libs/adapter/db/typeorm/entity/password.entity';

export class PasswordTypeOrmRepository implements PasswordRepositoryInterface<PasswordEntity> {
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

  findManyWithPagination(_queryDto: GetPasswordsQueryReqDto): Promise<PasswordInterface[]> {
    return Promise.resolve([]);
  }

  findOneByDomain(_getDomainQueryReqDto: GetDomainParamReqDto): Promise<PasswordInterface> {
    return Promise.resolve(undefined);
  }

  findOneById(_findOneByIdReqDto: FindOneByIdReqDto): Promise<PasswordInterface> {
    return Promise.resolve(undefined);
  }

  removeOne(_param: PasswordInterface): Promise<PasswordEntity> {
    return Promise.resolve(undefined);
  }

  updateOne(_password: PasswordInterface): Promise<PasswordEntity> {
    return Promise.resolve(undefined);
  }
}
