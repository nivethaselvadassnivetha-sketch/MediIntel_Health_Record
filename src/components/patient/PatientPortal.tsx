import React, { useState, useEffect } from 'react';
import {
  User,
  Patient,
  TimelineEvent,
  MedicalDocument,
  ConsentRecord,
  AuditLog
} from '../../types/healthcare';
import { QRCodeView } from '../common/QRCodeView';
import { PatientGraphicalHistory } from './PatientGraphicalHistory';
import { api, PatientGraphData } from '../../services/api';
import {
  QrCode,
  Shield,
  ShieldCheck,
  Calendar,
  Clock,
  Pill,
  Activity,
  FileText,
  AlertTriangle,
  Lock,
  Eye,
  CheckCircle2,
  XCircle,
  Database,
  TrendingDown,
  ChevronRight,
  User as UserIcon,
  FlaskConical,
  HeartPulse,
  Heart,
  Hospital,
  AlertOctagon,
  Camera,
  Sparkles,
  Upload
} from 'lucide-react';
import { PatientDocumentScannerModal } from './PatientDocumentScannerModal';

interface PatientPortalProps {
  currentUser: User;
  onAttemptUnauthorizedAccess: (targetId: string) => void;
  onLogout: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  currentUser,
  onAttemptUnauthorizedAccess,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<
    'PROFILE' | 'HISTORY' | 'DIAGNOSES' | 'MEDICATIONS' | 'LABS' | 'DOCUMENTS' | 'TIMELINE' | 'AUDIT'
  >('PROFILE');

  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [graphData, setGraphData] = useState<PatientGraphData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleDocumentSaved = (newDoc: MedicalDocument, newEvent: TimelineEvent) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setTimelineEvents((prev) => [newEvent, ...prev]);
    setActiveTab('DOCUMENTS');
  };

  // Load patient's OWN record from backend
  const loadMyData = async () => {
    setIsLoading(true);
    try {
      const res = await api.getPatientMe();
      setPatientData(res.patient);
      setTimelineEvents(res.timelineEvents || []);
      setDocuments(res.documents || []);
      setConsents(res.consents || []);
      setAuditLogs(res.auditLogs || []);
      setGraphData(res.graphData || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMyData();
  }, []);

  const handleToggleConsent = async (consentId: string) => {
    try {
      await api.toggleConsent(consentId);
      loadMyData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !patientData) {
    return (
      <div className="p-12 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Securing patient connection & loading personal health record...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner with Patient Avatar & MHealth Caring Theme */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
              alt={patientData.fullName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {patientData.fullName}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                {patientData.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {patientData.age} yrs • {patientData.gender} • Blood {patientData.bloodGroup} • {patientData.hospitalName}
            </p>
          </div>
        </div>

        {/* Security & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scan Document (PDF/Image) Button */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition-colors shadow-2xs"
          >
            <Camera className="w-3.5 h-3.5 mr-1.5" />
            <span>Scan Medical Document (PDF/Image)</span>
          </button>

          {/* Strict Security Test Button */}
          <button
            onClick={() => onAttemptUnauthorizedAccess('PAT-1002')}
            className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-2xs"
            title="Demonstrate RBAC security boundary when a patient attempts to access another record"
          >
            <Lock className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
            <span>Test Unauthorized Access (PAT-1002)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
            <span>Print / Export Summary</span>
          </button>
        </div>
      </div>

      {/* Modern Pill Navigation Bar (Matching uploaded mHealth App design) */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { key: 'PROFILE', label: 'Own Profile & QR', icon: UserIcon },
          { key: 'HISTORY', label: 'Medical History', icon: Hospital },
          { key: 'DIAGNOSES', label: 'Diagnoses', count: patientData.activeConditions.length, icon: Activity },
          { key: 'MEDICATIONS', label: 'Medications', count: patientData.currentMedications.length, icon: Pill },
          { key: 'LABS', label: 'Laboratory Results', icon: FlaskConical },
          { key: 'DOCUMENTS', label: 'Documents', count: documents.length, icon: FileText },
          { key: 'TIMELINE', label: 'Longitudinal Timeline', count: timelineEvents.length, icon: Calendar },
          { key: 'AUDIT', label: 'Access & Audit Log', count: auditLogs.length, icon: Eye }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3.5 py-2.5 rounded-xl transition-all shrink-0 flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-teal-900 text-teal-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. VIEW OWN PROFILE & QR IDENTITY */}
      {activeTab === 'PROFILE' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
                  Official Patient Record
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Patient Demographics & Identification
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-bold flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                VERIFIED ID
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Unique Patient ID</span>
                <span className="font-mono text-base font-bold text-teal-800">{patientData.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Full Legal Name</span>
                <span className="text-sm font-bold text-slate-900">{patientData.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Date of Birth & Age</span>
                <span className="text-slate-800 font-medium">{patientData.dateOfBirth} ({patientData.age} yrs)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Blood Group</span>
                <span className="font-mono font-bold text-slate-800">{patientData.bloodGroup}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Phone</span>
                <span className="text-slate-800">{patientData.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email</span>
                <span className="text-slate-800">{patientData.email}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Residential Address</span>
                <span className="text-slate-800">{patientData.address}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Primary Facility</span>
                <span className="text-slate-800">{patientData.hospitalName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Primary Clinician</span>
                <span className="text-slate-800 font-medium">{patientData.primaryDoctorName}</span>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Emergency Contact</span>
                <span className="text-slate-800 font-medium">
                  {patientData.emergencyContact.name} ({patientData.emergencyContact.relationship}) • {patientData.emergencyContact.phone}
                </span>
              </div>
            </div>

            {/* Vitals Snapshot */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase block">
                Latest Recorded Baseline Vitals
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Blood Pressure</span>
                  <strong className="text-slate-900">{patientData.latestVitals.bloodPressure}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Heart Rate</span>
                  <strong className="text-slate-900">{patientData.latestVitals.heartRate} bpm</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">HbA1c</span>
                  <strong className="text-teal-700">{patientData.latestVitals.hba1c}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">SpO2</span>
                  <strong className="text-slate-900">{patientData.latestVitals.spO2}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Secure QR Identity Code Box */}
          <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-between text-center space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Secure QR Identity Token
              </h4>
              <p className="text-xs text-slate-500">
                Present at hospital admissions, emergency rooms, or authorized diagnostic clinics.
              </p>
            </div>

            <QRCodeView
              value={patientData.qrIdentityToken}
              size={180}
              label={`PATIENT: ${patientData.id}`}
              sublabel="Cryptographic Identity Reference Token"
            />

            <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 text-xs text-teal-900 text-left">
              <strong className="block text-teal-950 font-bold mb-0.5">Privacy Notice</strong>
              This QR code acts as a secure identity reference token. It does not directly leak raw clinical text or medical records without authorized clinician key verification.
            </div>
          </div>

          {/* Primary Care Team & Facility Bento Banner with Doctor Image */}
          <div className="md:col-span-12 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"
                alt="Primary Doctor"
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-xs shrink-0"
              />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide">Attending Clinician</span>
                <h4 className="text-base font-bold text-slate-900">{patientData.primaryDoctorName}</h4>
                <p className="text-xs text-slate-500">MD, Internal Medicine & Endocrinology • Apex Health</p>
                <div className="flex items-center space-x-2 text-[11px] text-emerald-700 pt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Licensed Clinical Supervisor • Next Review: 18 Apr 2026</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Registered Facility</span>
                <strong className="text-slate-900 block">{patientData.hospitalName}</strong>
                <p className="text-slate-500 text-[11px]">Department of Metabolic & Endocrine Disorders</p>
              </div>
              <span className="px-3 py-1.5 bg-white text-teal-800 rounded-xl border border-slate-200 font-bold text-xs shadow-2xs">
                Ward B-204
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIEW OWN MEDICAL HISTORY - MONTH-WISE & YEAR-WISE GRAPHICAL REPRESENTATION */}
      {activeTab === 'HISTORY' && (
        <div className="space-y-6">
          <PatientGraphicalHistory
            patient={patientData}
            timelineEvents={timelineEvents}
            graphData={graphData}
          />

          {/* Hospital Registration & Allergies Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center text-sm">
                <Hospital className="w-4 h-4 mr-1.5 text-teal-600" />
                Hospital Registration & Primary Facility
              </h4>
              <p className="text-slate-600">
                Primary treatment facility: <strong>{patientData.hospitalName}</strong>. Registered on {patientData.registeredDate} under the longitudinal care of <strong>{patientData.primaryDoctorName}</strong>.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-slate-500 font-mono text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Active Patient Master Index #PMI-{patientData.id}</span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center text-sm">
                <AlertOctagon className="w-4 h-4 mr-1.5 text-amber-600" />
                Documented Allergies & Drug Adverse Reactions
              </h4>
              <p className="text-slate-500 text-[11px]">
                Reported to clinical team and verified against pharmacovigilance database.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {patientData.allergies.map((allergy) => (
                  <span key={allergy} className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. VIEW OWN DIAGNOSES */}
      {activeTab === 'DIAGNOSES' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Active Diagnoses & Clinical Conditions
              </h3>
              <p className="text-xs text-slate-500">
                Diagnoses formally documented by your attending clinicians with international ICD-10 clinical coding.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg text-xs font-bold">
              {patientData.activeConditions.length} Active Conditions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {patientData.activeConditions.map((cond, i) => (
              <div
                key={cond}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-500 transition-colors shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-teal-700 font-bold">
                      {i === 0 ? 'ICD-10: E11.9' : i === 1 ? 'ICD-10: I10' : 'ICD-10: N08.3'}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{cond}</h4>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[10px] font-bold border border-emerald-200">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Managed under regular clinical oversight by {patientData.primaryDoctorName}. Regular monitoring of vitals and biochemical panels is active.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VIEW OWN MEDICATIONS */}
      {activeTab === 'MEDICATIONS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Current Prescribed Medications
              </h3>
              <p className="text-xs text-slate-500">
                Active pharmacological prescriptions, dosage schedules, and instructions.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg text-xs font-bold">
              {patientData.currentMedications.length} Prescriptions Active
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {patientData.currentMedications.map((med) => (
              <div key={med} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Pill className="w-4 h-4 text-teal-600" />
                    <h4 className="text-sm font-bold text-slate-900">{med}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      Oral Formulation
                    </span>
                  </div>
                  <div className="text-slate-600 text-xs pl-6">
                    Prescribed by <strong>{patientData.primaryDoctorName}</strong> • Dispensed at Apex Pharmacy
                  </div>
                </div>

                <div className="flex items-center space-x-2 pl-6 sm:pl-0">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                    Active Regimen
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pharmacy & Adherence Guide with Image */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4 text-xs">
            <img
              src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80"
              alt="Medication Safety"
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="space-y-1">
              <strong className="text-slate-900 block font-bold">Pharmacological Adherence Notice</strong>
              <p className="text-slate-600">
                Please ensure Metformin 500 mg is taken with or immediately after meals to minimize gastrointestinal discomfort. Always report any unusual muscular fatigue or weakness to your care team.
              </p>
              <span className="text-[11px] text-teal-700 font-semibold block">Refill Available: Apex Hospital Pharmacy Counter 4</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW OWN LABORATORY RESULTS & TREND GRAPHS */}
      {activeTab === 'LABS' && (
        <div className="space-y-6">
          {/* Diagnostic Laboratory Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center gap-4 text-xs">
            <img
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=400&q=80"
              alt="Clinical Lab Diagnostics"
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
            />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide">Accredited Testing Facility</span>
              <h4 className="text-sm font-bold text-slate-900">Apex Regional Pathology & Biochemistry Laboratories</h4>
              <p className="text-slate-500">
                CAP & NABL accredited clinical diagnostic reporting. Automatic high-precision verification linked to patient longitudinal health profile.
              </p>
            </div>
          </div>
          {/* HbA1c Progression Chart Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                  Glycated Hemoglobin (HbA1c) Progression Trend
                </h3>
                <p className="text-xs text-slate-500">
                  Target for Type 2 Diabetes Management: &lt; 7.0%
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <TrendingDown className="w-4 h-4" />
                <span>Decreased from 8.4% down to 6.8%</span>
              </div>
            </div>

            {/* Visual Bar Progression */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-2">
                <span className="text-xs font-semibold text-slate-500 block">Baseline (Mar 2024)</span>
                <div className="text-3xl font-mono font-bold text-rose-600">8.4%</div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                  ELEVATED
                </span>
                <p className="text-[11px] text-slate-500">Commenced Metformin 250 mg</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-2">
                <span className="text-xs font-semibold text-slate-500 block">Titration (Aug 2025)</span>
                <div className="text-3xl font-mono font-bold text-amber-600">7.3%</div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  IMPROVING
                </span>
                <p className="text-[11px] text-slate-500">Titrated to Metformin 500 mg</p>
              </div>

              <div className="p-4 rounded-2xl border border-teal-200 bg-teal-50/50 text-center space-y-2">
                <span className="text-xs font-semibold text-teal-800 block">Recent Review (Mar 2026)</span>
                <div className="text-3xl font-mono font-bold text-teal-700">6.8%</div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  OPTIMAL GOAL ACHIEVED
                </span>
                <p className="text-[11px] text-teal-900 font-medium">Continue Metformin 500 mg BD</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. VIEW OWN DOCUMENTS */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                My Clinical Documents ({documents.length})
              </h3>
              <p className="text-xs text-slate-500">
                Uploaded discharge summaries, laboratory reports, and clinician consultation notes.
              </p>
            </div>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white transition-colors shadow-2xs self-start sm:self-auto"
            >
              <Camera className="w-3.5 h-3.5 mr-1.5" />
              <span>Scan & Upload New Document</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {documents.map((doc) => (
              <div key={doc.id} className="p-5 hover:bg-slate-50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900">{doc.id}</span>
                      <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                        {doc.documentType}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Uploaded by: {doc.uploadedByName} • Date: {doc.uploadedAt} • Format: {doc.fileFormat} ({doc.fileSize})
                    </div>
                  </div>

                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold self-start sm:self-auto">
                    {doc.extractedEntities.length} Entities Verified
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-mono text-[11px] whitespace-pre-wrap">
                  {doc.ocrTextPreview}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. VIEW OWN TIMELINE */}
      {activeTab === 'TIMELINE' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Your Complete Medical Journey (2024 - 2026)
              </h3>
            </div>
            <span className="text-xs text-slate-500">{timelineEvents.length} events logged</span>
          </div>

          <div className="ml-4 pl-4 border-l-2 border-teal-200 space-y-4">
            {timelineEvents.map((evt) => (
              <div
                key={evt.id}
                className="relative bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-all"
              >
                <div className="absolute -left-[25px] top-5 w-3.5 h-3.5 rounded-full bg-teal-600 border-2 border-white shadow-xs" />
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                  <span className="font-mono text-slate-500 font-semibold">{evt.date}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    {evt.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                <p className="text-xs text-slate-600">{evt.summary}</p>
                {evt.details.notes && (
                  <div className="text-[11px] bg-slate-50 p-2.5 rounded-xl text-slate-600 mt-2">
                    <strong>Doctor's Advice:</strong> {evt.details.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. VIEW PERMITTED ACCESS / AUDIT INFORMATION & CONSENT */}
      {activeTab === 'AUDIT' && (
        <div className="space-y-6">
          {/* Active Consent Grants */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                  Active Access Consents & Authorizations
                </h3>
                <p className="text-xs text-slate-500">
                  You hold sovereign control over which healthcare providers have permission to inspect your record.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-teal-50 text-teal-800 rounded-lg text-xs font-bold self-start sm:self-auto">
                {consents.filter((c) => c.status === 'ACTIVE').length} Active Authorizations
              </span>
            </div>

            <div className="p-6 divide-y divide-slate-100">
              {consents.map((consent) => {
                const isActive = consent.status === 'ACTIVE';

                return (
                  <div key={consent.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900">{consent.granteeName}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {consent.granteeRole}
                        </span>
                        {isActive ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            REVOKED
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600">
                        Scope: <strong className="text-slate-800">{consent.scope}</strong> • Facility: {consent.hospitalName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Granted: {consent.grantedDate} • Expiry: {consent.expiryDate}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleConsent(consent.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                        isActive
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                      }`}
                    >
                      {isActive ? 'Revoke Consent' : 'Reinstate Consent'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Immutable Audit Log Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                  Who Accessed My Record (Access & Audit Transparency)
                </h3>
                <p className="text-xs text-slate-500">
                  Chronological, immutable audit records of all clinicians and systems that accessed your health data.
                </p>
              </div>
              <Eye className="w-5 h-5 text-slate-400" />
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-slate-500 font-semibold">{log.timestamp}</span>
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {log.status}
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">IP: {log.ipAddress}</span>
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                  <div className="text-[11px] text-slate-500">
                    Accessed by: <strong className="text-slate-800">{log.actorName}</strong> ({log.actorRole}) • {log.hospitalName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Patient Document Scanner Modal (PDF & Image scanning) */}
      <PatientDocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        patientId={patientData.id}
        patientName={patientData.fullName}
        onSaveSuccess={handleDocumentSaved}
      />
    </div>
  );
};
