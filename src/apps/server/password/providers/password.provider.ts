import { Provider } from '@nestjs/common';
import { PasswordRepository } from '../../../../libs/mysql/repositories/password.repository';
import { InjectionToken } from '../../../../libs/mysql/repositories/injectionToken';

export const passwordProviders: Provider[] = [{ provide: InjectionToken.PASSWORD_REPOSITORY, useClass: PasswordRepository }];
