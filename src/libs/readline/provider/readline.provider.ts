import { Provider } from '@nestjs/common';

import { InjectionToken } from '../../mysql/repository/injectionToken';
import { PreQualificationRepository } from '../../mysql/repository/preQualification.repository';
import { ServerInfoRepository } from '../../mysql/repository/serverInfo.repository';

export const readlineProvider: Provider[] = [
  { provide: InjectionToken.SERVER_INFO_REPOSITORY, useClass: ServerInfoRepository },
  { provide: InjectionToken.PRE_QUALIFICATION_REPOSITORY, useClass: PreQualificationRepository },
];
