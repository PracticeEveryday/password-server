import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
@Injectable()
export class DateUtilService {
  /**
   * day2에서 day1까지 몇일지 지났는지를 반환해주는 함수입니다.
   * @param day1 날짜1 Date타입
   * @param day2 날짜2 Date타입
   */
  public diffDays(day1: Date | dayjs.Dayjs, day2: Date | dayjs.Dayjs) {
    const date1 = dayjs(day1);
    const date2 = dayjs(day2);

    return date2.diff(date1, 'day');
  }
}
