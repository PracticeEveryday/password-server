import { Injectable } from '@nestjs/common';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

import { CreatePasswordReqDto } from '@apps/server/modules/password/dto/api-dto/createPassword.req.dto';
import { GetDomainParamReqDto } from '@apps/server/modules/password/dto/api-dto/getDomain.req.dto';
import { GetPasswordsQueryReqDto } from '@apps/server/modules/password/dto/api-dto/getPasswords.req.dto';
import { PasswordInterface } from '@apps/server/modules/password/interface/password.interface';
import { PasswordRepositoryInterface } from '@apps/server/modules/password/interface/PasswordRepository.interface';
import { FindOneByIdReqDto } from '@commons/dto/basicApiDto';
import { PasswordSqlInterface } from '@libs/mysql/interface/password.interface';
import { MysqlService } from '@libs/mysql/mysql.service';
@Injectable()
export class PasswordRepository implements PasswordRepositoryInterface {
  private ROW_IDX = 0 as const;

  private FILED_IDX = 1 as const;

  constructor(private readonly mysqlService: MysqlService) {}

  /**
   * 도메인과 일치하는 것을 삭제합니다.
   * @param param GetDomainParamReqDto
   */
  public async removeOneByDomain(param: GetDomainParamReqDto): Promise<ResultSetHeader> {
    const query = `DELETE FROM password.password WHERE domain = '${param.domain}'`;
    const deleteQueryResult = await this.mysqlService.executeSingleQuery<ResultSetHeader>(query);

    return deleteQueryResult[this.ROW_IDX];
  }

  /**
   * 페이지네이션 옵션만큼 가져옵니다.
   * @param queryDto GetPasswordsQueryReqDto
   */
  public async findManyWithPagination(queryDto: GetPasswordsQueryReqDto): Promise<PasswordInterface[]> {
    const query = `SELECT * FROM password.password ORDERS LIMIT ${queryDto.pageSize} OFFSET ${(queryDto.pageNo - 1) * queryDto.pageSize}`;
    const selectQueryResult = await this.mysqlService.executeSingleQuery<PasswordInterface[]>(query);

    return selectQueryResult[this.ROW_IDX];
  }

  /**
   * 전체 개수를 반환합니다.
   */
  public async count(): Promise<RowDataPacket> {
    const query = `SELECT COUNT(*) AS totalCount FROM password.password `;
    const selectQueryResult = await this.mysqlService.executeSingleQuery<RowDataPacket[]>(query);

    return selectQueryResult[this.ROW_IDX][this.ROW_IDX];
  }

  /**
   * 비밀번호 정보를 업데이트합니다.
   *
   * @param password PasswordInterface
   */
  public async updateOne(password: PasswordInterface): Promise<ResultSetHeader> {
    const query = `UPDATE password.password SET password='${password.password}', domain='${password.domain}' WHERE id=${password.id}`;
    const selectQueryResult = await this.mysqlService.executeSingleQuery<ResultSetHeader>(query);

    return selectQueryResult[this.ROW_IDX];
  }

  /**
   * 비밀번호 정보 생성
   *
   * @param body CreatePassworeReqDto(domain, 해쉬된 password 정보가 들어 있습니다.)
   */
  public async createOne(body: CreatePasswordReqDto): Promise<ResultSetHeader> {
    const query = `INSERT INTO password.password (domain, password, createdAt, updatedAt, deletedAt) VALUES ('${body.domain}', '${body.password}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, null)`;
    const createQueryResult = await this.mysqlService.executeSingleQuery<ResultSetHeader>(query);

    return createQueryResult[this.ROW_IDX];
  }

  /**
   * 도메인이 일치하는 것을 반환합니다.
   *
   * @param getDomainQueryReqDto 도메인 ex naver, google...
   */
  public async findOneByDomain(getDomainQueryReqDto: GetDomainParamReqDto): Promise<PasswordInterface> {
    const query = `SELECT * FROM password.password WHERE domain='${getDomainQueryReqDto.domain}'`;
    const queryResult = await this.mysqlService.executeSingleQuery<PasswordInterface[]>(query);

    return queryResult[this.ROW_IDX][this.ROW_IDX];
  }

  /**
   * id가 일치하는 것을 반환합니다.
   *
   * @param findOneByIdReqDto id 숫자
   */
  public async findOneById(findOneByIdReqDto: FindOneByIdReqDto): Promise<PasswordInterface> {
    const query = `SELECT * FROM password.password WHERE id=${findOneByIdReqDto.id}`;
    const queryResult = await this.mysqlService.executeSingleQuery<PasswordInterface[]>(query);

    return queryResult[this.ROW_IDX][this.ROW_IDX];
  }
}
