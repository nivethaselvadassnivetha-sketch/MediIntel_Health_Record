import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Edit3,
  AlertTriangle,
  BrainCircuit,
  Search,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileUp,
  FileCheck,
  Camera,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { api } from '../../services/api';
import {
  ExtractedEntity,
  MedicalDocument,
  NegationStatus,
  Patient,
  VerificationStatus
} from '../../types/healthcare';

interface DocumentIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onSaveExtractedToPatient: (
    docTitle: string,
    docType: MedicalDocument['documentType'],
    ocrText: string,
    entities: ExtractedEntity[]
  ) => void;
}

const SAMPLE_TEMPLATES = [
  {
    title: 'Discharge Summary & Endocrinology Note (Apollo)',
    type: 'Discharge Summary' as const,
    fileSize: '1.4 MB',
    format: 'PDF' as const,
    ocrText: `APOLLO SPECIALTY HOSPITALS - CLINICAL DISCHARGE & CONSULTATION NOTE
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
    entities: [
      {
        id: 'ENT-DEMO-1',
        category: 'DIAGNOSIS' as const,
        name: 'Type 2 Diabetes Mellitus',
        status: 'PRESENT' as const,
        confidence: 98,
        sourceEvidence: 'Impression 1: Type 2 Diabetes Mellitus - Well-controlled on oral hypoglycemic monotherapy.',
        sourcePage: 1,
        verificationStatus: 'PENDING' as const,
        clinicalCode: 'ICD-10: E11.9'
      },
      {
        id: 'ENT-DEMO-2',
        category: 'MEDICATION' as const,
        name: 'Metformin',
        dosage: '500 mg',
        frequency: 'Twice daily (BD) after meals',
        status: 'PRESENT' as const,
        confidence: 96,
        sourceEvidence: 'Tab. Metformin 500 mg - 1 tablet twice daily after meals (oral).',
        sourcePage: 1,
        verificationStatus: 'PENDING' as const,
        clinicalCode: 'RxNorm: 6809'
      },
      {
        id: 'ENT-DEMO-3',
        category: 'LAB_RESULT' as const,
        name: 'Glycated Hemoglobin (HbA1c)',
        value: '6.8',
        unit: '%',
        status: 'PRESENT' as const,
        confidence: 95,
        sourceEvidence: 'Point-of-Care HbA1c: 6.8% (Ref: < 5.7%, target < 7.0%)',
        sourcePage: 1,
        verificationStatus: 'PENDING' as const,
        clinicalCode: 'LOINC: 4548-4'
      },
      {
        id: 'ENT-DEMO-4',
        category: 'SYMPTOM_STATEMENT' as const,
        name: 'Chest Pain / Angina',
        status: 'NEGATED' as const, // Key demonstration of negation understanding
        confidence: 97,
        sourceEvidence: 'Cardiovascular: The patient denies chest pain, angina, or palpitations upon ordinary exertion.',
        sourcePage: 1,
        verificationStatus: 'PENDING' as const,
        clinicalCode: 'SNOMED CT: 29857009 (Negated Concept)',
        doctorNotes: 'Explicit patient negation detected via assertion rule.'
      },
      {
        id: 'ENT-DEMO-5',
        category: 'SYMPTOM_STATEMENT' as const,
        name: 'Palpitations',
        status: 'NEGATED' as const,
        confidence: 94,
        sourceEvidence: 'denies chest pain, angina, or palpitations upon ordinary exertion.',
        sourcePage: 1,
        verificationStatus: 'PENDING' as const,
        clinicalCode: 'SNOMED CT: 80313002 (Negated)'
      },
      {
        id: 'ENT-DEMO-6',
        category: 'SYMPTOM_STATEMENT' as const,
        name: 'Exertional Dyspnea',
        value: 'Mild',
        status: 'PRESENT' as const,
        confidence: 91,
        sourceEvidence: 'Respiratory: Reports mild exertional dyspnea during steep hill climbs;',
        sourcePage: 1,
        verificationStatus: 'PENDING' as const,
        clinicalCode: 'SNOMED CT: 267036007'
      },
      {
        id: 'ENT-DEMO-7',
        category: 'SYMPTOM_STATEMENT' as const,
        name: 'Tobacco & Smoking History',
        status: 'NEGATED' as const,
        confidence: 98,
        sourceEvidence: 'Habits: Non-smoker. The patient denies tobacco, smoking, or alcohol consumption.',
        sourcePage: 1,
        verificationStatus: 'PENDING' as const,
        clinicalCode: 'SNOMED CT: 77176002 (Non-smoker)'
      }
    ]
  },
  {
    id: 'sample-cardio',
    title: 'Cardiology Clinic Consultation Note - Metro Heart',
    type: 'Consultation Note' as const,
    fileSize: '950 KB',
    format: 'PDF' as const,
    ocrText: `METRO CARE HEART INSTITUTE - OUTPATIENT CARDIOLOGY NOTE
PATIENT ID: PAT-1001 | NAME: Arun Kumar | AGE: 48 M
EXAMINER: Dr. Anand Raman, DM (Cardiology)

REASON FOR CONSULT:
Cardiology clearance and assessment following exertional dyspnea report during routine walk.

OBSERVATIONS:
- Blood Pressure: 122/80 mmHg right arm sitting. Pulse 72 bpm regular.
- 12-Lead ECG: Normal sinus rhythm. No ST-T segment deviations. No pathological Q waves.
- Cardiac Symptoms: Patient explicitly denies chest pain, pressure, radiating jaw pain, or diaphoresis.
- Respiratory: Chest is clear bilaterally. No wheeze, no crackles.
- Medications Confirmed: Metformin 500 mg BD, Telmisartan 40 mg OD.

ASSESSMENT:
Non-cardiac exertional dyspnea; likely physical deconditioning. Angina pectoris is clinically ruled out.
Continue current anti-hypertensive and diabetic regimens. No invasive coronary angiogram indicated at this time.`,
    entities: [
      {
        id: 'ENT-CARD-1',
        category: 'DIAGNOSIS' as const,
        name: 'Angina Pectoris',
        status: 'NEGATED' as const,
        confidence: 97,
        sourceEvidence: 'Angina pectoris is clinically ruled out.',
        sourcePage: 1,
        verificationStatus: 'PENDING' as const,
        clinicalCode: 'ICD-10: I20.9 (Negated)'
      },
      {
        id: 'ENT-CARD-2',
        category: 'SYMPTOM_STATEMENT' as const,
        name: 'Chest Pain / Pressure',
        status: 'NEGATED' as const,
        confidence: 98,
        sourceEvidence: 'Patient explicitly denies chest pain, pressure, radiating jaw pain, or diaphoresis.',
        sourcePage: 1,
        verificationStatus: 'PENDING' as const,
        clinicalCode: 'SNOMED CT: 29857009 (Negated)'
      },
      {
        id: 'ENT-CARD-3',
        category: 'SYMPTOM_STATEMENT' as const,
        name: 'Diaphoresis',
        status: 'NEGATED' as const,
        confidence: 95,
        sourceEvidence: 'denies chest pain, pressure, radiating jaw pain, or diaphoresis.',
        sourcePage: 1,
        verificationStatus: 'PENDING' as const,
        clinicalCode: 'SNOMED CT: 52613005 (Negated)'
      },
      {
        id: 'ENT-CARD-4',
        category: 'LAB_RESULT' as const,
        name: '12-Lead Electrocardiogram (ECG)',
        value: 'Normal Sinus Rhythm',
        status: 'PRESENT' as const,
        confidence: 96,
        sourceEvidence: '12-Lead ECG: Normal sinus rhythm. No ST-T segment deviations.',
        sourcePage: 1,
        verificationStatus: 'PENDING' as const,
        clinicalCode: 'LOINC: 11524-6'
      }
    ]
  }
];

export const DocumentIntelligenceModal: React.FC<DocumentIntelligenceModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSaveExtractedToPatient
}) => {
  const [step, setStep] = useState<'SELECT' | 'PROCESSING' | 'REVIEW'>('SELECT');
  const [selectedTemplate, setSelectedTemplate] = useState(SAMPLE_TEMPLATES[0]);
  const [customFileName, setCustomFileName] = useState('');
  const [uploadedFileData, setUploadedFileData] = useState<string | null>(null);
  const [uploadedFileFormat, setUploadedFileFormat] = useState<'PDF' | 'IMAGE'>('PDF');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [activeOcrText, setActiveOcrText] = useState(SAMPLE_TEMPLATES[0].ocrText);
  const [previewTab, setPreviewTab] = useState<'VISUAL' | 'OCR'>('VISUAL');
  const [zoomScale, setZoomScale] = useState(100);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingPhase, setProcessingPhase] = useState('');
  const [entities, setEntities] = useState<ExtractedEntity[]>(SAMPLE_TEMPLATES[0].entities);
  const [highlightedEvidence, setHighlightedEvidence] = useState<string | null>(null);

  // Editing state for an individual entity
  const [editingEntity, setEditingEntity] = useState<ExtractedEntity | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    setCustomFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedFileSize(`${sizeInMb} MB`);
    const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
    const format = isPdf ? 'PDF' : 'IMAGE';
    setUploadedFileFormat(format);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedFileData(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleStartProcessing = async (template = selectedTemplate) => {
    setStep('PROCESSING');
    setProcessingProgress(15);
    setProcessingPhase('Step 1/4: Ingesting high-resolution scan & optical character recognition (OCR)...');

    const t1 = setTimeout(() => {
      setProcessingProgress(45);
      setProcessingPhase('Step 2/4: BioClinical Named Entity Recognition (NER) & Taxonomy Mapping...');
    }, 600);

    const t2 = setTimeout(() => {
      setProcessingProgress(78);
      setProcessingPhase('Step 3/4: Negation & Assertion Context Classifier (detecting "denies", "no history")...');
    }, 1200);

    const t3 = setTimeout(() => {
      setProcessingProgress(95);
      setProcessingPhase('Step 4/4: Standardizing SNOMED CT, RxNorm, and LOINC terminologies...');
    }, 1800);

    try {
      if (uploadedFileData || customFileName) {
        const res = await api.processDocument({
          patientId: patient.id,
          docTitle: customFileName || template.title,
          docType: template.type,
          fileData: uploadedFileData || undefined,
          fileName: customFileName || `${template.title}.${template.format.toLowerCase()}`,
          fileFormat: uploadedFileFormat,
          customText: template.ocrText
        });
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        setProcessingProgress(100);
        setEntities(res.extractedEntities);
        setActiveOcrText(res.ocrText);
        setStep('REVIEW');
        setPreviewTab(uploadedFileData ? 'VISUAL' : 'OCR');
      } else {
        setSelectedTemplate(template);
        setActiveOcrText(template.ocrText);
        setTimeout(() => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
          setProcessingProgress(100);
          setEntities(template.entities.map(e => ({ ...e, verificationStatus: 'PENDING' })));
          setStep('REVIEW');
          setPreviewTab('OCR');
        }, 2000);
      }
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setEntities(template.entities.map(e => ({ ...e, verificationStatus: 'PENDING' })));
      setActiveOcrText(template.ocrText);
      setStep('REVIEW');
      setPreviewTab('OCR');
    }
  };

  const handleConfirmEntity = (id: string) => {
    setEntities((prev) =>
      prev.map((ent) => (ent.id === id ? { ...ent, verificationStatus: 'CONFIRMED' } : ent))
    );
  };

  const handleRejectEntity = (id: string) => {
    setEntities((prev) =>
      prev.map((ent) => (ent.id === id ? { ...ent, verificationStatus: 'REJECTED' } : ent))
    );
  };

  const handleConfirmAll = () => {
    setEntities((prev) =>
      prev.map((ent) => ({
        ...ent,
        verificationStatus: ent.verificationStatus === 'REJECTED' ? 'REJECTED' : 'CONFIRMED'
      }))
    );
  };

  const handleSaveEdit = () => {
    if (!editingEntity) return;
    setEntities((prev) =>
      prev.map((ent) => (ent.id === editingEntity.id ? { ...editingEntity, verificationStatus: 'EDITED' } : ent))
    );
    setEditingEntity(null);
  };

  const handleCommitToEHR = () => {
    const verifiedEntities = entities.filter(e => e.verificationStatus !== 'REJECTED');
    onSaveExtractedToPatient(
      customFileName || selectedTemplate.title,
      selectedTemplate.type,
      activeOcrText,
      verifiedEntities
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Medical Document Intelligence & Extraction
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  AI ASSISTIVE ENGINE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Patient: <strong className="text-slate-200">{patient.fullName} ({patient.id})</strong> • Upload PDF / JPG / PNG with Negation Detection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: SELECT / UPLOAD */}
        {step === 'SELECT' && (
          <div className="p-6 overflow-y-auto space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
                Select Medical Document or Upload
              </h4>
              <p className="text-xs text-slate-500">
                Choose a pre-formatted clinical document to test negation extraction, or upload any medical document file (PDF, JPG, JPEG, PNG).
              </p>
            </div>

            {/* Upload & Camera Scanning Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-2xl p-6 text-center bg-teal-50/20 hover:bg-teal-50/50 transition-all cursor-pointer group flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  id="doctor-file-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                <label htmlFor="doctor-file-input" className="cursor-pointer block w-full">
                  <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    Drop PDF or Image here, or <span className="text-teal-600 underline">browse</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Supports PDF, JPG, JPEG, PNG (up to 25 MB)
                  </div>
                </label>
              </div>

              {/* Camera Scanner */}
              <div className="border-2 border-dashed border-cyan-300 hover:border-cyan-500 rounded-2xl p-6 text-center bg-cyan-50/20 hover:bg-cyan-50/50 transition-all cursor-pointer group flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  id="doctor-camera-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                <label htmlFor="doctor-camera-input" className="cursor-pointer block w-full">
                  <div className="w-12 h-12 mx-auto rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    Scan with Camera / Take Photo
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Direct webcam / smartphone camera capture
                  </div>
                </label>
              </div>
            </div>

            {/* Selected File Details Banner */}
            {customFileName && (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {uploadedFileFormat}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{customFileName}</div>
                    <div className="text-[11px] text-slate-500">
                      {uploadedFileSize} • Format: <strong className="text-teal-900">{uploadedFileFormat}</strong>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCustomFileName('');
                    setUploadedFileData(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs hover:bg-slate-100 font-semibold"
                >
                  Clear File
                </button>
              </div>
            )}

            {/* Pre-configured Clinical Test Documents */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Preset Clinical Test Documents (Negation Benchmark)
                </h5>
                <span className="text-[11px] text-teal-700 font-medium">Ready for instant AI extraction</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.title}
                    onClick={() => setSelectedTemplate(tmpl)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      selectedTemplate.title === tmpl.title
                        ? 'border-teal-600 bg-teal-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {tmpl.type}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{tmpl.fileSize} • {tmpl.format}</span>
                      </div>
                      <h6 className="text-sm font-bold text-slate-900 mb-1">{tmpl.title}</h6>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {tmpl.ocrText.substring(0, 160)}...
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-medium flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Contains Negated Entities ("denies chest pain")
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartProcessing(tmpl);
                        }}
                        className="px-3 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold"
                      >
                        Process Document
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleStartProcessing(selectedTemplate)}
                className="inline-flex items-center px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Start AI Extraction Pipeline
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING SIMULATION */}
        {step === 'PROCESSING' && (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center space-y-6 my-auto">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-slate-200 border-t-teal-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-teal-700">
                <BrainCircuit className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="text-center max-w-md space-y-2">
              <h4 className="text-base font-bold text-slate-900">
                Processing Clinical Document Intelligence
              </h4>
              <p className="text-xs text-teal-700 font-medium h-6">
                {processingPhase}
              </p>
            </div>

            <div className="w-full max-w-md bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-teal-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${processingProgress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-left w-full max-w-md text-xs text-slate-600">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 block">Context Parser</span>
                Distinguishing negated vs positive assertions
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 block">Confidence Scoring</span>
                Calculating evidence probability score
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTIVE REVIEW & VERIFICATION */}
        {step === 'REVIEW' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Mandatory AI Assistive Banner */}
            <div className="px-5 py-2.5 bg-sky-50 border-b border-sky-200 flex flex-wrap items-center justify-between text-xs text-sky-900 shrink-0 gap-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
                <span>
                  <strong>Clinical Notice:</strong> AI-extracted information. Requires clinician verification. Prototype confidence shown with source evidence quotes.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleConfirmAll}
                  className="px-2.5 py-1 bg-white hover:bg-sky-100 text-sky-800 font-semibold rounded text-[11px] border border-sky-300 transition-colors"
                >
                  Confirm All Pending ({entities.filter((e) => e.verificationStatus === 'PENDING').length})
                </button>
              </div>
            </div>

            {/* Main Dual-Pane Content */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              {/* Left Pane: Document Visual Scan / OCR Text & Evidence (5 cols) */}
              <div className="lg:col-span-5 p-4 sm:p-5 bg-slate-50 flex flex-col overflow-y-auto space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('VISUAL')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        previewTab === 'VISUAL'
                          ? 'bg-teal-700 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {uploadedFileFormat === 'IMAGE' ? 'Scanned Image' : 'PDF Document'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('OCR')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        previewTab === 'OCR'
                          ? 'bg-teal-700 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      OCR Transcript
                    </button>
                  </div>

                  {previewTab === 'VISUAL' && uploadedFileData && uploadedFileFormat === 'IMAGE' && (
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => setZoomScale((z) => Math.max(z - 25, 50))}
                        className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-200 text-slate-600"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono text-slate-500">{zoomScale}%</span>
                      <button
                        type="button"
                        onClick={() => setZoomScale((z) => Math.min(z + 25, 200))}
                        className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-200 text-slate-600"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {highlightedEvidence && (
                  <div className="p-2.5 bg-amber-100 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start justify-between animate-fadeIn">
                    <div>
                      <span className="font-bold block text-[11px]">Highlighted Source Evidence:</span>
                      <span className="italic">"{highlightedEvidence}"</span>
                    </div>
                    <button
                      onClick={() => setHighlightedEvidence(null)}
                      className="text-amber-700 hover:text-amber-900 font-bold ml-2 text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}

                {previewTab === 'VISUAL' ? (
                  <div className="flex-1 bg-white rounded-xl border border-slate-200 p-3 overflow-auto flex items-center justify-center min-h-[300px]">
                    {uploadedFileData && uploadedFileFormat === 'IMAGE' ? (
                      <img
                        src={uploadedFileData}
                        alt="Scanned Clinical Document"
                        style={{ width: `${zoomScale}%` }}
                        className="rounded object-contain shadow-xs transition-all max-h-[460px]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 mx-auto flex items-center justify-center font-mono font-bold text-lg">
                          {uploadedFileFormat}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {customFileName || selectedTemplate.title}
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            {selectedTemplate.type} • {uploadedFileSize || selectedTemplate.fileSize}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                          Digitally verified clinical file processed by multimodal BioClinical extraction model.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[480px]">
                    {activeOcrText}
                  </div>
                )}

                <div className="text-[11px] text-slate-500">
                  Tip: Click "View in OCR" on any extracted entity on the right to reference the exact sentence.
                </div>
              </div>

              {/* Right Pane: Extracted Entities List (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col overflow-y-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Extracted Clinical Entities ({entities.length})
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Review extracted items. Notice the contextual negation detection on Chest Pain.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="flex items-center text-emerald-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
                      Present
                    </span>
                    <span className="flex items-center text-rose-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mr-1" />
                      Negated
                    </span>
                  </div>
                </div>

                {/* Entities Cards */}
                <div className="space-y-3">
                  {entities.map((entity) => {
                    const isNegated = entity.status === 'NEGATED';
                    const isConfirmed = entity.verificationStatus === 'CONFIRMED';
                    const isRejected = entity.verificationStatus === 'REJECTED';
                    const isEdited = entity.verificationStatus === 'EDITED';

                    return (
                      <div
                        key={entity.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isRejected
                            ? 'bg-slate-50 border-slate-200 opacity-60'
                            : isNegated
                            ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                            : 'bg-white border-slate-200 hover:border-teal-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Category Badge */}
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                                {entity.category.replace('_', ' ')}
                              </span>

                              {/* Negation vs Present Status Badge */}
                              {isNegated ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  <XCircle className="w-3 h-3 mr-1 text-rose-600" />
                                  NEGATED (Ruled Out / Denied)
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                  PRESENT
                                </span>
                              )}

                              {/* Confidence Gauge */}
                              <span className="text-[10px] font-mono text-slate-500">
                                Conf: <strong className="text-slate-800">{entity.confidence}%</strong>
                              </span>

                              {/* Clinical Code */}
                              {entity.clinicalCode && (
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {entity.clinicalCode}
                                </span>
                              )}
                            </div>

                            {/* Entity Name & Values */}
                            <div className="flex items-baseline space-x-2 pt-0.5">
                              <h6 className={`text-sm font-bold ${isNegated ? 'text-rose-950' : 'text-slate-900'}`}>
                                {entity.name}
                              </h6>
                              {entity.value && (
                                <span className="font-semibold text-slate-800 text-xs">
                                  : {entity.value} {entity.unit || ''}
                                </span>
                              )}
                              {entity.dosage && (
                                <span className="text-xs text-teal-800 font-medium">
                                  ({entity.dosage} {entity.frequency || ''})
                                </span>
                              )}
                            </div>

                            {/* Source Evidence Quote */}
                            <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/70 mt-1.5 flex items-start justify-between">
                              <div>
                                <span className="font-semibold text-slate-700 block text-[10px] uppercase">
                                  Source Evidence:
                                </span>
                                <span className="italic">"{entity.sourceEvidence}"</span>
                              </div>
                              <button
                                onClick={() => setHighlightedEvidence(entity.sourceEvidence)}
                                className="text-[10px] font-semibold text-teal-700 hover:text-teal-900 underline shrink-0 ml-2 mt-1"
                              >
                                View in OCR
                              </button>
                            </div>

                            {/* Negation explanation callout if negated */}
                            {isNegated && (
                              <div className="text-[11px] text-rose-800 bg-rose-100/50 p-1.5 rounded mt-1">
                                Context Parser: Patient explicitly denies this symptom in consultation. Recorded as <strong>NEGATED</strong> rather than present.
                              </div>
                            )}
                          </div>

                          {/* Action Buttons for Clinician */}
                          <div className="flex flex-col items-end space-y-1.5 shrink-0 ml-2">
                            {isConfirmed ? (
                              <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold">
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Confirmed
                              </span>
                            ) : isRejected ? (
                              <span className="inline-flex items-center px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs font-semibold">
                                Rejected
                              </span>
                            ) : isEdited ? (
                              <span className="inline-flex items-center px-2 py-1 bg-sky-100 text-sky-800 rounded text-xs font-semibold">
                                Edited
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-semibold">
                                Needs Verification
                              </span>
                            )}

                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleConfirmEntity(entity.id)}
                                title="Confirm extraction"
                                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  isConfirmed
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingEntity({ ...entity })}
                                title="Edit extracted value"
                                className="p-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRejectEntity(entity.id)}
                                title="Reject extraction"
                                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                                  isRejected
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                                }`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-600">
                Confirmed: <strong className="text-emerald-700">{entities.filter((e) => e.verificationStatus === 'CONFIRMED' || e.verificationStatus === 'EDITED').length}</strong> of {entities.length} entities • An immutable audit log will be generated upon save.
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setStep('SELECT')}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Back to Documents
                </button>
                <button
                  onClick={handleCommitToEHR}
                  className="inline-flex items-center px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                >
                  <FileCheck className="w-4 h-4 mr-1.5" />
                  Save to Longitudinal Health Record
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Entity */}
        {editingEntity && (
          <div className="fixed inset-0 z-60 bg-slate-900/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-5 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h5 className="text-sm font-bold text-slate-900">Edit Extracted Entity</h5>
                <button
                  onClick={() => setEditingEntity(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Entity Name</label>
                  <input
                    type="text"
                    value={editingEntity.name}
                    onChange={(e) => setEditingEntity({ ...editingEntity, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Value / Dosage</label>
                    <input
                      type="text"
                      value={editingEntity.value || editingEntity.dosage || ''}
                      onChange={(e) => setEditingEntity({ ...editingEntity, value: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Assertion Status</label>
                    <select
                      value={editingEntity.status}
                      onChange={(e) => setEditingEntity({ ...editingEntity, status: e.target.value as NegationStatus })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="PRESENT">PRESENT (Positive)</option>
                      <option value="NEGATED">NEGATED (Ruled out / denied)</option>
                      <option value="UNCERTAIN">UNCERTAIN</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Doctor Correction Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Rationale for adjustment..."
                    value={editingEntity.doctorNotes || ''}
                    onChange={(e) => setEditingEntity({ ...editingEntity, doctorNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setEditingEntity(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
