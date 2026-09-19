import { Patient, MedicalDocument, TimelineEvent, ConsentRecord, AuditLog, User, Hospital, FHIRBundle } from '../types/healthcare';

export const INITIAL_USERS: Record<string, User> = {
  doctor: {
    id: 'USR-DOC-201',
    name: 'Dr. Sarah Mathew, MD',
    email: 'sarah.mathew@apexcityhealth.org',
    role: 'DOCTOR',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    specialty: 'Consultant Endocrinologist & Internal Medicine',
    licenseNumber: 'MCI-REG-84920'
  },
  patient: {
    id: 'USR-PAT-1001',
    name: 'Arun Kumar',
    email: 'arun.kumar@gmail.com',
    role: 'PATIENT',
    patientId: 'PAT-1001',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital'
  },
  hospitalAdmin: {
    id: 'USR-HADM-401',
    name: 'Marcus Vance',
    email: 'm.vance@apexcityhealth.org',
    role: 'HOSPITAL_ADMIN',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital'
  },
  systemAdmin: {
    id: 'USR-SADM-901',
    name: 'Dr. Clara Chen',
    email: 'c.chen@healthintel-core.gov',
    role: 'SYSTEM_ADMIN'
  }
};

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'HOSP-01',
    name: 'Apex City Multi-Specialty Hospital',
    city: 'Bangalore, KA',
    doctorsCount: 42,
    patientsCount: 1280,
    documentsProcessed: 4320,
    status: 'ACTIVE'
  },
  {
    id: 'HOSP-02',
    name: 'Metro Care Heart & General Institute',
    city: 'Hyderabad, TS',
    doctorsCount: 28,
    patientsCount: 840,
    documentsProcessed: 2890,
    status: 'ACTIVE'
  },
  {
    id: 'HOSP-03',
    name: 'St. Jude Clinical Research & Memorial',
    city: 'Chennai, TN',
    doctorsCount: 35,
    patientsCount: 1105,
    documentsProcessed: 3740,
    status: 'ACTIVE'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PAT-1001',
    fullName: 'Arun Kumar',
    age: 48,
    gender: 'Male',
    dateOfBirth: '1978-04-14',
    bloodGroup: 'B Positive (B+)',
    phone: '+91 98450 23190',
    email: 'arun.kumar@gmail.com',
    address: '#142, 4th Cross, Indiranagar, Bangalore 560038',
    emergencyContact: {
      name: 'Sunita Kumar',
      relationship: 'Spouse',
      phone: '+91 98450 23199'
    },
    primaryDoctorId: 'USR-DOC-201',
    primaryDoctorName: 'Dr. Sarah Mathew, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-02-10',
    activeConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Dyslipidemia'],
    currentMedications: ['Metformin 500 mg BD', 'Telmisartan 40 mg OD', 'Atorvastatin 10 mg HS'],
    allergies: ['Penicillin (Moderate rash)', 'Shellfish'],
    latestVitals: {
      bloodPressure: '124/82 mmHg',
      heartRate: 74,
      hba1c: 6.8,
      glucoseFasting: 118,
      bmi: 25.4,
      spO2: 98,
      temperature: 98.4,
      lastRecorded: '2026-03-12'
    },
    qrIdentityToken: 'MEDI-ID:PAT-1001:SIG-89FE22AC907B'
  },
  {
    id: 'PAT-1002',
    fullName: 'Priya Sharma',
    age: 34,
    gender: 'Female',
    dateOfBirth: '1992-08-22',
    bloodGroup: 'O Positive (O+)',
    phone: '+91 97312 88419',
    email: 'priya.sharma@yahoo.co.in',
    address: 'Flat 304, Green Palms Apt, Whitefield, Bangalore',
    emergencyContact: {
      name: 'Rohan Sharma',
      relationship: 'Brother',
      phone: '+91 97312 88420'
    },
    primaryDoctorId: 'USR-DOC-201',
    primaryDoctorName: 'Dr. Sarah Mathew, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-05-18',
    activeConditions: ['Bronchial Asthma', 'Allergic Rhinitis'],
    currentMedications: ['Montelukast 10 mg HS', 'Budesonide Inhaler 200mcg BID'],
    allergies: ['Aspirin / NSAIDs', 'Dust Mites'],
    latestVitals: {
      bloodPressure: '116/74 mmHg',
      heartRate: 78,
      bmi: 22.1,
      spO2: 99,
      temperature: 98.6,
      lastRecorded: '2026-02-20'
    },
    qrIdentityToken: 'MEDI-ID:PAT-1002:SIG-33DA9014BC18'
  },
  {
    id: 'PAT-1003',
    fullName: 'Rajesh Patel',
    age: 62,
    gender: 'Male',
    dateOfBirth: '1964-11-05',
    bloodGroup: 'A Positive (A+)',
    phone: '+91 94481 02938',
    email: 'r.patel64@gmail.com',
    address: 'Plot 88, Jubilee Hills Road 36, Hyderabad',
    emergencyContact: {
      name: 'Kavita Patel',
      relationship: 'Spouse',
      phone: '+91 94481 02939'
    },
    primaryDoctorId: 'USR-DOC-202',
    primaryDoctorName: 'Dr. Anand Raman, DM',
    hospitalId: 'HOSP-02',
    hospitalName: 'Metro Care Heart & General Institute',
    registeredDate: '2023-09-14',
    activeConditions: ['Coronary Artery Disease (s/p PTCA 2023)', 'Hypercholesterolemia'],
    currentMedications: ['Atorvastatin 40 mg HS', 'Clopidogrel 75 mg OD', 'Metoprolol 25 mg BD'],
    allergies: ['Sulfa drugs'],
    latestVitals: {
      bloodPressure: '130/84 mmHg',
      heartRate: 66,
      bmi: 26.8,
      spO2: 97,
      temperature: 98.2,
      lastRecorded: '2026-01-15'
    },
    qrIdentityToken: 'MEDI-ID:PAT-1003:SIG-10CC88B983AF'
  },
  {
    id: 'PAT-1004',
    fullName: 'Sunita Devi',
    age: 55,
    gender: 'Female',
    dateOfBirth: '1971-06-19',
    bloodGroup: 'B Negative (B-)',
    phone: '+91 99001 54620',
    email: 'sunita.devi71@outlook.com',
    address: 'House 12B, Anna Nagar West, Chennai',
    emergencyContact: {
      name: 'Amit Kumar',
      relationship: 'Son',
      phone: '+91 99001 54621'
    },
    primaryDoctorId: 'USR-DOC-203',
    primaryDoctorName: 'Dr. Meenakshi Sundaram',
    hospitalId: 'HOSP-03',
    hospitalName: 'St. Jude Clinical Research & Memorial',
    registeredDate: '2024-08-01',
    activeConditions: ['Bilateral Knee Osteoarthritis', 'Primary Hypothyroidism'],
    currentMedications: ['Levothyroxine 75 mcg OD', 'Paracetamol 650 mg SOS', 'Calcium + Vit D3'],
    allergies: ['None known'],
    latestVitals: {
      bloodPressure: '128/80 mmHg',
      heartRate: 72,
      bmi: 27.5,
      spO2: 98,
      temperature: 98.4,
      lastRecorded: '2026-02-28'
    },
    qrIdentityToken: 'MEDI-ID:PAT-1004:SIG-47AC0298BEEF'
  },
  {
    id: 'PAT-1005',
    fullName: 'Vikram Singh',
    age: 44,
    gender: 'Male',
    dateOfBirth: '1982-01-30',
    bloodGroup: 'AB Positive (AB+)',
    phone: '+91 98860 11920',
    email: 'vikram.singh.tech@gmail.com',
    address: '#502, Prestige Lakeside Habitat, Varthur, Bangalore',
    emergencyContact: {
      name: 'Neelam Singh',
      relationship: 'Spouse',
      phone: '+91 98860 11925'
    },
    primaryDoctorId: 'USR-DOC-201',
    primaryDoctorName: 'Dr. Sarah Mathew, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2025-01-10',
    activeConditions: ['Type 2 Diabetes Mellitus', 'Non-Alcoholic Fatty Liver (Grade 1)'],
    currentMedications: ['Metformin 500 mg BD', 'Saroglitazar 4 mg OD'],
    allergies: ['Ciprofloxacin'],
    latestVitals: {
      bloodPressure: '122/80 mmHg',
      heartRate: 76,
      hba1c: 7.1,
      bmi: 28.2,
      spO2: 98,
      temperature: 98.6,
      lastRecorded: '2026-03-05'
    },
    qrIdentityToken: 'MEDI-ID:PAT-1005:SIG-99AA3460CEE1'
  }
];

