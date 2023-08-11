import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import ErrorResponse from '@apps/server/common/customExceptions/errorResponse';
import { BaseExceptionPropertyType, ErrorTypeEnum } from '@apps/server/common/enum/errorType.enum';

export class BaseException extends HttpException {
  @Exclude() private readonly _statusCode: number;
  @Exclude() private readonly _success = false as const;
  @Exclude() private readonly _errorResponse: ErrorResponse;
  @Exclude() private readonly _errorType: ErrorTypeEnum;
  @Exclude() raw?: unknown;

  constructor(properties: Pick<BaseException, BaseExceptionPropertyType>) {
    super('', properties.statusCode);
    this._success = false;
    this._statusCode = properties.statusCode;
    this._errorResponse = properties.errorResponse;
    this._errorType = properties.errorType;
    this.raw = properties?.raw;
  }

  public getResponse() {
    return {
      error: this.errorResponse,
    };
  }

  @ApiProperty({ description: '응답코드' })
  @Expose()
  get statusCode(): number {
    return this._statusCode;
  }

  @ApiProperty({ description: 'error or warn' })
  @Expose()
  get errorType(): ErrorTypeEnum {
    return this._errorType;
  }

  @ApiProperty({ description: '에러 메세지' })
  @Expose()
  get errorResponse(): ErrorResponse {
    return this._errorResponse;
  }

  @ApiProperty({ description: 'API 요청 성공 유무' })
  @Expose()
  get success(): boolean {
    return this._success;
  }

  @ApiProperty({ description: '에러 메시지' })
  @Expose()
  message: string;
}
