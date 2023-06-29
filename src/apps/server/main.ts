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

const mysql = new MysqlService(new EnvService(new ConfigService()));

async function precondition() {
  try {
    await mysql.connection.promise().query(initTablePassword);
    await mysql.connection.promise().query(initTableIsFirst);
    await mysql.connection.promise().query(initTablePrequalification);
    await mysql.connection.promise().query(initFirstValue);
  } catch (error) {
    console.log(error);
    throw new UnknownException({ title: 'sql error', message: '초기 sql에서 나는 에러입니다. 확인해주세요', raw: error });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  const envService = app.get(EnvService);
  const PORT = +envService.get(EnvEnum.PORT) || 3000;

  await app.listen(PORT);
}

async function bootstrap2() {
  const readlineService = new ReadlineService(new MysqlService(new EnvService(new ConfigService())));
  readlineService.askQuestions();
}

async function realStart() {
  try {
    const rows = await mysql.connection.promise().query('SELECT is_first FROM password.is_firsts WHERE id = 1');
    const flag = rows[0][0].is_first;

    if (Boolean(flag)) {
      bootstrap();
    }
  } catch (error) {
    // 최초에는 isFirst가 없기 때문입니다.
    precondition();
    bootstrap2();
  }
}
realStart();