export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'EVT-2026-03',
    patientId: 'PAT-1001',
    date: '2026-03-12',
    year: 2026,
    month: 'March',
    title: 'Hospital Visit & Endocrine Review',
    category: 'Hospital Visit',
    facility: 'Apex City Multi-Specialty Hospital',
    doctorName: 'Dr. Sarah Mathew, MD',
    summary: 'Quarterly diabetic checkup. Glycemic control is optimal with HbA1c at 6.8%. Patient denies chest pain.',
    details: {
      diagnoses: ['Type 2 Diabetes Mellitus (Controlled)'],
      vitals: { BP: '124/82', Pulse: '74 bpm', BMI: '25.4' },
      prescribedMeds: ['Metformin 500 mg BD', 'Telmisartan 40 mg OD'],
      labValues: [
        { parameter: 'HbA1c', value: '6.8%', flag: 'NORMAL' },
        { parameter: 'Fasting Plasma Glucose', value: '118 mg/dL', flag: 'NORMAL' },
        { parameter: 'Post-Prandial Glucose', value: '142 mg/dL', flag: 'NORMAL' }
      ],
      notes: 'Cardiovascular assessment negative for angina. Mild exertional dyspnea discussed; continue routine walking program.'
    },
    documentId: 'DOC-8821'
  },
  {
    id: 'EVT-2026-01',
    patientId: 'PAT-1001',
    date: '2026-01-20',
    year: 2026,
    month: 'January',
    title: 'General Internal Medicine Consultation',
    category: 'Consultation',
    facility: 'Apex City Multi-Specialty Hospital',
    doctorName: 'Dr. Sarah Mathew, MD',
    summary: 'Annual hypertension monitoring and prescription refill. Blood pressure within target range.',
    details: {
      diagnoses: ['Essential Hypertension'],
      vitals: { BP: '126/80', Pulse: '72 bpm' },
      prescribedMeds: ['Telmisartan 40 mg OD', 'Atorvastatin 10 mg HS'],
      notes: 'Patient tolerating Telmisartan without cough or dizziness. Serum creatinine within normal limits.'
    }
  },
  {
    id: 'EVT-2025-11',
    patientId: 'PAT-1001',
    date: '2025-11-18',
    year: 2025,
    month: 'November',
    title: 'Comprehensive Metabolic Panel & Lipid Profile',
    category: 'Lab Result',
    facility: 'Apex Diagnostic Pathology Lab',
    doctorName: 'Dr. Sarah Mathew, MD',
    summary: 'Routine 6-month biochemistry evaluation. Fasting lipid profile demonstrates excellent response to Statin.',
    details: {
      labValues: [
        { parameter: 'Total Cholesterol', value: '162 mg/dL', flag: 'NORMAL' },
        { parameter: 'LDL Cholesterol', value: '88 mg/dL', flag: 'NORMAL' },
        { parameter: 'HDL Cholesterol', value: '46 mg/dL', flag: 'NORMAL' },
        { parameter: 'Triglycerides', value: '140 mg/dL', flag: 'NORMAL' },
        { parameter: 'Serum Creatinine', value: '0.92 mg/dL', flag: 'NORMAL' }
      ],
      notes: 'Renal panel unremarkable. eGFR > 90 mL/min/1.73m2.'
    }
  },
  {
    id: 'EVT-2025-08',
    patientId: 'PAT-1001',
    date: '2025-08-25',
    year: 2025,
    month: 'August',
    title: 'Medication Optimization & Follow-up Prescription',
    category: 'Prescription',
    facility: 'Apex City Multi-Specialty Hospital',
    doctorName: 'Dr. Sarah Mathew, MD',
    summary: 'Metformin titrated from 250mg to 500mg BD following slightly elevated post-prandial spikes.',
    details: {
      prescribedMeds: ['Metformin 500 mg BD (Increased)', 'Telmisartan 40 mg OD'],
      notes: 'Reinforced diabetic foot care and regular retinal screening appointment.'
    }
  },
  {
    id: 'EVT-2024-03',
    patientId: 'PAT-1001',
    date: '2024-03-05',
    year: 2024,
    month: 'March',
    title: 'Initial Endocrine Evaluation & Diagnosis',
    category: 'Consultation',
    facility: 'Apex City Multi-Specialty Hospital',
    doctorName: 'Dr. Sarah Mathew, MD',
    summary: 'First clinical presentation with polyuria and fatigue. Confirmed diagnosis of Type 2 Diabetes Mellitus.',
    details: {
      diagnoses: ['Type 2 Diabetes Mellitus - New Onset'],
      vitals: { BP: '138/88', Pulse: '80 bpm', BMI: '26.8' },
      labValues: [
        { parameter: 'HbA1c', value: '8.4%', flag: 'HIGH' },
        { parameter: 'Fasting Glucose', value: '172 mg/dL', flag: 'HIGH' }
      ],
      notes: 'Commenced Metformin 250 mg BD with medical nutrition therapy and lifestyle modifications.'
    }
  }
];

