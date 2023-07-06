import { Injectable } from '@nestjs/common';
import { Connection, ConnectionOptions, createConnection, OkPacket, RowDataPacket, ResultSetHeader, FieldPacket } from 'mysql2';
import { createPool, Pool, PoolConnection } from 'mysql2/promise';

import { EnvService } from '../env/env.service';
import { EnvEnum } from '../env/envEnum';

@Injectable()
export class MysqlService {
  public connection: Connection;
  public connectionOptions: ConnectionOptions;

  constructor(private readonly envService: EnvService) {
    this.connectionOptions = {
      host: this.envService.get(EnvEnum.DATABASE_HOST),
      user: this.envService.get(EnvEnum.DATABASE_USER),
      database: this.envService.get(EnvEnum.DATABASE_DB),
      password: this.envService.get(EnvEnum.DATABASE_PASSWORD),
    };

    this.connection = createConnection(this.connectionOptions);
  }

  private async getConnectionPool(): Promise<PoolConnection> {
    const pool: Pool = createPool(this.connectionOptions);

    return await pool.getConnection();
  }

  private releaseConnectionPool(connectionPool: PoolConnection): void {
    return connectionPool.release();
  }

  public async parallelTransaction(querys: string[]): Promise<void> {
    const connectionPool = await this.getConnectionPool();
    try {
      await connectionPool.beginTransaction();
      for (let i = 0; i < querys.length; i++) {
        await connectionPool.execute(querys[i]);
      }
    } catch (error) {
      if (connectionPool) {
        await connectionPool.rollback();
      }
    } finally {
      if (connectionPool) {
        this.releaseConnectionPool(connectionPool);
      }
    }
  }

  /**
   * 하나의 쿼리를 싫행하는 메서드 입니다.
   * @param query 실행할 SQL 쿼리문입니다.
   * 1.OkPacket:
   * 2.ResultSetHeader: Create Query
   * 3.RowDataPacket[]: Select Query
   * 4.RowDatePacket[][]
   * 5.OkPacket[]
   */
  public async executeSingleQuery<T extends OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[]>(
    query: string,
  ): Promise<[T, FieldPacket[]]> {
    const connectionPool = await this.getConnectionPool();
    return connectionPool.execute<T>(query);
  }
}
