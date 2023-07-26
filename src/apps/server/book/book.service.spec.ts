import { Test, TestingModule } from '@nestjs/testing';

import { BookService } from './book.service';
import { CreateBookReqDto } from './dto/api-dto/createBook.req.dto';
import { CreateBookResDto } from './dto/api-dto/createBook.res.dto';
import { DeleteBookReqDto } from './dto/api-dto/deleteBook.req.dto';
import { FindOneByIdResDto } from './dto/api-dto/findOneById.res.dto';
import { UpdateBookReqDto } from './dto/api-dto/updateBook.req.dto';
import { bookProviders } from './providers/book.provider';
import { MysqlModule } from '../../../libs/mysql/mysql.module';
import { MysqlService } from '../../../libs/mysql/mysql.service';
import { SqlUtilModule } from '../../../libs/utils/sql-util/sql-util.module';
import { DeletedResDto } from '../common/dto/basic-api-dto/deleteResult.res.dto';
import { FindOneByIdReqDto } from '../common/dto/basic-api-dto/findOneById.req.dto';
import { UpdatedResDto } from '../common/dto/basic-api-dto/updateResult.res.dto';

describe('BookService Test', () => {
  let bookService: BookService;
  let bookMockService: Partial<BookService>;
  let mysqlService: MysqlService;
  let newBookId: number;
  beforeEach(async () => {
    bookMockService = {
      create: jest.fn().mockReturnValue(CreateBookResDto),
      deleteOne: jest.fn().mockImplementation(async (_body: DeleteBookReqDto): Promise<DeletedResDto> => {
        return new DeletedResDto(true);
      }),
      findOneById: jest.fn().mockReturnValue(FindOneByIdResDto),
      update: jest.fn().mockImplementation(async (_body: UpdateBookReqDto, _param: FindOneByIdReqDto) => {
        return new UpdatedResDto(true);
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [MysqlModule, SqlUtilModule],
      providers: [BookService, ...bookProviders],
    }).compile();

    bookService = module.get<BookService>(BookService);
    mysqlService = module.get<MysqlService>(MysqlService);
  });

  // service 유무 확인
  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  it('책 정보 생성', async () => {
    const createBookReqDto = CreateBookReqDto.toDTO({
      title: '책',
      price: 20000,
      author: '김동현',
      publisher: '김동현',
      pageCount: 200,
    });
    createBookReqDto.setConnectionPool = await mysqlService.getConnectionPool();

    const newBook = await bookService.create(createBookReqDto);
    newBookId = newBook.bookId;

    expect(newBook).toHaveProperty('bookId');
    expect(newBook).toHaveProperty('bookMetaId');
  });

  it('책 정보 수정', async () => {
    const updatedBookReqDto = UpdateBookReqDto.toDTO({
      title: '책',
      price: 20000,
      author: '김동현',
      publisher: '김동현',
      pageCount: 200,
      startDate: new Date(),
      endDate: new Date(),
    });

    const findOneByIdReqDto = FindOneByIdReqDto.toDTO(newBookId);

    updatedBookReqDto.setConnectionPool = await mysqlService.getConnectionPool();

    const updated = await bookService.update(updatedBookReqDto, findOneByIdReqDto);
    const updatedMock = await bookMockService.update(updatedBookReqDto, findOneByIdReqDto);
    expect(updated).toStrictEqual(updatedMock);
  });

  it('책 정보 삭제', async () => {
    const deleteBookReqDto = DeleteBookReqDto.toDTO(newBookId);
    deleteBookReqDto.setConnectionPool = await mysqlService.getConnectionPool();

    const deletedResult = await bookService.deleteOne(deleteBookReqDto);
    const deletedMockResult = await bookMockService.deleteOne(deleteBookReqDto);

    expect(deletedResult).toEqual(deletedMockResult);
  });
});
