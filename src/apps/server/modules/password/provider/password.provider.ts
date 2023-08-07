import { Provider } from '@nestjs/common';

import { PasswordRepository } from '@apps/server/modules/password/repository/password.repository';
import { InjectionToken } from '@libs/mysql/repository/injectionToken';

export const passwordProviders: Provider[] = [{ provide: InjectionToken.PASSWORD_REPOSITORY, useClass: PasswordRepository }];
