import { PasswordDomain } from '@apps/server/modules/password/domain/password.domain';
import { PasswordSqlInterface } from '@libs/adapter/db/mysql/interface/password.interface';

export default class PasswordMapper {
  public static toOptionalDomain(passwordSql: PasswordSqlInterface | null): PasswordDomain | null {
    if (!passwordSql) {
      return null;
    }

    const passwordDomain = new PasswordDomain(passwordSql);

    return passwordDomain;
  }

  public static toRequiredDomain(passwordSql: PasswordSqlInterface): PasswordDomain {
    const passwordDomain = new PasswordDomain(passwordSql);

    return passwordDomain;
  }

  public static toDomains(passwords: PasswordSqlInterface[]): PasswordDomain[] {
    const passwordDomains = new Array<PasswordDomain>();
    passwords.forEach((password) => {
      const product = this.toRequiredDomain(password);
      passwordDomains.push(product);
    });
    return passwordDomains;
  }
}
