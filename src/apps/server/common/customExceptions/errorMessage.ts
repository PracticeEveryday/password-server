export default class ErrorMessage {
  public static readonly COMMON = {
    COMMON_0500: 'INTERNAL_SERVER_ERROR',
  };

  public static readonly AUTH = {
    //400
    AUTH_4001: 'ALREADY_EXIST_USER',

    // 404
    AUTH_4041: 'NOT_FOUND_USER',
  };

  public static readonly PASSWORD = {
    // 400
    AUTH_4001: {
      ENG: 'PASSWORD_TYPE_ERROR',
      KR: '비밀번호의 타입이 아닙니다.',
    },

    // 404
    AUTH_4041: {
      ENG: 'NOT_FOUND_DOMAIN',
      KR: '해당 도메인의 정보를 찾을 수 없습니다.',
    },
    AUTH_4042: {
      ENG: 'NOT_FOUND_PASSWORD',
      KR: '해당 비밀 번호를 찾을 수 없습니다.',
    },

    //409
    AUTH_4091: {
      ENG: 'PASSWORD_ALREADY_EXIST',
      KR: '해당 비밀 번호의 정보가 이미 존재합니다.',
    },
  };

  public static readonly BOOK = {
    //404
    BOOK_4041: {
      ENG: 'NOT_FOUND_BOOK_BY_ID',
      KR: '해당 아이디의 책 정보가 존재하지 않습니다.',
    },

    //409
    BOOK_4091: {
      ENG: 'BOOK_ALREADY_EXIST',
      KR: '해당 타이틀의 책 정보가 이미 존재합니다.',
    },
  };
}
