import { Provider } from '@nestjs/common';

import { BookRepository } from '@apps/server/modules/book/repository/book.repository';
import { BookMetaRepository } from '@apps/server/modules/book/repository/bookMeta.repository';
import { InjectionToken } from '@libs/mysql/repository/injectionToken';

export const bookProviders: Provider[] = [
  { provide: InjectionToken.BOOK_REPOSITORY, useClass: BookRepository },
  { provide: InjectionToken.BOOKMETA_REPOSITORY, useClass: BookMetaRepository },
];
