
export enum ComplianceStatus {
  VALID = 'VALID',
  EXPIRING = 'EXPIRING',
  PENDING = 'PENDING',
  CRITICAL = 'CRITICAL'
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export interface Company {
  id: string;
  name: string;
  avatar: string;
}

export interface Worker {
  id: string;
  nif: string;
  name: string;
  role: string;
  project?: string;
  status: ComplianceStatus;
  lastUpdate: string;
  skillTags: string[];
  hourlyCost: number;
  phone: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  country: string;
  budget: number;
  status: ProjectStatus;
  completion: number;
  margin: number;
  teamCount: number;
}

export interface KPIData {
  title: string;
  value: string;
  trend: number;
  label: string;
}

export interface TimeEntry {
  id: string;
  workerId: string;
  workerName: string;
  date: string;
  hours: number;
  status: 'PENDING' | 'APPROVED' | 'DISPUTED';
  locationAlert: boolean;
}