export const INITIAL_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'DOC-8821',
    patientId: 'PAT-1001',
    title: 'Discharge Summary & Endocrinology Note - Apollo Specialty',
    documentType: 'Discharge Summary',
    uploadedBy: 'USR-DOC-201',
    uploadedByName: 'Dr. Sarah Mathew, MD',
    uploadedAt: '2026-03-12 11:30 AM',
    fileSize: '1.4 MB',
    fileFormat: 'PDF',
    status: 'VERIFIED',
    ocrTextPreview: `APOLLO SPECIALTY HOSPITALS - CLINICAL DISCHARGE & CONSULTATION NOTE
PATIENT NAME: Arun Kumar | AGE/SEX: 48 / Male | PATIENT ID: PAT-1001
DATE OF EVALUATION: March 12, 2026 | CONSULTANT: Dr. Sarah Mathew, MD (Endocrinology)

CHIEF COMPLAINTS & HISTORY OF PRESENT ILLNESS:
Patient presents for scheduled quarterly metabolic follow-up and glycemic optimization. Patient confirms strict compliance with Metformin 500 mg BD orally after meals. Reports feeling active and denies dizziness or hypoglycemic episodes.

SYSTEMIC CLINICAL REVIEW:
- Cardiovascular: The patient denies chest pain, angina, or palpitations upon ordinary exertion.
- Respiratory: Reports mild exertional dyspnea during steep hill climbs; denied nocturnal paroxysmal dyspnea.
- Habits: Non-smoker. The patient denies tobacco, smoking, or alcohol consumption.

LABORATORY INVESTIGATIONS (March 12, 2026):
- Fasting Blood Sugar: 118 mg/dL (Ref: 70-99 mg/dL)
- Post-Prandial Blood Sugar: 142 mg/dL (Ref: < 140 mg/dL)
- Point-of-Care HbA1c: 6.8% (Ref: < 5.7%, target < 7.0%)
- Serum Creatinine: 0.94 mg/dL | eGFR: >90 mL/min

CLINICAL IMPRESSION:
1. Type 2 Diabetes Mellitus - Well-controlled on oral hypoglycemic monotherapy.
2. Essential Hypertension - Stable on Telmisartan 40 mg.
3. Dyslipidemia - Controlled on low-dose Atorvastatin.

RECOMMENDED DISCHARGE MEDICATIONS:
- Tab. Metformin 500 mg - 1 tablet twice daily after meals (oral).
- Tab. Telmisartan 40 mg - 1 tablet once daily morning.
- Tab. Atorvastatin 10 mg - 1 tablet at bedtime.`,
    extractedEntities: [
      {
        id: 'ENT-01',
        category: 'DIAGNOSIS',
        name: 'Type 2 Diabetes Mellitus',
        status: 'PRESENT',
        confidence: 98,
        sourceEvidence: 'Impression 1: Type 2 Diabetes Mellitus - Well-controlled on oral hypoglycemic monotherapy.',
        sourcePage: 1,
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'ICD-10: E11.9'
      },
      {
        id: 'ENT-02',
        category: 'MEDICATION',
        name: 'Metformin',
        dosage: '500 mg',
        frequency: 'Twice daily (BD) after meals',
        status: 'PRESENT',
        confidence: 96,
        sourceEvidence: 'Tab. Metformin 500 mg - 1 tablet twice daily after meals (oral).',
        sourcePage: 1,
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'RxNorm: 6809'
      },
      {
        id: 'ENT-03',
        category: 'LAB_RESULT',
        name: 'Glycated Hemoglobin (HbA1c)',
        value: '6.8',
        unit: '%',
        status: 'PRESENT',
        confidence: 95,
        sourceEvidence: 'Point-of-Care HbA1c: 6.8% (Ref: < 5.7%, target < 7.0%)',
        sourcePage: 1,
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'LOINC: 4548-4'
      },
      {
        id: 'ENT-04',
        category: 'SYMPTOM_STATEMENT',
        name: 'Chest Pain / Angina',
        status: 'NEGATED', // Highlighted context negation demonstration!
        confidence: 97,
        sourceEvidence: 'Cardiovascular: The patient denies chest pain, angina, or palpitations upon ordinary exertion.',
        sourcePage: 1,
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'SNOMED CT: 29857009 (Negated)',
        doctorNotes: 'Explicit patient negation confirmed. Rule out ischemic etiology.'
      },
      {
        id: 'ENT-05',
        category: 'SYMPTOM_STATEMENT',
        name: 'Palpitations',
        status: 'NEGATED',
        confidence: 94,
        sourceEvidence: 'denies chest pain, angina, or palpitations upon ordinary exertion.',
        sourcePage: 1,
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'SNOMED CT: 80313002 (Negated)'
      },
      {
        id: 'ENT-06',
        category: 'SYMPTOM_STATEMENT',
        name: 'Dyspnea (Exertional)',
        value: 'Mild',
        status: 'PRESENT',
        confidence: 92,
        sourceEvidence: 'Reports mild exertional dyspnea during steep hill climbs;',
        sourcePage: 1,
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'SNOMED CT: 267036007'
      },
      {
        id: 'ENT-07',
        category: 'SYMPTOM_STATEMENT',
        name: 'Tobacco / Smoking Exposure',
        status: 'NEGATED',
        confidence: 98,
        sourceEvidence: 'Non-smoker. The patient denies tobacco, smoking, or alcohol consumption.',
        sourcePage: 1,
        verificationStatus: 'CONFIRMED',
        clinicalCode: 'SNOMED CT: 77176002 (Never smoker)'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-9912',
    timestamp: '2026-09-18 12:30:15',
    actorId: 'USR-DOC-201',
    actorName: 'Dr. Sarah Mathew, MD',
    actorRole: 'DOCTOR',
    action: 'Doctor confirmed extraction',
    targetPatientId: 'PAT-1001',
    targetPatientName: 'Arun Kumar',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    status: 'SUCCESS',
    details: 'Clinician confirmed 7 AI-extracted clinical entities from DOC-8821 including Negated Chest Pain.',
    ipAddress: '192.168.4.120'
  },
  {
    id: 'AUD-9911',
    timestamp: '2026-09-18 12:28:40',
    actorId: 'AI-PIPELINE-V2',
    actorName: 'MediIntel Clinical NLP Engine',
    actorRole: 'SYSTEM_ADMIN',
    action: 'AI processed document',
    targetPatientId: 'PAT-1001',
    targetPatientName: 'Arun Kumar',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    status: 'SUCCESS',
    details: 'Document DOC-8821 parsed: OCR 99.4%, Negation Assertion accuracy 97.2%, 7 entities mapped to SNOMED/LOINC.',
    ipAddress: '10.0.8.44'
  },
  {
    id: 'AUD-9910',
    timestamp: '2026-09-18 12:27:12',
    actorId: 'USR-DOC-201',
    actorName: 'Dr. Sarah Mathew, MD',
    actorRole: 'DOCTOR',
    action: 'Doctor uploaded document',
    targetPatientId: 'PAT-1001',
    targetPatientName: 'Arun Kumar',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    status: 'SUCCESS',
    details: 'Uploaded PDF file: "Discharge Summary & Endocrinology Note - Apollo Specialty" (1.4 MB).',
    ipAddress: '192.168.4.120'
  },
  {
    id: 'AUD-9909',
    timestamp: '2026-09-18 12:25:02',
    actorId: 'USR-DOC-201',
    actorName: 'Dr. Sarah Mathew, MD',
    actorRole: 'DOCTOR',
    action: 'Doctor viewed patient record',
    targetPatientId: 'PAT-1001',
    targetPatientName: 'Arun Kumar',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    status: 'SUCCESS',
    details: 'Authorized record review via clinical dashboard search query "Male 40+ diabetes metformin".',
    ipAddress: '192.168.4.120'
  },
  {
    id: 'AUD-9908',
    timestamp: '2026-09-17 16:45:10',
    actorId: 'USR-PAT-1001',
    actorName: 'Arun Kumar',
    actorRole: 'PATIENT',
    action: 'Patient granted consent',
    targetPatientId: 'PAT-1001',
    targetPatientName: 'Arun Kumar',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    status: 'SUCCESS',
    details: 'Granted Full Medical Record Access to Dr. Sarah Mathew, MD until 2027-03-31.',
    ipAddress: '106.51.24.18'
  },
  {
    id: 'AUD-9907',
    timestamp: '2026-09-16 09:15:30',
    actorId: 'USR-PAT-1001',
    actorName: 'Arun Kumar',
    actorRole: 'PATIENT',
    action: 'Patient identity scanned via QR',
    targetPatientId: 'PAT-1001',
    targetPatientName: 'Arun Kumar',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    status: 'SUCCESS',
    details: 'Cryptographic QR token validated at Hospital Outpatient Check-in Desk A3.',
    ipAddress: '192.168.2.14'
  }
];

