import { Injectable } from '@nestjs/common';

import { CreateBookReqDto } from './dto/api-dto/createBook.req.dto';
import { CustomUnknownException } from '../common/customExceptions/exception/unknown.exception';

@Injectable()
export class BookService {
  public async create(createBookReqDto: CreateBookReqDto) {
    try {
      //
    } catch (error) {
      throw new CustomUnknownException({ title: 'UnknownException', message: 'book create', raw: error });
    }
  }
}
