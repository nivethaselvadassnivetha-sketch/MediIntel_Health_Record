import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  FileText,
  Activity,
  CheckCircle2,
  ChevronRight,
  Filter,
  UserCheck,
  AlertCircle,
  X,
  Stethoscope,
  HeartPulse,
  Pill,
  Hospital,
  Calendar,
  Layers,
  ShieldCheck,
  Camera,
  LineChart,
  Clock,
  FileUp,
  Upload,
  Check,
  Edit3,
  XCircle,
  HelpCircle,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Patient, User, MedicalDocument, ExtractedEntity } from '../../types/healthcare';
import { api } from '../../services/api';
import { DocumentIntelligenceModal } from './DocumentIntelligenceModal';

interface DoctorDashboardProps {
  currentUser: User;
  onSelectPatient: (patient: Patient, initialTab?: 'TIMELINE' | 'GRAPHS' | 'DOCUMENTS' | 'CLINICAL' | 'AUDIT') => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  currentUser,
  onSelectPatient
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('Male, 40+, diabetes, metformin');
  const [selectedDisease, setSelectedDisease] = useState<string>('all');
  const [selectedMedicine, setSelectedMedicine] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(true);
  const [showPermissionsMatrix, setShowPermissionsMatrix] = useState<boolean>(false);

  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [parsedTokens, setParsedTokens] = useState<any>({});

  // Direct modal trigger for scanning and uploading documents
  const [uploadTargetPatient, setUploadTargetPatient] = useState<Patient | null>(null);

