export const initTablePassword = `
CREATE TABLE IF NOT EXISTS passwords (
  id            INT PRIMARY KEY     NOT NULL,
  domain        VARCHAR(100)        NOT NULL,
  password      VARCHAR(150)        NOT NULL,
  createdAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP   ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci;
`;

export const initTableIsFirst = `
CREATE TABLE IF NOT EXISTS is_first (
  id            INT   PRIMARY KEY     NOT NULL,
  isFirst       BIT   DEFAULT FALSE   NOT NULL,
  createdAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP   ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci;
`;

export const initTablePrequalification = `
CREATE TABLE IF NOT EXISTS prequalifications (
  id            INT   PRIMARY KEY     NOT NULL,
  question      VARCHAR(100)          NOT NULL,
  answer        VARCHAR(100)          NOT NULL,
  createdAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP DEFAULT               CURRENT_TIMESTAMP   ON UPDATE CURRENT_TIMESTAMP,
  deletedAt     TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci;
`;
