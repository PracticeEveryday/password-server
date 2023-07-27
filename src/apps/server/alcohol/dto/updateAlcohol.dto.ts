import { PartialType } from '@nestjs/swagger';

import { CreateAlcoholDto } from './createAlcohol.dto';

export class UpdateAlcoholDto extends PartialType(CreateAlcoholDto) {}
