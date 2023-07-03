import { Injectable } from '@nestjs/common';
import { CreatePassworeReqDto } from './dto/create-password.req.dto';
import { MysqlService } from '../../../libs/mysql/mysql.service';
import { ConflictException } from '../common/customExceptions/conflict.exception';
import { conflictScript } from '../common/customExceptions/exceptionScript';
import { PasswordUtilService } from '../../../libs/utils/password-util/password-util.service';
import { PasswordInterface } from '../../../libs/mysql/types/password.type';
import { CreatePasswordResDto } from './dto/create-password.res.dto';
import { GetDomainReqDto } from './dto/getDomain.req.dto';
import { NotFoundException } from '../common/customExceptions/notFound.exception';

@Injectable()
export class PasswordService {
  constructor(private readonly mysqlService: MysqlService, private readonly passwordUtilService: PasswordUtilService) {}

  public async create(body: CreatePassworeReqDto): Promise<CreatePasswordResDto> {
    const result = await this.mysqlService.findPasswordByDomain(body.domain);
    if (result[0]) {
      throw new ConflictException(conflictScript('conflict exist domain', '해당 도메인의 패스워드 정보가 이미 저장되어 있습니다.'));
    }

    body.password = this.passwordUtilService.hashPassword(body.password);
    const [row, fields] = await this.mysqlService.createPassword(body);

    if (row.affectedRows === 1) {
      const [rows, fields] = await this.mysqlService.executeSingleQuery<PasswordInterface[]>(
        `SELECT domain FROM password.passwords WHERE id=${row.insertId}`,
      );

      return new CreatePasswordResDto(rows[0].domain);
    }
  }

  public async getPasswordByDomain(param: GetDomainReqDto) {
    const result = await this.mysqlService.findPasswordByDomain(param.domain);
    if (result.length === 0) {
      throw new NotFoundException({ title: 'not found domain', message: '해당 도메인의 비밀번호 데이터가 없습니다.' });
    }

    return this.passwordUtilService.decodedPassword(result[0].password);
  }
}
