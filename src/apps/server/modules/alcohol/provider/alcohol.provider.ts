import { Provider } from '@nestjs/common';

import { InjectionToken } from '@libs/adapter/db/mysql/repository/injectionToken';

import { AlcoholRepository } from '../reposiroty/alcohol.repository';

export const alcoholProviders: Provider[] = [{ provide: InjectionToken.ALCOHOL_REPOSITORY, useClass: AlcoholRepository }];
