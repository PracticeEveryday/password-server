import { RouteTable } from '../common/decorator/router-table.decorator';
import { PasswordUtilService } from '../../../libs/utils/password-util/password-util.service';
import { Route } from '../common/decorator/router.decorator';
import { Method } from '../common/enum/method.enum';
import { Body, HttpStatus, Query, ValidationPipe } from '@nestjs/common';
import { CreatePassworeReqDto } from './dto/create-password.req.dto';
import { PasswordService } from './password.service';
import { createPasswordDescriptionMd, createPasswordSuccMd, createPasswordSummaryMd } from './docs/password.docs';
import { CreatePasswordResDto } from './dto/create-password.res.dto';
import { GetDomainReqDto } from './dto/getDomain.req.dto';

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
    return await this.passwordService.create(createPassworeReqDto);
  }

  @Route({
    request: {
      method: Method.GET,
      path: '/:domain',
    },
    response: {
      code: HttpStatus.OK,
      // type: CreatePasswordResDto,
      // description: createPasswordSuccMd,
    },
    // description: createPasswordDescriptionMd,
    // summary: createPasswordSummaryMd,
  })
  public async getPasswordByDomain(@Query(ValidationPipe) getDomainReqDto: GetDomainReqDto) {
    return await this.passwordService.getPasswordByDomain(getDomainReqDto);
  }
}
