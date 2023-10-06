import { HttpService, HttpModule as BaseHttpModule } from '@nestjs/axios';
import { Module, OnModuleInit } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';

import { LogService } from '@libs/log/log.service';

@Module({
  imports: [BaseHttpModule],
  exports: [BaseHttpModule],
})
export class HttpModule implements OnModuleInit {
  private MAX_RETRY_COUNT = 2;

  constructor(private readonly httpService: HttpService, public readonly logService: LogService) {}

  public onModuleInit() {
    const axios = this.httpService.axiosRef;

    // 요청 직전에 가로챈다.
    axios.interceptors.request.use((config) => {
      config['metadata'] = { ...config['metadata'], startDate: new Date() };

      return config;
    });

    // 요청 직후에 가로챈다.
    axios.interceptors.response.use(
      // 성공 시 가로챈다.
      (response) => {
        const { config } = response;
        config['metadata'] = { ...config['metadata'], endDate: new Date() };
        const duration = config['metadata'].endDate.getTime() - config['metadata'].startDate.getTime();

        this.logService.info('Axios Success', `${config.method.toUpperCase()} ${config.url} ${duration}ms`);

        return response;
      },

      // 실패시 가로챈다.
      (error: AxiosError) => {
        interface AxiosCustomRequestConfig extends AxiosRequestConfig {
          retryCount: number;
        }

        const config = error.config as AxiosCustomRequestConfig;
        config.retryCount = config.retryCount ? config.retryCount : 0;

        const shouldRetry = config.retryCount < this.MAX_RETRY_COUNT;
        if (shouldRetry) {
          config.retryCount += 1;
          return axios.request(config);
        }

        return Promise.reject(error);
      },
    );
  }
}
