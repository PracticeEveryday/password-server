import { Test, TestingModule } from '@nestjs/testing';

import { SqlUtilService } from './sql-util.service';

describe('SqlUtilService', () => {
  let service: SqlUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqlUtilService],
    }).compile();

    service = module.get<SqlUtilService>(SqlUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
