import { Provider } from '@nestjs/common';
import { InjectionToken } from '../../mysql/repositories/injectionToken';
import { ServerInfoRepository } from '../../mysql/repositories/serverInfo.repository.service';

export const readlineProvider: Provider[] = [{ provide: InjectionToken.SERVER_INFO_REPOSITORY, useClass: ServerInfoRepository }];
