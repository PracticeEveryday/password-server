import { Test, TestingModule } from '@nestjs/testing';
import { QueryError } from 'mysql2';

import { PasswordSqlInterface } from '@libs/mysql/interface/password.interface';

import { ValidateUtilService } from './validateUtil.service';

describe('ValidateUtilService Test', () => {
  let validateUserService: ValidateUtilService;

  const passwordInterface: PasswordSqlInterface = {
    constructor: { name: 'RowDataPacket' },
    id: 1,
    domain: 'naver',
    password: '12345678a',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  };

  const queryError: QueryError = {
    name: 'error',
    message: '에러입니다.',
    code: '11',
    fieldCount: 5,
    sqlState: 'query error',
    sqlStateMarker: 'maker',
    fatal: true,
    errno: 123,
  };

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
