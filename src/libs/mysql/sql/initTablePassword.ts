import { ServerStatusEnum } from '../../../apps/server/common/enum/serverStatus.enum';

export const initTablePassword = `
CREATE TABLE IF NOT EXISTS passwords (
    id            INT              AUTO_INCREMENT    PRIMARY KEY    COMMENT 'password의 Unique Id',
    domain        VARCHAR(100)     NOT NULL     COMMENT '비밀번호 도메인',
    password      VARCHAR(150)     NOT NULL     COMMENT '비밀번호',
    createdAt     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP COMMENT '생성된 시간',
    updatedAt     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP     ON UPDATE    CURRENT_TIMESTAMP   COMMENT '마지막으로 업데이트 된 시간',
    deletedAt     TIMESTAMP      NULL        COMMENT '삭제된 시간'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='비밀번호를 저장하기 위한 TABLE';
`;

export const initTableIsFirst = `
CREATE TABLE IF NOT EXISTS server_infos (
    id            INT      AUTO_INCREMENT PRIMARY KEY COMMENT 'server_infos의 UniqueId',
    server_status ENUM('active', 'inactive', 'pending')  DEFAULT 'inactive'   NOT NULL COMMENT '서버의 상태',
    createdAt     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP COMMENT '생성된 시간',
    updatedAt     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP     ON UPDATE    CURRENT_TIMESTAMP   COMMENT '마지막으로 업데이트 된 시간',
    deletedAt     TIMESTAMP      NULL        COMMENT '삭제된 시간'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='서버의 상태를 저장하기 위한 TABLE';
`;

export const initTablePrequalification = `
    CREATE TABLE IF NOT EXISTS prequalifications (
    id          INT              AUTO_INCREMENT    PRIMARY KEY COMMENT 'prequalifications의 UniqueId',
    question    VARCHAR(100)     NOT NULL          COMMENT '사전 질문',
    answer      VARCHAR(100)     NOT NULL          COMMENT '사전 질문 답변',
    createdAt     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP COMMENT '생성된 시간',
    updatedAt     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP     ON UPDATE    CURRENT_TIMESTAMP   COMMENT '마지막으로 업데이트 된 시간',
    deletedAt     TIMESTAMP      NULL        COMMENT '삭제된 시간'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='사전 질문을 저장하기 위한 TABLE';
`;

export const initTableBooks = `
CREATE TABLE IF NOT EXISTS books (
    id            INT              AUTO_INCREMENT    PRIMARY KEY    COMMENT 'books의 UniqueId',
    title         VARCHAR(100)     UNIQUE            NOT NULL   COMMENT '책 제목',
    price         INT              NOT NULL     COMMENT '책 가격',
    book_report   VARCHAR(1000)                      NULL   COMMENT '독후감',
    start_date    TIMESTAMP        NOT NULL          DEFAULT CURRENT_TIMESTAMP  COMMENT '책을 읽기 시작한 날짜',
    end_date      TIMESTAMP                           NULL  COMMENT '책을 다 읽은 날짜',
    createdAt     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP COMMENT '생성된 시간',
    updatedAt     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP     ON UPDATE    CURRENT_TIMESTAMP   COMMENT '마지막으로 업데이트 된 시간',
    deletedAt     TIMESTAMP      NULL        COMMENT '삭제된 시간'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='책 정보를 저장하기 위한 TABLE';
`;

export const initTableBookMetas = `
CREATE TABLE IF NOT EXISTS book_metas (
    id            INT              AUTO_INCREMENT    PRIMARY KEY    COMMENT 'book_metas의 Unique Id',
    book_id       INT              NOT NULL     COMMENT '연결된 Book의 Id',
    author        VARCHAR(50)      NOT NULL     COMMENT '저자',
    publisher     VARCHAR(50)      NOT NULL     COMMENT '출판사',
    page_count    INT              NOT NULL     COMMENT '책의 전체 페이지 수',
    createdAt     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP COMMENT '생성된 시간',
    updatedAt     TIMESTAMP      DEFAULT     CURRENT_TIMESTAMP     ON UPDATE    CURRENT_TIMESTAMP   COMMENT '마지막으로 업데이트 된 시간',
    deletedAt     TIMESTAMP      NULL        COMMENT '삭제된 시간',
    FOREIGN KEY (book_id) REFERENCES books(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci COMMENT='책의 메타 정보를 저장하기 위한 TABLE';
`;

export const initFirstValue = `
INSERT INTO password.server_infos (id, server_status, createdAt, updatedAt, deletedAt)
VALUES(1, '${ServerStatusEnum.INACTIVE}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);
`;
