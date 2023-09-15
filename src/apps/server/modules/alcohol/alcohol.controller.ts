import { Get, Body, Patch, Param, Delete, HttpStatus, UseInterceptors } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';

import { AlcoholService } from '@apps/server/modules/alcohol/alcohol.service';
import { CreateAlcoholDto } from '@apps/server/modules/alcohol/dto/createAlcohol.dto';
import { UpdateAlcoholDto } from '@apps/server/modules/alcohol/dto/updateAlcohol.dto';
import { TransactionManager } from '@commons/framework/decorator/connectionPool.decorator';
import { Route } from '@commons/framework/decorator/router.decorator';
import { RouteTable } from '@commons/framework/decorator/routerTable.decorator';
import { TransactionInterceptor } from '@commons/framework/interceptor/transaction.interceptor';
import { TryCatchInterceptor } from '@commons/framework/interceptor/tryCatch.interceptor';
import { Method } from '@commons/variable/enum/method.enum';

import * as AlcoholDocs from './docs/alcohol.docs';

@RouteTable({
  path: 'alcohols',
  version: '1',
  tag: {
    title: '💸 술 API',
    category: 'public',
  },
})
@UseInterceptors(TryCatchInterceptor)
export class AlcoholController {
  constructor(private readonly alcoholService: AlcoholService) {}

  // --POST
  @Route({
    request: {
      path: '/',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
      // type: FindOneByIdResDto,
      description: AlcoholDocs.createAlcoholSuccMd,
    },
    summary: AlcoholDocs.createAlcoholSummaryMd,
    description: AlcoholDocs.createAlcoholDescriptionMd,
  })
  @UseInterceptors(TransactionInterceptor)
  create(@Body() createAlcoholDto: CreateAlcoholDto, @TransactionManager() _connectionPool: PoolConnection) {
    return this.alcoholService.create(createAlcoholDto);
  }

  @Get()
  findAll() {
    return this.alcoholService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alcoholService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlcoholDto: UpdateAlcoholDto) {
    return this.alcoholService.update(+id, updateAlcoholDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alcoholService.remove(+id);
  }
}
