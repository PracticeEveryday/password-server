import { Inject, Injectable } from '@nestjs/common';
import { MysqlService } from '../mysql.service';
import { RowDataPacket, ResultSetHeader, FieldPacket } from 'mysql2';
import { PasswordInterface } from '../types/password.type';
import { CreatePassworeReqDto } from '../../../apps/server/password/dto/create-password.req.dto';
import { ValidateUtilService } from '../../utils/validate-util/validate-util.service';

@Injectable()
export class PasswordRepository {
  private ROW_IDX: 0 = 0;
  private FILED_IDX: 1 = 1;
  constructor(private readonly mysqlService: MysqlService, private readonly validateUtilService: ValidateUtilService) {}

  /**
   * 비밀번호 정보 생성
   * @param body CreatePassworeReqDto(domain, 해쉬된 password 정보가 들어 있습니다.)
   */
  public async create(body: CreatePassworeReqDto): Promise<ResultSetHeader> {
    const query = `INSERT INTO password.passwords (domain, password, createdAt, updatedAt, deletedAt) VALUES ('${body.domain}', '${body.password}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)`;
    const createQueryResult = await this.mysqlService.executeSingleQuery<ResultSetHeader>(query);

    return createQueryResult[this.ROW_IDX];
  }

  /**
   * 도메인이 일치하는 것을 반환합니다.
   * @param domain 도메인 ex naver, google...
   */
  public async findOneByDomain(domain: string): Promise<RowDataPacket> {
    const query = `SELECT * FROM password.passwords WHERE domain='${domain}'`;
    const queryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return queryResult[this.ROW_IDX][this.ROW_IDX];
  }

  /**
   * id가 일치하는 것을 반환합니다.
   * @param id id 숫자
   */
  public async findOneById(id: number): Promise<RowDataPacket> {
    const query = `SELECT * FROM password.passwords WHERE id=${id}`;
    const queryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return queryResult[this.ROW_IDX][this.ROW_IDX];
  }
}
