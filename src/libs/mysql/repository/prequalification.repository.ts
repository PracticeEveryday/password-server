import { Injectable } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { ServerStatusEnum } from '../../../apps/server/common/enum/serverStatus.enum';
import { MysqlService } from '../mysql.service';

@Injectable()
export class PrequalificationRepository {
  private ROW_IDX = 0 as const;
  private FILED_IDX = 1 as const;
  constructor(private readonly mysqlService: MysqlService) {}

  public async findOneById(id: number): Promise<RowDataPacket> {
    const query = `SELECT * FROM password.prequalification WHERE id=${id}`;
    const selectQueryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return selectQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  public async create(question: string, answer: string) {
    const query = `
        INSERT INTO password.prequalification  (question, answer, createdAt, updatedAt, deletedAt)
        VALUES('${question}', '${answer}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null);
      `;
    const createQueryResult = await this.mysqlService.executeSingleQuery<ResultSetHeader>(query);
    return createQueryResult[this.ROW_IDX];
  }

  public async update(id: number, serverStatus: ServerStatusEnum): Promise<RowDataPacket> {
    const query = `UPDATE password.prequalification SET server_status='${serverStatus}'`;
    const selectQueryResult = await this.mysqlService.executeSingleQuery(query);

    return selectQueryResult[this.ROW_IDX][this.ROW_IDX];
  }
}
