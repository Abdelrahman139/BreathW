export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'Doctor' | 'Admin' | 'Patient';
}

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  doctorId: string;
}

export interface ScanResult {
  id: string;
  scanId: string;
  pneumonia: number;
  effusion: number;
  cardiomegaly: number;
  pneumothorax: number;
  noFinding: number;
  heatmapUrl: string;
  generatedAt: string;
}

export interface Scan {
  id: string;
  patientId: string;
  imageUrl: string;
  uploadedAt: string;
  notes: string;
  result: ScanResult;
}
