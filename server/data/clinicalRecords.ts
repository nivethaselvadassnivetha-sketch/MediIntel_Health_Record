import {
  MedicalDocument,
  TimelineEvent,
  ConsentRecord,
  AuditLog,
  FHIRBundle,
  Patient,
  ExtractedEntity
} from '../../src/types/healthcare';

export const BACKEND_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'EVT-001',
    patientId: 'PAT-1001',
    date: '2026-03-12',
    year: 2026,
    month: 'March',
    title: 'Routine Endocrine & Cardiometabolic Review',
    category: 'Consultation',
    facility: 'Apex City Multi-Specialty Hospital',
    doctorName: 'Dr. Sarah Mathew, MD',
    summary: 'Glycemic control optimized with HbA1c at 6.8%. BP stable at 122/78 mmHg. No hypoglycemic episodes.',
    details: {
      diagnoses: ['Type 2 Diabetes Mellitus (Controlled)', 'Essential Hypertension (Stage 1 Well-Controlled)'],
      vitals: {
        'Blood Pressure': '122/78 mmHg',
        'Heart Rate': '72 bpm',
        'HbA1c': '6.8%',
        'Fasting Blood Glucose': '106 mg/dL',
        'BMI': 24.8
      },
      prescribedMeds: [
        'Metformin HCl 500 mg BD (after meals)',
        'Telmisartan 40 mg OD (morning)',
        'Atorvastatin 10 mg HS'
      ],
      notes: 'Patient advised to continue current diet and 30-minute daily brisk walking regimen.'
    },
    documentId: 'DOC-101'
  },
  {
    id: 'EVT-002',
    patientId: 'PAT-1001',
    date: '2026-03-10',
    year: 2026,
    month: 'March',
    title: 'Comprehensive Metabolic & Renal Function Panel',
    category: 'Lab Result',
    facility: 'Apex Central Diagnostics Laboratory',
    doctorName: 'Dr. Sarah Mathew, MD',
    summary: 'HbA1c improved to 6.8%. Serum Creatinine 0.9 mg/dL. Urine Albumin-to-Creatinine Ratio (UACR) 22 mg/g (Normal).',
    details: {
      labValues: [
        { parameter: 'HbA1c Glycated Hemoglobin', value: '6.8 %', flag: 'NORMAL' },
        { parameter: 'Fasting Blood Sugar', value: '106 mg/dL', flag: 'NORMAL' },
        { parameter: 'Post-Prandial Blood Sugar', value: '138 mg/dL', flag: 'NORMAL' },
        { parameter: 'Serum Creatinine', value: '0.9 mg/dL', flag: 'NORMAL' },
        { parameter: 'eGFR', value: '> 90 mL/min/1.73m2', flag: 'NORMAL' },
        { parameter: 'Lipid Panel - LDL Cholesterol', value: '88 mg/dL', flag: 'NORMAL' },
        { parameter: 'Lipid Panel - HDL Cholesterol', value: '46 mg/dL', flag: 'NORMAL' }
      ],
      notes: 'Renal parameters stable with no microalbuminuria progression.'
    },
    documentId: 'DOC-102'
  },
  {
    id: 'EVT-003',
    patientId: 'PAT-1001',
    date: '2025-09-15',
    year: 2025,
    month: 'September',
    title: '6-Month Glycemic Monitoring & Medication Titration',
    category: 'Consultation',
    facility: 'Apex City Multi-Specialty Hospital',
    doctorName: 'Dr. Sarah Mathew, MD',
    summary: 'HbA1c measured at 7.0%. Maintained on Metformin 500 mg BD. Blood pressure 128/80 mmHg.',
    details: {
      vitals: {
        'Blood Pressure': '128/80 mmHg',
        'HbA1c': '7.0%',
        'Fasting Blood Glucose': '114 mg/dL'
      },
      prescribedMeds: [
        'Metformin HCl 500 mg BD',
        'Telmisartan 40 mg OD'
      ]
    }
  },
  {
    id: 'EVT-004',
    patientId: 'PAT-1001',
    date: '2025-03-20',
    year: 2025,
    month: 'March',
    title: 'Annual Cardiovascular Risk Screening',
    category: 'Hospital Visit',
    facility: 'Apex Heart & Vascular Center',
    doctorName: 'Dr. Anand Raman, DM',
    summary: '12-lead ECG showed normal sinus rhythm. Treadmill stress test negative for inducible myocardial ischemia at 9.4 METs.',
    details: {
      diagnoses: ['Non-Ischemic ECG', 'Low-Intermediate Framingham Risk'],
      notes: 'Carotid doppler showed no hemodynamically significant stenosis. Continue statin therapy.'
    },
    documentId: 'DOC-103'
  },
  {
    id: 'EVT-005',
    patientId: 'PAT-1001',
    date: '2024-09-10',
    year: 2024,
    month: 'September',
    title: 'Initial Endocrine Follow-up & Therapy Optimization',
    category: 'Consultation',
    facility: 'Apex City Multi-Specialty Hospital',
    doctorName: 'Dr. Sarah Mathew, MD',
    summary: 'HbA1c decreased from initial 8.4% to 7.9% after 6 months on oral hypoglycemic therapy.',
    details: {
      vitals: { 'Blood Pressure': '140/88 mmHg', 'HbA1c': '7.9%' },
      prescribedMeds: ['Metformin 500 mg BD', 'Telmisartan 40 mg OD']
    }
  },
  {
    id: 'EVT-006',
    patientId: 'PAT-1001',
    date: '2024-03-15',
    year: 2024,
    month: 'March',
    title: 'New Patient Enrollment & T2D Diagnosis',
    category: 'Hospital Visit',
    facility: 'Apex City Multi-Specialty Hospital',
    doctorName: 'Dr. Sarah Mathew, MD',
    summary: 'Diagnosed with Type 2 Diabetes Mellitus following persistent polyuria and fatigue. Baseline HbA1c 8.4%.',
    details: {
      diagnoses: ['Type 2 Diabetes Mellitus (E11.9)', 'Essential Hypertension (I10)'],
      vitals: {
        'Blood Pressure': '148/92 mmHg',
        'HbA1c': '8.4%',
        'Fasting Blood Glucose': '172 mg/dL',
        'Weight': '82 kg'
      },
      prescribedMeds: ['Metformin 250 mg BD initial titration', 'Telmisartan 20 mg OD']
    }
  }
];

