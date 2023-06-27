import { RouteTable } from '../common/decorator/router-table.decorator';
import { PasswordUtilService } from '../../../libs/password-util/password-util.service';
import { Route } from '../common/decorator/router.decorator';
import { Method } from '../common/enum/method.enum';
import { HttpStatus } from '@nestjs/common';

@RouteTable({
  path: 'password',
  tag: {
    title: '🔭비밀 번호 API',
    category: 'public',
  },
})
export class PasswordController {
  constructor(readonly passwordUtilService: PasswordUtilService) {}

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
  public hassPassword() {
    const hashed = this.passwordUtilService.hashPassword('password');
    const decoded = this.passwordUtilService.decodedPassword(hashed);

    return { hashed, decoded };
  }
}