  const diseaseSelectRef = useRef<HTMLSelectElement>(null);
  const medicineSelectRef = useRef<HTMLSelectElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Execute backend search whenever query or filters change
  const executeSearch = async () => {
    setIsLoading(true);
    try {
      const res = await api.searchPatients({
        q: searchQuery,
        disease: selectedDisease,
        medicine: selectedMedicine,
        gender: selectedGender,
        age: selectedAge
      });
      setPatients(res.patients || []);
      setTotalCount(res.total || 0);
      setParsedTokens(res.searchMetadata?.parsedTokens || {});
    } catch (err) {
      console.error('Failed to search backend patients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    executeSearch();
  }, [searchQuery, selectedDisease, selectedMedicine, selectedGender, selectedAge]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDisease('all');
    setSelectedMedicine('all');
    setSelectedGender('ALL');
    setSelectedAge('');
  };

  const handleApplyPreset = (presetQuery: string, disease = 'all', medicine = 'all', gender = 'ALL', age = '') => {
    setSearchQuery(presetQuery);
    setSelectedDisease(disease);
    setSelectedMedicine(medicine);
    setSelectedGender(gender);
    setSelectedAge(age);
  };

  const DOCTOR_PERMISSIONS = [
    { name: 'Search authorized patients', status: 'ACTIVE', desc: 'Query authorized registry by name, ID, or clinical profile' },
    { name: 'Filter patients', status: 'ACTIVE', desc: 'Multi-criteria dynamic filtering' },
    { name: 'Search by disease', status: 'ACTIVE', desc: 'Type 2 Diabetes, Hypertension, Asthma, CAD, CKD, COPD' },
    { name: 'Search by medicine', status: 'ACTIVE', desc: 'Metformin, Telmisartan, Atorvastatin, Montelukast' },
    { name: 'Search by demographics', status: 'ACTIVE', desc: 'Gender (Male/Female) and Age brackets (<40, 40-59, 60+)' },
    { name: 'Perform combined searches', status: 'ACTIVE', desc: 'Cross-attribute Boolean query resolution' },
    { name: 'View authorized patient records', status: 'ACTIVE', desc: 'Consent-verified longitudinal clinical summaries' },
    { name: 'Upload medical documents', status: 'ACTIVE', desc: 'PDF, JPG, PNG, WEBP document upload' },
    { name: 'Process documents', status: 'ACTIVE', desc: 'Multimodal AI extraction & clinical OCR' },
    { name: 'View AI extraction', status: 'ACTIVE', desc: 'Structured diagnoses, medications, labs, symptoms' },
    { name: 'View confidence', status: 'ACTIVE', desc: 'Entity-level confidence scores (0-100%)' },
    { name: 'View source evidence', status: 'ACTIVE', desc: 'Grounded verbatim source quotes with page indicators' },
    { name: 'Confirm extraction', status: 'ACTIVE', desc: '1-click clinician endorsement to permanent EHR' },
    { name: 'Edit extraction', status: 'ACTIVE', desc: 'Adjust names, dosages, frequencies, and clinical codes' },
    { name: 'Reject extraction', status: 'ACTIVE', desc: 'Omit irrelevant or false positive mentions' },
    { name: 'View patient timeline', status: 'ACTIVE', desc: 'Longitudinal clinical event sequence' },
    { name: 'View year/month history', status: 'ACTIVE', desc: 'Historical drill-down by calendar year & month' },
    { name: 'View graphs', status: 'ACTIVE', desc: 'Blood Pressure, HbA1c, Glucose, eGFR trends' },
    { name: 'Scan PDF & image format', status: 'ACTIVE', desc: 'High-res file ingest and camera photo scanner' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Clinician Welcome & Facility Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80"
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-600 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                CLINICIAN
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.specialty || 'Endocrinology & Internal Medicine'} • {currentUser.hospitalName}
            </p>
          </div>
        </div>

        {/* Quick Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (patients.length > 0) {
                setUploadTargetPatient(patients[0]);
              }
            }}
            className="inline-flex items-center px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Camera className="w-3.5 h-3.5 mr-1.5" />
            Scan & Upload Document (PDF/Image)
          </button>

          <button
            onClick={() => {
              if (patients.length > 0) {
                onSelectPatient(patients[0], 'GRAPHS');
              }
            }}
            className="inline-flex items-center px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
          >
            <LineChart className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
            View Clinical Graphs
          </button>

          <button
            onClick={() => {
              if (patients.length > 0) {
                onSelectPatient(patients[0], 'TIMELINE');
              }
            }}
            className="inline-flex items-center px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
          >
            <Clock className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
            View Patient Timeline
          </button>

          <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Authorized Registry</span>
            <strong className="text-slate-900 font-mono text-sm">{totalCount} Patients</strong>
          </div>
        </div>
      </div>

      {/* Doctor Permissions & Features Suite */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Authorized Doctor Clinical Permissions ({DOCTOR_PERMISSIONS.length}/{DOCTOR_PERMISSIONS.length} Enabled)
              </h3>
              <p className="text-[11px] text-slate-500">
                All clinical features are certified and active for Dr. {currentUser.name.split(',')[0]}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPermissionsMatrix(!showPermissionsMatrix)}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center space-x-1"
          >
            <span>{showPermissionsMatrix ? 'Hide Full Permissions' : 'View All Permissions'}</span>
            {showPermissionsMatrix ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Quick Permissions Pills */}
        <div className="flex flex-wrap gap-1.5">
          {DOCTOR_PERMISSIONS.slice(0, 7).map((p) => (
            <span
              key={p.name}
              className="inline-flex items-center px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium"
            >
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
              {p.name}
            </span>
          ))}
          {!showPermissionsMatrix && (
            <button
              onClick={() => setShowPermissionsMatrix(true)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-semibold"
            >
              +{DOCTOR_PERMISSIONS.length - 7} more permissions
            </button>
          )}
        </div>

        {/* Expanded Permissions Grid */}
        {showPermissionsMatrix && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {DOCTOR_PERMISSIONS.map((perm) => (
              <div
                key={perm.name}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between space-x-2 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-800 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
                    <span>{perm.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 pl-5">{perm.desc}</p>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                  ACTIVE
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Search & Clinical Filters Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center">
              <Search className="w-4 h-4 mr-2 text-teal-600" />
              Search & Filter Authorized Patients
            </h3>
            <p className="text-xs text-slate-500">
              Query by natural language, clinical diagnosis, active medication, or demographic criteria.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
              <span>{showAdvancedFilters ? 'Hide Filter Panel' : 'Show Filter Panel'}</span>
            </button>
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Search Input Bar (Natural Language & Combined Search) */}
        <div className="relative">
          <Search className="w-5 h-5 text-teal-600 absolute left-3.5 top-3.5" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Combined search: Enter disease, medicine, demographics (e.g. Male, 40+, diabetes, metformin)..."
            className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* NLP Detected Tokens Pill Bar */}
        {(parsedTokens?.gender || parsedTokens?.minAge || parsedTokens?.conditions?.length > 0 || parsedTokens?.medications?.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-teal-50/70 rounded-xl border border-teal-200 text-xs">
            <span className="text-[11px] font-bold text-teal-900 flex items-center mr-1">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-700" />
              Combined Clinical Tokens:
            </span>
            {parsedTokens.gender && (
              <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-white text-teal-900 border border-teal-200 font-semibold">
                Gender: {parsedTokens.gender}
              </span>
            )}
            {parsedTokens.minAge && (
              <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-white text-teal-900 border border-teal-200 font-semibold">
                Age &gt;= {parsedTokens.minAge}
              </span>
            )}
            {parsedTokens.conditions?.map((c: string) => (
              <span key={c} className="px-2 py-0.5 rounded font-mono text-[11px] bg-white text-teal-900 border border-teal-200 font-semibold">
                Disease: {c}
              </span>
            ))}
            {parsedTokens.medications?.map((m: string) => (
              <span key={m} className="px-2 py-0.5 rounded font-mono text-[11px] bg-white text-teal-900 border border-teal-200 font-semibold">
                Rx: {m}
              </span>
            ))}
          </div>
        )}

        {/* Filter Controls: Disease, Medicine, Demographics */}
        {showAdvancedFilters && (
          <div className="space-y-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Search by Disease */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center">
                  <Activity className="w-3 h-3 mr-1 text-teal-600" />
                  Search by Disease
                </label>
                <select
                  ref={diseaseSelectRef}
                  value={selectedDisease}
                  onChange={(e) => setSelectedDisease(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                >
                  <option value="all">All Diagnoses</option>
                  <option value="diabetes">Type 2 Diabetes Mellitus</option>
                  <option value="hypertension">Essential Hypertension</option>
                  <option value="asthma">Bronchial Asthma</option>
                  <option value="cad">Coronary Artery Disease</option>
                  <option value="arthritis">Osteoarthritis</option>
                  <option value="thyroid">Hypothyroidism</option>
                  <option value="kidney">Chronic Kidney Disease</option>
                  <option value="copd">COPD</option>
                </select>
              </div>

              {/* 2. Search by Medicine */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center">
                  <Pill className="w-3 h-3 mr-1 text-teal-600" />
                  Search by Medicine
                </label>
                <select
                  ref={medicineSelectRef}
                  value={selectedMedicine}
                  onChange={(e) => setSelectedMedicine(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                >
                  <option value="all">All Prescribed Medications</option>
                  <option value="metformin">Metformin HCl</option>
                  <option value="telmisartan">Telmisartan</option>
                  <option value="montelukast">Montelukast / Budesonide</option>
                  <option value="atorvastatin">Atorvastatin</option>
                  <option value="levothyroxine">Levothyroxine Sodium</option>
                  <option value="allopurinol">Allopurinol</option>
                </select>
              </div>

              {/* 3. Search by Demographics: Gender */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center">
                  <Users className="w-3 h-3 mr-1 text-teal-600" />
                  Demographics: Gender
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                >
                  <option value="ALL">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* 4. Search by Demographics: Age */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1 flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-teal-600" />
                  Demographics: Age Bracket
                </label>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
                >
                  <option value="">Any Age</option>
                  <option value="<40">Young Adult (&lt; 40 yrs)</option>
                  <option value="40+">Middle-aged (40 - 59 yrs)</option>
                  <option value="60+">Senior (60+ yrs)</option>
                </select>
              </div>
            </div>

            {/* Quick Interactive Filter Chips */}
            <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 font-semibold mr-1">Quick Tag Filters:</span>
              <button
                onClick={() => setSelectedDisease('diabetes')}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  selectedDisease === 'diabetes' ? 'bg-teal-700 text-white border-teal-700 font-bold' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Diabetes
              </button>
              <button
                onClick={() => setSelectedDisease('hypertension')}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  selectedDisease === 'hypertension' ? 'bg-teal-700 text-white border-teal-700 font-bold' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Hypertension
              </button>
              <button
                onClick={() => setSelectedMedicine('metformin')}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  selectedMedicine === 'metformin' ? 'bg-teal-700 text-white border-teal-700 font-bold' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Metformin
              </button>
              <button
                onClick={() => setSelectedMedicine('atorvastatin')}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  selectedMedicine === 'atorvastatin' ? 'bg-teal-700 text-white border-teal-700 font-bold' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Atorvastatin
              </button>
              <button
                onClick={() => setSelectedGender('Female')}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  selectedGender === 'Female' ? 'bg-teal-700 text-white border-teal-700 font-bold' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Female
              </button>
              <button
                onClick={() => setSelectedGender('Male')}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  selectedGender === 'Male' ? 'bg-teal-700 text-white border-teal-700 font-bold' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Male
              </button>
              <button
                onClick={() => setSelectedAge('60+')}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  selectedAge === '60+' ? 'bg-teal-700 text-white border-teal-700 font-bold' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                Age 60+
              </button>
            </div>
          </div>
        )}

        {/* Quick Clinical Search Presets (Combined Searches) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Combined Searches:</span>
          <button
            onClick={() => handleApplyPreset('Male, 40+, diabetes, metformin')}
            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold transition-colors border border-teal-200"
          >
            Male, 40+, Diabetes, Metformin
          </button>
          <button
            onClick={() => handleApplyPreset('Asthma, Montelukast', 'asthma', 'montelukast')}
            className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-semibold transition-colors border border-cyan-200"
          >
            Asthma & Montelukast
          </button>
          <button
            onClick={() => handleApplyPreset('Senior CAD Patients 60+', 'cad', 'atorvastatin', 'ALL', '60+')}
            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold transition-colors border border-blue-200"
          >
            Senior CAD & Statin (60+)
          </button>
          <button
            onClick={() => handleApplyPreset('')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
          >
            View All 15 Authorized Patients
          </button>
        </div>
      </div>

      {/* Patient Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
          <span>Matching Authorized Patients ({patients.length})</span>
          {isLoading && <span className="text-teal-600 animate-pulse">Filtering backend records...</span>}
        </div>

        {patients.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Patients Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No authorized patient matched the combined search criteria. Try relaxing your filters or resetting the search.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Header & Avatar */}
                  <div className="flex items-start justify-between">
                    <div
                      onClick={() => onSelectPatient(patient, 'CLINICAL')}
                      className="flex items-center space-x-3 cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0 border border-teal-200">
                        {patient.fullName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {patient.fullName}
                        </h4>
                        <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                          <span className="font-mono text-teal-800 font-bold">{patient.id}</span>
                          <span>•</span>
                          <span>{patient.age}y {patient.gender}</span>
                          <span>•</span>
                          <span>{patient.bloodGroup}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      CONSENT ACTIVE
                    </span>
                  </div>

                  {/* Active Conditions */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Diagnoses</span>
                    <div className="flex flex-wrap gap-1">
                      {patient.activeConditions.slice(0, 2).map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 truncate max-w-[200px]">
                          {c}
                        </span>
                      ))}
                      {patient.activeConditions.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500">
                          +{patient.activeConditions.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Medications */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Medications</span>
                    <div className="flex flex-wrap gap-1">
                      {patient.currentMedications.slice(0, 2).map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-50 text-teal-800 border border-teal-100 truncate max-w-[200px]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Vitals Summary Pill */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">BP</span>
                      <strong className="text-slate-900">{patient.latestVitals.bloodPressure}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Heart Rate</span>
                      <strong className="text-slate-900">{patient.latestVitals.heartRate} bpm</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">HbA1c</span>
                      <strong className="text-teal-700">{patient.latestVitals.hba1c ? `${patient.latestVitals.hba1c}%` : 'N/A'}</strong>
                    </div>
                  </div>
                </div>

                {/* 4 Dedicated Clinical Action Buttons */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => onSelectPatient(patient, 'CLINICAL')}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold border border-teal-200 flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Record</span>
                    </button>

                    <button
                      onClick={() => setUploadTargetPatient(patient)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 font-bold border border-slate-200 flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-teal-600" />
                      <span>Scan & Upload</span>
                    </button>

                    <button
                      onClick={() => onSelectPatient(patient, 'TIMELINE')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 flex items-center justify-center space-x-1 transition-colors text-[11px]"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Timeline History</span>
                    </button>

                    <button
                      onClick={() => onSelectPatient(patient, 'GRAPHS')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 flex items-center justify-center space-x-1 transition-colors text-[11px]"
                    >
                      <LineChart className="w-3.5 h-3.5 text-slate-500" />
                      <span>Clinical Graphs</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Multimodal Document Upload & Scanner Modal (Direct from Doctor Dashboard) */}
      {uploadTargetPatient && (
        <DocumentIntelligenceModal
          isOpen={!!uploadTargetPatient}
          onClose={() => setUploadTargetPatient(null)}
          patient={uploadTargetPatient}
          onSaveExtractedToPatient={async (docTitle, docType, ocrText, entities) => {
            try {
              await api.confirmExtraction({
                patientId: uploadTargetPatient.id,
                docTitle,
                docType,
                ocrText,
                verifiedEntities: entities
              });
              setUploadTargetPatient(null);
              executeSearch();
            } catch (err) {
              console.error('Error confirming extraction:', err);
            }
          }}
        />
      )}
    </div>
  );
};