export const BACKEND_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'DOC-101',
    patientId: 'PAT-1001',
    title: 'Clinical Consultation Summary & Negation Assessment',
    documentType: 'Consultation Note',
    uploadedBy: 'DOC-201',
    uploadedByName: 'Dr. Sarah Mathew, MD',
    uploadedAt: '2026-03-12 11:30:00',
    fileSize: '1.4 MB',
    fileFormat: 'PDF',
    status: 'VERIFIED',
    ocrTextPreview: `CHIEF COMPLAINT: Follow-up for Type 2 Diabetes Mellitus and Essential Hypertension.
REVIEW OF SYSTEMS: The patient denies chest pain, palpitations, or shortness of breath. No nocturnal dyspnea or pedal edema. Reports mild tension headache when fatigued.
PHYSICAL EXAMINATION: BP 122/78 mmHg, HR 72 bpm regular. Chest clear to auscultation bilaterally. S1/S2 normal without murmur.
ASSESSMENT:
1. Type 2 Diabetes Mellitus - Glycemic control optimal, latest HbA1c 6.8%.
2. Essential Hypertension - Controlled on Telmisartan.
PLAN: Continue Metformin 500 mg twice daily. Continue Telmisartan 40 mg once daily. Statin maintenance Atorvastatin 10 mg HS. Next follow-up in 6 months.`,
    extractedEntities: [
      {
        id: 'ENT-001',
        category: 'DIAGNOSIS',
        name: 'Type 2 Diabetes Mellitus',
        status: 'PRESENT',
        confidence: 99,
        sourceEvidence: 'Follow-up for Type 2 Diabetes Mellitus... Glycemic control optimal, latest HbA1c 6.8%',
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'ICD-10: E11.9'
      },
      {
        id: 'ENT-002',
        category: 'DIAGNOSIS',
        name: 'Essential Hypertension',
        status: 'PRESENT',
        confidence: 98,
        sourceEvidence: 'Essential Hypertension - Controlled on Telmisartan',
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'ICD-10: I10'
      },
      {
        id: 'ENT-003',
        category: 'SYMPTOM_STATEMENT',
        name: 'Chest Pain',
        status: 'NEGATED', // Explicitly demonstrating NEGATION
        confidence: 97,
        sourceEvidence: 'The patient denies chest pain, palpitations, or shortness of breath.',
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'SNOMED: 29857009',
        doctorNotes: 'Clinician confirmed: Patient denies angina or ischemic symptoms.'
      },
      {
        id: 'ENT-004',
        category: 'SYMPTOM_STATEMENT',
        name: 'Palpitations',
        status: 'NEGATED',
        confidence: 96,
        sourceEvidence: 'The patient denies chest pain, palpitations, or shortness of breath.',
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'SNOMED: 80313002'
      },
      {
        id: 'ENT-005',
        category: 'MEDICATION',
        name: 'Metformin Hydrochloride',
        dosage: '500 mg',
        frequency: 'Twice daily after meals',
        status: 'PRESENT',
        confidence: 99,
        sourceEvidence: 'Continue Metformin 500 mg twice daily.',
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'RxNorm: 6809'
      },
      {
        id: 'ENT-006',
        category: 'MEDICATION',
        name: 'Telmisartan',
        dosage: '40 mg',
        frequency: 'Once daily morning',
        status: 'PRESENT',
        confidence: 98,
        sourceEvidence: 'Continue Telmisartan 40 mg once daily.',
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'RxNorm: 73044'
      }
    ]
  },
  {
    id: 'DOC-102',
    patientId: 'PAT-1001',
    title: 'Biochemistry & HbA1c Diagnostic Report',
    documentType: 'Lab Report',
    uploadedBy: 'DOC-201',
    uploadedByName: 'Dr. Sarah Mathew, MD',
    uploadedAt: '2026-03-10 14:15:00',
    fileSize: '840 KB',
    fileFormat: 'PDF',
    status: 'VERIFIED',
    ocrTextPreview: `APEX CENTRAL DIAGNOSTICS LABORATORY
PATIENT: Arun Kumar (PAT-1001) | AGE: 48 M | REF: Dr. Sarah Mathew, MD
TESTS:
- HbA1c (Glycosylated Hemoglobin): 6.8 % (Reference: < 5.7 Normal, 5.7-6.4 Prediabetes, >= 6.5 Diabetes)
- Fasting Blood Sugar: 106 mg/dL (Reference: 70 - 100 mg/dL)
- Serum Creatinine: 0.9 mg/dL (Reference: 0.7 - 1.2 mg/dL)
- Estimated GFR: > 90 mL/min/1.73 m2 (Normal)
- Urine Albumin/Creatinine Ratio: 22 mg/g (Normal < 30 mg/g)`,
    extractedEntities: [
      {
        id: 'ENT-007',
        category: 'LAB_RESULT',
        name: 'Glycated Hemoglobin (HbA1c)',
        value: '6.8',
        unit: '%',
        status: 'PRESENT',
        confidence: 99,
        sourceEvidence: 'HbA1c (Glycosylated Hemoglobin): 6.8 %',
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'LOINC: 4548-4'
      },
      {
        id: 'ENT-008',
        category: 'LAB_RESULT',
        name: 'Fasting Blood Glucose',
        value: '106',
        unit: 'mg/dL',
        status: 'PRESENT',
        confidence: 98,
        sourceEvidence: 'Fasting Blood Sugar: 106 mg/dL',
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'LOINC: 1558-6'
      }
    ]
  }
];

