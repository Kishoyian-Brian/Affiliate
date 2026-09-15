import type { PaginatedResult, PaginationQuery } from '../types/pagination.type';

export function normalizePagination(query: PaginationQuery) {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 20));
  return { page, limit, skip: (page - 1) * limit };
}

export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return { data, page, limit, total };
}
