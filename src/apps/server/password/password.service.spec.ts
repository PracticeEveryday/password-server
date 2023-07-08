import { Test, TestingModule } from '@nestjs/testing';

import { PasswordService } from './password.service';
import { passwordProviders } from './providers/password.provider';
import { EnvModule } from '../../../libs/env/env.module';
import { LogModule } from '../../../libs/log/log.module';
import { MysqlModule } from '../../../libs/mysql/mysql.module';
import { MysqlService } from '../../../libs/mysql/mysql.service';
import { PasswordUtilModule } from '../../../libs/utils/password-util/password-util.module';
import { ValidateUtilModule } from '../../../libs/utils/validate-util/validate-util.module';

const mockPassword = {
  password: '12345678a',
};

describe.only('PasswordService Test', () => {
  let passwordService: PasswordService;
  let mysqlService: MysqlService;
  let mockPasswordService: Partial<PasswordService>;

  beforeEach(async () => {
    mockPasswordService = {
      findOneByDomain: jest.fn().mockReturnValue(mockPassword),
    };

    const module: TestingModule = await Test.createTestingModule({
      // 의존성 주입하 Module 넣기
      imports: [PasswordUtilModule, ValidateUtilModule, LogModule, EnvModule, MysqlModule],
      // 테스트할 모듈 넣기
      providers: [PasswordService, ...passwordProviders],
    }).compile();

    //TODO: DB연결을 어떻게 할 것인가?

    passwordService = module.get<PasswordService>(PasswordService);
  });

  // service 유무 확인
  it('should be defined', () => {
    expect(passwordService).toBeDefined();
  });
});
