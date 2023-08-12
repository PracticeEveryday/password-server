import { Test, TestingModule } from '@nestjs/testing';

import ErrorResponse from '@commons/customExceptions/errorResponse';

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

  it('isStrictNotEmptyWithErrorResponse 비어있지 않으면 에러를 던짐', () => {
    const str = 'hello';
    const num = 123;
    const obj = { test: 'test' };
    const arr = [1, 2, 3];
    const 널 = null;
    const 언디파인 = undefined;
    const emptyArr = [];
    const emptyObj = {};
    expect(validateUserService.isStrictNotEmptyWithErrorResponse(str, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toBeUndefined();
    expect(validateUserService.isStrictNotEmptyWithErrorResponse(num, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toBeUndefined();
    expect(validateUserService.isStrictNotEmptyWithErrorResponse(obj, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toBeUndefined();
    expect(validateUserService.isStrictNotEmptyWithErrorResponse(arr, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toBeUndefined();
    expect(() => validateUserService.isStrictNotEmptyWithErrorResponse(널, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toThrow();
    expect(() => validateUserService.isStrictNotEmptyWithErrorResponse(언디파인, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toThrow();
    expect(() => validateUserService.isStrictNotEmptyWithErrorResponse(emptyArr, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toThrow();
    expect(() => validateUserService.isStrictNotEmptyWithErrorResponse(emptyObj, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toThrow();
  });

  it('isStrictEmptyWithErrorResponse 비어있지 않으면 에러를 던짐', () => {
    const str = 'hello';
    const num = 123;
    const obj = { test: 'test' };
    const arr = [1, 2, 3];
    const 널 = null;
    const 언디파인 = undefined;
    const emptyArr = [];
    const emptyObj = {};
    expect(validateUserService.isStrictEmptyWithErrorResponse(널, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toBeUndefined();
    expect(validateUserService.isStrictEmptyWithErrorResponse(언디파인, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toBeUndefined();
    expect(validateUserService.isStrictEmptyWithErrorResponse(emptyArr, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toBeUndefined();
    expect(validateUserService.isStrictEmptyWithErrorResponse(emptyObj, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toBeUndefined();
    expect(() => validateUserService.isStrictEmptyWithErrorResponse(str, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toThrow();
    expect(() => validateUserService.isStrictEmptyWithErrorResponse(num, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toThrow();
    expect(() => validateUserService.isStrictEmptyWithErrorResponse(obj, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toThrow();
    expect(() => validateUserService.isStrictEmptyWithErrorResponse(arr, ErrorResponse.PASSWORD.BOOK_ALREADY_EXIST)).toThrow();
  });
});
