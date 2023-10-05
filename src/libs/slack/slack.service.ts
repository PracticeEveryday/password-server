import { Injectable } from '@nestjs/common';

import ErrorResponse from '@commons/exception/errorResponse';
import { ApiService } from '@libs/api/api.service';
import { AxiosReqDto } from '@libs/api/dto/axios.req.dto';
import { EnvService } from '@libs/env/env.service';
import { EnvEnum } from '@libs/env/envEnum';

@Injectable()
export class SlackService {
  private readonly SLACK_ERROR_LOG_URL: string;
  private readonly STACK = new Error().stack;

  private readonly headers = { headers: { 'Content-Type': 'application/json' } };

  constructor(private readonly envService: EnvService, private readonly apiService: ApiService) {
    this.SLACK_ERROR_LOG_URL = envService.get(EnvEnum.SLACK_ERROR_LOG_URL);
  }

  public sendWarnToSlack(errorResponse: ErrorResponse): void {
    const attachment = {
      pretext: '⚠️ 요청이 실패했습니다.',
      color: '#ff7f00',
      title: '에러 코드',
      text: JSON.stringify(errorResponse, null, 2),
      // fields: [{ title: '에러 헤더', value: JSON.stringify(error.requestInfo, null, 2), short: false }],
    };

    const axiosReqDto = new AxiosReqDto({ url: this.SLACK_ERROR_LOG_URL, data: attachment, headers: this.headers, stack: this.STACK });
    this.apiService.justPost(axiosReqDto);
  }

  public sendErrorToSlack(errorResponse: ErrorResponse): void {
    const attachment = {
      pretext: '⚠️ 서버 에러 입니다.',
      color: '#FF0000',
      title: '에러 코드',
      text: JSON.stringify(errorResponse, null, 2),
      // fields: [{ title: '에러 헤더', value: JSON.stringify(error.requestInfo, null, 2), short: false }],
    };

    const axiosReqDto = new AxiosReqDto({ url: this.SLACK_ERROR_LOG_URL, data: attachment, headers: this.headers, stack: this.STACK });
    this.apiService.justPost(axiosReqDto);
  }
}
