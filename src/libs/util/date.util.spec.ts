import { DateUtil } from '@libs/util/date.util';

describe('DateUtil 테스트!!', () => {
  it('앞 날짜는 양수처리된다.', () => {
    const date1 = new Date('2023-09-01');
    const date2 = new Date('2023-09-05');
    const result = DateUtil.diffDays(date1, date2);
    expect(result).toBe(4);
  });

  it('뒷 날짜는 음수처리된다.', () => {
    const date1 = new Date('2023-09-05');
    const date2 = new Date('2023-09-01');
    const result = DateUtil.diffDays(date1, date2);
    expect(result).toBe(-4);
  });

  it('같은 날짜는 0을 뱉어낸다.', () => {
    const date1 = new Date('2023-09-01');
    const date2 = new Date('2023-09-01');
    const result = DateUtil.diffDays(date1, date2);
    expect(result).toBe(0);
  });
});
