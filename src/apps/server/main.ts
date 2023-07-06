import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { OkPacket } from 'mysql2';

import { AppModule } from './app.module';
import { UnknownException } from './common/customExceptions/unknown.exception';
import { ServerStatusEnum } from './common/enum/serverStatus.enum';
import { EnvService } from '../../libs/env/env.service';
import { EnvEnum } from '../../libs/env/envEnum';
import { LogService } from '../../libs/log/log.service';
import { MysqlService } from '../../libs/mysql/mysql.service';
import { PrequalificationRepository } from '../../libs/mysql/repositories/prequalification.repository';
import { ServerInfoRepository } from '../../libs/mysql/repositories/serverInfo.repository.service';
import { initTablePassword, initTableIsFirst, initTablePrequalification, initFirstValue } from '../../libs/mysql/sql/initTablePassword';
import { ReadlineService } from '../../libs/readline/readline.service';
import { setupSwagger } from '../../libs/swagger/swagger';
import { DateUtilService } from '../../libs/utils/date-util/date-util.service';

class Server {
  private readonly ROW_IDX = 0 as const;
  private readonly mysql: MysqlService;
  private readonly readlineService: ReadlineService;
  private readonly dateUtilService: DateUtilService;
  private readonly logService: LogService;

  constructor() {
    this.mysql = new MysqlService(new EnvService(new ConfigService()));
    this.dateUtilService = new DateUtilService();
    this.readlineService = new ReadlineService(
      new PrequalificationRepository(new MysqlService(new EnvService(new ConfigService()))),
      new ServerInfoRepository(new MysqlService(new EnvService(new ConfigService()))),
    );
    this.logService = new LogService();
  }

  /**
   * 사전에 필요한 데이터와 테이블을 생성하는 함수입니다.
   */
  public async precondition(): Promise<void> {
    try {
      await this.mysql.parallelTransaction([initTablePassword, initTableIsFirst, initTablePrequalification, initFirstValue]);
    } catch (error) {
      this.logService.errorLog('Server', 'precondition error', error);
      throw new UnknownException({ title: 'sql error', message: '초기 sql에서 나는 에러입니다. 확인해주세요', raw: error });
    }
  }

  /**
   * 처음 사전 질문을 입력한 뒤 하루가 지나면 다시 입력할 수 있도록 업데이트 하는 함수입니다.
   */
  public async timeValidation() {
    try {
      const selectResult = await this.mysql.connection
        .promise()
        .query<OkPacket>('SELECT server_status, updatedAt FROM password.server_infos WHERE id = 1');

      const dateDiff = this.dateUtilService.diffDays(selectResult[this.ROW_IDX][this.ROW_IDX].updatedAt, new Date());
      if (dateDiff >= 1) {
        await this.mysql.executeSingleQuery(
          `UPDATE password.server_infos SET server_status = '${ServerStatusEnum.PENDING}', updatedAt = CURRENT_TIMESTAMP WHERE id = 1`,
        );
      }
    } catch (error) {
      this.logService.errorLog('Server', 'timeValidation error', error);
      throw new UnknownException({ title: 'sql error', message: '초기 sql에서 나는 에러입니다. 확인해주세요', raw: error });
    }
  }

  /**
   * 서버를 시작하기 위해 질문할 내역과 답변을 입력하는 함수입니다.
   */
  public askQuestions(): void {
    this.readlineService.processingQuestions();
  }

  /**
   * 서버를 시작하기 위해 질문에 답하는 함수입니다.
   */
  public async confirmAboutPrequalifications(): Promise<boolean> {
    const totalPrequalifications = await this.mysql.executeSingleQuery('SELECT id, question, answer FROM password.prequalifications');
    const prequalificationArr = totalPrequalifications[this.ROW_IDX] as unknown as { id: number; question: string; answer: string }[];

    return await this.readlineService.processingAboutPrequalifications(prequalificationArr);
  }

  /**
   * 질문에 대해 올바르게 답변했으면 서버를 시작하는 함수입니다.
   */
  public async bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    setupSwagger(app);

    app.setGlobalPrefix('/api', { exclude: ['/'] });

    const envService = app.get(EnvService);
    const PORT = +envService.get(EnvEnum.PORT) || 3000;

    await app.listen(PORT);
  }

  /**
   * 최초 서버를 시작하는 메서드입니다.
   */
  public async init(): Promise<void> {
    try {
      const rows = await this.mysql.connection.promise().query('SELECT server_status FROM password.server_infos WHERE id = 1');
      const flag = rows[this.ROW_IDX][this.ROW_IDX].server_status;

      if (flag === 'pending') {
        // pending이라면 질문합니다.
        const test = await this.confirmAboutPrequalifications();
        if (test) {
          await this.mysql.executeSingleQuery(
            `UPDATE password.server_infos SET server_status = '${ServerStatusEnum.ACTIVE}', updatedAt = CURRENT_TIMESTAMP WHERE id = 1`,
          );
          await this.bootstrap();
        }
      } else if (flag === 'active') {
        await this.timeValidation();
        // 서버 상태가 active면 서버를 시작합니다.
        await this.bootstrap();
      }
    } catch (error) {
      // 데이터가 없으면 사전 작업을 진행합니다.
      await this.precondition();
      this.askQuestions();
    }
  }
}

const server = new Server();
server.init();
