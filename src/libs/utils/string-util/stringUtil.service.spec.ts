import { Test, TestingModule } from '@nestjs/testing';

import { StringUtilService } from './stringUtil.service';

describe('StringUtilService', () => {
  let stringUtilService: StringUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StringUtilService],
    }).compile();

    stringUtilService = module.get<StringUtilService>(StringUtilService);
  });

  it('should be defined', () => {
    expect(stringUtilService).toBeDefined();
  });

  it('스네이크 케이스를 카멜 케이스로 변경하는 함수', () => {
    const snake = 'book_id';
    const snake2 = 'book_meta_id';
    const notSnake = 'bookId';
    const notSnake2 = 'bookid';

    expect(stringUtilService.parseSnakeCaseToCamelCase(snake)).toBe('bookId');
    expect(stringUtilService.parseSnakeCaseToCamelCase(snake2)).toBe('bookMetaId');
    expect(stringUtilService.parseSnakeCaseToCamelCase(notSnake)).toBe('bookId');
    expect(stringUtilService.parseSnakeCaseToCamelCase(notSnake2)).toBe('bookid');
  });

  it('카멜 케이스를 스네이크 케이스로 변경하는 함수', () => {
    const snake = 'bookId';
    const snake2 = 'bookMetaId';
    const notSnake = 'bookId';
    const notSnake2 = 'bookid';

    expect(stringUtilService.parseSnakeCaseToCamelCase(snake)).toBe('bookId');
    expect(stringUtilService.parseSnakeCaseToCamelCase(snake2)).toBe('bookMetaId');
    expect(stringUtilService.parseSnakeCaseToCamelCase(notSnake)).toBe('bookId');
    expect(stringUtilService.parseSnakeCaseToCamelCase(notSnake2)).toBe('bookid');
  });
});
