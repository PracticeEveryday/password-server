import { Inject, Injectable } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';

import { AlcoholRepositoryInterface } from '@apps/server/alcohol/interface/alcohol.interface';
import { AlcoholDto } from '@apps/server/common/dto/alcohol.dto';
import { MysqlService } from '@libs/mysql/mysql.service';
import { SqlUtilService } from '@libs/util/sql/sqlUtil.service';

@Injectable()
export class AlcoholRepository implements AlcoholRepositoryInterface {
  private ROW_IDX = 0 as const;

  private FILED_IDX = 1 as const;

  constructor(
    @Inject(MysqlService) private readonly mysqlService: MysqlService,
    @Inject(SqlUtilService) private readonly sqlUtilService: SqlUtilService,
  ) {}

  public create = async (creatInfo: Partial<AlcoholDto>): Promise<ResultSetHeader> => {
    const query = `
      INSERT INTO password.alcohol (drinking_date, relationship, mood, createdAt, updatedAt, deletedAt)
      VALUES ('${creatInfo.drinkingDate.toISOString().slice(0, 19)}', '${creatInfo.relationship}', '${
      creatInfo.mood
    }', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)
    `;
    const createdQueryResult = await this.mysqlService.executeSingleQuery<ResultSetHeader>(query);

    return createdQueryResult[this.ROW_IDX];
  };
}
