export type passwordRequiredProps = Required<{
  readonly domain: string;
  readonly password: string;
}>;

export type passwordOptionalProps = Partial<{
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
}>;

export type passwordProps = passwordRequiredProps & Required<passwordOptionalProps>;

export interface PasswordInterface {
  properties: () => passwordProps;
}

export class PasswordDomain implements PasswordInterface {
  private readonly id: number;
  private domain: string;
  private password: string;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;
  private readonly deletedAt: Date | null;

  constructor(properties: passwordRequiredProps & passwordOptionalProps) {
    Object.assign(this, properties);
  }

  public properties() {
    return {
      id: this.id,
      domain: this.domain,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}
