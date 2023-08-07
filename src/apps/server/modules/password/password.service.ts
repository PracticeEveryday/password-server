import { Inject, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import { CustomBadRequestException } from '@apps/server/common/customExceptions/exception/badRequest.exception';
import { CustomConflictException } from '@apps/server/common/customExceptions/exception/conflict.exception';
import { CustomNotFoundException } from '@apps/server/common/customExceptions/exception/notFound.exception';
import { makeExceptionScript } from '@apps/server/common/customExceptions/makeExceptionScript';
import { DeletedResDto } from '@apps/server/common/dto/basic-api-dto/deleteResult.res.dto';
import { FindOneByIdReqDto } from '@apps/server/common/dto/basic-api-dto/findOneById.req.dto';
import { UpdatedResDto } from '@apps/server/common/dto/basic-api-dto/updateResult.res.dto';
import { toPagination } from '@apps/server/common/helper/pagination.helper';
import { CreatePasswordReqDto } from '@apps/server/modules/password/dto/api-dto/createPassword.req.dto';
import { CreatePasswordResDto } from '@apps/server/modules/password/dto/api-dto/createPassword.res.dto';
import { GetDomainParamReqDto } from '@apps/server/modules/password/dto/api-dto/getDomain.req.dto';
import { GetDomainResDto } from '@apps/server/modules/password/dto/api-dto/getDomain.res.dto';
import { GetPasswordsQueryReqDto } from '@apps/server/modules/password/dto/api-dto/getPasswords.req.dto';
import { GetPasswordsResDto, PasswordResDto } from '@apps/server/modules/password/dto/api-dto/getPasswords.res.dto';
import { UpdatePasswordReqDto } from '@apps/server/modules/password/dto/api-dto/updatePassword.req.dto';
import { PasswordRepository } from '@apps/server/modules/password/repository/password.repository';
import { LogService } from '@libs/log/log.service';
import { InjectionToken } from '@libs/mysql/repository/injectionToken';
import { PasswordInterface } from '@libs/mysql/type/password.type';
import { PasswordUtilService } from '@libs/util/password/passwordUtil.service';
import { ValidateUtilService } from '@libs/util/validate/validateUtil.service';

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
   * 비밀번호 조회 By id
   * @param param FindOneByIdDto
   */
  public async removeOneByDomain(param: GetDomainParamReqDto): Promise<DeletedResDto> {
    const password = await this.passwordRepository.findOneByDomain(param);
    if (!password) {
      throw new CustomNotFoundException({ title: 'not found domain', message: '해당 도메인의 비밀번호 데이터가 없습니다.' });
    }

    const deleteResult = await this.passwordRepository.removeOneByDomain(param);
    return deleteResult.affectedRows === 1 ? new DeletedResDto(true) : new DeletedResDto(false);
  }

  /**
   * 비밀번호 조회 By 페이지네이션
   * @param getPasswordsReqDto pagination을 상속 받은 dto
   */
  public async findManyWithPagination(getPasswordsReqDto: GetPasswordsQueryReqDto): Promise<GetPasswordsResDto> {
    const selectQueryResultArr = await this.passwordRepository.findManyWithPagination(getPasswordsReqDto);
    if (selectQueryResultArr.length === 0) {
      throw new CustomNotFoundException(makeExceptionScript('not found password', 'password가 없습니다.'));
    }

    const passwords = selectQueryResultArr.map((selectQueryResult: RowDataPacket) => {
      if (!this.validateUtilService.isPasswordInterfaceType(selectQueryResult)) {
        throw new CustomBadRequestException(makeExceptionScript('type error', 'password 타입이 아닙니다.'));
      }
      return new PasswordResDto(selectQueryResult);
    });

    const { totalCount } = await this.passwordRepository.count();

    const pagination = toPagination(totalCount, getPasswordsReqDto.pageNo, getPasswordsReqDto.pageSize);
    return new GetPasswordsResDto(passwords, pagination);
  }

  /**
   * 비밀번호 생성
   * @param body CreatePassworeReqDto
   */
  public async createOne(body: CreatePasswordReqDto): Promise<CreatePasswordResDto> {
    const getDomainQueryReqDto = GetDomainParamReqDto.toDTO(body.domain);
    const selectQueryResult = await this.passwordRepository.findOneByDomain(getDomainQueryReqDto);

    if (selectQueryResult) {
      throw new CustomConflictException(
        makeExceptionScript('conflict exist domain', '해당 도메인의 패스워드 정보가 이미 저장되어 있습니다.'),
      );
    }

    body.password = this.passwordUtilService.hashPassword(body.password);

    const createResult = await this.passwordRepository.createOne(body);
    if (createResult.affectedRows === 1) {
      const findOneByIdReqDto = FindOneByIdReqDto.toDTO(createResult.insertId);

      const rowDataPacket = await this.passwordRepository.findOneById(findOneByIdReqDto);
      const password = await this.validatePasswordType(rowDataPacket);

      return new CreatePasswordResDto(password.domain);
    }
  }

  /**
   * 비밀번호 수정
   * @param body UpdatePasswordReqDto
   */
  public async updateOne(body: UpdatePasswordReqDto): Promise<UpdatedResDto> {
    const findOnByDomain = GetDomainParamReqDto.toDTO(body.domain);
    const selectResult = await this.passwordRepository.findOneByDomain(findOnByDomain);

    if (!selectResult) {
      throw new CustomNotFoundException({ title: 'not found domain', message: '해당 도메인의 비밀번호 데이터가 없습니다.' });
    }
    let password = await this.validatePasswordType(selectResult);
    password = body.compareValue(password);
    password.password = this.passwordUtilService.hashPassword(password.password);

    const updatedResult = await this.passwordRepository.updateOne(password);

    return updatedResult.affectedRows === 1 ? new UpdatedResDto(true) : new UpdatedResDto(false);
  }

  /**
   * 비밀번호 조회 By 도메인
   * @param param GetDomainReqDto
   */
  public async findOneByDomain(param: GetDomainParamReqDto): Promise<GetDomainResDto> {
    const selectQueryResult = await this.passwordRepository.findOneByDomain(param);

    if (!selectQueryResult) {
      throw new CustomNotFoundException({ title: 'not found domain', message: '해당 도메인의 비밀번호 데이터가 없습니다.' });
    }

    if (!this.validateUtilService.isPasswordInterfaceType(selectQueryResult)) {
      throw new CustomBadRequestException(makeExceptionScript('type error', 'password 타입이 아닙니다.'));
    }

    return new GetDomainResDto(this.passwordUtilService.decodedPassword(selectQueryResult.password));
  }

  /**
   * sql에서 select해오면 RowDataPacket 타입으로 넘어온다 이 Object가 PasswordInterface 타입인지 확인해주는 메서드
   * 이 함수를 통과하면 PasswordInterface이므로 as 캐스팅을 넣어준다.
   * @param rowDataPacket 비밀번호(RowDataPacket)
   */
  private async validatePasswordType(rowDataPacket: RowDataPacket): Promise<PasswordInterface> {
    if (!this.validateUtilService.isPasswordInterfaceType(rowDataPacket)) {
      throw new CustomBadRequestException(makeExceptionScript('type error', 'password interface 타입이 아닙니다.'));
    }

    return rowDataPacket as PasswordInterface;
  }
}
