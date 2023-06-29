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

class Server {
  private mysql: MysqlService;
  private readlineService: ReadlineService;
  constructor() {
    this.mysql = new MysqlService(new EnvService(new ConfigService()));
    this.readlineService = new ReadlineService(new MysqlService(new EnvService(new ConfigService())));
  }

  public async precondition(): Promise<void> {
    try {
      await this.mysql.connection.promise().query(initTablePassword);
      await this.mysql.connection.promise().query(initTableIsFirst);
      await this.mysql.connection.promise().query(initTablePrequalification);
      await this.mysql.connection.promise().query(initFirstValue);
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
      const rows = await this.mysql.connection.promise().query('SELECT is_first FROM password.is_firsts WHERE id = 1');
      const flag = rows[0][0].is_first;

      if (Boolean(flag)) {
        const test = await this.confirmAboutPrequalifications();
        if (test) {
          this.bootstrap();
        }
      } else {
        // flag가 true가 아니면 질문을 다시 합니다.
        this.askQuestions();
      }
    } catch (error) {
      // 최초에는 isFirst가 없기 때문입니다.
      await this.precondition();
      this.askQuestions();
    }
  }
}

const server = new Server();
server.init();
