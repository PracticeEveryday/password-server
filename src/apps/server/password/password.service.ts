import { Inject, Injectable } from '@nestjs/common';
import { CreatePassworeReqDto } from './dto/create-password.req.dto';
import { ConflictException } from '../common/customExceptions/conflict.exception';
import { conflictScript } from '../common/customExceptions/exceptionScript';
import { PasswordUtilService } from '../../../libs/utils/password-util/password-util.service';
import { CreatePasswordResDto } from './dto/create-password.res.dto';
import { GetDomainQueryReqDto } from './dto/getDomain.req.dto';
import { NotFoundException } from '../common/customExceptions/notFound.exception';
import { GetDomainResDto } from './dto/getDomain.res.dto';
import { PasswordRepository } from '../../../libs/mysql/repositories/password.repository';
import { InjectionToken } from '../../../libs/mysql/repositories/injectionToken';
import { QueryError } from 'mysql2';
import { UnknownException } from '../common/customExceptions/unknown.exception';

@Injectable()
export class PasswordService {
  constructor(
    //service
    private readonly passwordUtilService: PasswordUtilService,
    //repository
    @Inject(InjectionToken.PASSWORD_REPOSIROTY) private readonly passwordRepository: PasswordRepository,
  ) {}

  /**
   * password를 생성하는 서비스
   * @param body CreatePassworeReqDto
   */
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
      if (this.isQeuryErrorInterface(error)) {
        throw new ConflictException({
          title: 'type error',
          message: error.sqlState,
          raw: error,
        });
      }
      throw new UnknownException({ title: 'sql error', message: 'password.service.ts line 47', raw: error });
    }
  }

  /**
   * 도메인에 따른 비밀번호를 조회하는 메서드
   * @param param GetDomainReqDto
   */
  public async getPasswordByDomain(param: GetDomainQueryReqDto): Promise<GetDomainResDto> {
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
