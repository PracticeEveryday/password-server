import { Body, HttpStatus, Param, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

import {
  createPasswordDescriptionMd,
  createPasswordSuccMd,
  createPasswordSummaryMd,
  deleteOneDescriptionMd,
  deleteOneSuccMd,
  deleteOneSummaryMd,
  getPasswordArrWithPaginationDescriptionMd,
  getPasswordArrWithPaginationSuccMd,
  getPasswordArrWithPaginationSummaryMd,
  getPasswordByDomainDescriptionMd,
  getPasswordByDomainSuccMd,
  getPasswordByDomainSummaryMd,
  recommendPasswordDescriptionMd,
  recommendPasswordSuccMd,
  recommendPasswordSummaryMd,
  updatePasswordDescriptionMd,
  updatePasswordSuccMd,
  updatePasswordSummaryMd,
} from './docs/password.docs';
import { CreatePasswordReqDto } from './dto/api-dto/create-password.req.dto';
import { CreatePasswordResDto } from './dto/api-dto/create-password.res.dto';
import { GetDomainParamReqDto } from './dto/api-dto/getDomain.req.dto';
import { GetDomainResDto, GetDomainResDtoNotFoundExceptionResDto } from './dto/api-dto/getDomain.res.dto';
import { GetPasswordsQueryReqDto } from './dto/api-dto/getPasswords.req.dto';
import { GetPasswordsResDto } from './dto/api-dto/getPasswords.res.dto';
import { GetRecommendPasswordReqQueryDto } from './dto/api-dto/recommendPassword.req.dto';
import { GetRecommendPasswordResDto } from './dto/api-dto/recommendPassword.res.dto';
import { UpdatePasswordReqDto } from './dto/api-dto/updatePassword.req.dto';
import { UpdatePasswordResDto } from './dto/api-dto/updatePassword.res.dto';
import { PasswordService } from './password.service';
import { PasswordUtilService } from '../../../libs/utils/password-util/password-util.service';
import { ValidateUtilService } from '../../../libs/utils/validate-util/validate-util.service';
import { RouteTable } from '../common/decorator/router-table.decorator';
import { Route } from '../common/decorator/router.decorator';
import { Method } from '../common/enum/method.enum';
import { TryCatchInterceptor } from '../common/interceptor/tryCatch.interceptor';

@RouteTable({
  path: 'passwords',
  tag: {
    title: '🔭비밀 번호 API',
    category: 'public',
  },
})
@UseInterceptors(TryCatchInterceptor)
export class PasswordController {
  constructor(
    readonly passwordService: PasswordService,
    readonly passwordUtilService: PasswordUtilService,
    private readonly validateUtilService: ValidateUtilService,
  ) {}

  // -- GET
  @Route({
    request: {
      method: Method.GET,
      path: '/',
    },
    response: {
      code: HttpStatus.OK,
      type: GetPasswordsResDto,
      description: getPasswordArrWithPaginationSuccMd,
    },
    description: getPasswordArrWithPaginationDescriptionMd,
    summary: getPasswordArrWithPaginationSummaryMd,
  })
  public async getPasswordArrWithPagination(@Query() getPasswordsReqDto: GetPasswordsQueryReqDto): Promise<GetPasswordsResDto> {
    return await this.passwordService.findAllWithPagination(getPasswordsReqDto);
  }

  @ApiNotFoundResponse({ type: GetDomainResDtoNotFoundExceptionResDto, description: '⛔ 해당 도메인의 비밀번호 정보가 없습니다.' })
  @Route({
    request: {
      method: Method.GET,
      path: '/:domain',
    },
    response: {
      code: HttpStatus.OK,
      type: GetDomainResDto,
      description: getPasswordByDomainSuccMd,
    },
    description: getPasswordByDomainDescriptionMd,
    summary: getPasswordByDomainSummaryMd,
  })
  public async getPasswordByDomain(@Param(ValidationPipe) getDomainParamReqDto: GetDomainParamReqDto): Promise<GetDomainResDto> {
    return await this.passwordService.findOneByDomain(getDomainParamReqDto);
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

  // --POST
  @Route({
    request: {
      method: Method.POST,
      path: '/',
    },
    response: {
      code: HttpStatus.CREATED,
      // type: CreatePasswordResDto,
      description: createPasswordSuccMd,
    },
    description: createPasswordDescriptionMd,
    summary: createPasswordSummaryMd,
  })
  public async create(@Body(ValidationPipe) createPasswordReqDto: CreatePasswordReqDto): Promise<CreatePasswordResDto> {
    return await this.passwordService.create(createPasswordReqDto);
  }

  // -- PUT
  @Route({
    request: {
      method: Method.PUT,
      path: '/',
    },
    response: {
      code: HttpStatus.CREATED,
      type: UpdatePasswordResDto,
      description: updatePasswordSuccMd,
    },
    description: updatePasswordDescriptionMd,
    summary: updatePasswordSummaryMd,
  })
  public async update(@Body(ValidationPipe) updatePasswordReqDto: UpdatePasswordReqDto) {
    return await this.validateUtilService.validateResponse<UpdatePasswordResDto>(await this.passwordService.update(updatePasswordReqDto));
  }

  // -- DELETE
  @Route({
    request: {
      method: Method.DELETE,
      path: '/:domain',
    },
    response: {
      code: HttpStatus.CREATED,
      type: CreatePasswordResDto,
      description: deleteOneSuccMd,
    },
    description: deleteOneDescriptionMd,
    summary: deleteOneSummaryMd,
  })
  public async deleteOneByDomain(@Param(ValidationPipe) getDomainParamReqDto: GetDomainParamReqDto) {
    return await this.validateUtilService.validateResponse<CreatePasswordResDto>(
      await this.passwordService.deleteOneByDomain(getDomainParamReqDto),
    );
  }
}
