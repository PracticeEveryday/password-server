import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';

import { DateUtilService } from './date-util.service';

describe('DateUtilService Test', () => {
  let dateUtilService: DateUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // 테스트할 모듈 넣기
      providers: [DateUtilService],
    }).compile();

    dateUtilService = module.get<DateUtilService>(DateUtilService);
  });

  // service 유무 확인
  it('should be defined', () => {
    expect(dateUtilService).toBeDefined();
  });

  it('두 날짜간 차이를 구하기', () => {
    const date1 = dayjs();
    const date2 = dayjs();

    const diff = dateUtilService.diffDays(date1, date2);
    expect(date1 instanceof dayjs).toBe(true);
    expect(date2 instanceof dayjs).toBe(true);
    expect(diff).toStrictEqual(0);

    const date3 = dayjs('2023-01-01');
    const date4 = dayjs('2023-01-02');

    const diff2 = dateUtilService.diffDays(date3, date4);
    expect(date3 instanceof dayjs).toBe(true);
    expect(date4 instanceof dayjs).toBe(true);
    expect(diff2).toStrictEqual(1);

    const date5 = dayjs('2023-01-02');
    const date6 = dayjs('2023-01-01');

    const diff3 = dateUtilService.diffDays(date5, date6);
    expect(date3 instanceof dayjs).toBe(true);
    expect(date4 instanceof dayjs).toBe(true);
    expect(diff3).toStrictEqual(-1);
  });
});
