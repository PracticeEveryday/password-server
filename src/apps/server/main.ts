import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from '../../libs/env/env.service';
import { EnvEnum } from '../../libs/env/envEnum';
import { setupSwagger } from '../../libs/swagger/swagger';
import { ReadlineService } from '../../libs/readline/readline.service';
import { MysqlService } from '../../libs/mysql/mysql.service';
import { ConfigService } from '@nestjs/config';
import { initTablePassword, initTableIsFirst, initTablePrequalification, initFirstValue } from '../../libs/mysql/sql/initTablePassword';
import { UnknownException } from './common/customExceptions/unknown.exception';
import { ServerStatusEnum } from './common/enum/serverStatus.enum';

class Server {
  private mysql: MysqlService;
  private readlineService: ReadlineService;
  constructor() {
    this.mysql = new MysqlService(new EnvService(new ConfigService()));
    this.readlineService = new ReadlineService(new MysqlService(new EnvService(new ConfigService())));
  }

  public async precondition(): Promise<void> {
    try {
      await this.mysql.parallelTransaction([initTablePassword, initTableIsFirst, initTablePrequalification, initFirstValue]);
    } catch (error) {
      console.log(error);
      throw new UnknownException({ title: 'sql error', message: '초기 sql에서 나는 에러입니다. 확인해주세요', raw: error });
    }
  }

  public askQuestions(): void {
    this.readlineService.askQuestions();
  }

  public async confirmAboutPrequalifications(): Promise<boolean> {
    const totalPrequalifications = await this.mysql.connection
      .promise()
      .query('SELECT id, question, answer FROM password.prequalifications');
    const prequalificationArr = totalPrequalifications[0] as unknown as { id: number; question: string; answer: string }[];
    return await this.readlineService.askAboutPrequalifications(prequalificationArr);
  }

  public async bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    setupSwagger(app);

    const envService = app.get(EnvService);
    const PORT = +envService.get(EnvEnum.PORT) || 3000;

    await app.listen(PORT);
  }

  public async init(): Promise<void> {
    try {
      const rows = await this.mysql.connection.promise().query('SELECT server_status FROM password.server_infos WHERE id = 1');
      const flag = rows[0][0].server_status;

      if (flag === 'pending') {
        // pending이라면 질문합니다.
        const test = await this.confirmAboutPrequalifications();
        if (test) {
          this.mysql.connection
            .promise()
            .query(
              `UPDATE password.server_infos SET server_status = '${ServerStatusEnum.ACTIVE}', updatedAt = CURRENT_TIMESTAMP WHERE id = 1`,
            );
          this.bootstrap();
        }
      } else if (flag === 'active') {
        // 서버 상태가 active면 서버를 시작합니다.
        this.bootstrap();
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
