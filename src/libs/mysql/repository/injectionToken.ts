/**
 * DB 주입할 때 사용하는 토큰입니다.
 */
export enum InjectionToken {
  PASSWORD_SQL_REPOSITORY = 'passwordSqlRepository',
  PASSWORD_TYPEORM_REPOSITORY = 'passwordTypeOrmRepository',

  SERVER_INFO_REPOSITORY = 'serverInfoRepository',
  PRE_QUALIFICATION_REPOSITORY = 'preQualificationRepository',
  BOOK_REPOSITORY = 'bookRepository',
  BOOK_META_REPOSITORY = 'bookMetaRepository',
  ALCOHOL_REPOSITORY = 'alcoholRepository',
}
