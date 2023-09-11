import { Provider } from '@nestjs/common';

import { InjectionToken } from '@libs/adapter/db/mysql/repository/injectionToken';
import { PreQualificationRepository } from '@libs/adapter/db/mysql/repository/preQualification.repository';
import { ServerInfoRepository } from '@libs/adapter/db/mysql/repository/serverInfo.repository';

export const readlineProvider: Provider[] = [
  { provide: InjectionToken.SERVER_INFO_REPOSITORY, useClass: ServerInfoRepository },
  { provide: InjectionToken.PRE_QUALIFICATION_REPOSITORY, useClass: PreQualificationRepository },
];
