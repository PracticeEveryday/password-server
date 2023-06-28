import { Test, TestingModule } from '@nestjs/testing';
import { ReadlineService } from './readline.service';

describe('ReadlineService', () => {
  let service: ReadlineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReadlineService],
    }).compile();

    service = module.get<ReadlineService>(ReadlineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
