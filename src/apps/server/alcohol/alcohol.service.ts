import { Injectable } from '@nestjs/common';

import { CreateAlcoholDto } from './dto/create-alcohol.dto';
import { UpdateAlcoholDto } from './dto/update-alcohol.dto';

@Injectable()
export class AlcoholService {
  create(createAlcoholDto: CreateAlcoholDto) {
    return 'This action adds a new alcohol';
  }

  findAll() {
    return `This action returns all alcohol`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alcohol`;
  }

  update(id: number, updateAlcoholDto: UpdateAlcoholDto) {
    return `This action updates a #${id} alcohol`;
  }

  remove(id: number) {
    return `This action removes a #${id} alcohol`;
  }
}
