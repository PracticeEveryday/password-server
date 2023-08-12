import { Inject, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import ErrorResponse from '@apps/server/common/customExceptions/errorResponse';
import { toPagination } from '@apps/server/common/helper/pagination.helper';
import { GetDomainResDto } from '@apps/server/modules/password/dto/api-dto/getDomain.res.dto';
import { PasswordInterface } from '@apps/server/modules/password/interface/password.interface';
import { PasswordRepository } from '@apps/server/modules/password/repository/password.repository';
import { DeletedResDto } from '@commons/dto/basicApiDto/deleteResult.res.dto';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto/findOneById.req.dto';
import { UpdatedResDto } from '@commons/dto/basicApiDto/updateResult.res.dto';
import { LogService } from '@libs/log/log.service';
import { PasswordSqlInterface } from '@libs/mysql/interface/password.interface';
import { InjectionToken } from '@libs/mysql/repository/injectionToken';
import { PasswordUtilService } from '@libs/util/password/passwordUtil.service';
import { SqlUtilService } from '@libs/util/sql/sqlUtil.service';
import { ValidateUtilService } from '@libs/util/validate/validateUtil.service';

import * as Dtos from './dto';

@Injectable()
export class PasswordService {
  constructor(
    private readonly logService: LogService,
    private readonly sqlUtilService: SqlUtilService,
    private readonly passwordUtilService: PasswordUtilService,
    private readonly validateUtilService: ValidateUtilService,

    @Inject(InjectionToken.PASSWORD_REPOSITORY) private readonly passwordRepository: PasswordRepository,
  ) {}

  /**
   * 비밀번호 삭제 By id
   * @param param FindOneByIdDto
   */
  public async removeOneByDomain(param: Dtos.GetDomainParamReqDto): Promise<DeletedResDto> {
    const password = await this.passwordRepository.findOneByDomain(param);
    this.validateUtilService.isStrictNotEmptyWithErrorResponse(password, ErrorResponse.PASSWORD.NOT_FOUND_DOMAIN);

    const deleteResult = await this.passwordRepository.removeOneByDomain(param);
    return deleteResult.affectedRows === 1 ? new DeletedResDto(true) : new DeletedResDto(false);
  }

  /**
   * 비밀번호 조회 By 페이지네이션
   * @param getPasswordsReqDto pagination을 상속 받은 dto
   */
  public async findManyWithPagination(getPasswordsReqDto: Dtos.GetPasswordsQueryReqDto): Promise<Dtos.GetPasswordsResDto> {
    const selectQueryResultArr = await this.passwordRepository.findManyWithPagination(getPasswordsReqDto);
    this.validateUtilService.isStrictNotEmptyWithErrorResponse(selectQueryResultArr, ErrorResponse.PASSWORD.NOT_FOUND_PASSWORD);

    const passwords = selectQueryResultArr.map((selectQueryResult: RowDataPacket) => {
      const password = this.sqlUtilService.checkTypeAndConvert<PasswordSqlInterface, PasswordInterface>(selectQueryResult, 'domain');

      return new Dtos.PasswordResDto(password);
    });

    const { totalCount } = await this.passwordRepository.count();

    const pagination = toPagination(totalCount, getPasswordsReqDto.pageNo, getPasswordsReqDto.pageSize);
    return new Dtos.GetPasswordsResDto(passwords, pagination);
  }

  /**
   * 비밀번호 생성
   * @param body CreatePassworeReqDto
   */
  public async createOne(body: Dtos.CreatePasswordReqDto): Promise<Dtos.CreatePasswordResDto> {
    const getDomainQueryReqDto = Dtos.GetDomainParamReqDto.toDTO(body.domain);
    const selectQueryResult = await this.passwordRepository.findOneByDomain(getDomainQueryReqDto);

    this.validateUtilService.isStrictEmptyWithErrorResponse(selectQueryResult, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST);

    body.password = this.passwordUtilService.hashPassword(body.password);

    const createResult = await this.passwordRepository.createOne(body);
    if (createResult.affectedRows === 1) {
      const findOneByIdReqDto = FindOneByIdReqDto.toDTO(createResult.insertId);

      const rowDataPacket = await this.passwordRepository.findOneById(findOneByIdReqDto);
      const password = this.sqlUtilService.checkTypeAndConvert<PasswordSqlInterface, PasswordInterface>(rowDataPacket, 'domain');

      return new Dtos.CreatePasswordResDto(password.domain);
    }
  }

  /**
   * 비밀번호 수정
   * @param body UpdatePasswordReqDto
   */
  public async updateOne(body: Dtos.UpdatePasswordReqDto): Promise<UpdatedResDto> {
    const findOnByDomain = Dtos.GetDomainParamReqDto.toDTO(body.domain);
    const selectResult = await this.passwordRepository.findOneByDomain(findOnByDomain);
    this.validateUtilService.isStrictNotEmptyWithErrorResponse(selectResult, ErrorResponse.PASSWORD.NOT_FOUND_DOMAIN);

    let password = await this.sqlUtilService.checkTypeAndConvert<PasswordSqlInterface, PasswordInterface>(selectResult, 'domain');
    password = body.compareValue(password);
    password.password = this.passwordUtilService.hashPassword(password.password);

    const updatedResult = await this.passwordRepository.updateOne(password);

    return updatedResult.affectedRows === 1 ? new UpdatedResDto(true) : new UpdatedResDto(false);
  }

  /**
   * 비밀번호 조회 By 도메인
   * @param param GetDomainReqDto
   */
  public async findOneByDomain(param: Dtos.GetDomainParamReqDto): Promise<GetDomainResDto> {
    const selectQueryResult = await this.passwordRepository.findOneByDomain(param);
    this.validateUtilService.isStrictNotEmptyWithErrorResponse(selectQueryResult, ErrorResponse.PASSWORD.NOT_FOUND_DOMAIN);

    return new GetDomainResDto(this.passwordUtilService.decodedPassword(selectQueryResult.password));
  }
}
