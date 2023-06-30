import { Injectable } from '@nestjs/common';
import { CreatePassworeReqDto } from './dto/create-password.req.dto';
import { MysqlService } from '../../../libs/mysql/mysql.service';
import { NotFoundException } from '../common/customExceptions/notFound.exception';
import { ConflictException } from '../common/customExceptions/conflict.exception';
import { conflictScript } from '../common/customExceptions/exceptionScript';

@Injectable()
export class PasswordService {
  constructor(private readonly mysqlService: MysqlService) {}
  public async create(body: CreatePassworeReqDto) {
    const password = await this.mysqlService.findPasswordByDomain(body.domain);
    if (password.length !== 0) {
      throw new ConflictException(conflictScript('conflict exist domain', '해당 도메인의 패스워드 정보가 이미 저장되어 있습니다.'));
    }

    const newPassword = await this.mysqlService.createPassword(body);
    return newPassword;
  }
}
