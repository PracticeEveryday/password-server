import { Inject, Injectable } from '@nestjs/common';
import { CreatePassworeReqDto } from './dto/create-password.req.dto';
import { MysqlService } from '../../../libs/mysql/mysql.service';
import { ConflictException } from '../common/customExceptions/conflict.exception';
import { conflictScript } from '../common/customExceptions/exceptionScript';
import { PasswordUtilService } from '../../../libs/utils/password-util/password-util.service';
import { CreatePasswordResDto } from './dto/create-password.res.dto';
import { GetDomainReqDto } from './dto/getDomain.req.dto';
import { NotFoundException } from '../common/customExceptions/notFound.exception';
import { GetDomainResDto } from './dto/getDomain.res.dto';
import { PasswordRepository } from '../../../libs/mysql/repositories/password.repository';
import { InjectionToken } from '../../../libs/mysql/repositories/injectionToken';
import { QueryError } from 'mysql2';

@Injectable()
export class PasswordService {
  constructor(
    private readonly mysqlService: MysqlService,
    private readonly passwordUtilService: PasswordUtilService,
    @Inject(InjectionToken.PASSWORD_REPOSIROTY) private readonly passwordRepository: PasswordRepository,
  ) {}

  public async create(body: CreatePassworeReqDto): Promise<CreatePasswordResDto> {
    const password = await this.passwordRepository.findOneByDomain(body.domain);
    if (password) {
      throw new ConflictException(conflictScript('conflict exist domain', '해당 도메인의 패스워드 정보가 이미 저장되어 있습니다.'));
    }

    body.password = this.passwordUtilService.hashPassword(body.password);
    try {
      const createResult = await this.passwordRepository.create(body);
      if (createResult.affectedRows === 1) {
        const password = await this.passwordRepository.findOneById(createResult.insertId);

        return new CreatePasswordResDto(password.domain);
      }
    } catch (error) {
      console.log(error);
      if (this.isQeuryErrorInterface(error)) {
        console.log(1);
        throw new ConflictException({
          title: 'type error',
          message: error.sqlState,
          raw: error,
        });
      }
    }
  }

  public async getPasswordByDomain(param: GetDomainReqDto): Promise<GetDomainResDto> {
    const password = await this.passwordRepository.findOneByDomain(param.domain);
    if (!password) {
      throw new NotFoundException({ title: 'not found domain', message: '해당 도메인의 비밀번호 데이터가 없습니다.' });
    }

    return new GetDomainResDto(this.passwordUtilService.decodedPassword(password.password));
  }

  private isQeuryErrorInterface = (args: unknown): args is QueryError => {
    if (typeof args !== 'object' || args === null) {
      return false;
    }

    const { code, sqlState, errno } = args as QueryError;

    return typeof code === 'string' && typeof sqlState === 'string' && typeof errno === 'number';
  };
}
