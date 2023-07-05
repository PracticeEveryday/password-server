import { Injectable } from '@nestjs/common';
import { Connection, ConnectionOptions, createConnection, OkPacket, RowDataPacket } from 'mysql2';
import { EnvService } from '../env/env.service';
import { EnvEnum } from '../env/envEnum';
import { CreatePassworeReqDto } from '../../apps/server/password/dto/create-password.req.dto';
import { ConflictException } from '../../apps/server/common/customExceptions/conflict.exception';
import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import { ResultSetHeader } from 'mysql2/typings/mysql/lib/protocol/packets';

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

  private async getConnectionPool() {
    const pool: Pool = createPool(this.connectionOptions);

    return await pool.getConnection();
  }

  private realeaseConnectionPool(connectionPool: PoolConnection) {
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
        this.realeaseConnectionPool(connectionPool);
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
  public async executeSingleQuery<T extends OkPacket | ResultSetHeader | RowDataPacket[] | RowDataPacket[][] | OkPacket[]>(query: string) {
    const connectionPool = await this.getConnectionPool();
    return await connectionPool.execute<T>(query);
  }
}
