import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Activity,
  Heart,
  Pill,
  AlertCircle,
  FileUp,
  BrainCircuit,
  Database,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Download,
  Info,
  TrendingDown,
  LineChart,
  Check,
  Edit3,
  Camera,
  Upload,
  Eye,
  Layers
} from 'lucide-react';
import {
  Patient,
  TimelineEvent,
  MedicalDocument,
  ExtractedEntity,
  User,
  AuditLog
} from '../../types/healthcare';
import { DocumentIntelligenceModal } from './DocumentIntelligenceModal';
import { ClinicalGraphsView } from './ClinicalGraphsView';
import { LongitudinalWaveTimeline } from './LongitudinalWaveTimeline';

interface PatientDetailViewProps {
  patient: Patient;
  currentUser: User;
  timelineEvents: TimelineEvent[];
  documents: MedicalDocument[];
  auditLogs: AuditLog[];
  initialTab?: 'TIMELINE' | 'GRAPHS' | 'DOCUMENTS' | 'CLINICAL' | 'AUDIT';
  onBack: () => void;
  onSaveNewDocument: (
    docTitle: string,
    docType: MedicalDocument['documentType'],
    ocrText: string,
    entities: ExtractedEntity[]
  ) => void;
  onRequestUnauthorizedTest?: () => void;
}

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({
  patient,
  currentUser,
  timelineEvents,
  documents,
  auditLogs,
  initialTab = 'CLINICAL',
  onBack,
  onSaveNewDocument,
  onRequestUnauthorizedTest
}) => {
  const [activeTab, setActiveTab] = useState<'TIMELINE' | 'GRAPHS' | 'DOCUMENTS' | 'CLINICAL' | 'AUDIT'>(initialTab);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Interactive entity verification state (Confirm, Edit, Reject)
  const [entityOverrides, setEntityOverrides] = useState<
    Record<string, { status?: 'CONFIRMED' | 'REJECTED' | 'EDITED'; name?: string; value?: string; dosage?: string }>
  >({});
  const [editingEntity, setEditingEntity] = useState<ExtractedEntity | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; value: string; dosage: string }>({
    name: '',
    value: '',
    dosage: ''
  });

  // React to initialTab changes from parent
  React.useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const handleConfirmEntity = (id: string) => {
    setEntityOverrides((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: 'CONFIRMED' }
    }));
  };

  const handleRejectEntity = (id: string) => {
    setEntityOverrides((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: 'REJECTED' }
    }));
  };

  const handleOpenEdit = (ent: ExtractedEntity) => {
    const override = entityOverrides[ent.id] || {};
    setEditingEntity(ent);
    setEditForm({
      name: override.name || ent.name,
      value: override.value !== undefined ? override.value : (ent.value || ''),
      dosage: override.dosage !== undefined ? override.dosage : (ent.dosage || '')
    });
  };

  const handleSaveEdit = () => {
    if (!editingEntity) return;
    setEntityOverrides((prev) => ({
      ...prev,
      [editingEntity.id]: {
        ...prev[editingEntity.id],
        status: 'EDITED',
        name: editForm.name,
        value: editForm.value,
        dosage: editForm.dosage
      }
    }));
    setEditingEntity(null);
  };

  // Filter timeline events for this patient
  const patientEvents = timelineEvents
    .filter((e) => e.patientId === patient.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const patientDocs = documents.filter((d) => d.patientId === patient.id);
  const patientAudits = auditLogs.filter((a) => a.targetPatientId === patient.id);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          Back to Patient Search & Directory
        </button>

        <div className="flex items-center space-x-2">
          {onRequestUnauthorizedTest && (
            <button
              onClick={onRequestUnauthorizedTest}
              className="inline-flex items-center text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors"
              title="Test RBAC security enforcement"
            >
              Simulate Unauthorized Patient Jump
            </button>
          )}

          <button
            onClick={() => setIsDocModalOpen(true)}
            className="inline-flex items-center text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
          >
            <FileUp className="w-3.5 h-3.5 mr-1.5" />
            Upload & Process Medical Document
          </button>
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 bg-linear-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-600/30 border border-teal-400/40 text-teal-300 flex items-center justify-center font-bold text-xl shrink-0">
                {patient.fullName.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {patient.fullName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-teal-900 text-teal-200 border border-teal-700">
                    {patient.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-200">
                    {patient.gender}, {patient.age} yrs
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-200 font-mono">
                    Blood: {patient.bloodGroup}
                  </span>
                </div>
                <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>DOB: <strong>{patient.dateOfBirth}</strong></span>
                  <span>Phone: <strong>{patient.phone}</strong></span>
                  <span>Primary: <strong>{patient.primaryDoctorName}</strong></span>
                  <span>Facility: <strong>{patient.hospitalName}</strong></span>
                </div>
              </div>
            </div>

            {/* Consent Status Indicator */}
            <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold tracking-wider">
                  Consent Verification
                </span>
                <span className="text-emerald-300 font-bold">
                  Active • Clinician Access Granted
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Recorded Vitals Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-200 bg-slate-50 text-xs border-t border-slate-200">
          <div className="p-3">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Blood Pressure</span>
            <span className="text-sm font-bold text-slate-800">{patient.latestVitals.bloodPressure}</span>
          </div>
          <div className="p-3">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Heart Rate</span>
            <span className="text-sm font-bold text-slate-800">{patient.latestVitals.heartRate} bpm</span>
          </div>
          <div className="p-3 bg-teal-50/50">
            <span className="text-teal-700 block text-[10px] uppercase font-semibold">Glycated HbA1c</span>
            <span className="text-sm font-bold text-teal-900">{patient.latestVitals.hba1c}%</span>
          </div>
          <div className="p-3">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Fasting Sugar</span>
            <span className="text-sm font-bold text-slate-800">{patient.latestVitals.glucoseFasting || 118} mg/dL</span>
          </div>
          <div className="p-3">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Body Mass Index</span>
            <span className="text-sm font-bold text-slate-800">{patient.latestVitals.bmi}</span>
          </div>
          <div className="p-3">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Oxygen (SpO2)</span>
            <span className="text-sm font-bold text-slate-800">{patient.latestVitals.spO2}%</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-t border-slate-200 flex space-x-1 sm:space-x-4 overflow-x-auto text-xs font-semibold">
          {[
            { key: 'TIMELINE', label: 'Longitudinal Timeline', count: patientEvents.length },
            { key: 'GRAPHS', label: 'Clinical Graphs & Trends', count: undefined },
            { key: 'DOCUMENTS', label: 'Medical Documents & AI Extraction', count: patientDocs.length },
            { key: 'CLINICAL', label: 'Conditions & Prescriptions', count: patient.activeConditions.length },
            { key: 'AUDIT', label: 'Patient Access & Audit Trail', count: patientAudits.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3.5 px-2 border-b-2 transition-all shrink-0 flex items-center space-x-1.5 ${
                activeTab === tab.key
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.key ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: CLINICAL GRAPHS & BIOMARKERS */}
      {activeTab === 'GRAPHS' && (
        <ClinicalGraphsView patient={patient} />
      )}

      {/* TAB 1: PREVIOUS LONGITUDINAL HEALTH HISTORY (INTERACTIVE ANIMATED WAVE-STYLE TIMELINE) */}
      {activeTab === 'TIMELINE' && (
        <LongitudinalWaveTimeline
          patient={patient}
          timelineEvents={timelineEvents}
          documents={documents}
          onOpenDocumentReview={() => {
            setActiveTab('DOCUMENTS');
          }}
        />
      )}

      {/* TAB 2: MEDICAL DOCUMENTS & AI EXTRACTION */}
      {activeTab === 'DOCUMENTS' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center">
                <BrainCircuit className="w-4 h-4 mr-2 text-teal-600" />
                Medical Document Intelligence & Multimodal OCR
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload or scan PDF and image files (Discharge summaries, prescriptions, lab reports). View AI extractions with confidence scores, verbatim source evidence, and confirm, edit, or reject clinical entities.
              </p>
            </div>
            <button
              onClick={() => setIsDocModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 space-x-2"
            >
              <Camera className="w-4 h-4" />
              <span>Scan & Upload (PDF/Image)</span>
            </button>
          </div>

          {/* List of Documents */}
          <div className="space-y-4">
            {patientDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 font-mono">
                        {doc.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-teal-800">
                        {doc.documentType}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                        AI Extraction Active
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{doc.title}</h4>
                    <p className="text-xs text-slate-500">
                      Uploaded by {doc.uploadedByName} on {doc.uploadedAt} • Format: <strong className="uppercase font-mono text-slate-700">{doc.fileFormat}</strong> ({doc.fileSize})
                    </p>
                  </div>

                  <button
                    onClick={() => setIsDocModalOpen(true)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg transition-colors self-start sm:self-center shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                    Open Dual-Pane OCR & Scanner
                  </button>
                </div>

                {/* Highlight of Extracted Entities in this document */}
                <div className="p-4 sm:p-5 bg-slate-50/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                      AI Extracted Entities & Clinical Verification ({doc.extractedEntities.length})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      View confidence, source grounding evidence, and confirm / edit / reject below:
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {doc.extractedEntities.map((ent) => {
                      const override = entityOverrides[ent.id] || {};
                      const currentStatus = override.status || ent.verificationStatus || 'PENDING';
                      const currentName = override.name || ent.name;
                      const currentValue = override.value !== undefined ? override.value : ent.value;
                      const currentDosage = override.dosage !== undefined ? override.dosage : ent.dosage;
                      const isNeg = ent.status === 'NEGATED';

                      return (
                        <div
                          key={ent.id}
                          className={`p-3.5 rounded-xl border text-xs space-y-2.5 transition-all ${
                            currentStatus === 'REJECTED'
                              ? 'bg-slate-100/70 border-slate-200 opacity-60'
                              : currentStatus === 'CONFIRMED'
                              ? 'bg-emerald-50/30 border-emerald-300 shadow-2xs'
                              : currentStatus === 'EDITED'
                              ? 'bg-blue-50/30 border-blue-300'
                              : isNeg
                              ? 'bg-rose-50/40 border-rose-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          {/* Top Row: Category, Name, Negation */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center space-x-1.5 mb-1">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 uppercase">
                                  {ent.category}
                                </span>
                                {isNeg ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                    NEGATED
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                    PRESENT
                                  </span>
                                )}
                              </div>
                              <h5 className="font-bold text-sm text-slate-900">{currentName}</h5>
                            </div>

                            {/* Verification State Badge */}
                            <div>
                              {currentStatus === 'CONFIRMED' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center">
                                  <Check className="w-3 h-3 mr-1" />
                                  CONFIRMED
                                </span>
                              )}
                              {currentStatus === 'EDITED' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center">
                                  <Edit3 className="w-3 h-3 mr-1" />
                                  EDITED
                                </span>
                              )}
                              {currentStatus === 'REJECTED' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  REJECTED
                                </span>
                              )}
                              {currentStatus === 'PENDING' && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  PENDING
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Value / Dosage details */}
                          {(currentValue || currentDosage || ent.clinicalCode) && (
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-150 space-y-1 text-[11px]">
                              {currentValue && (
                                <div className="text-slate-800 font-semibold">
                                  Value: <span className="font-mono text-teal-800">{currentValue} {ent.unit || ''}</span>
                                </div>
                              )}
                              {currentDosage && (
                                <div className="text-teal-900 font-medium">
                                  Dosage: <span className="font-mono">{currentDosage}</span> {ent.frequency ? `(${ent.frequency})` : ''}
                                </div>
                              )}
                              {ent.clinicalCode && (
                                <div className="text-[10px] text-slate-500 font-mono">
                                  Code: {ent.clinicalCode}
                                </div>
                              )}
                            </div>
                          )}

                          {/* AI Confidence Meter */}
                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="text-slate-500 font-medium">AI Confidence:</span>
                            <div className="flex items-center space-x-1.5">
                              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    ent.confidence >= 90 ? 'bg-emerald-500' : ent.confidence >= 75 ? 'bg-teal-500' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${ent.confidence}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-slate-700 text-[10px]">{ent.confidence}%</span>
                            </div>
                          </div>

                          {/* Grounded Verbatim Source Evidence */}
                          <div className="p-2 bg-amber-50/60 border border-amber-200/80 rounded-lg text-[11px] text-amber-950">
                            <span className="font-bold block text-[9px] uppercase tracking-wider text-amber-800">
                              Source Evidence:
                            </span>
                            <span className="italic">"{ent.sourceEvidence}"</span>
                          </div>

                          {/* Clinician Action Buttons: Confirm, Edit, Reject */}
                          <div className="pt-2 border-t border-slate-150 flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleConfirmEntity(ent.id)}
                              className={`px-2 py-1 rounded text-[11px] font-bold flex items-center space-x-1 transition-colors ${
                                currentStatus === 'CONFIRMED'
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                              <span>Confirm</span>
                            </button>

                            <button
                              onClick={() => handleOpenEdit(ent)}
                              className="px-2 py-1 rounded text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 flex items-center space-x-1 transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleRejectEntity(ent.id)}
                              className={`px-2 py-1 rounded text-[11px] font-bold flex items-center space-x-1 transition-colors ${
                                currentStatus === 'REJECTED'
                                  ? 'bg-rose-700 text-white'
                                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Entity Modal */}
      {editingEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-slate-150">
              <h4 className="text-sm font-bold text-slate-900 flex items-center">
                <Edit3 className="w-4 h-4 mr-2 text-teal-600" />
                Edit Extracted Clinical Entity
              </h4>
              <button
                onClick={() => setEditingEntity(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Entity Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Value / Unit (if applicable)
                </label>
                <input
                  type="text"
                  value={editForm.value}
                  onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                  placeholder="e.g., 7.4 % or 138/86 mmHg"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Dosage / Regimen
                </label>
                <input
                  type="text"
                  value={editForm.dosage}
                  onChange={(e) => setEditForm({ ...editForm, dosage: e.target.value })}
                  placeholder="e.g., 500mg Once daily"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-teal-600"
                />
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <span className="font-bold block text-[10px] uppercase">Grounded Source Evidence:</span>
                "{editingEntity.sourceEvidence}"
              </div>
            </div>

            <div className="pt-3 border-t border-slate-150 flex items-center justify-end space-x-2">
              <button
                onClick={() => setEditingEntity(null)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold"
              >
                Save & Confirm Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLINICAL CONDITIONS & PRESCRIPTIONS */}
      {activeTab === 'CLINICAL' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Diagnoses */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <Activity className="w-4 h-4 mr-2 text-teal-600" />
              Active Clinical Diagnoses
            </h4>
            <div className="space-y-2">
              {patient.activeConditions.map((cond, idx) => (
                <div key={cond} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{cond}</span>
                    <span className="text-[10px] text-slate-500 font-mono">ICD-10 Categorized • Managed</span>
                  </div>
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-800 font-semibold rounded text-[10px]">
                    Active
                  </span>
                </div>
              ))}
            </div>

            {/* Allergies Callout */}
            <div className="pt-3 border-t border-slate-100">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center text-rose-800">
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
                Documented Allergies
              </h5>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy) => (
                  <span key={allergy} className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Current Medications */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <Pill className="w-4 h-4 mr-2 text-emerald-600" />
              Active Prescriptions & Regimens
            </h4>
            <div className="space-y-2">
              {patient.currentMedications.map((med) => (
                <div key={med} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{med}</span>
                    <span className="text-[10px] text-slate-500 font-mono">RxNorm Referenced • Verified</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[10px]">
                    Ongoing
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS FOR THIS PATIENT */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Access & Verification Audit Trail for {patient.fullName} ({patient.id})
            </h4>
            <span className="text-[11px] text-slate-500 font-mono">Immutable Compliance Log</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {patientAudits.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] text-slate-500">{log.timestamp}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                      {log.action}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {log.status}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{log.details}</p>
                  <div className="text-[11px] text-slate-500">
                    Actor: <strong className="text-slate-800">{log.actorName}</strong> ({log.actorRole}) • IP: <span className="font-mono">{log.ipAddress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <DocumentIntelligenceModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        patient={patient}
        onSaveExtractedToPatient={onSaveNewDocument}
      />
    </div>
  );
};
