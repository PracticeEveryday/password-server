import { Get, Body, Patch, Param, Delete, HttpStatus, UseInterceptors } from '@nestjs/common';

import { AlcoholService } from './alcohol.service';
import * as AlcoholDocs from './docs/alcohol.docs';
import { CreateAlcoholDto } from './dto/createAlcohol.dto';
import { UpdateAlcoholDto } from './dto/updateAlcohol.dto';
import { Route } from '../common/decorator/router.decorator';
import { RouteTable } from '../common/decorator/routerTable.decorator';
import { Method } from '../common/enum/method.enum';
import { TryCatchInterceptor } from '../common/interceptor/tryCatch.interceptor';
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
  create(@Body() createAlcoholDto: CreateAlcoholDto) {
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
