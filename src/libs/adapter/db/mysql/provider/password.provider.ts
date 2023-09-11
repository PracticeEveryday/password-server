import { Provider } from '@nestjs/common';

import { InjectionToken } from '@libs/adapter/db/mysql/repository/injectionToken';
import { PasswordSqlRepository } from '@libs/adapter/db/mysql/repository/passwordSql.repository';

export const passwordProviders: Provider[] = [{ provide: InjectionToken.PASSWORD_SQL_REPOSITORY, useClass: PasswordSqlRepository }];
