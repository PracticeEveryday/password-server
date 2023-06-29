import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from '../../libs/env/env.service';
import { EnvEnum } from '../../libs/env/envEnum';
import { setupSwagger } from '../../libs/swagger/swagger';
import { ReadlineService } from '../../libs/readline/readline.service';
import { MysqlService } from '../../libs/mysql/mysql.service';
import { ConfigService } from '@nestjs/config';
import { initTablePassword, initTableIsFirst, initTablePrequalification } from '../../libs/mysql/sql/initTablePassword';
import { UnknownException } from './common/customExceptions/unknown.exception';

let flag = false;

async function precondition() {
  const mysql = new MysqlService(new EnvService(new ConfigService()));
  try {
    await mysql.connection.promise().query(initTablePassword);
    await mysql.connection.promise().query(initTableIsFirst);
    await mysql.connection.promise().query(initTablePrequalification);
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
  flag = true;
}

if (flag) {
  bootstrap();
} else {
  precondition();
  bootstrap2();
}
