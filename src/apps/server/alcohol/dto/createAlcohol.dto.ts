import { PickType } from '@nestjs/swagger';

import { AlcoholDto } from '../../common/dto/alcohol.dto';

export class CreateAlcoholDto extends PickType(AlcoholDto, ['drinkingDate', 'relationship', 'mood']) {}
