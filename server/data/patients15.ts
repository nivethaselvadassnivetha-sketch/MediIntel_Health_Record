import { Patient, MedicalDocument, TimelineEvent, ConsentRecord, AuditLog } from '../../src/types/healthcare';

export interface PatientGraphData {
  patientId: string;
  hba1cTrend?: { date: string; value: number; label: string }[];
  bpTrend: { date: string; systolic: number; diastolic: number }[];
  glucoseTrend?: { date: string; fasting: number; postPrandial: number }[];
  customMetric?: { name: string; unit: string; series: { date: string; value: number }[] };
}

export const BACKEND_PATIENTS: Patient[] = [
  {
    id: 'PAT-1001',
    fullName: 'Arun Kumar',
    age: 48,
    gender: 'Male',
    dateOfBirth: '1978-04-14',
    bloodGroup: 'O+',
    phone: '+91 98450 23140',
    email: 'arun.kumar@gmail.com',
    address: '42, 6th Cross, 100ft Road, Indiranagar, Bengaluru, KA - 560038',
    emergencyContact: {
      name: 'Sunita Kumar',
      relationship: 'Spouse',
      phone: '+91 98450 23141'
    },
    primaryDoctorId: 'DOC-201',
    primaryDoctorName: 'Dr. Sarah Mathew, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-03-10',
    activeConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Microalbuminuria (Controlled)'],
    currentMedications: ['Metformin 500 mg BD', 'Telmisartan 40 mg OD', 'Atorvastatin 10 mg HS'],
    allergies: ['Penicillin (Moderate rash)'],
    latestVitals: {
      bloodPressure: '122/78',
      heartRate: 72,
      hba1c: 6.8,
      glucoseFasting: 106,
      bmi: 24.8,
      spO2: 99,
      temperature: 98.4,
      lastRecorded: '2026-03-12'
    },
    qrIdentityToken: 'MEDINTEL-PAT1001-e7b8a912-apex-sec-v2'
  },
  {
    id: 'PAT-1002',
    fullName: 'Priya Sharma',
    age: 36,
    gender: 'Female',
    dateOfBirth: '1990-09-22',
    bloodGroup: 'B+',
    phone: '+91 99160 44219',
    email: 'priya.sharma@yahoo.com',
    address: '18, 4th Block, 80ft Road, Koramangala, Bengaluru, KA - 560034',
    emergencyContact: {
      name: 'Rohan Sharma',
      relationship: 'Brother',
      phone: '+91 99160 44220'
    },
    primaryDoctorId: 'DOC-204',
    primaryDoctorName: 'Dr. Rajesh Rao, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-06-18',
    activeConditions: ['Persistent Bronchial Asthma', 'Allergic Rhinitis'],
    currentMedications: ['Budesonide Inhaler 200 mcg BD', 'Montelukast 10 mg OD', 'Levocetirizine 5 mg HS'],
    allergies: ['Aspirin (Bronchospasm trigger)', 'Dust mites'],
    latestVitals: {
      bloodPressure: '118/76',
      heartRate: 78,
      bmi: 22.4,
      spO2: 98,
      temperature: 98.6,
      lastRecorded: '2026-02-28'
    },
    qrIdentityToken: 'MEDINTEL-PAT1002-c4f91033-apex-sec-v2'
  },
  {
    id: 'PAT-1003',
    fullName: 'Rajesh Patel',
    age: 62,
    gender: 'Male',
    dateOfBirth: '1964-01-19',
    bloodGroup: 'A+',
    phone: '+91 97401 55678',
    email: 'rajesh.patel@outlook.com',
    address: '512, Prestige Palms, ECC Road, Whitefield, Bengaluru, KA - 560066',
    emergencyContact: {
      name: 'Nisha Patel',
      relationship: 'Spouse',
      phone: '+91 97401 55679'
    },
    primaryDoctorId: 'DOC-202',
    primaryDoctorName: 'Dr. Anand Raman, DM',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-01-15',
    activeConditions: ['Coronary Artery Disease', 'Hyperlipidemia', 'Post-PCI Stent (LAD - 2023)'],
    currentMedications: ['Atorvastatin 40 mg OD', 'Aspirin 75 mg OD', 'Metoprolol Succinate 50 mg OD', 'Ramipril 2.5 mg OD'],
    allergies: ['Sulfonamides'],
    latestVitals: {
      bloodPressure: '128/80',
      heartRate: 64,
      bmi: 26.1,
      spO2: 97,
      temperature: 98.2,
      lastRecorded: '2026-03-05'
    },
    qrIdentityToken: 'MEDINTEL-PAT1003-88bb7120-apex-sec-v2'
  },
  {
    id: 'PAT-1004',
    fullName: 'Sunita Devi',
    age: 55,
    gender: 'Female',
    dateOfBirth: '1971-08-04',
    bloodGroup: 'AB+',
    phone: '+91 98860 33112',
    email: 'sunita.devi@rediffmail.com',
    address: '77, 9th Main, 4th Block, Jayanagar, Bengaluru, KA - 560011',
    emergencyContact: {
      name: 'Manish Devi',
      relationship: 'Son',
      phone: '+91 98860 33113'
    },
    primaryDoctorId: 'DOC-203',
    primaryDoctorName: 'Dr. Meenakshi Sundaram, MS',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-04-20',
    activeConditions: ['Bilateral Knee Osteoarthritis (Grade 3)', 'Essential Hypertension'],
    currentMedications: ['Glucosamine Sulfate 1500 mg OD', 'Paracetamol 650 mg PRN', 'Amlodipine 5 mg OD'],
    allergies: ['None known'],
    latestVitals: {
      bloodPressure: '130/82',
      heartRate: 74,
      bmi: 27.8,
      spO2: 98,
      temperature: 98.5,
      lastRecorded: '2026-02-14'
    },
    qrIdentityToken: 'MEDINTEL-PAT1004-9a11d402-apex-sec-v2'
  },
  {
    id: 'PAT-1005',
    fullName: 'Vikram Singh',
    age: 41,
    gender: 'Male',
    dateOfBirth: '1985-05-11',
    bloodGroup: 'O-',
    phone: '+91 96112 88410',
    email: 'vikram.singh@gmail.com',
    address: '104, 27th Main, Sector 1, HSR Layout, Bengaluru, KA - 560102',
    emergencyContact: {
      name: 'Pooja Singh',
      relationship: 'Spouse',
      phone: '+91 96112 88411'
    },
    primaryDoctorId: 'DOC-201',
    primaryDoctorName: 'Dr. Sarah Mathew, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-09-02',
    activeConditions: ['Chronic Erosive Gastritis', 'Vitamin B12 Deficiency'],
    currentMedications: ['Pantoprazole 40 mg OD before breakfast', 'Methylcobalamin 1500 mcg OD'],
    allergies: ['Ciprofloxacin'],
    latestVitals: {
      bloodPressure: '120/78',
      heartRate: 70,
      bmi: 23.9,
      spO2: 99,
      temperature: 98.4,
      lastRecorded: '2026-01-20'
    },
    qrIdentityToken: 'MEDINTEL-PAT1005-77ef1903-apex-sec-v2'
  },
  {
    id: 'PAT-1006',
    fullName: 'Ananya Iyer',
    age: 29,
    gender: 'Female',
    dateOfBirth: '1997-11-03',
    bloodGroup: 'B+',
    phone: '+91 94480 66201',
    email: 'ananya.iyer@gmail.com',
    address: '89, 15th Cross, Margosa Road, Malleshwaram, Bengaluru, KA - 560003',
    emergencyContact: {
      name: 'Venkatesh Iyer',
      relationship: 'Father',
      phone: '+91 94480 66202'
    },
    primaryDoctorId: 'DOC-201',
    primaryDoctorName: 'Dr. Sarah Mathew, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-11-12',
    activeConditions: ['Hashimoto Thyroiditis', 'Iron Deficiency Anemia'],
    currentMedications: ['Levothyroxine 75 mcg OD (Fasting)', 'Ferrous Ascorbate 100 mg OD'],
    allergies: ['NSAIDs (Gastric burning)'],
    latestVitals: {
      bloodPressure: '112/74',
      heartRate: 68,
      bmi: 21.2,
      spO2: 99,
      temperature: 98.6,
      lastRecorded: '2026-03-01'
    },
    qrIdentityToken: 'MEDINTEL-PAT1006-22a48811-apex-sec-v2'
  },
  {
    id: 'PAT-1007',
    fullName: 'Mohammed Farhan',
    age: 52,
    gender: 'Male',
    dateOfBirth: '1974-03-29',
    bloodGroup: 'A-',
    phone: '+91 98441 77309',
    email: 'm.farhan@gmail.com',
    address: '22, Mosque Road, Frazer Town, Bengaluru, KA - 560005',
    emergencyContact: {
      name: 'Yasmin Farhan',
      relationship: 'Spouse',
      phone: '+91 98441 77310'
    },
    primaryDoctorId: 'DOC-202',
    primaryDoctorName: 'Dr. Anand Raman, DM',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-02-18',
    activeConditions: ['Chronic Kidney Disease Stage 2', 'Hypertension', 'Renal Microangiopathy'],
    currentMedications: ['Losartan 50 mg OD', 'Torsemide 10 mg OD', 'Sodium Bicarbonate 500 mg BD'],
    allergies: ['Contrast Dye (Iodine)'],
    latestVitals: {
      bloodPressure: '126/82',
      heartRate: 76,
      bmi: 25.4,
      spO2: 98,
      temperature: 98.4,
      lastRecorded: '2026-03-08'
    },
    qrIdentityToken: 'MEDINTEL-PAT1007-bb19942a-apex-sec-v2'
  },
  {
    id: 'PAT-1008',
    fullName: 'Deepa Nair',
    age: 44,
    gender: 'Female',
    dateOfBirth: '1982-06-17',
    bloodGroup: 'O+',
    phone: '+91 97312 99014',
    email: 'deepa.nair@live.com',
    address: '301, Richmond Heritage, Richmond Town, Bengaluru, KA - 560025',
    emergencyContact: {
      name: 'Girish Nair',
      relationship: 'Spouse',
      phone: '+91 97312 99015'
    },
    primaryDoctorId: 'DOC-201',
    primaryDoctorName: 'Dr. Sarah Mathew, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-08-05',
    activeConditions: ['Migraine with Visual Aura', 'Generalized Anxiety Disorder', 'Vitamin D Deficiency'],
    currentMedications: ['Propranolol 40 mg BD', 'Escitalopram 10 mg OD', 'Rizatriptan 10 mg PRN', 'Cholecalciferol 60k weekly'],
    allergies: ['Codeine'],
    latestVitals: {
      bloodPressure: '116/76',
      heartRate: 66,
      bmi: 22.8,
      spO2: 99,
      temperature: 98.3,
      lastRecorded: '2026-02-10'
    },
    qrIdentityToken: 'MEDINTEL-PAT1008-55dd1204-apex-sec-v2'
  },
  {
    id: 'PAT-1009',
    fullName: 'Suresh Nambiar',
    age: 67,
    gender: 'Male',
    dateOfBirth: '1959-10-12',
    bloodGroup: 'B-',
    phone: '+91 98801 22904',
    email: 'suresh.nambiar@gmail.com',
    address: '41, 10th Main, 2nd Stage, Banashankari, Bengaluru, KA - 560070',
    emergencyContact: {
      name: 'Maya Nambiar',
      relationship: 'Daughter',
      phone: '+91 98801 22905'
    },
    primaryDoctorId: 'DOC-204',
    primaryDoctorName: 'Dr. Rajesh Rao, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-05-14',
    activeConditions: ['Chronic Obstructive Pulmonary Disease (COPD Gold II)', 'Ex-Smoker (40 pk-yrs)'],
    currentMedications: ['Tiotropium Inhaler 2.5 mcg OD', 'Formoterol + Budesonide Inhaler BD', 'N-Acetylcysteine 600 mg OD'],
    allergies: ['Sulfa drugs'],
    latestVitals: {
      bloodPressure: '134/84',
      heartRate: 82,
      bmi: 24.1,
      spO2: 95,
      temperature: 98.5,
      lastRecorded: '2026-03-02'
    },
    qrIdentityToken: 'MEDINTEL-PAT1009-88aa3312-apex-sec-v2'
  },
  {
    id: 'PAT-1010',
    fullName: 'Kavita Reddy',
    age: 39,
    gender: 'Female',
    dateOfBirth: '1987-02-28',
    bloodGroup: 'AB-',
    phone: '+91 99002 44781',
    email: 'kavita.reddy@gmail.com',
    address: '204, Green Glen Layout, Bellandur, Outer Ring Road, Bengaluru, KA - 560103',
    emergencyContact: {
      name: 'Vikas Reddy',
      relationship: 'Spouse',
      phone: '+91 99002 44782'
    },
    primaryDoctorId: 'DOC-203',
    primaryDoctorName: 'Dr. Meenakshi Sundaram, MS',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-07-22',
    activeConditions: ['Seropositive Rheumatoid Arthritis', 'Secondary Sjogren Syndrome'],
    currentMedications: ['Methotrexate 15 mg weekly', 'Folic Acid 5 mg OD', 'Hydroxychloroquine 200 mg OD'],
    allergies: ['Sulfasalazine'],
    latestVitals: {
      bloodPressure: '120/78',
      heartRate: 72,
      bmi: 23.4,
      spO2: 98,
      temperature: 98.4,
      lastRecorded: '2026-02-20'
    },
    qrIdentityToken: 'MEDINTEL-PAT1010-44bb9910-apex-sec-v2'
  },
  {
    id: 'PAT-1011',
    fullName: 'Amitav Ghosh',
    age: 58,
    gender: 'Male',
    dateOfBirth: '1968-07-09',
    bloodGroup: 'O+',
    phone: '+91 98455 11982',
    email: 'amitav.ghosh@wipro.com',
    address: '58, Neeladri Road, Electronic City Phase 1, Bengaluru, KA - 560100',
    emergencyContact: {
      name: 'Sharmila Ghosh',
      relationship: 'Spouse',
      phone: '+91 98455 11983'
    },
    primaryDoctorId: 'DOC-201',
    primaryDoctorName: 'Dr. Sarah Mathew, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-03-30',
    activeConditions: ['Type 2 Diabetes Mellitus', 'Diabetic Peripheral Neuropathy', 'Hypertriglyceridemia'],
    currentMedications: ['Metformin 1000 mg BD', 'Glimepiride 2 mg OD', 'Pregabalin 75 mg HS', 'Fenofibrate 145 mg OD'],
    allergies: ['None known'],
    latestVitals: {
      bloodPressure: '136/86',
      heartRate: 78,
      hba1c: 7.4,
      glucoseFasting: 138,
      bmi: 28.2,
      spO2: 98,
      temperature: 98.6,
      lastRecorded: '2026-03-11'
    },
    qrIdentityToken: 'MEDINTEL-PAT1011-99881122-apex-sec-v2'
  },
  {
    id: 'PAT-1012',
    fullName: 'Meera Pillai',
    age: 63,
    gender: 'Female',
    dateOfBirth: '1963-04-05',
    bloodGroup: 'A+',
    phone: '+91 97410 88234',
    email: 'meera.pillai@gmail.com',
    address: '612, 16th Main, BTM 2nd Stage, Bengaluru, KA - 560076',
    emergencyContact: {
      name: 'K. Pillai',
      relationship: 'Spouse',
      phone: '+91 97410 88235'
    },
    primaryDoctorId: 'DOC-203',
    primaryDoctorName: 'Dr. Meenakshi Sundaram, MS',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-01-28',
    activeConditions: ['Postmenopausal Severe Osteoporosis', 'Essential Hypertension'],
    currentMedications: ['Alendronate 70 mg weekly', 'Calcium Carbonate 500 mg + Vit D3 BD', 'Telmisartan 20 mg OD'],
    allergies: ['Penicillin'],
    latestVitals: {
      bloodPressure: '124/80',
      heartRate: 68,
      bmi: 25.0,
      spO2: 99,
      temperature: 98.2,
      lastRecorded: '2026-02-17'
    },
    qrIdentityToken: 'MEDINTEL-PAT1012-77665544-apex-sec-v2'
  },
  {
    id: 'PAT-1013',
    fullName: 'Karthik Venkat',
    age: 46,
    gender: 'Male',
    dateOfBirth: '1980-12-14',
    bloodGroup: 'B+',
    phone: '+91 98866 55001',
    email: 'karthik.v@techcorp.in',
    address: '33, Rainbow Drive, Sarjapur Road, Bengaluru, KA - 560035',
    emergencyContact: {
      name: 'Radhika Venkat',
      relationship: 'Spouse',
      phone: '+91 98866 55002'
    },
    primaryDoctorId: 'DOC-201',
    primaryDoctorName: 'Dr. Sarah Mathew, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-10-04',
    activeConditions: ['Non-Alcoholic Fatty Liver Disease (NAFLD Grade 2)', 'Metabolic Syndrome', 'Obesity'],
    currentMedications: ['Saroglitazar 4 mg OD', 'Vitamin E 400 IU OD', 'Rosuvastatin 10 mg OD'],
    allergies: ['None known'],
    latestVitals: {
      bloodPressure: '132/84',
      heartRate: 75,
      hba1c: 6.2,
      glucoseFasting: 114,
      bmi: 29.8,
      spO2: 98,
      temperature: 98.5,
      lastRecorded: '2026-03-04'
    },
    qrIdentityToken: 'MEDINTEL-PAT1013-11223344-apex-sec-v2'
  },
  {
    id: 'PAT-1014',
    fullName: 'Fatima Begum',
    age: 71,
    gender: 'Female',
    dateOfBirth: '1955-09-08',
    bloodGroup: 'O+',
    phone: '+91 98452 33419',
    email: 'fatima.b@gmail.com',
    address: '14, Broadway Road, Shivajinagar, Bengaluru, KA - 560051',
    emergencyContact: {
      name: 'Tariq Begum',
      relationship: 'Son',
      phone: '+91 98452 33420'
    },
    primaryDoctorId: 'DOC-202',
    primaryDoctorName: 'Dr. Anand Raman, DM',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-02-09',
    activeConditions: ['Heart Failure with Preserved EF (HFpEF)', 'Type 2 Diabetes Mellitus', 'CKD Stage 3a'],
    currentMedications: ['Empagliflozin 10 mg OD', 'Furosemide 20 mg OD', 'Spironolactone 25 mg OD', 'Linagliptin 5 mg OD'],
    allergies: ['ACE Inhibitors (Persistent intractable cough)'],
    latestVitals: {
      bloodPressure: '126/78',
      heartRate: 70,
      hba1c: 6.9,
      glucoseFasting: 118,
      bmi: 26.5,
      spO2: 96,
      temperature: 98.3,
      lastRecorded: '2026-03-09'
    },
    qrIdentityToken: 'MEDINTEL-PAT1014-9900aacc-apex-sec-v2'
  },
  {
    id: 'PAT-1015',
    fullName: 'Sanjay Kulkarni',
    age: 50,
    gender: 'Male',
    dateOfBirth: '1976-06-25',
    bloodGroup: 'A+',
    phone: '+91 96110 33890',
    email: 'sanjay.kulkarni@gmail.com',
    address: '90, Bull Temple Road, Basavanagudi, Bengaluru, KA - 560004',
    emergencyContact: {
      name: 'Swati Kulkarni',
      relationship: 'Spouse',
      phone: '+91 96110 33891'
    },
    primaryDoctorId: 'DOC-201',
    primaryDoctorName: 'Dr. Sarah Mathew, MD',
    hospitalId: 'HOSP-01',
    hospitalName: 'Apex City Multi-Specialty Hospital',
    registeredDate: '2024-06-01',
    activeConditions: ['Chronic Hyperuricemia with Gouty Arthritis', 'Chronic Plaque Psoriasis'],
    currentMedications: ['Allopurinol 100 mg OD', 'Colchicine 0.5 mg PRN', 'Topical Calcipotriol BD'],
    allergies: ['Sulfa drugs'],
    latestVitals: {
      bloodPressure: '128/82',
      heartRate: 72,
      bmi: 25.8,
      spO2: 98,
      temperature: 98.4,
      lastRecorded: '2026-02-24'
    },
    qrIdentityToken: 'MEDINTEL-PAT1015-33445566-apex-sec-v2'
  }
];

