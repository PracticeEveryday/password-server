import { Provider } from '@nestjs/common';

import { InjectionToken } from '../../mysql/repository/injectionToken';
import { PrequalificationRepository } from '../../mysql/repository/prequalification.repository';
import { ServerInfoRepository } from '../../mysql/repository/serverInfo.repository';

export const readlineProvider: Provider[] = [
  { provide: InjectionToken.SERVER_INFO_REPOSITORY, useClass: ServerInfoRepository },
  { provide: InjectionToken.PREQUALIFICATION_REPOSITORY, useClass: PrequalificationRepository },
];
