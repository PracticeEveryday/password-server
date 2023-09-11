import { Inject, Injectable } from '@nestjs/common';

import { GetDomainParamReqDto } from '@apps/server/modules/password/dto';
import { PasswordInterface } from '@apps/server/modules/password/interface/password.interface';
import { PasswordRepositoryInterface } from '@apps/server/modules/password/interface/PasswordRepository.interface';
import ErrorResponse from '@commons/customExceptions/errorResponse';
import { NotFoundException } from '@commons/customExceptions/exception';
import { InjectionToken } from '@libs/mysql/repository/injectionToken';
import { ValidateUtil } from '@libs/util/validate.util';

@Injectable()
export class PasswordServiceHelper {
  constructor(@Inject(InjectionToken.PASSWORD_REPOSITORY) private readonly passwordRepository: PasswordRepositoryInterface) {}

  public async getPasswordByDomain(getDomainParamReqDto: GetDomainParamReqDto): Promise<PasswordInterface> {
    const password = await this.passwordRepository.findOneByDomain(getDomainParamReqDto);
    const isEmpty = ValidateUtil.checkEmptyStrictly(password);

    if (isEmpty) throw new NotFoundException({ errorResponse: ErrorResponse.PASSWORD.NOT_FOUND_DOMAIN });

    return password;
  }

  public async checkExistByDomain(getDomainParamReqDto: GetDomainParamReqDto): Promise<boolean> {
    const password = await this.passwordRepository.findOneByDomain(getDomainParamReqDto);

    return ValidateUtil.checkExistStrictly(password);
  }
}