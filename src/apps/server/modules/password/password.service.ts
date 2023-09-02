import { Inject, Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import ErrorResponse from '@apps/server/common/customExceptions/errorResponse';
import { toPagination } from '@apps/server/common/helper/pagination.helper';
import { GetDomainResDto } from '@apps/server/modules/password/dto/api-dto/getDomain.res.dto';
import { PasswordInterface } from '@apps/server/modules/password/interface/password.interface';
import { PasswordRepositoryInterface } from '@apps/server/modules/password/interface/PasswordRepository.interface';
import { DeletedResDto } from '@commons/dto/basicApiDto/deleteResult.res.dto';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto/findOneById.req.dto';
import { UpdatedResDto } from '@commons/dto/basicApiDto/updateResult.res.dto';
import { EnvService } from '@libs/env/env.service';
import { EnvEnum } from '@libs/env/envEnum';
import { LogService } from '@libs/log/log.service';
import { PasswordSqlInterface } from '@libs/mysql/interface/password.interface';
import { InjectionToken } from '@libs/mysql/repository/injectionToken';
import { PasswordUtil } from '@libs/util/password.util';
import { SqlUtil } from '@libs/util/sql.util';
import { ValidateUtil } from '@libs/util/validate.util';

import * as Dtos from './dto';

@Injectable()
export class PasswordService {
  private readonly PASSWORD_KEY: string;

  constructor(
    private readonly logService: LogService,
    private readonly envService: EnvService,

    @Inject(InjectionToken.PASSWORD_REPOSITORY) private readonly passwordRepository: PasswordRepositoryInterface,
  ) {
    this.PASSWORD_KEY = envService.get(EnvEnum.PASSWORD_KEY);
  }

  /**
   * 비밀번호 삭제 By id
   * @param param FindOneByIdDto
   */
  public async removeOneByDomain(param: Dtos.GetDomainParamReqDto): Promise<DeletedResDto> {
    const password = await this.passwordRepository.findOneByDomain(param);
    ValidateUtil.isStrictNotEmptyWithErrorResponse(password, ErrorResponse.PASSWORD.NOT_FOUND_DOMAIN);

    const deleteResult = await this.passwordRepository.removeOneByDomain(param);
    return deleteResult.affectedRows === 1 ? new DeletedResDto(true) : new DeletedResDto(false);
  }

  /**
   * 비밀번호 조회 By 페이지네이션
   * @param getPasswordsReqDto pagination을 상속 받은 dto
   */
  public async findManyWithPagination(getPasswordsReqDto: Dtos.GetPasswordsQueryReqDto): Promise<Dtos.GetPasswordsResDto> {
    const selectQueryResultArr = await this.passwordRepository.findManyWithPagination(getPasswordsReqDto);
    ValidateUtil.isStrictNotEmptyWithErrorResponse(selectQueryResultArr, ErrorResponse.PASSWORD.NOT_FOUND_PASSWORD);

    const passwords = selectQueryResultArr.map((selectQueryResult: RowDataPacket) => {
      const password = SqlUtil.checkTypeAndConvert<PasswordSqlInterface, PasswordInterface>(selectQueryResult, 'domain');

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

    ValidateUtil.isStrictEmptyWithErrorResponse(selectQueryResult, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST);

    body.password = PasswordUtil.hashPassword(body.password, this.PASSWORD_KEY);

    const createResult = await this.passwordRepository.createOne(body);

    if (createResult.affectedRows === 1) {
      const findOneByIdReqDto = FindOneByIdReqDto.toDTO(createResult.insertId);

      const rowDataPacket = await this.passwordRepository.findOneById(findOneByIdReqDto);
      const password = SqlUtil.checkTypeAndConvert<PasswordSqlInterface, PasswordInterface>(rowDataPacket, 'domain');

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
    ValidateUtil.isStrictNotEmptyWithErrorResponse(selectResult, ErrorResponse.PASSWORD.NOT_FOUND_DOMAIN);

    let password = await SqlUtil.checkTypeAndConvert<PasswordSqlInterface, PasswordInterface>(selectResult, 'domain');
    password = body.compareValue(password);
    password.password = PasswordUtil.hashPassword(password.password, this.PASSWORD_KEY);

    const updatedResult = await this.passwordRepository.updateOne(password);

    return updatedResult.affectedRows === 1 ? new UpdatedResDto(true) : new UpdatedResDto(false);
  }

  /**
   * 비밀번호 조회 By 도메인
   * @param param GetDomainReqDto
   */
  public async findOneByDomain(param: Dtos.GetDomainParamReqDto): Promise<GetDomainResDto> {
    const selectQueryResult = await this.passwordRepository.findOneByDomain(param);
    ValidateUtil.isStrictNotEmptyWithErrorResponse(selectQueryResult, ErrorResponse.PASSWORD.NOT_FOUND_DOMAIN);

    return new GetDomainResDto(PasswordUtil.decodedPassword(selectQueryResult.password, this.PASSWORD_KEY));
  }
}