export const BACKEND_CONSENTS: ConsentRecord[] = [
  {
    id: 'CON-001',
    patientId: 'PAT-1001',
    granteeName: 'Dr. Sarah Mathew, MD',
    granteeRole: 'Doctor (Endocrinology & Internal Medicine)',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    scope: 'Full Medical Record',
    status: 'ACTIVE',
    grantedDate: '2024-03-15',
    expiryDate: '2027-03-15'
  },
  {
    id: 'CON-002',
    patientId: 'PAT-1001',
    granteeName: 'Apex Emergency & Trauma Care Team',
    granteeRole: 'Emergency Care Clinicians',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    scope: 'Emergency Care Only',
    status: 'ACTIVE',
    grantedDate: '2024-03-15',
    expiryDate: '2027-03-15'
  },
  {
    id: 'CON-003',
    patientId: 'PAT-1001',
    granteeName: 'National Diabetes Clinical Research Registry',
    granteeRole: 'Research Institution',
    hospitalName: 'Apex Academic Research Foundation',
    scope: 'Anonymized Research',
    status: 'REVOKED',
    grantedDate: '2024-05-10',
    expiryDate: '2025-05-10'
  }
];

export const BACKEND_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-03-12 11:34:20',
    actorId: 'DOC-201',
    actorName: 'Dr. Sarah Mathew, MD',
    actorRole: 'DOCTOR',
    action: 'Doctor confirmed extraction',
    targetPatientId: 'PAT-1001',
    targetPatientName: 'Arun Kumar',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    status: 'SUCCESS',
    details: 'Verified and committed 6 clinical entities including Negated status for Chest Pain assertion.',
    ipAddress: '192.168.4.120'
  },
  {
    id: 'AUD-902',
    timestamp: '2026-03-12 11:31:05',
    actorId: 'AI-PIPELINE-V2',
    actorName: 'MediIntel Clinical NLP Engine',
    actorRole: 'SYSTEM_ADMIN',
    action: 'AI processed document',
    targetPatientId: 'PAT-1001',
    targetPatientName: 'Arun Kumar',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    status: 'SUCCESS',
    details: 'OCR & Clinical NER completed on DOC-101. Negation classified on "denies chest pain".',
    ipAddress: '10.0.8.44'
  },
  {
    id: 'AUD-903',
    timestamp: '2026-03-12 11:28:10',
    actorId: 'DOC-201',
    actorName: 'Dr. Sarah Mathew, MD',
    actorRole: 'DOCTOR',
    action: 'Doctor uploaded document',
    targetPatientId: 'PAT-1001',
    targetPatientName: 'Arun Kumar',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    status: 'SUCCESS',
    details: 'Uploaded Consultation Summary PDF (1.4 MB) to patient record.',
    ipAddress: '192.168.4.120'
  },
  {
    id: 'AUD-904',
    timestamp: '2026-03-12 11:25:00',
    actorId: 'DOC-201',
    actorName: 'Dr. Sarah Mathew, MD',
    actorRole: 'DOCTOR',
    action: 'Doctor viewed patient record',
    targetPatientId: 'PAT-1001',
    targetPatientName: 'Arun Kumar',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    status: 'SUCCESS',
    details: 'Authorized record view: Patient consent active under Dr. Sarah Mathew, MD.',
    ipAddress: '192.168.4.120'
  }
];

