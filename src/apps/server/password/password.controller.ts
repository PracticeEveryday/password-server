import { RouteTable } from '../common/decorator/router-table.decorator';
import { PasswordUtilService } from '../../../libs/password-util/password-util.service';
import { Route } from '../common/decorator/router.decorator';
import { Method } from '../common/enum/method.enum';
import { Body, HttpStatus, ValidationPipe } from '@nestjs/common';
import { CreatePassworeReqDto } from './dto/create-password.req.dto';
import { PasswordService } from './password.service';

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
      // type: CreateExperienceResDto,
      // description: createExperienceSuccMd,
    },
    // description: createExperienceDescriptionMd,
    // summary: createExperienceSummaryMd,
  })
  public async create(@Body(ValidationPipe) createPassworeReqDto: CreatePassworeReqDto) {
    return await this.passwordService.create(createPassworeReqDto);
  }
}
