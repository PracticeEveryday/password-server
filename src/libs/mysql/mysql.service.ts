import { Injectable } from '@nestjs/common';
import { Connection, ConnectionOptions, createConnection } from 'mysql2';
import { EnvService } from '../env/env.service';
import { EnvEnum } from '../env/envEnum';

@Injectable()
export class MysqlService {
  private connection: Connection;
  private connectionOptions: ConnectionOptions;

  constructor(private readonly envService: EnvService) {
    this.connectionOptions = {
      host: this.envService.get(EnvEnum.DATABASE_HOST),
      user: this.envService.get(EnvEnum.DATABASE_USER),
      database: this.envService.get(EnvEnum.DATABASE_DB),
      password: this.envService.get(EnvEnum.DATABASE_PASSWORD),
    };
    this.connection = createConnection(this.connectionOptions);
  }
}
