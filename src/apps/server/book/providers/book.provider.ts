import { Provider } from '@nestjs/common';

import { InjectionToken } from '../../../../libs/mysql/repositories/injectionToken';
import { BookRepository } from '../repository/book.repository';
import { BookMetaRepository } from '../repository/bookMeta.repository';

export const bookProviders: Provider[] = [
  { provide: InjectionToken.BOOK_REPOSITORY, useClass: BookRepository },
  { provide: InjectionToken.BOOKMETA_REPOSITORY, useClass: BookMetaRepository },
];
