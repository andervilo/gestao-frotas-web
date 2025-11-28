export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  INSPECTION = 'INSPECTION',
  REPAIR = 'REPAIR'
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Maintenance {
  id?: string;
  vehicleId: string;
  type: MaintenanceType;
  description: string;
  cost?: number;
  scheduledDate: string;
  startDate?: string;
  completionDate?: string;
  status?: MaintenanceStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceFilter {
  vehicleId?: string;
  type?: MaintenanceType;
  status?: MaintenanceStatus;
  description?: string;
  scheduledDateFrom?: string;
  scheduledDateTo?: string;
  completedDateFrom?: string;
  completedDateTo?: string;
}
