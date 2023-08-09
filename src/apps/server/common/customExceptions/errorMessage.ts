export default class ErrorMessage {
  public static readonly COMMON = {
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  };

  public static readonly AUTH = {
    //400
    ALREADY_EXIST_USER: 'ALREADY_EXIST_USER',

    // 404
    NOT_FOUND_USER: 'NOT_FOUND_USER',
  };

  public static readonly PASSWORD = {
    // 400
    PASSWORD_TYPE_ERROR: {
      ENG: 'PASSWORD_TYPE_ERROR',
      KR: '비밀번호의 타입이 아닙니다.',
    },

    // 404
    NOT_FOUND_DOMAIN: {
      ENG: 'NOT_FOUND_DOMAIN',
      KR: '해당 도메인의 정보를 찾을 수 없습니다.',
    },
    NOT_FOUND_PASSWORD: {
      ENG: 'NOT_FOUND_PASSWORD',
      KR: '해당 비밀 번호를 찾을 수 없습니다.',
    },

    //409
    BOOK_ALREADY_EXIST: {
      ENG: 'BOOK_ALREADY_EXIST',
      KR: '해당 비밀 번호의 정보가 이미 존재합니다.',
    },
  };

  public static readonly BOOK = {
    //404
    NOT_FOUND_BOOK_BY_ID: {
      ENG: 'NOT_FOUND_BOOK_BY_ID',
      KR: '해당 아이디의 책 정보가 존재하지 않습니다.',
    },

    //409
    BOOK_ALREADY_EXIST: {
      ENG: 'BOOK_ALREADY_EXIST',
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
}
