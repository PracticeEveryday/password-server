import { Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { AlcoholService } from './alcohol.service';
import { CreateAlcoholDto } from './dto/create-alcohol.dto';
import { UpdateAlcoholDto } from './dto/update-alcohol.dto';
import { RouteTable } from '../common/decorator/router-table.decorator';

@RouteTable({
  path: 'alcohols',
  tag: {
    title: '💸 술 API',
    category: 'public',
  },
})
export class AlcoholController {
  constructor(private readonly alcoholService: AlcoholService) {}

  @Post()
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
