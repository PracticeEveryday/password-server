import { Test, TestingModule } from '@nestjs/testing';

import { ValidateUtilService } from './validateUtil.service';

describe('ValidateUtilService Test', () => {
  let validateUserService: ValidateUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // 테스트할 모듈 넣기
      providers: [ValidateUtilService],
    }).compile();

    validateUserService = module.get<ValidateUtilService>(ValidateUtilService);
  });

  // service 유무 확인
  it('should be defined', () => {
    expect(validateUserService).toBeDefined();
  });
});
