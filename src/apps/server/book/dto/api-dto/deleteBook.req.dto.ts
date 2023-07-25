import { PickType } from '@nestjs/swagger';
import { PoolConnection } from 'mysql2/promise';

import { BookDto } from '../../../common/dto/book.dto';

export class DeleteBookReqDto extends PickType(BookDto, ['id']) {
  // 로직을 진행하다가 추가되는 프로퍼티들
  private _connectionPool?: PoolConnection;

  set setConnectionPool(connectionPool: PoolConnection) {
    this._connectionPool = connectionPool;
  }

  get connectionPool(): PoolConnection {
    return this._connectionPool;
  }
}
