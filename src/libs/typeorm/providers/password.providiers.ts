import { Provider } from '@nestjs/common';

import { InjectionToken } from '@libs/mysql/repository/injectionToken';
import { PasswordRepository } from '@libs/typeorm/repository/password.repository';

export const passwordProviders: Provider[] = [{ provide: InjectionToken.PASSWORD_TYPEORM_REPOSITORY, useClass: PasswordRepository }];
