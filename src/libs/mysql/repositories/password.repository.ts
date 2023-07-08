import { Injectable } from '@nestjs/common';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

import { UnknownException } from '../../../apps/server/common/customExceptions/unknown.exception';
import { CreatePasswordReqDto } from '../../../apps/server/password/dto/api-dto/create-password.req.dto';
import { GetDomainBodyReqDto } from '../../../apps/server/password/dto/api-dto/getDomain.req.dto';
import { GetPasswordsQueryReqDto } from '../../../apps/server/password/dto/api-dto/getPasswords.req.dto';
import { FindOneByIdDto } from '../../../apps/server/password/dto/basic-dto/findOneById.dto';
import { ValidateUtilService } from '../../utils/validate-util/validate-util.service';
import { MysqlService } from '../mysql.service';

@Injectable()
export class PasswordRepository {
  private ROW_IDX = 0 as const;
  private FILED_IDX = 1 as const;
  constructor(private readonly mysqlService: MysqlService, private readonly validateUtilService: ValidateUtilService) {}

  public async findAllWithPagination(queryDto: GetPasswordsQueryReqDto): Promise<RowDataPacket[]> {
    try {
      const query = `SELECT * FROM password.passwords ORDERS LIMIT ${queryDto.pageSize} OFFSET ${
        (queryDto.pageNo - 1) * queryDto.pageSize
      }`;
      const selectQueryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

      return selectQueryResult[this.ROW_IDX];
    } catch (error) {
      throw new UnknownException({ title: 'UnkwonException', message: 'getPasswordsReqDto', raw: error });
    }
  }

  public async count() {
    const query = `SELECT COUNT(*) AS totalCount FROM password.passwords `;
    const selectQueryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return selectQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  /**
   * 비밀번호 정보 생성
   * @param body CreatePassworeReqDto(domain, 해쉬된 password 정보가 들어 있습니다.)
   */
  public async create(body: CreatePasswordReqDto): Promise<ResultSetHeader> {
    const query = `INSERT INTO password.passwords (domain, password, createdAt, updatedAt, deletedAt) VALUES ('${body.domain}', '${body.password}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)`;
    const createQueryResult = await this.mysqlService.executeSingleQuery<ResultSetHeader>(query);

    return createQueryResult[this.ROW_IDX];
  }

  /**
   * 도메인이 일치하는 것을 반환합니다.
   * @param getDomainQueryReqDto 도메인 ex naver, google...
   */
  public async findOneByDomain(getDomainQueryReqDto: GetDomainBodyReqDto): Promise<RowDataPacket> {
    const query = `SELECT * FROM password.passwords WHERE domain='${getDomainQueryReqDto.domain}'`;
    const queryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return queryResult[this.ROW_IDX][this.ROW_IDX];
  }

  /**
   * id가 일치하는 것을 반환합니다.
   * @param findOneByIdDto id 숫자
   */
  public async findOneById(findOneByIdDto: FindOneByIdDto): Promise<RowDataPacket> {
    const query = `SELECT * FROM password.passwords WHERE id=${findOneByIdDto.id}`;
    const queryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return queryResult[this.ROW_IDX][this.ROW_IDX];
  }
}
