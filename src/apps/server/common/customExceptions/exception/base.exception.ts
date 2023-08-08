import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { ErrorCode } from '@apps/server/common/customExceptions/errorCode';
import ErrorMessage from '@apps/server/common/customExceptions/errorMessage';
import { BaseExceptionPropertyType, ErrorTypeEnum } from '@apps/server/common/enum/errorType.enum';

export class BaseException extends HttpException {
  @Exclude()
  private readonly _statusCode: number;

  @Exclude()
  private readonly _success = false as const;

  @Exclude()
  private readonly _title: string;

  @Exclude()
  private readonly _errorCode: ErrorCode;

  @Exclude()
  private readonly _errorMessage: ErrorMessage | string;

  @Exclude()
  private readonly _errorType: ErrorTypeEnum;

  @Exclude()
  raw?: unknown;

  constructor(properties: Pick<BaseException, BaseExceptionPropertyType>) {
    super('', properties.statusCode);
    this._success = false;
    this._title = properties.title;
    this._statusCode = properties.statusCode;
    this._errorCode = properties.errorCode;
    this._errorMessage = properties.errorMessage;
    this._errorType = properties.errorType;
    this.raw = properties?.raw;
  }

  public getResponse() {
    return {
      statusCode: this.statusCode,
      success: false,
      data: {
        title: this.title,
        errorCode: this.errorCode,
        errorMessage: this.errorMessage,
      },
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

  @ApiProperty({ description: '에러 제목' })
  @Expose()
  get title(): string {
    return this._title;
  }

  @ApiProperty({ description: '에러 코드' })
  @Expose()
  get errorCode(): ErrorCode {
    return this._errorCode;
  }

  @ApiProperty({ description: '에러 메세지' })
  @Expose()
  get errorMessage(): ErrorMessage {
    return this._errorMessage;
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
