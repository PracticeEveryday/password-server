import { PartialType } from '@nestjs/swagger';

import { CreateAlcoholDto } from './create-alcohol.dto';

export class UpdateAlcoholDto extends PartialType(CreateAlcoholDto) {}
