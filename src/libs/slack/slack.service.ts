import { Injectable } from '@nestjs/common';

import { ErrorLogDto, WarnLogDto } from '@commons/type/dto/basicApiDto';
import { ApiService } from '@libs/api/api.service';
import { AxiosReqDto } from '@libs/api/dto/axios.req.dto';
import { EnvService } from '@libs/env/env.service';
import { EnvEnum } from '@libs/env/envEnum';

@Injectable()
export class SlackService {
  private readonly SLACK_ERROR_LOG_URL: string;
  constructor(private readonly envService: EnvService, private readonly apiService: ApiService) {
    this.SLACK_ERROR_LOG_URL = envService.get(EnvEnum.SLACK_ERROR_LOG_URL);
  }

  public sendWarnToSlack(error: WarnLogDto): void {
    const attachment = {
      pretext: '⚠️ 요청이 실패했습니다.',
      color: '#ff7f00',
      title: '에러 코드',
      text: JSON.stringify(error.exception.errorResponse, null, 2),
      // fields: [{ title: '에러 헤더', value: JSON.stringify(error.requestInfo, null, 2), short: false }],
    };
    const headers = { headers: { 'Content-Type': 'application/json' } };
    const { stack } = new Error();

    const axiosReqDto = new AxiosReqDto({ url: this.SLACK_ERROR_LOG_URL, data: attachment, headers, stack });
    this.apiService.justPost(axiosReqDto);
  }

  public sendErrorToSlack(error: ErrorLogDto): void {
    const attachment = {
      pretext: '⚠️ 서버 에러 입니다.',
      color: '#FF0000',
      title: '에러 코드',
      text: JSON.stringify(error.exception.errorResponse, null, 2),
      // fields: [{ title: '에러 헤더', value: JSON.stringify(error.requestInfo, null, 2), short: false }],
    };
    const headers = { headers: { 'Content-Type': 'application/json' } };
    const { stack } = new Error();

    const axiosReqDto = new AxiosReqDto({ url: this.SLACK_ERROR_LOG_URL, data: attachment, headers, stack });
    this.apiService.justPost(axiosReqDto);
  }
}
