import { Body, HttpStatus, Param, Query, UseInterceptors } from '@nestjs/common';

import { Route } from '@apps/server/common/decorator/router.decorator';
import { Method } from '@apps/server/common/enum/method.enum';
import { TryCatchInterceptor } from '@apps/server/common/interceptor/tryCatch.interceptor';
import { PasswordService } from '@apps/server/modules/password/password.service';
import { RouteTable } from '@commons/decorator/routerTable.decorator';
import { ResponseDto, UpdatedResDto, DeletedResDto } from '@commons/dto/basicApiDto';
import { CreateResDto } from '@commons/dto/basicApiDto/createResult.res.dto';
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
  public async findManyWithPagination(@Query() query: Dtos.GetPasswordsQueryReqDto): Promise<ResponseDto<Dtos.GetPasswordsResDto>> {
    const passwordArr = await this.passwordService.findManyWithPagination(query);

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
    @Query() query: Dtos.GetRecommendPasswordQueryReqDto,
  ): Promise<ResponseDto<Dtos.GetRecommendPasswordResDto>> {
    const recommended = PasswordUtil.recommendRandomPassword(query.passwordLength);

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
  public async findOneByDomain(@Param() param: Dtos.GetDomainParamReqDto): Promise<ResponseDto<Dtos.GetDomainResDto>> {
    const password = await this.passwordService.findOneByDomain(param);

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
      type: CreateResDto,
      description: Docs.createOnePasswordSuccMd,
    },
    summary: Docs.createOnePasswordSummaryMd,
    description: Docs.createOnePasswordDescriptionMd,
  })
  public async createOne(@Body() body: Dtos.CreatePasswordReqDto): Promise<ResponseDto<CreateResDto>> {
    const created = await this.passwordService.createOne(body);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE<CreateResDto>(created);
  }

  // -- PUT
  @Route({
    request: {
      path: '/',
      method: Method.PUT,
    },
    response: {
      code: HttpStatus.OK,
      type: UpdatedResDto,
      description: Docs.updateOnePasswordSuccMd,
    },
    summary: Docs.updateOnePasswordSummaryMd,
    description: Docs.updateOnePasswordDescriptionMd,
  })
  public async updateOne(@Body() body: Dtos.UpdatePasswordReqDto): Promise<ResponseDto<UpdatedResDto>> {
    const updated = await this.passwordService.updateOne(body);

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
  public async removeOneByDomain(@Param() param: Dtos.GetDomainParamReqDto): Promise<ResponseDto<DeletedResDto>> {
    const deleted = await this.passwordService.removeOne(param);

    return await ResponseDto.OK_DATA_WITH_OPTIONAL_MESSAGE(deleted, 'success delete');
  }
}
