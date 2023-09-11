import { Test, TestingModule } from '@nestjs/testing';

import { CreatePasswordReqDto } from '@apps/server/modules/password/dto/api-dto/createPassword.req.dto';
import { GetDomainParamReqDto } from '@apps/server/modules/password/dto/api-dto/getDomain.req.dto';
import { GetDomainResDto } from '@apps/server/modules/password/dto/api-dto/getDomain.res.dto';
import { UpdatePasswordReqDto } from '@apps/server/modules/password/dto/api-dto/updatePassword.req.dto';
import { PasswordServiceHelper } from '@apps/server/modules/password/helper/passwordService.helper';
import { PasswordService } from '@apps/server/modules/password/password.service';
import { passwordProviders } from '@apps/server/modules/password/provider/password.provider';
import { CreateResDto } from '@commons/dto/basicApiDto/createResult.res.dto';
import { DeletedResDto } from '@commons/dto/basicApiDto/deleteResult.res.dto';
import { UpdatedResDto } from '@commons/dto/basicApiDto/updateResult.res.dto';
import { EnvModule } from '@libs/env/env.module';
import { LogModule } from '@libs/log/log.module';
import { MysqlModule } from '@libs/mysql/mysql.module';

const getDomainResDto = new GetDomainResDto('test1');

describe('PasswordService Test', () => {
  let passwordService: PasswordService;
  let mockPasswordService: Partial<PasswordService>;

  beforeEach(async () => {
    mockPasswordService = {
      findOneByDomain: jest.fn().mockReturnValue(getDomainResDto),
      createOne: jest.fn().mockImplementation(async (_body: CreatePasswordReqDto): Promise<CreateResDto> => {
        return new CreateResDto(true);
      }),
      updateOne: jest.fn().mockImplementation(async (_body: UpdatedResDto): Promise<UpdatedResDto> => {
        return new UpdatedResDto(true);
      }),
      removeOne: jest.fn().mockReturnValue(new DeletedResDto(true)),
    };

    const module: TestingModule = await Test.createTestingModule({
      // 의존성 주입하 Module 넣기
      imports: [LogModule, EnvModule, MysqlModule],
      // 테스트할 모듈 넣기
      providers: [PasswordService, PasswordServiceHelper, ...passwordProviders],
    }).compile();

    passwordService = module.get<PasswordService>(PasswordService);
  });

  // service 유무 확인
  it('should be defined', () => {
    expect(passwordService).toBeDefined();
  });

  it('password 생성하기', async () => {
    const createPasswordReqDto = CreatePasswordReqDto.toDTO('test', 'test1');
    const newPassword = await passwordService.createOne(createPasswordReqDto);
    const createResDto = new CreateResDto(true);
    const result = await mockPasswordService.createOne(createPasswordReqDto);

    // 생성하는 것도 같음.
    expect(result).toStrictEqual(newPassword);
    expect(result).toStrictEqual(createResDto);
  });

  it('Domain에 따른 비밀번호 가져오기', async () => {
    const getDomainBodyReqDto = GetDomainParamReqDto.toDTO('test');
    const password = await passwordService.findOneByDomain(getDomainBodyReqDto);

    const mockResult = await mockPasswordService.findOneByDomain(getDomainBodyReqDto);
    // 있는 거는 같음.
    expect(mockResult).toStrictEqual(password);
  });

  it('password update', async () => {
    const updatePasswordReqDto = new UpdatePasswordReqDto();
    updatePasswordReqDto.domain = 'test';
    updatePasswordReqDto.password = '12345678a';
    const updated = await passwordService.updateOne(updatePasswordReqDto);

    const mockResult = await mockPasswordService.updateOne(updatePasswordReqDto);
    // 있는 거는 같음.
    expect(mockResult).toStrictEqual(updated);
  });

  it('Domain의 비밀번호 삭제하기', async () => {
    const getDomainBodyReqDto = GetDomainParamReqDto.toDTO('test');
    const deleteResult = await passwordService.removeOne(getDomainBodyReqDto);
    const mockResult = await mockPasswordService.removeOne(getDomainBodyReqDto);
    // 있는 거는 같음.
    expect(mockResult).toStrictEqual(deleteResult);
  });

  describe('Domain 데이터가 없을 떄', () => {
    it('Domain의 비밀번호가 존재하지 않을 때', async () => {
      // 없으면 에러 던짐
      const notFoundDto = GetDomainParamReqDto.toDTO('없는거');
      await expect(async () => await passwordService.findOneByDomain(notFoundDto)).rejects.toThrow();
    });

    it('Domain의 비밀번호가 존재하지 않을 때', async () => {
      // 없으면 에러 던짐
      const notFoundDto = GetDomainParamReqDto.toDTO('없는거');
      await expect(async () => await passwordService.removeOne(notFoundDto)).rejects.toThrow();
    });

    it('password update 시 도메인 정보가 없을떄', async () => {
      const updatePasswordReqDto = new UpdatePasswordReqDto();
      updatePasswordReqDto.domain = 'test1';
      updatePasswordReqDto.password = '12345678a';

      await expect(async () => await passwordService.updateOne(updatePasswordReqDto)).rejects.toThrow();
    });
  });
});
