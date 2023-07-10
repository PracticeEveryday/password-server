import { Inject, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import { CreatePasswordReqDto } from './dto/api-dto/create-password.req.dto';
import { CreatePasswordResDto } from './dto/api-dto/create-password.res.dto';
import { GetDomainParamReqDto } from './dto/api-dto/getDomain.req.dto';
import { GetDomainResDto } from './dto/api-dto/getDomain.res.dto';
import { GetPasswordsQueryReqDto } from './dto/api-dto/getPasswords.req.dto';
import { GetPasswordsResDto, PasswordResDto } from './dto/api-dto/getPasswords.res.dto';
import { FindOneByIdDto } from './dto/basic-dto/findOneById.dto';
import { PasswordRepository } from './repository/password.repository';
import { LogService } from '../../../libs/log/log.service';
import { InjectionToken } from '../../../libs/mysql/repositories/injectionToken';
import { PasswordInterface } from '../../../libs/mysql/types/password.type';
import { PasswordUtilService } from '../../../libs/utils/password-util/password-util.service';
import { ValidateUtilService } from '../../../libs/utils/validate-util/validate-util.service';
import { CustomBadRequestException } from '../common/customExceptions/exception/badRequest.exception';
import { BaseException } from '../common/customExceptions/exception/base.exception';
import { CustomConflictException } from '../common/customExceptions/exception/conflict.exception';
import { CustomNotFoundException } from '../common/customExceptions/exception/notFound.exception';
import { CustomUnknownException } from '../common/customExceptions/exception/unknown.exception';
import { makeExceptionScript } from '../common/customExceptions/makeExceptionScript';
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

  /**
   * password의 해당 id를 삭제하는 메서드입니다. 없을 경우 404, 삭제가 제대로 되지 않은 경우 400 에러를 뱉어냅니다.
   * @param param FindOneByIdDto
   */
  public async deleteOneByDomain(param: GetDomainParamReqDto) {
    try {
      const password = await this.passwordRepository.findOneByDomain(param);
      if (!password) {
        throw new CustomNotFoundException({ title: 'not found domain', message: '해당 도메인의 비밀번호 데이터가 없습니다.' });
      }

      const deleteResult = await this.passwordRepository.deleteOneByDomain(param);
      if (deleteResult.affectedRows === 1) {
        return '정상적으로 삭제되었습니다.';
      }
      throw new CustomBadRequestException(makeExceptionScript('BadRequestException', '삭제하는 데 문제가 있습니다.'));
    } catch (error) {
      if (error instanceof BaseException) throw error;

      throw new CustomUnknownException({ title: 'UnknownException', message: 'password deleteOne', raw: error });
    }
  }

  /**
   * 페이지네이션을 통해 password를 가져온다.
   * @param getPasswordsReqDto pagination을 상속 받은 dto
   */
  public async findAllWithPagination(getPasswordsReqDto: GetPasswordsQueryReqDto): Promise<GetPasswordsResDto> {
    try {
      const result = await this.passwordRepository.findAllWithPagination(getPasswordsReqDto);
      const passwords = result.map((password: RowDataPacket) => {
        if (!this.validateUtilService.isPasswordInterfaceType(password)) {
          throw new CustomBadRequestException(makeExceptionScript('type error', 'password 타입이 아닙니다.'));
        }
        return new PasswordResDto(password);
      });
      const { totalCount } = await this.passwordRepository.count();

      const pagination = toPagination(totalCount, getPasswordsReqDto.pageNo, getPasswordsReqDto.pageSize);
      return new GetPasswordsResDto(passwords, pagination);
    } catch (error) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new CustomUnknownException({ title: 'UnknownException', message: 'password findAllWithPagination', raw: error });
    }
  }

  /**
   * password를 생성하는 서비스
   * @param body CreatePassworeReqDto
   */
  public async create(body: CreatePasswordReqDto): Promise<CreatePasswordResDto> {
    try {
      const getDomainQueryReqDto = GetDomainParamReqDto.toDTO(body.domain);
      const password = await this.passwordRepository.findOneByDomain(getDomainQueryReqDto);

      if (password) {
        throw new CustomConflictException(
          makeExceptionScript('conflict exist domain', '해당 도메인의 패스워드 정보가 이미 저장되어 있습니다.'),
        );
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
        throw new CustomConflictException({
          title: 'type error',
          message: error.sqlState,
          raw: error,
        });
      }

      if (error instanceof BaseException) {
        throw error;
      }

      throw new CustomUnknownException({ title: 'UnknownException', message: 'password create', raw: error });
    }
  }

  /**
   * 도메인에 따른 비밀번호를 조회하는 메서드
   * @param param GetDomainReqDto
   */
  public async findOneByDomain(param: GetDomainParamReqDto): Promise<GetDomainResDto> {
    try {
      const password = await this.passwordRepository.findOneByDomain(param);

      if (!password) {
        throw new CustomNotFoundException({ title: 'not found domain', message: '해당 도메인의 비밀번호 데이터가 없습니다.' });
      }

      return new GetDomainResDto(this.passwordUtilService.decodedPassword(password.password));
    } catch (error) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new CustomUnknownException({ title: 'UnknownException', message: 'password findOneByDomain', raw: error });
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
        throw new CustomBadRequestException(makeExceptionScript('type error', 'password interface 타입이 아닙니다.'));
      }

      return rowDataPacket as PasswordInterface;
    } catch (error) {
      if (error instanceof BaseException) {
        throw error;
      }
      throw new CustomUnknownException({ title: 'UnknownException', message: 'password validatePasswordType', raw: error });
    }
  }
}
