import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import { CreatePasswordReqDto } from './dto/api-dto/create-password.req.dto';
import { CreatePasswordResDto } from './dto/api-dto/create-password.res.dto';
import { GetDomainBodyReqDto } from './dto/api-dto/getDomain.req.dto';
import { GetDomainResDto } from './dto/api-dto/getDomain.res.dto';
import { GetPasswordsQueryReqDto } from './dto/api-dto/getPasswords.req.dto';
import { FindOneByIdDto } from './dto/basic-dto/findOneById.dto';
import { LogService } from '../../../libs/log/log.service';
import { InjectionToken } from '../../../libs/mysql/repositories/injectionToken';
import { PasswordRepository } from '../../../libs/mysql/repositories/password.repository';
import { PasswordInterface } from '../../../libs/mysql/types/password.type';
import { PasswordUtilService } from '../../../libs/utils/password-util/password-util.service';
import { ValidateUtilService } from '../../../libs/utils/validate-util/validate-util.service';
import { ConflictException } from '../common/customExceptions/conflict.exception';
import { makeExceptionScript } from '../common/customExceptions/makeExceptionScript';
import { NotFoundException } from '../common/customExceptions/notFound.exception';
import { UnknownException } from '../common/customExceptions/unknown.exception';
import { toPagination } from '../common/helper/pagination.helper';

@Injectable()
export class PasswordService {
  constructor(
    //service
    private readonly passwordUtilService: PasswordUtilService,
    private readonly validateUtilService: ValidateUtilService,
    private readonly logService: LogService,
    //repository
    @Inject(InjectionToken.PASSWORD_REPOSITORY) private readonly passwordRepository: PasswordRepository,
  ) {}

  public async findAllWithPagination(getPasswordsReqDto: GetPasswordsQueryReqDto) {
    try {
      const result = await this.passwordRepository.findAllWithPagination(getPasswordsReqDto);
      const pagination = toPagination(result.length, getPasswordsReqDto.pageNo, getPasswordsReqDto.pageSize);
      return { result, pagination };
    } catch (error) {
      throw error;
    }
  }

  /**
   * password를 생성하는 서비스
   * @param body CreatePassworeReqDto
   */
  public async create(body: CreatePasswordReqDto): Promise<CreatePasswordResDto> {
    try {
      const getDomainQueryReqDto = GetDomainBodyReqDto.toDTO(body.domain);
      const password = await this.passwordRepository.findOneByDomain(getDomainQueryReqDto);

      if (password) {
        throw new ConflictException(makeExceptionScript('conflict exist domain', '해당 도메인의 패스워드 정보가 이미 저장되어 있습니다.'));
      }

      body.password = this.passwordUtilService.hashPassword(body.password);

      const createResult = await this.passwordRepository.create(body);
      if (createResult.affectedRows === 1) {
        const findOneByIdDto = FindOneByIdDto.toDTO(createResult.insertId);

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

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new UnknownException({ title: 'UnkwonException', message: 'password create', raw: error });
    }
  }

  /**
   * 도메인에 따른 비밀번호를 조회하는 메서드
   * @param param GetDomainReqDto
   */
  public async findOneByDomain(param: GetDomainBodyReqDto): Promise<GetDomainResDto> {
    try {
      const password = await this.passwordRepository.findOneByDomain(param);

      if (!password) {
        throw new NotFoundException({ title: 'not found domain', message: '해당 도메인의 비밀번호 데이터가 없습니다.' });
      }

      return new GetDomainResDto(this.passwordUtilService.decodedPassword(password.password));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new UnknownException({ title: 'UnkwonException', message: 'password findOneByDomain', raw: error });
    }
  }

  /**
   * sql에서 select해오면 RowDataPacket 타입으로 넘어온다 이 Object가 PasswordInterface 타입인지 확인해주는 메서드
   * 이 함수를 통과하면 PasswordInterface이므로 as 캐스팅을 넣어준다.
   * @param rowDataPacket 비밀번호(RowDataPacket)
   */
  private async validatePasswordType(rowDataPacket: RowDataPacket): Promise<PasswordInterface> {
    try {
      if (!this.validateUtilService.isPasswordInterfaceType(rowDataPacket)) {
        throw new BadRequestException(makeExceptionScript('type error', 'password interface 타입이 아닙니다.'));
      }

      return rowDataPacket as PasswordInterface;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new UnknownException({ title: 'UnkwonException', message: 'password validatePasswordType', raw: error });
    }
  }
}
