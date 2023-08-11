import { PickType } from '@nestjs/swagger';

import { AlcoholDto } from '@commons/dto/moduleDto/alcohol.dto';

export class CreateAlcoholDto extends PickType(AlcoholDto, ['drinkingDate', 'relationship', 'mood']) {}
