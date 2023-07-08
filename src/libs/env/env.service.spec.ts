import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { EnvService } from './env.service';
import { EnvEnum } from './envEnum';

describe('EnvService Test', () => {
  let envService: EnvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // 의존성 주입하 Module 넣기
      imports: [ConfigModule],
      // 테스트할 모듈 넣기
      providers: [EnvService],
    }).compile();

    envService = module.get<EnvService>(EnvService);
  });

  // service 유무 확인
  it('should be defined', () => {
    expect(envService).toBeDefined();
  });

  it('환경 변수 getOrThrow 체크', () => {
    // throw는 익명 함수로 넣어야 한다.
    expect(() => envService.getOrThrow(EnvEnum.SWAGGER_PASSWORD)).toThrow();
  });
});
