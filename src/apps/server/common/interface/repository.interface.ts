import { ResultSetHeader } from 'mysql2';

export interface RepositoryInterface<T> {
  create: (createInfo: Partial<T>) => Promise<ResultSetHeader>;
}