export function generateFHIRBundleBackend(
  patient: Patient,
  events: TimelineEvent[],
  documents: MedicalDocument[]
): FHIRBundle {
  const patientResource = {
    resourceType: 'Patient',
    id: patient.id,
    identifier: [
      {
        use: 'official',
        system: 'urn:oid:mediintel:patient-id',
        value: patient.id
      },
      {
        use: 'secondary',
        system: 'urn:oid:mediintel:qr-token',
        value: patient.qrIdentityToken
      }
    ],
    active: true,
    name: [
      {
        use: 'official',
        text: patient.fullName,
        family: patient.fullName.split(' ').slice(-1)[0],
        given: patient.fullName.split(' ').slice(0, -1)
      }
    ],
    telecom: [
      { system: 'phone', value: patient.phone, use: 'mobile' },
      { system: 'email', value: patient.email, use: 'home' }
    ],
    gender: patient.gender.toLowerCase(),
    birthDate: patient.dateOfBirth,
    address: [
      {
        use: 'home',
        text: patient.address,
        city: 'Bengaluru',
        state: 'KA',
        country: 'IND'
      }
    ],
    managingOrganization: {
      reference: `Organization/${patient.hospitalId}`,
      display: patient.hospitalName
    }
  };

  const observations: any[] = [];
  if (patient.latestVitals) {
    if (patient.latestVitals.hba1c) {
      observations.push({
        resourceType: 'Observation',
        id: `obs-hba1c-${patient.id}`,
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'laboratory',
                display: 'Laboratory'
              }
            ]
          }
        ],
        code: {
          coding: [{ system: 'http://loinc.org', code: '4548-4', display: 'Hemoglobin A1c/Hemoglobin.total in Blood' }],
          text: 'HbA1c'
        },
        subject: { reference: `Patient/${patient.id}` },
        effectiveDateTime: `${patient.latestVitals.lastRecorded}T09:00:00Z`,
        valueQuantity: {
          value: patient.latestVitals.hba1c,
          unit: '%',
          system: 'http://unitsofmeasure.org',
          code: '%'
        }
      });
    }

    if (patient.latestVitals.bloodPressure) {
      const [sys, dia] = patient.latestVitals.bloodPressure.split('/');
      observations.push({
        resourceType: 'Observation',
        id: `obs-bp-${patient.id}`,
        status: 'final',
        category: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                code: 'vital-signs',
                display: 'Vital Signs'
              }
            ]
          }
        ],
        code: {
          coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel' }],
          text: 'Blood Pressure'
        },
        subject: { reference: `Patient/${patient.id}` },
        effectiveDateTime: `${patient.latestVitals.lastRecorded}T09:00:00Z`,
        component: [
          {
            code: {
              coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }]
            },
            valueQuantity: { value: Number(sys), unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }
          },
          {
            code: {
              coding: [{ system: 'http://loinc.org', code: '8462-4', display: 'Diastolic blood pressure' }]
            },
            valueQuantity: { value: Number(dia), unit: 'mmHg', system: 'http://unitsofmeasure.org', code: 'mm[Hg]' }
          }
        ]
      });
    }
  }

  const medicationStatements: any[] = patient.currentMedications.map((med, idx) => ({
    resourceType: 'MedicationStatement',
    id: `med-${patient.id}-${idx + 1}`,
    status: 'active',
    medicationCodeableConcept: {
      text: med
    },
    subject: { reference: `Patient/${patient.id}` },
    dateAsserted: patient.latestVitals.lastRecorded
  }));

  const entries = [
    { fullUrl: `urn:uuid:patient-${patient.id}`, resource: patientResource },
    ...observations.map((obs) => ({ fullUrl: `urn:uuid:${obs.id}`, resource: obs })),
    ...medicationStatements.map((med) => ({ fullUrl: `urn:uuid:${med.id}`, resource: med }))
  ];

  return {
    resourceType: 'Bundle',
    id: `bundle-fhir-${patient.id}-${Date.now()}`,
    type: 'collection',
    timestamp: new Date().toISOString(),
    total: entries.length,
    entry: entries
  };
}
