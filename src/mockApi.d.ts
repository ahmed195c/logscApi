// Type definitions for mockApi.js

export interface Employee {
  id: number;
  ceoNumber: string;
  ceoName: string;
  phoneNumber: string;
  jobTtile: string;
  department: string;
  unit: string;
  nationality: string;
}

export interface Car {
  id: number;
  carNumber: string;
  vType: string;
  carYear: number;
  cownerName: string;
  section: string;
}

export interface Log {
  id: number;
  employee: Employee;
  car: Car;
  carIsInUse: boolean;
  created_at: string;
  taken_date: string;
  taken_time: string;
  ended_at: string;
  return_date: string;
  return_time: string;
  carNote?: string;
}

export interface LogsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Log[];
}

export function fetchLogs(): Promise<LogsResponse>;