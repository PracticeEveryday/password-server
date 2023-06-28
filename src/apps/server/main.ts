import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from '../../libs/env/env.service';
import { EnvEnum } from '../../libs/env/envEnum';
import { setupSwagger } from '../../libs/swagger/swagger';
import { ReadlineService } from '../../libs/readline/readline.service';
import * as process from 'process';

const { exec } = require('child_process');

let flag = false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  const envService = app.get(EnvService);
  const PORT = +envService.get(EnvEnum.PORT) || 3000;

  await app.listen(PORT);
}
async function bootstrap2() {
  const readlineService = new ReadlineService();
  readlineService.askQuestions();

  flag = true;
}

if (flag) {
  bootstrap();
} else {
  bootstrap2();
}
