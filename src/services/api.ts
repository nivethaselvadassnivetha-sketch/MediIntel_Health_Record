import {
  User,
  Patient,
  MedicalDocument,
  TimelineEvent,
  ConsentRecord,
  AuditLog,
  FHIRBundle,
  ExtractedEntity
} from '../types/healthcare';

export interface PatientGraphData {
  patientId: string;
  hba1cTrend?: { date: string; value: number; label: string }[];
  bpTrend: { date: string; systolic: number; diastolic: number }[];
  glucoseTrend?: { date: string; fasting: number; postPrandial: number }[];
  customMetric?: { name: string; unit: string; series: { date: string; value: number }[] };
}

export interface PatientRecordResponse {
  patient: Patient;
  timelineEvents: TimelineEvent[];
  documents: MedicalDocument[];
  consents?: ConsentRecord[];
  auditLogs?: AuditLog[];
  graphData?: PatientGraphData | null;
  fhirBundle?: FHIRBundle;
}

export interface SearchPatientsResponse {
  total: number;
  patients: Patient[];
  searchMetadata: {
    query: string;
    parsedTokens: {
      gender?: string;
      minAge?: number;
      conditions: string[];
      medications: string[];
    };
  };
}

export const api = {
  async getMe(): Promise<{ user: User | null }> {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return { user: null };
      return await res.json();
    } catch {
      return { user: null };
    }
  },

  async login(roleKey?: string, email?: string, password?: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleKey, email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return await res.json();
  },

  async loginWithGoogle(email?: string, name?: string, role?: string): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, role })
    });
    if (!res.ok) throw new Error('Google Sign-In failed');
    return await res.json();
  },

  async signUp(data: { name: string; email: string; role: string; hospitalId?: string; specialty?: string }): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Sign-up failed');
    return await res.json();
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  async getPatientMe(): Promise<PatientRecordResponse> {
    const res = await fetch('/api/patient/me');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch personal health record');
    }
    return await res.json();
  },

  async getPatientById(patientId: string): Promise<PatientRecordResponse> {
    const res = await fetch(`/api/patient/${encodeURIComponent(patientId)}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const error: any = new Error(errData.message || 'Access Denied');
      error.status = res.status;
      error.code = errData.code || 'ERR_FORBIDDEN';
      error.targetPatientId = errData.targetPatientId || patientId;
      throw error;
    }
    return await res.json();
  },

  async searchPatients(params: {
    q?: string;
    disease?: string;
    medicine?: string;
    gender?: string;
    age?: string;
  }): Promise<SearchPatientsResponse> {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set('q', params.q);
    if (params.disease) searchParams.set('disease', params.disease);
    if (params.medicine) searchParams.set('medicine', params.medicine);
    if (params.gender) searchParams.set('gender', params.gender);
    if (params.age) searchParams.set('age', params.age);

    const res = await fetch(`/api/doctor/search?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to search patients');
    return await res.json();
  },

  async processDocument(params: {
    patientId: string;
    docTitle?: string;
    docType?: string;
    customText?: string;
    fileData?: string;
    fileName?: string;
    fileFormat?: string;
  }): Promise<{
    success: boolean;
    patientId: string;
    docTitle: string;
    docType: string;
    fileFormat?: string;
    filePreview?: string | null;
    ocrText: string;
    extractedEntities: ExtractedEntity[];
  }> {
    const res = await fetch('/api/documents/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('AI extraction failed');
    return await res.json();
  },

  async confirmExtraction(params: {
    patientId: string;
    docTitle: string;
    docType: string;
    ocrText: string;
    verifiedEntities: ExtractedEntity[];
    fileFormat?: string;
  }): Promise<{
    success: boolean;
    document: MedicalDocument;
    timelineEvent: TimelineEvent;
  }> {
    const res = await fetch('/api/documents/confirm-extraction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to confirm extraction');
    return await res.json();
  },

  async toggleConsent(consentId: string): Promise<{ success: boolean; consent: ConsentRecord }> {
    const res = await fetch('/api/consent/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consentId })
    });
    if (!res.ok) throw new Error('Failed to update consent');
    return await res.json();
  },

  async getFHIRBundle(patientId: string): Promise<FHIRBundle> {
    const res = await fetch(`/api/patient/${encodeURIComponent(patientId)}/fhir`);
    if (!res.ok) throw new Error('Failed to export FHIR bundle');
    return await res.json();
  },

  async getAuditLogs(): Promise<{ auditLogs: AuditLog[] }> {
    const res = await fetch('/api/audit-logs');
    if (!res.ok) return { auditLogs: [] };
    return await res.json();
  }
};
