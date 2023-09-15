import { Provider } from '@nestjs/common';

import { AlcoholRepository } from '@apps/server/modules/alcohol/repository/alcohol.repository';
import { InjectionToken } from '@libs/adapter/db/mysql/repository/injectionToken';

export const alcoholProviders: Provider[] = [{ provide: InjectionToken.ALCOHOL_REPOSITORY, useClass: AlcoholRepository }];
