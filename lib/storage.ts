import { Aircraft, MaintenanceSheet, MaintenanceRecord } from './types';

class LocalStorage {
  private getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Aircraft methods
  getAircraft(): Aircraft[] {
    return this.getItem('aircraft', []);
  }

  saveAircraft(aircraft: Aircraft[]): void {
    this.setItem('aircraft', aircraft);
  }

  addAircraft(aircraft: Aircraft): void {
    const existing = this.getAircraft();
    existing.push(aircraft);
    this.saveAircraft(existing);
  }

  updateAircraft(id: string, updates: Partial<Aircraft>): void {
    const aircraft = this.getAircraft();
    const index = aircraft.findIndex(a => a.id === id);
    if (index !== -1) {
      aircraft[index] = { ...aircraft[index], ...updates };
      this.saveAircraft(aircraft);
    }
  }

  deleteAircraft(id: string): void {
    const aircraft = this.getAircraft().filter(a => a.id !== id);
    this.saveAircraft(aircraft);
  }

  // Maintenance Sheet methods
  getMaintenanceSheets(): MaintenanceSheet[] {
    return this.getItem('maintenanceSheets', []);
  }

  saveMaintenanceSheets(sheets: MaintenanceSheet[]): void {
    this.setItem('maintenanceSheets', sheets);
  }

  addMaintenanceSheet(sheet: MaintenanceSheet): void {
    const existing = this.getMaintenanceSheets();
    existing.push(sheet);
    this.saveMaintenanceSheets(existing);
  }

  updateMaintenanceSheet(id: string, updates: Partial<MaintenanceSheet>): void {
    const sheets = this.getMaintenanceSheets();
    const index = sheets.findIndex(s => s.id === id);
    if (index !== -1) {
      sheets[index] = { ...sheets[index], ...updates };
      this.saveMaintenanceSheets(sheets);
    }
  }

  deleteMaintenanceSheet(id: string): void {
    const sheets = this.getMaintenanceSheets().filter(s => s.id !== id);
    this.saveMaintenanceSheets(sheets);
  }

  getMaintenanceSheetsByAircraft(aircraftId: string): MaintenanceSheet[] {
    return this.getMaintenanceSheets().filter(s => s.aircraftId === aircraftId);
  }

  // Maintenance Record methods
  getMaintenanceRecords(): MaintenanceRecord[] {
    return this.getItem('maintenanceRecords', []);
  }

  saveMaintenanceRecords(records: MaintenanceRecord[]): void {
    this.setItem('maintenanceRecords', records);
  }

  addMaintenanceRecord(record: MaintenanceRecord): void {
    const existing = this.getMaintenanceRecords();
    existing.push(record);
    this.saveMaintenanceRecords(existing);
  }
}

export const storage = new LocalStorage();