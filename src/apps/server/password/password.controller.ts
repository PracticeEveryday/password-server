import { RouteTable } from '../common/decorator/router-table.decorator';
import { PasswordUtilService } from '../../../libs/utils/password-util/password-util.service';
import { Route } from '../common/decorator/router.decorator';
import { Method } from '../common/enum/method.enum';
import { Body, HttpStatus, Query, ValidationPipe } from '@nestjs/common';
import { CreatePassworeReqDto } from './dto/create-password.req.dto';
import { PasswordService } from './password.service';
import {
  createPasswordDescriptionMd,
  createPasswordSuccMd,
  createPasswordSummaryMd,
  getPasswordByDomainDescriptionMd,
  getPasswordByDomainSuccMd,
  getPasswordByDomainSummaryMd,
} from './docs/password.docs';
import { CreatePasswordResDto } from './dto/create-password.res.dto';
import { GetDomainReqDto } from './dto/getDomain.req.dto';
import { GetDomainResDto, GetDomainResDtoNotFoundExceptionResDto } from './dto/getDomain.res.dto';
import { ApiNotFoundResponse } from '@nestjs/swagger';

@RouteTable({
  path: 'password',
  tag: {
    title: '🔭비밀 번호 API',
    category: 'public',
  },
})
export class PasswordController {
  constructor(readonly passwordService: PasswordService) {}

  @Route({
    request: {
      method: Method.POST,
      path: '/',
    },
    response: {
      code: HttpStatus.CREATED,
      type: CreatePasswordResDto,
      description: createPasswordSuccMd,
    },
    description: createPasswordDescriptionMd,
    summary: createPasswordSummaryMd,
  })
  public async create(@Body(ValidationPipe) createPassworeReqDto: CreatePassworeReqDto): Promise<CreatePasswordResDto> {
    const result = await this.passwordService.create(createPassworeReqDto);
    console.log(result);

    return result;
  }

  @ApiNotFoundResponse({ type: GetDomainResDtoNotFoundExceptionResDto, description: '⛔ 해당 도메인의 비밀번호 정보가 없습니다.' })
  @Route({
    request: {
      method: Method.GET,
      path: '/',
    },
    response: {
      code: HttpStatus.OK,
      type: GetDomainResDto,
      description: getPasswordByDomainSuccMd,
    },
    description: getPasswordByDomainDescriptionMd,
    summary: getPasswordByDomainSummaryMd,
  })
  public async getPasswordByDomain(@Query(ValidationPipe) getDomainReqDto: GetDomainReqDto): Promise<GetDomainResDto> {
    return await this.passwordService.getPasswordByDomain(getDomainReqDto);
  }
}
