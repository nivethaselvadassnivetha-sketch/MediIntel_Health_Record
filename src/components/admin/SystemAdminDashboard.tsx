import React, { useState } from 'react';
import {
  User,
  Hospital,
  Patient,
  MedicalDocument,
  AuditLog
} from '../../types/healthcare';
import {
  ShieldAlert,
  Server,
  Activity,
  Cpu,
  Database,
  Building,
  Users,
  FileText,
  BrainCircuit,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Sparkles,
  Sliders
} from 'lucide-react';

interface SystemAdminDashboardProps {
  currentUser: User;
  hospitals: Hospital[];
  patients: Patient[];
  documents: MedicalDocument[];
  auditLogs: AuditLog[];
}

export const SystemAdminDashboard: React.FC<SystemAdminDashboardProps> = ({
  currentUser,
  hospitals,
  patients,
  documents,
  auditLogs
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HOSPITALS' | 'USERS' | 'AI_MONITOR' | 'AUDIT_LOGS'>('OVERVIEW');
  const [auditFilter, setAuditFilter] = useState('');

  const systemHealth = [
    { name: 'Core Healthcare Data Integration Gateway', status: 'OPERATIONAL', latency: '24ms', uptime: '99.98%' },
    { name: 'BioClinicalBERT Negation Pipeline', status: 'OPERATIONAL', latency: '1.2s', uptime: '99.95%' },
    { name: 'Cryptographic Audit Logger (Immutable)', status: 'OPERATIONAL', latency: '12ms', uptime: '100%' },
    { name: 'RBAC Policy & Consent Decision Point', status: 'OPERATIONAL', latency: '8ms', uptime: '99.99%' },
  ];

  const filteredAudits = auditLogs.filter(
    (log) =>
      !auditFilter ||
      log.action.toLowerCase().includes(auditFilter.toLowerCase()) ||
      log.actorName.toLowerCase().includes(auditFilter.toLowerCase()) ||
      log.details.toLowerCase().includes(auditFilter.toLowerCase()) ||
      (log.targetPatientId && log.targetPatientId.toLowerCase().includes(auditFilter.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* System Admin Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-slate-900 text-teal-400 rounded-2xl border border-slate-700 shrink-0">
            <Server className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                System Administrator Console
              </h2>
              <span className="px-2.5 py-0.5 rounded font-mono text-[11px] font-bold bg-slate-900 text-teal-300">
                SYSTEM_ADMIN
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                GLOBAL OVERSIGHT
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Super-Admin: <strong>{currentUser.name}</strong> ({currentUser.email}) • Non-Public Provisioned Infrastructure Account
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-semibold flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
            All 4 System Services Healthy
          </div>
        </div>
      </div>

      {/* Global Analytics Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Hospitals</span>
          <span className="text-2xl font-mono font-bold text-slate-900">{hospitals.length}</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Apex, Metro, St. Jude</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Patients</span>
          <span className="text-2xl font-mono font-bold text-slate-900">3,225</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Across federations</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Clinicians</span>
          <span className="text-2xl font-mono font-bold text-slate-900">105</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Active licensed MDs</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Docs Processed</span>
          <span className="text-2xl font-mono font-bold text-teal-700">10,950</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">PDF, PNG, JPG</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Negation Recall</span>
          <span className="text-2xl font-mono font-bold text-teal-800">98.2%</span>
          <span className="text-[10px] text-teal-700 block mt-0.5">Context validation</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase block">Security Violations</span>
          <span className="text-2xl font-mono font-bold text-slate-900">0</span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">RBAC enforced</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-1 text-xs font-semibold overflow-x-auto">
        {[
          { key: 'OVERVIEW', label: 'System Health & Infrastructure' },
          { key: 'HOSPITALS', label: 'Hospitals Registry', count: hospitals.length },
          { key: 'AI_MONITOR', label: 'AI & Negation Engine Monitor' },
          { key: 'AUDIT_LOGS', label: 'Global Audit Logs', count: auditLogs.length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-2.5 px-3.5 rounded-lg transition-colors flex items-center space-x-1.5 shrink-0 ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.key ? 'bg-slate-700 text-teal-300' : 'bg-slate-200 text-slate-700'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: SYSTEM HEALTH */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Platform Microservice Architecture & Interop Status
              </h4>
              <span className="text-xs text-slate-500 font-mono">Live Probes</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {systemHealth.map((svc) => (
                <div key={svc.name} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">{svc.name}</span>
                    <div className="text-[11px] text-slate-500">
                      Uptime SLA: <strong className="text-slate-700">{svc.uptime}</strong> • Latency: <span className="font-mono text-teal-700">{svc.latency}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOSPITALS */}
      {activeTab === 'HOSPITALS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hospitals.map((hosp) => (
            <div key={hosp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700">
                    {hosp.id}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{hosp.name}</h4>
                  <p className="text-xs text-slate-500">{hosp.city}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Doctors</span>
                  <strong className="text-slate-900">{hosp.doctorsCount}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Patients</span>
                  <strong className="text-slate-900">{hosp.patientsCount}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Processed</span>
                  <strong className="text-teal-700">{hosp.documentsProcessed}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: AI MONITOR */}
      {activeTab === 'AI_MONITOR' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Medical Document Intelligence & Negation Accuracy Metrics
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating the deep context classifier on distinguishing positive findings from negated findings (e.g. "denies chest pain").
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 space-y-1">
              <span className="text-[11px] font-bold text-teal-800 uppercase">Contextual Negation F1 Score</span>
              <div className="text-2xl font-mono font-bold text-teal-900">0.978</div>
              <p className="text-[11px] text-teal-700">Prevents false positives like recording denied angina as present.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 uppercase">Clinician Verification Rate</span>
              <div className="text-2xl font-mono font-bold text-slate-900">96.4%</div>
              <p className="text-[11px] text-slate-500">Percentage of AI suggestions confirmed without edit.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 uppercase">Ontology Mapping (SNOMED/LOINC)</span>
              <div className="text-2xl font-mono font-bold text-slate-900">99.2%</div>
              <p className="text-[11px] text-slate-500">Standardized clinical coding accuracy.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GLOBAL AUDIT LOGS */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-3">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                System-Wide Audit Logs ({filteredAudits.length})
              </h4>
              <p className="text-xs text-slate-500">
                Immutable record of all access, upload, verification, and consent events.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                placeholder="Filter audit entries..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {filteredAudits.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-slate-500">{log.timestamp}</span>
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {log.status}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">IP: {log.ipAddress}</span>
                </div>
                <p className="text-slate-600">{log.details}</p>
                <div className="text-[11px] text-slate-500">
                  Actor: <strong className="text-slate-800">{log.actorName}</strong> ({log.actorRole}) • Target: {log.targetPatientId || 'Global'} • {log.hospitalName || 'System'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
