import { Provider } from '@nestjs/common';

import { InjectionToken } from '../../mysql/repositories/injectionToken';
import { PrequalificationRepository } from '../../mysql/repositories/prequalification.repository';
import { ServerInfoRepository } from '../../mysql/repositories/serverInfo.repository.service';

export const readlineProvider: Provider[] = [
  { provide: InjectionToken.SERVER_INFO_REPOSITORY, useClass: ServerInfoRepository },
  { provide: InjectionToken.PREQUALIFICATION_REPOSITORY, useClass: PrequalificationRepository },
];
