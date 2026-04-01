export interface Student {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  grade?: number;
  classGroup?: string;
  gender?: 'M' | 'F' | 'Other';
  clinicalNotes?: string;
  status: 'Active' | 'Monitoring' | 'Referred' | 'Archived';
  languageOfInstruction?: string;
  parentalConsentGiven: boolean;
  teacherIds: string[];
  lastAssessmentDate?: string;
  createdAt?: string;
}

export interface DomainScore {
  name: string;
  score: number;
}

export interface TestSession {
  _id: string;
  studentId: string;
  testDate: string;
  duration?: number;
  condition?: 'calm' | 'distracted' | 'tired';
  version?: string;
  domains: DomainScore[];
  completedDomains?: number;
  dri: number;
  tier: 0 | 1 | 2 | 3;
  aiAnalysis?: string;
}

export interface InterventionStrategy {
  _id: string;
  domain: string;
  title: string;
  description: string;
  ageRange?: string;
  type?: string;
  difficulty?: string;
  duration?: number;
  notes?: string;
}

export interface UserToken {
  userId: string;
  role: 'teacher' | 'student';
  studentId: string | null;
  exp?: number;
  iat?: number;
}
