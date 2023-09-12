import { Provider } from '@nestjs/common';

import { InjectionToken } from '@libs/adapter/db/mysql/repository/injectionToken';
import { PasswordTypeOrmRepository } from '@libs/adapter/db/typeorm/repository/passwordTypeOrm.repository';

export const passwordProviders: Provider[] = [{ provide: InjectionToken.PASSWORD_TYPEORM_REPOSITORY, useClass: PasswordTypeOrmRepository }];
