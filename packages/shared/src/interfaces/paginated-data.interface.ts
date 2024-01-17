export interface PaginatedData<T> {
  page: number;
  size: number;
  totalPages: number;
  totalItems: number;
  data: T[];
}
