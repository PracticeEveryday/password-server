import * as dayjs from 'dayjs';

export class DateUtil {
  public static diffDays = (day1: Date | dayjs.Dayjs, day2: Date | dayjs.Dayjs) => {
    const date1 = dayjs(day1);
    const date2 = dayjs(day2);

    return date2.diff(date1, 'day');
  };
}
