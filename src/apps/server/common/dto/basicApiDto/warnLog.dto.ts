import { BaseException } from '@commons/customExceptions/exception';

export class WarnLogDto {
  private readonly _exception: BaseException;
  private readonly _requestInfo: { url: string; method: string; body: string; headers: string };

  constructor(exception: BaseException, requestInfo: { url: string; method: string; body: string; headers: string }) {
    this._exception = exception;
    this._requestInfo = requestInfo;
  }

  get exception(): BaseException {
    return this._exception;
  }

  get requestInfo(): { url: string; method: string; body: string; headers: string } {
    return this._requestInfo;
  }
}
