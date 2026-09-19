import React, { useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Patient,
  MedicalDocument,
  TimelineEvent,
  ConsentRecord,
  AuditLog,
  ExtractedEntity,
  Hospital
} from './types/healthcare';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCUMENTS,
  INITIAL_TIMELINE_EVENTS,
  INITIAL_CONSENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_HOSPITALS
} from './data/mockData';
import { Navbar } from './components/common/Navbar';
import { AccessDenied } from './components/common/AccessDenied';
import { LoginView } from './components/auth/LoginView';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { PatientDetailView } from './components/doctor/PatientDetailView';
import { PatientPortal } from './components/patient/PatientPortal';
import { HospitalAdminDashboard } from './components/hospital/HospitalAdminDashboard';
import { SystemAdminDashboard } from './components/admin/SystemAdminDashboard';
import { api } from './services/api';

export default function App() {
  // Current active user (starts null so user sees the login site first)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Core application data collections
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [documents, setDocuments] = useState<MedicalDocument[]>(INITIAL_DOCUMENTS);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(INITIAL_TIMELINE_EVENTS);
  const [consents, setConsents] = useState<ConsentRecord[]>(INITIAL_CONSENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);

  // Selected patient for Doctor detail view and active tab
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientTab, setSelectedPatientTab] = useState<'TIMELINE' | 'GRAPHS' | 'DOCUMENTS' | 'CLINICAL' | 'AUDIT'>('CLINICAL');

  // Security violation state (triggers the ACCESS DENIED boundary)
  const [unauthorizedAttempt, setUnauthorizedAttempt] = useState<{
    targetId: string;
    reason: string;
  } | null>(null);

  // Check existing session on load
  useEffect(() => {
    api.getMe().then((res) => {
      if (res.user) {
        setCurrentUser(res.user);
      }
    });
  }, []);

  // Switch role handler (for navbar simulation)
  const handleSelectRole = (role: UserRole) => {
    setUnauthorizedAttempt(null);
    setSelectedPatient(null);

    const roleKeyMap: Record<UserRole, string> = {
      DOCTOR: 'doctor',
      PATIENT: 'patient',
      HOSPITAL_ADMIN: 'hospitalAdmin',
      SYSTEM_ADMIN: 'systemAdmin'
    };

    api.login(roleKeyMap[role]).then((res) => {
      setCurrentUser(res.user);
    });
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setSelectedPatient(null);
    setUnauthorizedAttempt(null);
  };

  // When patient attempts unauthorized access to another patient's record
  const handleAttemptUnauthorizedAccess = async (targetId: string) => {
    try {
      // Direct call to backend endpoint - backend will strictly enforce RBAC and return 403
      await api.getPatientById(targetId);
    } catch (err: any) {
      setUnauthorizedAttempt({
        targetId,
        reason:
          err.message ||
          'A patient must never access another patient\'s data. This incident has been logged in the immutable security audit trail.'
      });
    }
  };

  // Doctor saves extracted document
  const handleSaveExtractedDocument = async (
    docTitle: string,
    docType: MedicalDocument['documentType'],
    ocrText: string,
    verifiedEntities: ExtractedEntity[]
  ) => {
    if (!selectedPatient) return;

    try {
      const res = await api.confirmExtraction({
        patientId: selectedPatient.id,
        docTitle,
        docType,
        ocrText,
        verifiedEntities
      });

      setDocuments((prev) => [res.document, ...prev]);
      setTimelineEvents((prev) => [res.timelineEvent, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  // If user is not logged in, show Login Landing Site
  if (!currentUser) {
    return <LoginView onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Global Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onSelectPatientDirectly={() => setSelectedPatient(patients[0])}
        onTriggerUnauthorizedAccess={() =>
          handleAttemptUnauthorizedAccess('PAT-1002 (Ananya Roy)')
        }
      />

      {/* Main Content Viewport */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* ACCESS DENIED SECURITY BOUNDARY OVERLAY */}
        {unauthorizedAttempt ? (
          <AccessDenied
            currentUser={currentUser}
            attemptedTargetId={unauthorizedAttempt.targetId}
            reason={unauthorizedAttempt.reason}
            onReturnToAuthorized={() => setUnauthorizedAttempt(null)}
          />
        ) : (
          <>
            {/* DOCTOR VIEW */}
            {currentUser.role === 'DOCTOR' && (
              <>
                {selectedPatient ? (
                  <PatientDetailView
                    patient={selectedPatient}
                    currentUser={currentUser}
                    timelineEvents={timelineEvents}
                    documents={documents}
                    auditLogs={auditLogs}
                    initialTab={selectedPatientTab}
                    onBack={() => setSelectedPatient(null)}
                    onSaveNewDocument={handleSaveExtractedDocument}
                    onRequestUnauthorizedTest={() =>
                      handleAttemptUnauthorizedAccess('PAT-1003')
                    }
                  />
                ) : (
                  <DoctorDashboard
                    currentUser={currentUser}
                    onSelectPatient={(patient, tab = 'CLINICAL') => {
                      setSelectedPatient(patient);
                      setSelectedPatientTab(tab);
                    }}
                  />
                )}
              </>
            )}

            {/* PATIENT VIEW */}
            {currentUser.role === 'PATIENT' && (
              <PatientPortal
                currentUser={currentUser}
                onAttemptUnauthorizedAccess={handleAttemptUnauthorizedAccess}
                onLogout={handleLogout}
              />
            )}

            {/* HOSPITAL ADMIN VIEW */}
            {currentUser.role === 'HOSPITAL_ADMIN' && (
              <HospitalAdminDashboard
                currentUser={currentUser}
                hospital={hospitals[0]}
                patients={patients}
                documents={documents}
                auditLogs={auditLogs}
              />
            )}

            {/* SYSTEM ADMIN VIEW */}
            {currentUser.role === 'SYSTEM_ADMIN' && (
              <SystemAdminDashboard
                currentUser={currentUser}
                hospitals={hospitals}
                patients={patients}
                documents={documents}
                auditLogs={auditLogs}
              />
            )}
          </>
        )}
      </main>

      {/* Clinical Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">MediIntel</span>
            <span>•</span>
            <span>Healthcare Medical Record Intelligence Platform</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Role-Based Access Control (RBAC)</span>
            <span>•</span>
            <span>Longitudinal Health Records</span>
            <span>•</span>
            <span>Context & Negation Assertion Model</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
