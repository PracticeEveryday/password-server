import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
@Injectable()
export class DateUtilService {
  public diffDays(day1: Date, day2: Date) {
    const date1 = dayjs(day1);
    const date2 = dayjs(day2);

    return date2.diff(date1, 'day');
  }
}
