export class AxiosReqDto {
  private readonly _url: string;
  private readonly _data: unknown;
  private readonly _headers: unknown;
  private readonly _stack: string;

  constructor(param: { url: string; data: unknown; headers: unknown; stack: string }) {
    this._url = param.url;
    this._data = param.data;
    this._headers = param.headers;
    this._stack = param.stack;
  }

  get url(): string {
    return this._url;
  }

  get data(): unknown {
    return this._data;
  }

  get headers(): unknown {
    return this._headers;
  }

  get stack(): string {
    return this._stack;
  }
}
