import { Test, TestingModule } from '@nestjs/testing';

import { SqlUtilService } from './sqlUtil.service';
import { StringUtilModule } from '../string/stringUtil.module';

describe('SqlUtilService', () => {
  let service: SqlUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StringUtilModule],
      providers: [SqlUtilService],
    }).compile();

    service = module.get<SqlUtilService>(SqlUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
