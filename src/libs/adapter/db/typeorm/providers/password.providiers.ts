import { Provider } from '@nestjs/common';

import { InjectionToken } from '@libs/adapter/db/mysql/repository/injectionToken';

let PasswordRepository;
export const passwordProviders: Provider[] = [{ provide: InjectionToken.PASSWORD_TYPEORM_REPOSITORY, useClass: PasswordRepository }];
