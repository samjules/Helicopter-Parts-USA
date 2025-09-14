export interface Aircraft {
  id: string;
  registration: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  totalHours: number;
  lastInspection: string;
  nextInspection: string;
  createdAt: string;
}

export interface MaintenanceItem {
  id: string;
  description: string;
  interval: number; // hours
  lastCompleted: string;
  nextDue: string;
  status: 'current' | 'due' | 'overdue';
  notes?: string;
}

export interface MaintenanceSheet {
  id: string;
  aircraftId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  items: MaintenanceItem[];
}

export interface MaintenanceRecord {
  id: string;
  aircraftId: string;
  maintenanceItemId: string;
  completedDate: string;
  hoursAtCompletion: number;
  technician: string;
  notes: string;
  nextDue: string;
}