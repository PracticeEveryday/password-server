import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

import { AxiosReqDto } from '@libs/api/dto/axios.req.dto';
import { LogService } from '@libs/log/log.service';

@Injectable()
export class ApiService {
  constructor(private httpService: HttpService, private readonly logService: LogService) {}

  public justPost(axiosReqDto: AxiosReqDto): void {
    const observable = this.httpService.post(axiosReqDto.url, axiosReqDto.data, axiosReqDto.headers);
    firstValueFrom(observable).catch((error) => {
      this.logService.errorMsg('Axios Post Error', `post 요청에 실패 했습니다. ${error.response}`, axiosReqDto.stack);
    });
  }

  public async post<T>(axiosReqDto: AxiosReqDto): Promise<T> {
    try {
      const observable = await this.httpService.post(axiosReqDto.url, axiosReqDto.data, axiosReqDto.headers);
      const firstResultValue = await firstValueFrom(observable);

      return firstResultValue.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        this.logService.errorMsg('Axios Post Error', `post 요청에 실패 했습니다. ${error.response}`, axiosReqDto.stack);
      } else {
        console.error(error);
      }
    }
  }
}
