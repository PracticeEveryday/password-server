import { Provider } from '@nestjs/common';

import { InjectionToken } from '../../../../libs/mysql/repositories/injectionToken';
import { PasswordRepository } from '../repository/password.repository';

export const passwordProviders: Provider[] = [{ provide: InjectionToken.PASSWORD_REPOSITORY, useClass: PasswordRepository }];
