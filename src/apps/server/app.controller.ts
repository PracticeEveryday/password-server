import { Controller, Get } from '@nestjs/common';

import { AppService } from '@apps/server/app.service';
import { ReadlineStartService } from '@libs/readline/readlineStart.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly readlineService: ReadlineStartService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
