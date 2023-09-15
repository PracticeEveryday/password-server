import { BaseException } from '@commons/exception/exception';
import { RequestInfoInterface } from '@commons/type/interface/requestInfo.interface';

export class WarnLogDto {
  private readonly _exception: BaseException;
  private readonly _requestInfo: RequestInfoInterface;

  constructor(exception: BaseException, requestInfo: RequestInfoInterface) {
    this._exception = exception;
    this._requestInfo = requestInfo;
  }

  get exception(): BaseException {
    return this._exception;
  }

  get requestInfo(): RequestInfoInterface {
    return this._requestInfo;
  }
}
