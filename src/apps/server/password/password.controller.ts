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
import { CreatePasswordReqDto } from './dto/api-dto/createPassword.req.dto';
import { CreatePasswordResDto } from './dto/api-dto/createPassword.res.dto';
import { GetDomainParamReqDto } from './dto/api-dto/getDomain.req.dto';
import { GetDomainResDto, GetDomainResDtoNotFoundExceptionResDto } from './dto/api-dto/getDomain.res.dto';
import { GetPasswordsQueryReqDto } from './dto/api-dto/getPasswords.req.dto';
import { GetPasswordsResDto } from './dto/api-dto/getPasswords.res.dto';
import { GetRecommendPasswordReqQueryDto } from './dto/api-dto/recommendPassword.req.dto';
import { GetRecommendPasswordResDto } from './dto/api-dto/recommendPassword.res.dto';
import { UpdatePasswordReqDto } from './dto/api-dto/updatePassword.req.dto';
import { PasswordService } from './password.service';
import { PasswordUtilService } from '../../../libs/util/password/passwordUtil.service';
import { Route } from '../common/decorator/router.decorator';
import { RouteTable } from '../common/decorator/routerTable.decorator';
import { DeletedResDto } from '../common/dto/basic-api-dto/deleteResult.res.dto';
import { UpdatedResDto } from '../common/dto/basic-api-dto/updateResult.res.dto';
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
      path: '/',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetPasswordsResDto,
      description: getPasswordArrWithPaginationSuccMd,
    },
    summary: getPasswordArrWithPaginationSummaryMd,
    description: getPasswordArrWithPaginationDescriptionMd,
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
      path: '/:domain',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetDomainResDto,
      description: getPasswordByDomainSuccMd,
    },
    summary: getPasswordByDomainSummaryMd,
    description: getPasswordByDomainDescriptionMd,
  })
  public async getPasswordByDomain(
    @Param(ValidationPipe) getDomainParamReqDto: GetDomainParamReqDto,
  ): Promise<ResponseDto<GetDomainResDto>> {
    const password = await this.passwordService.findOneByDomain(getDomainParamReqDto);
    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<GetDomainResDto>(password);
  }

  @Route({
    request: {
      path: '/recommend',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: GetRecommendPasswordResDto,
      description: recommendPasswordSuccMd,
    },
    summary: recommendPasswordSummaryMd,
    description: recommendPasswordDescriptionMd,
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
      path: '/',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
      type: CreatePasswordResDto,
      description: createPasswordSuccMd,
    },
    summary: createPasswordSummaryMd,
    description: createPasswordDescriptionMd,
  })
  public async create(@Body(ValidationPipe) createPasswordReqDto: CreatePasswordReqDto): Promise<ResponseDto<CreatePasswordResDto>> {
    const created = await this.passwordService.create(createPasswordReqDto);
    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<CreatePasswordResDto>(created);
  }

  // -- PUT
  @Route({
    request: {
      path: '/',
      method: Method.PUT,
    },
    response: {
      code: HttpStatus.CREATED,
      type: UpdatedResDto,
      description: updatePasswordSuccMd,
    },
    summary: updatePasswordSummaryMd,
    description: updatePasswordDescriptionMd,
  })
  public async update(@Body(ValidationPipe) updatePasswordReqDto: UpdatePasswordReqDto): Promise<ResponseDto<UpdatedResDto>> {
    const updated = await this.passwordService.update(updatePasswordReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<UpdatedResDto>(updated, 'success update');
  }

  // -- DELETE
  @Route({
    request: {
      path: '/:domain',
      method: Method.DELETE,
    },
    response: {
      code: HttpStatus.CREATED,
      type: DeletedResDto,
      description: deleteOneSuccMd,
    },
    summary: deleteOneSummaryMd,
    description: deleteOneDescriptionMd,
  })
  public async deleteOneByDomain(@Param(ValidationPipe) getDomainParamReqDto: GetDomainParamReqDto): Promise<ResponseDto<DeletedResDto>> {
    const deleted = await this.passwordService.deleteOneByDomain(getDomainParamReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE(deleted, 'success delete');
  }
}
