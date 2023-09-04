import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { ErrorLogDto, WarnLogDto } from '@commons/dto/basicApiDto';
import { EnvService } from '@libs/env/env.service';
import { EnvEnum } from '@libs/env/envEnum';

@Injectable()
export class SlackService {
  private readonly SLACK_ERROR_LOG_URL: string;
  constructor(private readonly envService: EnvService) {
    this.SLACK_ERROR_LOG_URL = envService.get(EnvEnum.SLACK_ERROR_LOG_URL);
  }

  public sendWarnToSlack(error: WarnLogDto): void {
    try {
      const attachment = {
        pretext: '⚠️ 요청이 실패했습니다.',
        color: '#ff7f00',
        title: '에러 코드',
        text: JSON.stringify(error.exception.errorResponse, null, 2),
        // fields: [{ title: '에러 헤더', value: JSON.stringify(error.requestInfo, null, 2), short: false }],
      };
      axios.post(this.SLACK_ERROR_LOG_URL, { attachments: [attachment] }, { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.log(1);
      console.log(error);
    }
  }

  public sendErrorToSlack(error: ErrorLogDto): void {
    try {
      const attachment = {
        pretext: '⚠️ 서버 에러 입니다.',
        color: '#FF0000',
        title: '에러 코드',
        text: JSON.stringify(error.exception.errorResponse, null, 2),
        // fields: [{ title: '에러 헤더', value: JSON.stringify(error.requestInfo, null, 2), short: false }],
      };
      axios.post(this.SLACK_ERROR_LOG_URL, { attachments: [attachment] }, { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.log(1);
      console.log(error);
    }
  }
}
