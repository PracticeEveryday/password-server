import { Inject, Injectable } from '@nestjs/common';

import { toPagination } from '@apps/server/common/helper/pagination.helper';
import { GetDomainResDto } from '@apps/server/modules/password/dto/api-dto/getDomain.res.dto';
import { PasswordServiceHelper } from '@apps/server/modules/password/helper/passwordService.helper';
import { PasswordRepositoryInterface } from '@apps/server/modules/password/interface/PasswordRepository.interface';
import ErrorResponse from '@commons/exception/errorResponse';
import { ConflictException } from '@commons/exception/exception';
import { UpdatedResDto, DeletedResDto } from '@commons/type/dto/basicApiDto';
import { CreateResDto } from '@commons/type/dto/basicApiDto/createResult.res.dto';
import { InjectionToken } from '@libs/adapter/db/mysql/repository/injectionToken';
import { EnvService } from '@libs/env/env.service';
import { EnvEnum } from '@libs/env/envEnum';
import { LogService } from '@libs/log/log.service';
import { PasswordUtil } from '@libs/util/password.util';
import { ValidateUtil } from '@libs/util/validate.util';

import * as Dtos from './dto';

@Injectable()
export class PasswordService {
  private readonly PASSWORD_KEY: string;

  constructor(
    private readonly logService: LogService,
    private readonly envService: EnvService,
    private readonly passwordServiceHelper: PasswordServiceHelper,

    @Inject(InjectionToken.PASSWORD_SQL_REPOSITORY) private readonly passwordRepository: PasswordRepositoryInterface,
  ) {
    this.PASSWORD_KEY = envService.get(EnvEnum.PASSWORD_KEY);
  }

  /**
   * 비밀번호 조회 By 도메인
   *
   * @param param GetDomainReqDto
   */
  public async getPasswordByDomain(param: Dtos.GetDomainParamReqDto): Promise<GetDomainResDto> {
    const password = await this.passwordRepository.findOneOrThrowByDomain(param);

    return new GetDomainResDto(PasswordUtil.decodedPassword(password.password, this.PASSWORD_KEY));
  }

  /**
   * 비밀번호 조회 By 페이지네이션
   *
   * @param getPasswordsReqDto pagination을 상속 받은 dto
   */
  public async findManyWithPagination(getPasswordsReqDto: Dtos.GetPasswordsQueryReqDto): Promise<Dtos.GetPasswordsResDto> {
    const passwordArr = await this.passwordRepository.findManyWithPagination(getPasswordsReqDto);
    const passwordResDtoArr = passwordArr.map((password) => new Dtos.PasswordResDto(password));

    const totalCount = await this.passwordRepository.count();

    const pagination = toPagination(totalCount, getPasswordsReqDto.pageNo, getPasswordsReqDto.pageSize);
    return new Dtos.GetPasswordsResDto(passwordResDtoArr, pagination);
  }

  /**
   * 비밀번호 생성
   *
   * @param body CreatePasswordReqDto
   */
  public async createOne(body: Dtos.CreatePasswordReqDto) {
    const getDomainParamReqDto = Dtos.GetDomainParamReqDto.toDTO(body.domain);
    const password = await this.passwordRepository.findOneByDomain(getDomainParamReqDto);

    const isExist = ValidateUtil.checkExistStrictly(password);

    if (isExist) {
      throw new ConflictException(ErrorResponse.PASSWORD.ALREADY_EXIST_PASSWORD(body.domain));
    }

    body.password = PasswordUtil.hashPassword(body.password, this.PASSWORD_KEY);
    const affectedNum = await this.passwordRepository.createOne(body);

    if (affectedNum !== 1) {
      throw new ConflictException(ErrorResponse.DATABASE.CREATE_ONE_FAIL(body.domain));
    }

    return new CreateResDto(true);
  }

  /**
   * 비밀번호 수정
   *
   * @param body UpdatePasswordReqDto
   */
  public async updateOne(body: Dtos.UpdatePasswordReqDto): Promise<UpdatedResDto> {
    const getDomainParamReqDto = Dtos.GetDomainParamReqDto.toDTO(body.domain);
    const password = await this.passwordRepository.findOneOrThrowByDomain(getDomainParamReqDto);

    const updatedInfo = body.compareValue(password);
    updatedInfo.password = PasswordUtil.hashPassword(updatedInfo.password, this.PASSWORD_KEY);

    const affectedNum = await this.passwordRepository.updateOne(updatedInfo);
    if (affectedNum !== 1) {
      throw new ConflictException(ErrorResponse.DATABASE.UPDATE_ONE_FAIL(body.domain));
    }

    return new UpdatedResDto(true);
  }

  /**
   * 비밀번호 삭제 By id
   *
   * @param param GetDomainParamReqDto
   */
  public async removeOne(param: Dtos.GetDomainParamReqDto): Promise<DeletedResDto> {
    const password = await this.passwordRepository.findOneOrThrowByDomain(param);

    const affectedNum = await this.passwordRepository.removeOne(password);
    if (affectedNum !== 1) {
      throw new ConflictException(ErrorResponse.DATABASE.DELETE_ONE_FAIL(param.domain));
    }
    return new DeletedResDto(true);
  }
}
