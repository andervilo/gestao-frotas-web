export enum DriverStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  SUSPENDED = 'SUSPENDED'
}

export interface Driver {
  id?: string;
  name: string;
  cpf: string;
  cnh: string;
  cnhCategory: string;
  cnhExpirationDate: string;
  status?: DriverStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface DriverFilter {
  name?: string;
  cpf?: string;
  cnh?: string;
  cnhCategory?: string;
  cnhExpirationDateFrom?: string;
  cnhExpirationDateTo?: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}
