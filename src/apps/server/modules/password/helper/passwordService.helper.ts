import { Inject, Injectable } from '@nestjs/common';

import { PasswordRepositoryInterface } from '@apps/server/modules/password/interface/PasswordRepository.interface';
import { InjectionToken } from '@libs/adapter/db/mysql/repository/injectionToken';

@Injectable()
export class PasswordServiceHelper {
  constructor(@Inject(InjectionToken.PASSWORD_SQL_REPOSITORY) private readonly passwordRepository: PasswordRepositoryInterface) {}
}
