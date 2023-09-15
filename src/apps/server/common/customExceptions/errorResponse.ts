export default class ErrorResponse {
  public static readonly COMMON = {
    INTERNAL_SERVER_ERROR: {
      CODE: 'INTERNAL_SERVER_ERROR',
      ENG: 'This is a server error.',
      KR: '서버 에러입니다.',
    },
  };

  public static readonly AUTH = {
    //400
    ALREADY_EXIST_USER: {
      CODE: 'ALREADY_EXIST_USER',
      ENG: 'The user already exists.',
      KR: '이미 유저가 존재합니다.',
    },

    // 404
    NOT_FOUND_USER: {
      CODE: 'NOT_FOUND_USER',
      ENG: 'The user was not found.',
      KR: '유저를 찾을 수 없습니다.',
    },
  };

  public static readonly PASSWORD = {
    // 400
    PASSWORD_TYPE_ERROR: {
      CODE: 'PASSWORD_TYPE_ERROR',
      ENG: 'The password is the wrong type.',
      KR: '비밀번호의 타입이 틀립니다.',
    },

    // 404
    NOT_FOUND_DOMAIN: {
      CODE: 'NOT_FOUND_DOMAIN',
      ENG: 'No information was found for that domain.',
      KR: '해당 도메인의 정보를 찾을 수 없습니다.',
    },
    NOT_FOUND_PASSWORD: {
      CODE: 'NOT_FOUND_PASSWORD',
      ENG: 'The corresponding password information was not found.',
      KR: '해당 비밀 번호 정보를 찾을 수 없습니다.',
    },

    //409
    BOOK_ALREADY_EXIST: {
      CODE: 'BOOK_ALREADY_EXIST',
      ENG: 'The information for that password already exists.',
      KR: '해당 비밀 번호의 정보가 이미 존재합니다.',
    },
  };

  public static readonly BOOK = {
    //404
    NOT_FOUND_BOOK_BY_ID: {
      CODE: 'NOT_FOUND_BOOK_BY_ID',
      ENG: 'No book information exists for that ID.',
      KR: '해당 아이디의 책 정보가 존재하지 않습니다.',
    },

    //409
    BOOK_ALREADY_EXIST: {
      CODE: 'BOOK_ALREADY_EXIST',
      ENG: 'Book information for that title already exists.',
      KR: '해당 타이틀의 책 정보가 이미 존재합니다.',
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

    UPDATE_ONE_FAIL: () => {
      return {
        CODE: 'UPDATE_ONE_FAIL',
        ENG: 'Data modification failed. This may be a DB error.',
        KR: '데이터 수정에 실패하였습니다. DB 에러일 수 있습니다.',
      };
    },

    DELETE_ONE_FAIL: {
      CODE: 'DELETE_ONE_FAIL',
      ENG: 'Data deletion failed. This may be a DB error.',
      KR: '데이터 삭제에 실패하였습니다. DB 에러일 수 있습니다.',
    },
  };
}
