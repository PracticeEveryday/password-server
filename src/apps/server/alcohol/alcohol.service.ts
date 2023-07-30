import { Inject, Injectable } from '@nestjs/common';

import { CreateAlcoholDto } from './dto/createAlcohol.dto';
import { UpdateAlcoholDto } from './dto/updateAlcohol.dto';
import { AlcoholRepositoryInterface } from './interface/alcohol.interface';
import { InjectionToken } from '../../../libs/mysql/repository/injectionToken';

@Injectable()
export class AlcoholService {
  constructor(@Inject(InjectionToken.ALCOHOL_REPOSIROTY) private readonly alcoholRepository: AlcoholRepositoryInterface) {}

  public async create(createAlcoholDto: CreateAlcoholDto) {
    const result = await this.alcoholRepository.create(createAlcoholDto);
    console.log(result);
    return result;
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
