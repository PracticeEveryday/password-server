import { Provider } from '@nestjs/common';
import { InjectionToken } from '../../mysql/repositories/injectionToken';
import { ServerInfoRepository } from '../../mysql/repositories/serverInfo.repository.service';
import { PrequalificationRepository } from '../../mysql/repositories/prequalification.repository';

export const readlineProvider: Provider[] = [
  { provide: InjectionToken.SERVER_INFO_REPOSITORY, useClass: ServerInfoRepository },
  { provide: InjectionToken.PREQUALIFICATION_REPOSITORY, useClass: PrequalificationRepository },
];
