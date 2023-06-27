import { HttpException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

type BaseExceptionPropertyType = 'statusCode' | 'title' | 'message' | 'raw';

export class BaseException extends HttpException {
  @Exclude() private readonly _statusCode: number;
  @Exclude() private readonly _success = false;
  @Exclude() private readonly _title: string;
  @Exclude() raw: Error;

  constructor(properties: Pick<BaseException, BaseExceptionPropertyType>) {
    super(properties.message, properties.statusCode);
    this._title = properties.title;
    this._statusCode = properties.statusCode;
    this._success = false;
    this.raw = properties.raw;
  }

  public getResponse() {
    return {
      statusCode: this.statusCode,
      success: false,
      data: {
        title: this.title,
        message: this.message,
      },
    };
  }

  @ApiProperty({ description: '응답코드' })
  @Expose()
  get statusCode(): number {
    return this._statusCode;
  }

  @ApiProperty({ description: '에러 제목' })
  @Expose()
  get title(): string {
    return this._title;
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
