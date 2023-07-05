import { Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { RowDataPacket } from 'mysql2';

@Injectable()
export class serverInfoRepository {
  private ROW_IDX: 0 = 0;
  private FILED_IDX: 1 = 1;

  constructor(private readonly mysqlService: MysqlService) {}

  public async findById(id: number) {
    const query = `SELECT * FROM password.serverInfos WHERE id = ${id}`;
    const createQueryResult = this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return createQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  public async update() {}
}