export const BACKEND_GRAPH_DATA: Record<string, PatientGraphData> = {
  'PAT-1001': {
    patientId: 'PAT-1001',
    hba1cTrend: [
      { date: '2024-03-15', value: 8.4, label: 'Initial T2D Diagnosis' },
      { date: '2024-09-10', value: 7.9, label: 'Metformin 500mg Titration' },
      { date: '2025-03-20', value: 7.3, label: 'Diet & Exercise Plan' },
      { date: '2025-09-15', value: 7.0, label: 'Lifestyle Adherence' },
      { date: '2026-03-12', value: 6.8, label: 'Target Glycemic Goal Achieved' }
    ],
    bpTrend: [
      { date: '2024-03-15', systolic: 148, diastolic: 92 },
      { date: '2024-09-10', systolic: 140, diastolic: 88 },
      { date: '2025-03-20', systolic: 134, diastolic: 84 },
      { date: '2025-09-15', systolic: 128, diastolic: 80 },
      { date: '2026-03-12', systolic: 122, diastolic: 78 }
    ],
    glucoseTrend: [
      { date: '2024-03-15', fasting: 172, postPrandial: 238 },
      { date: '2024-09-10', fasting: 148, postPrandial: 195 },
      { date: '2025-03-20', fasting: 126, postPrandial: 168 },
      { date: '2025-09-15', fasting: 114, postPrandial: 148 },
      { date: '2026-03-12', fasting: 106, postPrandial: 138 }
    ]
  },
  'PAT-1002': {
    patientId: 'PAT-1002',
    bpTrend: [
      { date: '2024-06-18', systolic: 124, diastolic: 80 },
      { date: '2025-01-10', systolic: 120, diastolic: 78 },
      { date: '2025-08-14', systolic: 118, diastolic: 76 },
      { date: '2026-02-28', systolic: 118, diastolic: 76 }
    ],
    customMetric: {
      name: 'FEV1 / FVC Ratio',
      unit: '%',
      series: [
        { date: '2024-06-18', value: 68 },
        { date: '2025-01-10', value: 74 },
        { date: '2025-08-14', value: 79 },
        { date: '2026-02-28', value: 82 }
      ]
    }
  },
  'PAT-1003': {
    patientId: 'PAT-1003',
    bpTrend: [
      { date: '2024-01-15', systolic: 152, diastolic: 94 },
      { date: '2024-07-20', systolic: 142, diastolic: 88 },
      { date: '2025-02-18', systolic: 134, diastolic: 82 },
      { date: '2025-09-10', systolic: 130, diastolic: 80 },
      { date: '2026-03-05', systolic: 128, diastolic: 80 }
    ],
    customMetric: {
      name: 'LDL-C Cholesterol',
      unit: 'mg/dL',
      series: [
        { date: '2024-01-15', value: 165 },
        { date: '2024-07-20', value: 118 },
        { date: '2025-02-18', value: 92 },
        { date: '2025-09-10', value: 74 },
        { date: '2026-03-05', value: 68 }
      ]
    }
  },
  'PAT-1011': {
    patientId: 'PAT-1011',
    hba1cTrend: [
      { date: '2024-03-30', value: 9.2, label: 'Uncontrolled T2D' },
      { date: '2024-10-15', value: 8.5, label: 'Metformin Titration' },
      { date: '2025-04-12', value: 7.9, label: 'Added Glimepiride' },
      { date: '2026-03-11', value: 7.4, label: 'Significant Neuropathy Relief' }
    ],
    bpTrend: [
      { date: '2024-03-30', systolic: 146, diastolic: 92 },
      { date: '2025-04-12', systolic: 140, diastolic: 88 },
      { date: '2026-03-11', systolic: 136, diastolic: 86 }
    ]
  }
};
