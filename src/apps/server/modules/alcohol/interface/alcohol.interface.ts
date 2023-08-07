import { AlcoholDto } from '@apps/server/common/dto/alcohol.dto';
import { RepositoryInterface } from '@apps/server/common/interface/repository.interface';

export type AlcoholRepositoryInterface = RepositoryInterface<AlcoholDto>;
