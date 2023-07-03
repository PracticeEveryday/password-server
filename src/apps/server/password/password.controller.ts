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
  recommendPasswordDescriptionMd,
  recommendPasswordSuccMd,
  recommendPasswordSummaryMd,
} from './docs/password.docs';
import { CreatePasswordResDto } from './dto/create-password.res.dto';
import { GetDomainReqDto } from './dto/getDomain.req.dto';
import { GetDomainResDto, GetDomainResDtoNotFoundExceptionResDto } from './dto/getDomain.res.dto';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { GetRecommendPasswordReqQueryDto } from './dto/recommendPassword.req.dto';
import { GetRecommendPasswordResDto } from './dto/recommendPassword.res.dto';

@RouteTable({
  path: 'password',
  tag: {
    title: '🔭비밀 번호 API',
    category: 'public',
  },
})
export class PasswordController {
  constructor(readonly passwordService: PasswordService, readonly passwordUtilService: PasswordUtilService) {}

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
    return await this.passwordService.create(createPassworeReqDto);
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

  @Route({
    request: {
      method: Method.GET,
      path: '/recommend',
    },
    response: {
      code: HttpStatus.OK,
      type: GetRecommendPasswordResDto,
      description: recommendPasswordSuccMd,
    },
    description: recommendPasswordDescriptionMd,
    summary: recommendPasswordSummaryMd,
  })
  public recommendPassword(
    @Query(ValidationPipe) getRecommendPasswordReqQueryDto: GetRecommendPasswordReqQueryDto,
  ): GetRecommendPasswordResDto {
    return this.passwordUtilService.recommendRandomPassword(getRecommendPasswordReqQueryDto.passwordLength);
  }
}
