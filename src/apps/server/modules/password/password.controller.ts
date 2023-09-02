import { Body, HttpStatus, Param, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';

import { Route } from '@apps/server/common/decorator/router.decorator';
import { Method } from '@apps/server/common/enum/method.enum';
import { TryCatchInterceptor } from '@apps/server/common/interceptor/tryCatch.interceptor';
import { PasswordService } from '@apps/server/modules/password/password.service';
import { RouteTable } from '@commons/decorator/routerTable.decorator';
import { DeletedResDto } from '@commons/dto/basicApiDto/deleteResult.res.dto';
import { ResponseDto } from '@commons/dto/basicApiDto/response.dto';
import { UpdatedResDto } from '@commons/dto/basicApiDto/updateResult.res.dto';
import { PasswordUtil } from '@libs/util/password.util';

import * as Docs from './docs/password.docs';
import * as Dtos from './dto';

@RouteTable({
  path: '/passwords',
  version: '1',
  tag: {
    title: '🔭비밀 번호 API',
    category: 'public',
  },
})
@UseInterceptors(TryCatchInterceptor)
export class PasswordController {
  constructor(readonly passwordService: PasswordService) {}

  // -- GET
  @Route({
    request: {
      path: '/',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: Dtos.GetPasswordsResDto,
      description: Docs.findManyWithPaginationWithPaginationSuccMd,
    },
    summary: Docs.findManyWithPaginationWithPaginationSummaryMd,
    description: Docs.findManyWithPaginationWithPaginationDescriptionMd,
  })
  public async findManyWithPagination(
    @Query() getPasswordsReqDto: Dtos.GetPasswordsQueryReqDto,
  ): Promise<ResponseDto<Dtos.GetPasswordsResDto>> {
    const passwordArr = await this.passwordService.findManyWithPagination(getPasswordsReqDto);
    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<Dtos.GetPasswordsResDto>(passwordArr);
  }

  @Route({
    request: {
      path: '/recommend',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: Dtos.GetRecommendPasswordResDto,
      description: Docs.recommendPasswordSuccMd,
    },
    summary: Docs.recommendPasswordSummaryMd,
    description: Docs.recommendPasswordDescriptionMd,
  })
  public async recommendPassword(
    @Query(ValidationPipe) getRecommendPasswordReqQueryDto: Dtos.GetRecommendPasswordReqQueryDto,
  ): Promise<ResponseDto<Dtos.GetRecommendPasswordResDto>> {
    const recommended = PasswordUtil.recommendRandomPassword(getRecommendPasswordReqQueryDto.passwordLength);
    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<Dtos.GetRecommendPasswordResDto>(recommended);
  }

  @Route({
    request: {
      path: '/:domain',
      method: Method.GET,
    },
    response: {
      code: HttpStatus.OK,
      type: Dtos.GetDomainResDto,
      description: Docs.findOneByDomainSuccMd,
    },
    summary: Docs.findOneByDomainSummaryMd,
    description: Docs.findOneByDomainDescriptionMd,
  })
  public async findOneByDomain(
    @Param(ValidationPipe) getDomainParamReqDto: Dtos.GetDomainParamReqDto,
  ): Promise<ResponseDto<Dtos.GetDomainResDto>> {
    const password = await this.passwordService.findOneByDomain(getDomainParamReqDto);
    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<Dtos.GetDomainResDto>(password);
  }

  // --POST
  @Route({
    request: {
      path: '/',
      method: Method.POST,
    },
    response: {
      code: HttpStatus.CREATED,
      type: Dtos.CreatePasswordResDto,
      description: Docs.createOnePasswordSuccMd,
    },
    summary: Docs.createOnePasswordSummaryMd,
    description: Docs.createOnePasswordDescriptionMd,
  })
  public async createOne(
    @Body(ValidationPipe) createPasswordReqDto: Dtos.CreatePasswordReqDto,
  ): Promise<ResponseDto<Dtos.CreatePasswordResDto>> {
    const created = await this.passwordService.createOne(createPasswordReqDto);
    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<Dtos.CreatePasswordResDto>(created);
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
      description: Docs.updateOnePasswordSuccMd,
    },
    summary: Docs.updateOnePasswordSummaryMd,
    description: Docs.updateOnePasswordDescriptionMd,
  })
  public async update(@Body(ValidationPipe) updatePasswordReqDto: Dtos.UpdatePasswordReqDto): Promise<ResponseDto<UpdatedResDto>> {
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
      description: Docs.removeOneByDomainSuccMd,
    },
    summary: Docs.removeOneByDomainSummaryMd,
    description: Docs.removeOneByDomainDescriptionMd,
  })
  public async removeOneByDomain(
    @Param(ValidationPipe) getDomainParamReqDto: Dtos.GetDomainParamReqDto,
  ): Promise<ResponseDto<DeletedResDto>> {
    const deleted = await this.passwordService.removeOneByDomain(getDomainParamReqDto);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE(deleted, 'success delete');
  }
}
