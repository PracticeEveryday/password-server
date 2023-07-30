import { Test, TestingModule } from '@nestjs/testing';

import { BookService } from './book.service';
import { CreateBookReqDto } from './dto/api-dto/createBook.req.dto';
import { CreateBookResDto } from './dto/api-dto/createBook.res.dto';
import { DeleteBookReqDto } from './dto/api-dto/deleteBook.req.dto';
import { FindOneByIdResDto } from './dto/api-dto/findOneById.res.dto';
import { UpdateBookReqDto } from './dto/api-dto/updateBook.req.dto';
import { bookProviders } from './provider/book.provider';
import { MysqlModule } from '../../../libs/mysql/mysql.module';
import { MysqlService } from '../../../libs/mysql/mysql.service';
import { SqlUtilModule } from '../../../libs/util/sql/sqlUtil.module';
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
      createOne: jest.fn().mockReturnValue(CreateBookResDto),
      removeOne: jest.fn().mockImplementation(async (_body: DeleteBookReqDto): Promise<DeletedResDto> => {
        return new DeletedResDto(true);
      }),
      findOneById: jest.fn().mockReturnValue(FindOneByIdResDto),
      updateOne: jest.fn().mockImplementation(async (_body: UpdateBookReqDto, _param: FindOneByIdReqDto) => {
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

    const newBook = await bookService.createOne(createBookReqDto);
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

    const updated = await bookService.updateOne(updatedBookReqDto, findOneByIdReqDto);
    const updatedMock = await bookMockService.updateOne(updatedBookReqDto, findOneByIdReqDto);
    expect(updated).toStrictEqual(updatedMock);
  });

  it('책 정보 삭제', async () => {
    const deleteBookReqDto = DeleteBookReqDto.toDTO(newBookId);
    deleteBookReqDto.setConnectionPool = await mysqlService.getConnectionPool();

    const deletedResult = await bookService.removeOne(deleteBookReqDto);
    const deletedMockResult = await bookMockService.removeOne(deleteBookReqDto);

    expect(deletedResult).toEqual(deletedMockResult);
  });
});
