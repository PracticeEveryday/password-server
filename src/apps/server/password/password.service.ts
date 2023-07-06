import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import { CreatePassworeReqDto } from './dto/api-dto/create-password.req.dto';
import { CreatePasswordResDto } from './dto/api-dto/create-password.res.dto';
import { GetDomainQueryReqDto } from './dto/api-dto/getDomain.req.dto';
import { GetDomainResDto } from './dto/api-dto/getDomain.res.dto';
import { FindOneByIdDto } from './dto/basic-dto/findOneById.dto';
import { InjectionToken } from '../../../libs/mysql/repositories/injectionToken';
import { PasswordRepository } from '../../../libs/mysql/repositories/password.repository';
import { PasswordInterface } from '../../../libs/mysql/types/password.type';
import { PasswordUtilService } from '../../../libs/utils/password-util/password-util.service';
import { ValidateUtilService } from '../../../libs/utils/validate-util/validate-util.service';
import { ConflictException } from '../common/customExceptions/conflict.exception';
import { makeExceptionScript } from '../common/customExceptions/makeExceptionScript';
import { NotFoundException } from '../common/customExceptions/notFound.exception';
import { UnknownException } from '../common/customExceptions/unknown.exception';

@Injectable()
export class PasswordService {
  constructor(
    //service
    private readonly passwordUtilService: PasswordUtilService,
    private readonly validateUtilService: ValidateUtilService,
    //repository
    @Inject(InjectionToken.PASSWORD_REPOSITORY) private readonly passwordRepository: PasswordRepository,
  ) {}

  /**
   * password를 생성하는 서비스
   * @param body CreatePassworeReqDto
   */
  public async create(body: CreatePassworeReqDto): Promise<CreatePasswordResDto> {
    const getDomainQueryReqDto = new GetDomainQueryReqDto(body.domain);
    const password = await this.passwordRepository.findOneByDomain(getDomainQueryReqDto);
    await this.validatePasswordType(password);

    if (password) {
      throw new ConflictException(makeExceptionScript('conflict exist domain', '해당 도메인의 패스워드 정보가 이미 저장되어 있습니다.'));
    }

    body.password = this.passwordUtilService.hashPassword(body.password);
    try {
      const createResult = await this.passwordRepository.create(body);
      if (createResult.affectedRows === 1) {
        const findOneByIdDto = new FindOneByIdDto(createResult.insertId);

        const rowDataPacket = await this.passwordRepository.findOneById(findOneByIdDto);
        const password = await this.validatePasswordType(rowDataPacket);

        return new CreatePasswordResDto(password.domain);
      }
    } catch (error) {
      if (this.validateUtilService.isQeuryErrorInterface(error)) {
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
    const password = await this.passwordRepository.findOneByDomain(param);

    if (!password) {
      throw new NotFoundException({ title: 'not found domain', message: '해당 도메인의 비밀번호 데이터가 없습니다.' });
    }

    return new GetDomainResDto(this.passwordUtilService.decodedPassword(password.password));
  }

  /**
   * sql에서 select해오면 RowDataPacket 타입으로 넘어온다 이 Object가 PasswordInterface 타입인지 확인해주는 메서드
   * 이 함수를 통과하면 PasswordInterface이므로 as 캐스팅을 넣어준다.
   * @param rowDataPacket 비밀번호(RowDataPacket)
   */
  private async validatePasswordType(rowDataPacket: RowDataPacket): Promise<PasswordInterface> {
    if (!this.validateUtilService.isPasswordInterfaceType(rowDataPacket)) {
      throw new BadRequestException(makeExceptionScript('type error', 'password interface 타입이 아닙니다.'));
    }

    return rowDataPacket as PasswordInterface;
  }
}
