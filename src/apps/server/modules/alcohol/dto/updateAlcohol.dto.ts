import { PartialType } from '@nestjs/swagger';

import { CreateAlcoholDto } from '@apps/server/modules/alcohol/dto/createAlcohol.dto';

export class UpdateAlcoholDto extends PartialType(CreateAlcoholDto) {}
