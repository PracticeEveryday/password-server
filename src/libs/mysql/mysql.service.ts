import { Injectable } from '@nestjs/common';
import { Connection, ConnectionOptions, createConnection, RowDataPacket } from 'mysql2';
import { EnvService } from '../env/env.service';
import { EnvEnum } from '../env/envEnum';
import { NotFoundException } from '../../apps/server/common/customExceptions/notFound.exception';
import { CreatePassworeReqDto } from '../../apps/server/password/dto/create-password.req.dto';
import { ConflictException } from '../../apps/server/common/customExceptions/conflict.exception';
import { createPool, Pool, PoolConnection } from 'mysql2/promise';

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

  public async findPasswordByDomain(domain: string): Promise<RowDataPacket[][]> {
    try {
      const password = await this.connection
        .promise()
        .query<RowDataPacket[][]>(`SELECT domain, password FROM password.passwords WHERE domain='${domain}'`);
      return password[0];
    } catch (error) {
      throw new NotFoundException({
        title: 'not found domain info',
        message: '해당 도메인의 패스워드 정보가 없습니다.',
        raw: error,
      });
    }
  }

  public async createPassword(body: CreatePassworeReqDto) {
    try {
      return await this.connection
        .promise()
        .query(
          `INSERT INTO password.passwords (domain, password, createdAt, updatedAt, deletedAt) VALUES ('${body.domain}', '${body.password}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)`,
        );
    } catch (error) {
      console.log(error);
      throw new ConflictException({
        title: 'type error',
        message: '비밀번호와 도메인의 타입을 확인해주세요',
        raw: error,
      });
    }
  }
}
