import { Body, HttpStatus, Param, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';

import { Route } from '@apps/server/common/decorator/router.decorator';
import { RouteTable } from '@apps/server/common/decorator/routerTable.decorator';
import { DeletedResDto } from '@apps/server/common/dto/basic-api-dto/deleteResult.res.dto';
import { UpdatedResDto } from '@apps/server/common/dto/basic-api-dto/updateResult.res.dto';
import { ResponseDto } from '@apps/server/common/dto/response.dto';
import { Method } from '@apps/server/common/enum/method.enum';
import { TryCatchInterceptor } from '@apps/server/common/interceptor/tryCatch.interceptor';
import { CreatePasswordReqDto } from '@apps/server/modules/password/dto/api-dto/createPassword.req.dto';
import { CreatePasswordResDto } from '@apps/server/modules/password/dto/api-dto/createPassword.res.dto';
import { GetDomainParamReqDto } from '@apps/server/modules/password/dto/api-dto/getDomain.req.dto';
import { GetDomainResDto, GetDomainResDtoNotFoundExceptionResDto } from '@apps/server/modules/password/dto/api-dto/getDomain.res.dto';
import { GetPasswordsQueryReqDto } from '@apps/server/modules/password/dto/api-dto/getPasswords.req.dto';
import { GetPasswordsResDto } from '@apps/server/modules/password/dto/api-dto/getPasswords.res.dto';
import { GetRecommendPasswordReqQueryDto } from '@apps/server/modules/password/dto/api-dto/recommendPassword.req.dto';
import { GetRecommendPasswordResDto } from '@apps/server/modules/password/dto/api-dto/recommendPassword.res.dto';
import { UpdatePasswordReqDto } from '@apps/server/modules/password/dto/api-dto/updatePassword.req.dto';
import { PasswordService } from '@apps/server/modules/password/password.service';
import { PasswordUtilService } from '@libs/util/password/passwordUtil.service';

import * as PasswordDocs from './docs/password.docs';

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
      description: PasswordDocs.findManyWithPaginationWithPaginationSuccMd,
    },
    summary: PasswordDocs.findManyWithPaginationWithPaginationSummaryMd,
    description: PasswordDocs.findManyWithPaginationWithPaginationDescriptionMd,
  })
  public async findManyWithPagination(@Query() getPasswordsReqDto: GetPasswordsQueryReqDto): Promise<ResponseDto<GetPasswordsResDto>> {
    const passwordArr = await this.passwordService.findManyWithPagination(getPasswordsReqDto);
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
      description: PasswordDocs.findOneByDomainSuccMd,
    },
    summary: PasswordDocs.findOneByDomainSummaryMd,
    description: PasswordDocs.findOneByDomainDescriptionMd,
  })
  public async findOneByDomain(@Param(ValidationPipe) getDomainParamReqDto: GetDomainParamReqDto): Promise<ResponseDto<GetDomainResDto>> {
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
      description: PasswordDocs.recommendPasswordSuccMd,
    },
    summary: PasswordDocs.recommendPasswordSummaryMd,
    description: PasswordDocs.recommendPasswordDescriptionMd,
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
      description: PasswordDocs.createOnePasswordSuccMd,
    },
    summary: PasswordDocs.createOnePasswordSummaryMd,
    description: PasswordDocs.createOnePasswordDescriptionMd,
  })
  public async createOne(@Body(ValidationPipe) createPasswordReqDto: CreatePasswordReqDto): Promise<ResponseDto<CreatePasswordResDto>> {
    const created = await this.passwordService.createOne(createPasswordReqDto);
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
      description: PasswordDocs.updateOnePasswordSuccMd,
    },
    summary: PasswordDocs.updateOnePasswordSummaryMd,
    description: PasswordDocs.updateOnePasswordDescriptionMd,
  })
  public async update(@Body(ValidationPipe) updatePasswordReqDto: UpdatePasswordReqDto): Promise<ResponseDto<UpdatedResDto>> {
    const updated = await this.passwordService.updateOne(updatePasswordReqDto);

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
      description: PasswordDocs.removeOneByDomainSuccMd,
    },
    summary: PasswordDocs.removeOneByDomainSummaryMd,
    description: PasswordDocs.removeOneByDomainDescriptionMd,
  })
  public async removeOneByDomain(@Param(ValidationPipe) getDomainParamReqDto: GetDomainParamReqDto): Promise<ResponseDto<DeletedResDto>> {
    const deleted = await this.passwordService.removeOneByDomain(getDomainParamReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE(deleted, 'success delete');
  }
}