export const INITIAL_CONSENTS: ConsentRecord[] = [
  {
    id: 'CON-01',
    patientId: 'PAT-1001',
    granteeName: 'Dr. Sarah Mathew, MD',
    granteeRole: 'Consultant Endocrinologist',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    scope: 'Full Medical Record',
    status: 'ACTIVE',
    grantedDate: '2024-02-10',
    expiryDate: '2027-03-31'
  },
  {
    id: 'CON-02',
    patientId: 'PAT-1001',
    granteeName: 'Apex Emergency & Trauma Care Unit',
    granteeRole: 'Emergency Medicine Department',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    scope: 'Emergency Care Only',
    status: 'ACTIVE',
    grantedDate: '2024-02-10',
    expiryDate: '2027-12-31'
  },
  {
    id: 'CON-03',
    patientId: 'PAT-1001',
    granteeName: 'National Diabetes Research Consortium',
    granteeRole: 'Clinical Research Study',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    scope: 'Anonymized Research',
    status: 'ACTIVE',
    grantedDate: '2025-06-01',
    expiryDate: '2026-06-01'
  }
];

export function generateFHIRBundle(patient: Patient, events: TimelineEvent[], documents: MedicalDocument[]): FHIRBundle {
  return {
    resourceType: 'Bundle',
    id: `bundle-patient-${patient.id.toLowerCase()}`,
    type: 'collection',
    timestamp: new Date().toISOString(),
    total: 1 + events.length + documents.length + 2,
    entry: [
      {
        fullUrl: `urn:uuid:patient-${patient.id}`,
        resource: {
          resourceType: 'Patient',
          id: patient.id,
          meta: { profile: ['http://hl7.org/fhir/StructureDefinition/Patient'] },
          identifier: [
            { system: 'https://mediintel.health.gov/patients', value: patient.id },
            { system: 'https://mediintel.health.gov/qr-token', value: patient.qrIdentityToken }
          ],
          active: true,
          name: [{ use: 'official', text: patient.fullName }],
          telecom: [
            { system: 'phone', value: patient.phone, use: 'mobile' },
            { system: 'email', value: patient.email }
          ],
          gender: patient.gender.toLowerCase(),
          birthDate: patient.dateOfBirth,
          address: [{ line: [patient.address], country: 'IN' }],
          managingOrganization: { display: patient.hospitalName }
        }
      },
      {
        fullUrl: `urn:uuid:obs-hba1c-${patient.id}`,
        resource: {
          resourceType: 'Observation',
          id: `obs-hba1c-${patient.id}`,
          status: 'final',
          category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory' }] }],
          code: {
            coding: [{ system: 'http://loinc.org', code: '4548-4', display: 'Hemoglobin A1c/Hemoglobin.total in Blood' }]
          },
          subject: { reference: `Patient/${patient.id}`, display: patient.fullName },
          effectiveDateTime: patient.latestVitals.lastRecorded,
          valueQuantity: {
            value: patient.latestVitals.hba1c || 6.8,
            unit: '%',
            system: 'http://unitsofmeasure.org',
            code: '%'
          },
          referenceRange: [{ low: { value: 4.0, unit: '%' }, high: { value: 5.6, unit: '%' } }]
        }
      },
      {
        fullUrl: `urn:uuid:obs-bp-${patient.id}`,
        resource: {
          resourceType: 'Observation',
          id: `obs-bp-${patient.id}`,
          status: 'final',
          category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
          code: {
            coding: [{ system: 'http://loinc.org', code: '85354-9', display: 'Blood pressure panel' }]
          },
          subject: { reference: `Patient/${patient.id}` },
          effectiveDateTime: patient.latestVitals.lastRecorded,
          note: [{ text: `Measured blood pressure: ${patient.latestVitals.bloodPressure}` }]
        }
      },
      ...patient.currentMedications.map((med, idx) => ({
        fullUrl: `urn:uuid:med-${patient.id}-${idx}`,
        resource: {
          resourceType: 'MedicationStatement',
          id: `med-${patient.id}-${idx}`,
          status: 'active',
          medicationCodeableConcept: {
            text: med
          },
          subject: { reference: `Patient/${patient.id}`, display: patient.fullName },
          dateAsserted: patient.latestVitals.lastRecorded
        }
      })),
      ...documents.map((doc) => ({
        fullUrl: `urn:uuid:diagnosticreport-${doc.id}`,
        resource: {
          resourceType: 'DiagnosticReport',
          id: doc.id,
          status: 'final',
          code: { text: doc.title },
          subject: { reference: `Patient/${patient.id}` },
          effectiveDateTime: doc.uploadedAt,
          conclusion: `AI extracted ${doc.extractedEntities.length} entities with human clinical verification.`,
          extension: [
            {
              url: 'https://mediintel.health.gov/fhir/StructureDefinition/negation-assertions',
              valueString: JSON.stringify(
                doc.extractedEntities
                  .filter((e) => e.status === 'NEGATED')
                  .map((e) => ({ concept: e.name, status: 'NEGATED', confidence: e.confidence }))
              )
            }
          ]
        }
      }))
    ]
  };
}
