import { Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2';

import { ServerStatusEnum } from '@apps/server/common/enum/serverStatus.enum';

import { MysqlService } from '../mysql.service';

@Injectable()
export class ServerInfoRepository {
  private ROW_IDX = 0 as const;

  private FILED_IDX = 1 as const;

  constructor(private readonly mysqlService: MysqlService) {}

  public async findById(id: number): Promise<RowDataPacket> {
    const query = `SELECT * FROM password.server_info WHERE id = ${id}`;
    const findQueryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return findQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  public async update(serverInfo: ServerStatusEnum, id: number) {
    const query = `UPDATE password.server_info SET server_status = '${serverInfo}', updatedAt = CURRENT_TIMESTAMP WHERE id = ${id}`;
    const updatedQueryResult = await this.mysqlService.executeSingleQuery(query);

    return updatedQueryResult;
  }
}
