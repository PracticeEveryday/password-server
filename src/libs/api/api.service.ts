import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { isAxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

import { AxiosReqDto } from '@libs/api/dto/axios.req.dto';
import { LogService } from '@libs/log/log.service';

@Injectable()
export class ApiService {
  constructor(private httpService: HttpService, private readonly logService: LogService) {}

  public async post<T>(axiosReqDto: AxiosReqDto): Promise<T> {
    try {
      const observable = await this.httpService.post(axiosReqDto.url, axiosReqDto.data, axiosReqDto.headers);

      const firstResultValue = await firstValueFrom(observable);

      return firstResultValue.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        this.logService.errorMsg('Axios Post Error', `post 요청에 실패가 있습니다. ${error.response.data}`, axiosReqDto.stack);
      } else {
        console.error(error);
      }
    }
  }
}
