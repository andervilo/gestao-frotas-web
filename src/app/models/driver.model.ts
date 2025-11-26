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
