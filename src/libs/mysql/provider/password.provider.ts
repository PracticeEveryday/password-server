import { Provider } from '@nestjs/common';

import { InjectionToken } from '@libs/mysql/repository/injectionToken';
import { PasswordSqlRepository } from '@libs/mysql/repository/passwordSql.repository';

export const passwordProviders: Provider[] = [{ provide: InjectionToken.PASSWORD_SQL_REPOSITORY, useClass: PasswordSqlRepository }];
