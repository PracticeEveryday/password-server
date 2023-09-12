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
  private _id: number;
  private _domain: string;
  private _password: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(properties: passwordRequiredProps & passwordOptionalProps) {
    Object.assign(this, properties);
  }

  public properties() {
    return {
      id: this._id,
      domain: this._domain,
      password: this._password,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get domain(): string {
    return this._domain;
  }

  set domain(value: string) {
    this._domain = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  set deletedAt(value: Date | null) {
    this._deletedAt = value;
  }
}
