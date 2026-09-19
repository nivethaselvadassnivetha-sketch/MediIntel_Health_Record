import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  Camera,
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  BrainCircuit,
  Eye,
  FileUp,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  AlertCircle
} from 'lucide-react';
import { ExtractedEntity, MedicalDocument, TimelineEvent } from '../../types/healthcare';
import { api } from '../../services/api';

interface PatientDocumentScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onSaveSuccess: (document: MedicalDocument, timelineEvent: TimelineEvent) => void;
}

export const PatientDocumentScannerModal: React.FC<PatientDocumentScannerModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName,
  onSaveSuccess
}) => {
  const [step, setStep] = useState<'SELECT' | 'PROCESSING' | 'REVIEW'>('SELECT');
  const [docTitle, setDocTitle] = useState('Laboratory & Metabolic Panel');
  const [docType, setDocType] = useState('Lab Report');
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileFormat, setFileFormat] = useState<'PDF' | 'IMAGE'>('PDF');
  const [fileSize, setFileSize] = useState<string>('1.2 MB');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [ocrText, setOcrText] = useState('');
  const [entities, setEntities] = useState<ExtractedEntity[]>([]);
  const [previewTab, setPreviewTab] = useState<'SCAN' | 'OCR'>('SCAN');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    setDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setFileSize(`${sizeInMb} MB`);

    const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
    const format = isPdf ? 'PDF' : 'IMAGE';
    setFileFormat(format);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFileData(result);
    };
    reader.readAsDataURL(file);
    setErrorMessage('');
  };

  const handleStartScan = async () => {
    setStep('PROCESSING');
    setProcessingProgress(15);
    setProcessingStatus('Step 1/3: Ingesting high-resolution scan & optical character recognition (OCR)...');

    const progressTimer1 = setTimeout(() => {
      setProcessingProgress(50);
      setProcessingStatus('Step 2/3: Clinical AI extracting diagnoses, prescriptions, and lab biomarkers...');
    }, 600);

    const progressTimer2 = setTimeout(() => {
      setProcessingProgress(85);
      setProcessingStatus('Step 3/3: Evaluating clinical negation assertions and confidence scores...');
    }, 1200);

    try {
      const response = await api.processDocument({
        patientId,
        docTitle,
        docType,
        fileName: fileName || `${docTitle}.${fileFormat.toLowerCase()}`,
        fileFormat,
        fileData: fileData || undefined,
        customText: ocrText || undefined
      });

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      setProcessingProgress(100);
      setProcessingStatus('AI Extraction complete. Preparing interactive patient review...');

      setTimeout(() => {
        setOcrText(response.ocrText);
        setEntities(response.extractedEntities.map(e => ({ ...e, verificationStatus: 'CONFIRMED' })));
        setStep('REVIEW');
      }, 500);
    } catch (err: any) {
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      setErrorMessage(err.message || 'AI document scanning failed. Please retry.');
      setStep('SELECT');
    }
  };

  const handleConfirmAndSave = async () => {
    setIsSaving(true);
    try {
      const result = await api.confirmExtraction({
        patientId,
        docTitle,
        docType,
        ocrText,
        verifiedEntities: entities,
        fileFormat
      });

      onSaveSuccess(result.document, result.timelineEvent);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save record into EHR.');
      setIsSaving(false);
    }
  };

  const handlePresetSelect = (preset: { title: string; type: string; format: 'PDF' | 'IMAGE'; sampleOcr: string }) => {
    setDocTitle(preset.title);
    setDocType(preset.type);
    setFileFormat(preset.format);
    setFileName(`${preset.title.toLowerCase().replace(/\s+/g, '_')}.${preset.format.toLowerCase()}`);
    setOcrText(preset.sampleOcr);
    setFileData(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-800 text-teal-200 rounded-xl border border-teal-700">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  Scan & Upload Medical Record
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-800 text-teal-200 border border-teal-700">
                  PDF & IMAGE SCANNER
                </span>
              </div>
              <p className="text-xs text-teal-200">
                Patient: <strong>{patientName} ({patientId})</strong> • Instant AI Extraction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-300 hover:text-white rounded-lg hover:bg-teal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: SELECT / SCAN */}
        {step === 'SELECT' && (
          <div className="p-6 overflow-y-auto space-y-5 text-xs">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
                Step 1: Choose File or Scan with Camera
              </h4>
              <p className="text-slate-500">
                Upload your medical bills, discharge summaries, laboratory reports, or prescriptions in PDF or Image format.
              </p>
            </div>

            {/* Upload & Camera Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-teal-300 hover:border-teal-500 rounded-2xl p-6 text-center bg-teal-50/30 hover:bg-teal-50/60 transition-all cursor-pointer group flex flex-col items-center justify-center">
                <input
                  type="file"
                  id="patient-file-input"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                />
                <label htmlFor="patient-file-input" className="cursor-pointer block w-full">
                  <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-800 text-sm">
                    Browse File or Drag & Drop
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1">
                    Supports PDF, JPG, JPEG, PNG (up to 25 MB)
                  </div>
                </label>
              </div>

              {/* Camera Scanner */}
              <div className="border-2 border-dashed border-cyan-300 hover:border-cyan-500 rounded-2xl p-6 text-center bg-cyan-50/30 hover:bg-cyan-50/60 transition-all cursor-pointer group flex flex-col items-center justify-center">
                <input
                  type="file"
                  id="patient-camera-input"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                />
                <label htmlFor="patient-camera-input" className="cursor-pointer block w-full">
                  <div className="w-12 h-12 mx-auto rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-800 text-sm">
                    Scan with Camera / Take Photo
                  </div>
                  <div className="text-slate-500 text-[11px] mt-1">
                    Direct webcam / smartphone camera capture
                  </div>
                </label>
              </div>
            </div>

            {/* Selected File Details & Preview Banner */}
            {fileName && (
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {fileFormat}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{fileName}</div>
                    <div className="text-[11px] text-slate-500">
                      {fileSize} • Format: <strong className="text-teal-900">{fileFormat}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setFileName('');
                      setFileData(null);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs hover:bg-slate-100 font-semibold"
                  >
                    Change File
                  </button>
                </div>
              </div>
            )}

            {/* Metadata inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  placeholder="e.g. Apollo Hospital Discharge Summary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-600"
                >
                  <option value="Discharge Summary">Discharge Summary</option>
                  <option value="Lab Report">Lab Report</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Consultation Note">Consultation Note</option>
                  <option value="Imaging Report">Imaging / Radiology Report</option>
                </select>
              </div>
            </div>

            {/* Clinical Test Presets (Ready for Instant AI Extraction) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block">
                Or choose sample clinical report to test AI extraction:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handlePresetSelect({
                      title: 'Apollo Diagnostic Lab Report (March 2026)',
                      type: 'Lab Report',
                      format: 'PDF',
                      sampleOcr: `APOLLO CLINICAL BIOCHEMISTRY LABORATORY
PATIENT: ${patientName} | ID: ${patientId} | DATE: March 14, 2026
INVESTIGATION: Comprehensive Metabolic Panel
- HbA1c: 6.8% (Good Control)
- Fasting Glucose: 124 mg/dL
- Total Cholesterol: 184 mg/dL
- Creatinine: 0.92 mg/dL
IMPRESSION: Stable metabolic control. Patient denies hypoglycemic symptoms.`
                    })
                  }
                  className="p-3 text-left rounded-xl border border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/30 transition-all"
                >
                  <span className="font-bold text-slate-900 block text-xs">Apollo Diagnostic Lab Report</span>
                  <span className="text-[11px] text-slate-500">HbA1c & Metabolic Panel • PDF format</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePresetSelect({
                      title: 'Cardiology Consultation Scan & Rx',
                      type: 'Prescription',
                      format: 'IMAGE',
                      sampleOcr: `CARDIOLOGY CLINICAL CONSULTATION
PATIENT: ${patientName} (PAT-1001) | EVALUATION DATE: March 10, 2026
CHIEF COMPLAINT: Routine cardiovascular review.
FINDINGS: The patient explicitly denies chest pain, angina, or nocturnal dyspnea.
RX:
1. Telmisartan 40 mg - 1 tab daily morning.
2. Metformin 500 mg - 1 tab twice daily after food.
BP: 126/82 mmHg | Pulse: 72 bpm.`
                    })
                  }
                  className="p-3 text-left rounded-xl border border-slate-200 hover:border-teal-400 bg-white hover:bg-teal-50/30 transition-all"
                >
                  <span className="font-bold text-slate-900 block text-xs">Cardiology Consultation Scan</span>
                  <span className="text-[11px] text-slate-500">Includes Negated Chest Pain • Image format</span>
                </button>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleStartScan}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Clinical AI Extraction Pipeline</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING */}
        {step === 'PROCESSING' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 flex-1">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-teal-200 border-t-teal-700 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="w-7 h-7 text-teal-700" />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <h4 className="text-base font-bold text-slate-900">
                Processing {fileFormat} Medical Document
              </h4>
              <p className="text-xs text-slate-500">{processingStatus}</p>
            </div>

            <div className="w-full max-w-md bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
              <div
                className="bg-teal-600 h-full transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & CONFIRM */}
        {step === 'REVIEW' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Notice Bar */}
            <div className="px-5 py-2.5 bg-teal-50 border-b border-teal-200 flex flex-wrap items-center justify-between text-xs text-teal-900 shrink-0 gap-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  <strong>AI Document Extraction Complete:</strong> Review detected diagnoses, medications, and laboratory values below.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-white text-teal-800 font-bold border border-teal-300 text-[11px]">
                {entities.length} Clinical Entities Detected
              </span>
            </div>

            {/* Split Screen: Document Preview / OCR vs Extracted Findings */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              {/* Left Column: Visual Scan Preview or OCR text */}
              <div className="lg:col-span-5 p-4 bg-slate-50 flex flex-col overflow-y-auto space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPreviewTab('SCAN')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        previewTab === 'SCAN'
                          ? 'bg-teal-700 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {fileFormat === 'IMAGE' ? 'Scanned Image' : 'PDF Document'}
                    </button>
                    <button
                      onClick={() => setPreviewTab('OCR')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        previewTab === 'OCR'
                          ? 'bg-teal-700 text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      OCR Transcript
                    </button>
                  </div>

                  {previewTab === 'SCAN' && fileData && fileFormat === 'IMAGE' && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setZoomLevel((z) => Math.max(z - 25, 50))}
                        className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-200 text-slate-600"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setZoomLevel((z) => Math.min(z + 25, 200))}
                        className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-200 text-slate-600"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {previewTab === 'SCAN' ? (
                  <div className="flex-1 bg-white rounded-xl border border-slate-200 p-3 overflow-auto flex items-center justify-center min-h-[260px]">
                    {fileData && fileFormat === 'IMAGE' ? (
                      <img
                        src={fileData}
                        alt="Scanned Clinical Document"
                        style={{ width: `${zoomLevel}%` }}
                        className="rounded object-contain shadow-xs transition-all max-h-[420px]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 mx-auto flex items-center justify-center font-mono font-bold text-lg">
                          {fileFormat}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{docTitle}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">
                            {fileName || `${docTitle}.${fileFormat.toLowerCase()}`}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                          Digital medical document indexed and verified by BioClinical extraction model.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[420px]">
                    {ocrText}
                  </div>
                )}
              </div>

              {/* Right Column: AI Extracted Findings */}
              <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col overflow-y-auto space-y-3">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  AI Extracted Findings ({entities.length})
                </h5>

                <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
                  {entities.map((ent) => {
                    const isNegated = ent.status === 'NEGATED';
                    return (
                      <div
                        key={ent.id}
                        className={`p-3 rounded-xl border transition-all text-xs ${
                          isNegated
                            ? 'bg-rose-50/40 border-rose-200'
                            : 'bg-white border-slate-200 hover:border-teal-300 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                              {ent.category.replace('_', ' ')}
                            </span>
                            {isNegated ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center">
                                <XCircle className="w-3 h-3 mr-1 text-rose-600" />
                                Ruled Out / Denied
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center">
                                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                                Active Finding
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">
                            Confidence: <strong className="text-slate-800">{ent.confidence}%</strong>
                          </span>
                        </div>

                        <div className="mt-1.5 font-bold text-slate-900 text-sm flex items-center space-x-2">
                          <span>{ent.name}</span>
                          {ent.dosage && (
                            <span className="text-xs text-teal-800 font-semibold">({ent.dosage})</span>
                          )}
                          {ent.value && (
                            <span className="text-xs text-slate-700 font-semibold">: {ent.value}</span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-1.5 rounded border border-slate-100">
                          "{ent.sourceEvidence}"
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Save Action */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Will be added to your medical records & timeline
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setStep('SELECT')}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleConfirmAndSave}
                      className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center space-x-2 shadow-xs transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isSaving ? 'Saving Record...' : 'Confirm & Save to My Health Record'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
