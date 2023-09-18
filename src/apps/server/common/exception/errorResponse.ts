export default class ErrorResponse {
  public static readonly COMMON = {
    NOT_FOUND_URL: {
      CODE: 'NOT_FOUND_URL',
      ENG: 'The path endpoint does not exist.',
      KR: '존재하지 않는 경로입니다.',
    },

    INTERNAL_SERVER_ERROR: {
      CODE: 'INTERNAL_SERVER_ERROR',
      ENG: 'This is a server error.',
      KR: '서버 에러입니다.',
    },
  };

  public static readonly PASSWORD = {
    ALREADY_EXIST_PASSWORD: (value: string) => {
      return {
        CODE: 'ALREADY_EXIST_PASSWORD',
        ENG: `The password of ${value} already exists.`,
        KR: `이미 도메인 ${value}의 비밀번호가 존재합니다.`,
      };
    },

    NOT_FOUND_DOMAIN: (domain: string | undefined) => {
      return {
        CODE: 'NOT_FOUND_DOMAIN',
        ENG: `No information was found for that ${domain || 'domain'}.`,
        KR: `해당 ${domain || '도메인'}의 정보를 찾을 수 없습니다.`,
      };
    },
  };

  public static readonly TYPE = {
    // 404
    TYPE_ERROR_MUST_BE_OBJECT: <T>(data: T) => {
      return {
        CODE: 'TYPE_ERROR_MUST_BE_OBJECT',
        ENG: `${data} is not object type.`,
        KR: `${data}는 object 타입이 아닙니다.`,
      };
    },

    // 400
    TYPE_ERROR: (data: string) => {
      return {
        CODE: 'TYPE_ERROR',
        ENG: data,
        KR: `타입에러입니다.`,
      };
    },
  };

  public static readonly BOOK = {
    //404
    NOT_FOUND_BOOK_BY_ID: (id: number) => {
      return {
        CODE: 'NOT_FOUND_BOOK_BY_ID',
        ENG: `No book information exists for that ${id}.`,
        KR: `해당 ${id}의 책 정보가 존재하지 않습니다.`,
      };
    },

    //409
    BOOK_ALREADY_EXIST: (title: string) => {
      return {
        CODE: 'BOOK_ALREADY_EXIST',
        ENG: `Book information for that title, ${title} already exists.`,
        KR: `해당 ${title}의 책 정보가 이미 존재합니다.`,
      };
    },
  };

  public static readonly VALIDATION = {
    IS_NOT_EMPTY: '은(는) 필수로 들어와야 합니다.',
    IS_NUMBER: '은(는) 숫자여야 합니다.',
    IS_STRING: '은(는) 문자여야 합니다.',
    NUMBER_LESS_THEN: '은(는) ###value### 보다 작아야 합니다.',
    NUMBER_GREATER_THEN: '은(는) ###value### 보다 커야 합니다.',
    STRING_LESS_THEN: ' 길이는 ###value### 보다 작아야 합니다.',
    STRING_GREATER_THEN: ' 길이는 ###value### 보다 커야 합니다.',
  };

  public static readonly DATABASE = {
    CREATE_ONE_FAIL: (value: string) => {
      return {
        CODE: 'CREATE_ONE_FAIL',
        ENG: `value: ${value} data creation failed. This may be a DB error`,
        KR: `값: ${value} 데이터 생성에 실패하였습니다. DB 에러일 수 있습니다.`,
      };
    },

    UPDATE_ONE_FAIL: (value: string) => {
      return {
        CODE: 'UPDATE_ONE_FAIL',
        ENG: `value: ${value} data modification failed. This may be a DB error.`,
        KR: `값: ${value} 데이터 수정에 실패하였습니다. DB 에러일 수 있습니다.`,
      };
    },

    DELETE_ONE_FAIL: (value: string) => {
      return {
        CODE: 'DELETE_ONE_FAIL',
        ENG: `value: ${value} data deletion failed. This may be a DB error.`,
        KR: `값: ${value} 데이터 삭제에 실패하였습니다. DB 에러일 수 있습니다.`,
      };
    },
  };
}
