import { ServerStatusEnum } from '../../../apps/server/common/enum/serverStatus.enum';

export const initTablePassword = `
CREATE TABLE IF NOT EXISTS passwords (
  id            INT                   AUTO_INCREMENT        PRIMARY KEY,
  domain        VARCHAR(100)        NOT NULL,
  password      VARCHAR(150)        NOT NULL,
  createdAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP   ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci;
`;

export const initTableIsFirst = `
CREATE TABLE IF NOT EXISTS server_infos (
  id            INT                   AUTO_INCREMENT        PRIMARY KEY,
  server_status      ENUM('active', 'inactive', 'pending')  DEFAULT 'inactive'   NOT NULL,
  createdAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP   ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci;
`;

export const initTablePrequalification = `
CREATE TABLE IF NOT EXISTS prequalifications (
  id            INT                   AUTO_INCREMENT        PRIMARY KEY,
  question      VARCHAR(100)          NOT NULL,
  answer        VARCHAR(100)          NOT NULL,
  createdAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP   ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci;
`;

export const initTableBooks = `
CREATE TABLE IF NOT EXISTS books (
  id            INT                   AUTO_INCREMENT        PRIMARY KEY,
  title         VARCHAR(100)   UNIQUE   NOT NULL,
  price         INT                     NOT NULL,
  book_report   VARCHAR(1000)              NULL,
  start_date    TIMESTAMP                  NOT NULL  DEFAULT CURRENT_TIMESTAMP,
  end_date      TIMESTAMP                  NULL,
  createdAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP   ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci;
`;

export const initTableBookMetas = `
CREATE TABLE IF NOT EXISTS book_metas (
  id            INT                   AUTO_INCREMENT        PRIMARY KEY,
  book_id       INT                   NOT NULL,
  author        VARCHAR(50)           NOT NULL,
  publisher     VARCHAR(50)           NOT NULL,
  page_count    INT                   NOT NULL,
  createdAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP   ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     TIMESTAMP NULL,
  FOREIGN KEY (book_id) REFERENCES books(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci;
`;

export const initFirstValue = `
INSERT INTO password.server_infos (id, server_status, createdAt, updatedAt, deletedAt)
VALUES(1, '${ServerStatusEnum.INACTIVE}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);
`;
