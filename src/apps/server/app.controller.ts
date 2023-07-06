import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ReadlineService } from '../../libs/readline/readline.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly readlineService: ReadlineService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
