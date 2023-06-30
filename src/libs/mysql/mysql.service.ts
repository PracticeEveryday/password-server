import { Injectable } from '@nestjs/common';
import { Connection, ConnectionOptions, createConnection, createPool } from 'mysql2';
import { EnvService } from '../env/env.service';
import { EnvEnum } from '../env/envEnum';
import { NotFoundException } from '../../apps/server/common/customExceptions/notFound.exception';

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

  public async findPasswordByDomain(domain: string) {
    try {
      return await this.connection.promise().query(`SELECT * FROM password.passwords WHERE domain = ${domain}`);
    } catch (error) {
      throw new NotFoundException({
        title: 'not found domain info',
        message: '해당 도메인의 패스워드 정보가 없습니다.',
        raw: error,
      });
    }
  }
}
