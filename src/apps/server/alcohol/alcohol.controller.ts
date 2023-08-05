import { Get, Body, Patch, Param, Delete, HttpStatus, UseInterceptors } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';

import { AlcoholService } from '@apps/server/alcohol/alcohol.service';
import { CreateAlcoholDto } from '@apps/server/alcohol/dto/createAlcohol.dto';
import { UpdateAlcoholDto } from '@apps/server/alcohol/dto/updateAlcohol.dto';
import { TransactionManager } from '@apps/server/common/decorator/connectionPool.decorator';
import { Route } from '@apps/server/common/decorator/router.decorator';
import { RouteTable } from '@apps/server/common/decorator/routerTable.decorator';
import { Method } from '@apps/server/common/enum/method.enum';
import { TransactionInterceptor } from '@apps/server/common/interceptor/transaction.interceptor';
import { TryCatchInterceptor } from '@apps/server/common/interceptor/tryCatch.interceptor';

import * as AlcoholDocs from './docs/alcohol.docs';

@RouteTable({
  path: 'alcohols',
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
  create(@Body() createAlcoholDto: CreateAlcoholDto, @TransactionManager() connectionPool: PoolConnection) {
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
