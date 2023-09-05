import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { isAxiosError, AxiosResponse } from 'axios';
import { firstValueFrom, Observable } from 'rxjs';

import { AxiosReqDto } from '@libs/api/dto/axios.req.dto';

@Injectable()
export class ApiService {
  constructor(private httpService: HttpService) {}

  public async post(axiosReqDto: AxiosReqDto): Promise<Observable<AxiosResponse>> {
    const observable = await this.httpService.post(axiosReqDto.url, axiosReqDto.data, axiosReqDto.headers);

    return await this.processAxios(observable);
  }

  private async processAxios(httpResponse: Observable<AxiosResponse>) {
    try {
      const firstResultValue = await firstValueFrom(httpResponse);

      return firstResultValue.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.log(error.status);
        console.error(error.response);
      } else {
        console.error(error);
      }
    }
  }
}
