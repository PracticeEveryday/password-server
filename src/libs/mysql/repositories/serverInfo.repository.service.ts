import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { RowDataPacket } from 'mysql2';
import { ServerStatusEnum } from '../../../apps/server/common/enum/serverStatus.enum';

@Injectable()
export class ServerInfoRepository {
  private ROW_IDX: 0 = 0;
  private FILED_IDX: 1 = 1;

  constructor(private readonly mysqlService: MysqlService) {}

  public async findById(id: number): Promise<RowDataPacket[]> {
    const query = `SELECT * FROM password.serverInfos WHERE id = ${id}`;
    const findQueryResult = this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return findQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  public async update(serverInfo: ServerStatusEnum, id: number) {
    const query = `UPDATE password.server_infos SET server_status = '${serverInfo}', updatedAt = CURRENT_TIMESTAMP WHERE id = ${id}`;
    const updatedQueryResult = this.mysqlService.executeSingleQuery(query);

    return updatedQueryResult;
  }
}
