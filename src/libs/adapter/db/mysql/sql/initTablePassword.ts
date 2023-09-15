import { ServerStatusEnum } from '@commons/variable/enum/serverStatus.enum';

const initTablePassword = `
CREATE TABLE IF NOT EXISTS password (
    id            INT              AUTO_INCREMENT    PRIMARY KEY    COMMENT 'password의 Unique Id',
    domain        VARCHAR(100)     NOT NULL     COMMENT '비밀번호 도메인',
    password      VARCHAR(150)     NOT NULL     COMMENT '비밀번호',
    created_at     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP COMMENT '생성된 시간',
    updated_at     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP     ON UPDATE    CURRENT_TIMESTAMP   COMMENT '마지막으로 업데이트 된 시간',
    deleted_at     TIMESTAMP      NULL        COMMENT '삭제된 시간'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='비밀번호를 저장하기 위한 TABLE';
`;

const initTableIsFirst = `
CREATE TABLE IF NOT EXISTS server_info (
    id            INT      AUTO_INCREMENT PRIMARY KEY COMMENT 'server_info의 UniqueId',
    server_status ENUM('active', 'inactive', 'pending')  DEFAULT 'inactive'   NOT NULL COMMENT '서버의 상태',
    created_at     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP COMMENT '생성된 시간',
    updated_at     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP     ON UPDATE    CURRENT_TIMESTAMP   COMMENT '마지막으로 업데이트 된 시간',
    deleted_at     TIMESTAMP      NULL        COMMENT '삭제된 시간'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='서버의 상태를 저장하기 위한 TABLE';
`;

const initTablePreQualification = `
    CREATE TABLE IF NOT EXISTS pre_qualification (
    id          INT              AUTO_INCREMENT    PRIMARY KEY COMMENT 'pre_qualifications의 UniqueId',
    question    VARCHAR(100)     NOT NULL          COMMENT '사전 질문',
    answer      VARCHAR(100)     NOT NULL          COMMENT '사전 질문 답변',
    created_at     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP COMMENT '생성된 시간',
    updated_at     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP     ON UPDATE    CURRENT_TIMESTAMP   COMMENT '마지막으로 업데이트 된 시간',
    deleted_at     TIMESTAMP      NULL        COMMENT '삭제된 시간'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='사전 질문을 저장하기 위한 TABLE';
`;

const initTableBook = `
CREATE TABLE IF NOT EXISTS book (
    id            INT              AUTO_INCREMENT    PRIMARY KEY    COMMENT 'books의 UniqueId',
    title         VARCHAR(100)     UNIQUE            NOT NULL   COMMENT '책 제목',
    price         INT              NOT NULL     COMMENT '책 가격',
    book_report   VARCHAR(1000)                      NULL   COMMENT '독후감',
    start_date    TIMESTAMP        NOT NULL          DEFAULT CURRENT_TIMESTAMP  COMMENT '책을 읽기 시작한 날짜',
    end_date      TIMESTAMP                           NULL  COMMENT '책을 다 읽은 날짜',
    created_at     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP COMMENT '생성된 시간',
    updated_at     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP     ON UPDATE    CURRENT_TIMESTAMP   COMMENT '마지막으로 업데이트 된 시간',
    deleted_at     TIMESTAMP      NULL        COMMENT '삭제된 시간'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='책 정보를 저장하기 위한 TABLE';
`;

const initTableBookMeta = `
CREATE TABLE IF NOT EXISTS book_meta (
    id            INT              AUTO_INCREMENT    PRIMARY KEY    COMMENT 'book_meta의 Unique Id',
    book_id       INT         UNIQUE     NOT NULL     COMMENT '연결된 Book의 Id',
    author        VARCHAR(50)      NOT NULL     COMMENT '저자',
    publisher     VARCHAR(50)      NOT NULL     COMMENT '출판사',
    page_count    INT              NOT NULL     COMMENT '책의 전체 페이지 수',
    created_at     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP COMMENT '생성된 시간',
    updated_at     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP     ON UPDATE    CURRENT_TIMESTAMP   COMMENT '마지막으로 업데이트 된 시간',
    deleted_at     TIMESTAMP      NULL        COMMENT '삭제된 시간',
    FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE 
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='책의 메타 정보를 저장하기 위한 TABLE';
`;
const initTableAlcohol = `
CREATE TABLE IF NOT EXISTS alcohol (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'alcohols의 UniqueId',
    drinking_date TIMESTAMP DEFAULT (CURRENT_TIMESTAMP) COMMENT '술마신 날짜',
    relationship VARCHAR(30) NOT NULL COMMENT '어떤 관계의 사람들',
    mood VARCHAR(30) NOT NULL COMMENT '어떤 기분이었는지',
    created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP) COMMENT '생성된 시간',
    updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP) COMMENT '마지막으로 업데이트 된 시간',
    deleted_at TIMESTAMP COMMENT '삭제된 시간'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='술 마신 정보를 저장하기 위한 TABLE'; 
`;

const initTableRound = `
CREATE TABLE IF NOT EXISTS round (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'round UniqueId',
    alcohol_id INT NOT NULL COMMENT '연결된 alcohol id',
    amount INT NOT NULL COMMENT '해당 Round의 지출액',
    category VARCHAR(30) NOT NULL COMMENT '술 자리 종류',
    created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP) COMMENT '생성된 시간',
    updated_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP) COMMENT '마지막으로 업데이트 된 시간',
    deleted_at TIMESTAMP COMMENT '삭제된 시간',
    FOREIGN KEY (alcohol_id) REFERENCES alcohol(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='술을 몇차까지 갔는지의 정보를 저장하기 위한 TABLE';
`;

export const initFirstValue = `
INSERT INTO password.server_info (id, server_status, created_at, updated_at, deleted_at)
VALUES(1, '${ServerStatusEnum.INACTIVE}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);
`;

export const InitTableArr = [
  initTablePassword,
  initTableIsFirst,
  initTablePreQualification,
  initTableBook,
  initTableBookMeta,
  initFirstValue,
  initTableAlcohol,
  initTableRound,
];
