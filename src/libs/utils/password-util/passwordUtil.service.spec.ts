import { Test, TestingModule } from '@nestjs/testing';

import { PasswordUtilService } from './passwordUtil.service';
import { EnvModule } from '../../env/env.module';

describe('PasswordUtilService Test', () => {
  let passwordUtilService: PasswordUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // import 할 모듈 넣기
      imports: [EnvModule],
      // 테스트할 모듈 넣기
      providers: [PasswordUtilService],
    }).compile();

    passwordUtilService = module.get<PasswordUtilService>(PasswordUtilService);
  });

  // service 유무 확인
  it('should be defined', () => {
    expect(passwordUtilService).toBeDefined();
  });

  it('verify hashPassword', () => {
    const password = '123456789a';

    const hashedPassword = passwordUtilService.hashPassword(password);
    const decoded = passwordUtilService.decodedPassword(hashedPassword);
    // type은 string
    expect(typeof decoded).toBe('string');
    // 비어있지 않습니다.
    expect(decoded.length).toBeGreaterThan(0);
    // 해쉬하기 전의 비밀번호랑 동일합니다.
    expect(decoded).toStrictEqual(password);
  });
});
