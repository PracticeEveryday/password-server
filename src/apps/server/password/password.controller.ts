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
import { RouteTable } from '../common/decorator/router-table.decorator';
import { Route } from '../common/decorator/router.decorator';
import { ResponseDto } from '../common/dto/response.dto';
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
  constructor(readonly passwordService: PasswordService, readonly passwordUtilService: PasswordUtilService) {}

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
  public async getPasswordArrWithPagination(
    @Query() getPasswordsReqDto: GetPasswordsQueryReqDto,
  ): Promise<ResponseDto<GetPasswordsResDto>> {
    const passwordArr = await this.passwordService.findAllWithPagination(getPasswordsReqDto);
    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<GetPasswordsResDto>(passwordArr);
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
  public async getPasswordByDomain(
    @Param(ValidationPipe) getDomainParamReqDto: GetDomainParamReqDto,
  ): Promise<ResponseDto<GetDomainResDto>> {
    const password = await this.passwordService.findOneByDomain(getDomainParamReqDto);
    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<GetDomainResDto>(password);
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
  public async recommendPassword(
    @Query(ValidationPipe) getRecommendPasswordReqQueryDto: GetRecommendPasswordReqQueryDto,
  ): Promise<ResponseDto<GetRecommendPasswordResDto>> {
    const recommended = this.passwordUtilService.recommendRandomPassword(getRecommendPasswordReqQueryDto.passwordLength);
    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<GetRecommendPasswordResDto>(recommended);
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
  public async create(@Body(ValidationPipe) createPasswordReqDto: CreatePasswordReqDto): Promise<ResponseDto<CreatePasswordResDto>> {
    const created = await this.passwordService.create(createPasswordReqDto);
    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<CreatePasswordResDto>(created);
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
  public async update(@Body(ValidationPipe) updatePasswordReqDto: UpdatePasswordReqDto): Promise<ResponseDto<UpdatePasswordResDto>> {
    const updated = await this.passwordService.update(updatePasswordReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<UpdatePasswordResDto>(updated, 'success update');
  }

  // -- DELETE
  @Route({
    request: {
      method: Method.DELETE,
      path: '/:domain',
    },
    response: {
      code: HttpStatus.CREATED,
      description: deleteOneSuccMd,
    },
    description: deleteOneDescriptionMd,
    summary: deleteOneSummaryMd,
  })
  public async deleteOneByDomain(@Param(ValidationPipe) getDomainParamReqDto: GetDomainParamReqDto): Promise<ResponseDto<string>> {
    const deleted = await this.passwordService.deleteOneByDomain(getDomainParamReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE(deleted, 'success delete');
  }
}
