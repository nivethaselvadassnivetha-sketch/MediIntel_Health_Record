import React, { useState } from 'react';
import {
  ShieldCheck,
  Activity,
  Users,
  Building2,
  Server,
  UserCheck,
  ChevronDown,
  Sparkles,
  HelpCircle,
  FileCode,
  Lock,
  LogOut
} from 'lucide-react';
import { User, UserRole } from '../../types/healthcare';
import { INITIAL_USERS } from '../../data/mockData';

interface NavbarProps {
  currentUser: User;
  onLogout?: () => void;
  onSelectPatientDirectly?: () => void;
  onTriggerUnauthorizedAccess?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onSelectPatientDirectly,
  onTriggerUnauthorizedAccess
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'DOCTOR':
        return 'Licensed Clinician';
      case 'PATIENT':
        return 'Patient Portal';
      case 'HOSPITAL_ADMIN':
        return 'Hospital Administrator';
      case 'SYSTEM_ADMIN':
        return 'System Administrator';
      default:
        return role;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Clinical Brand */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  MediIntel
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200 uppercase">
                  HEALTHCARE EHR
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Medical Record & Document Intelligence Platform
              </p>
            </div>
          </div>

          {/* Right Area: Features Guide & Isolated Active Session */}
          <div className="flex items-center space-x-3">
            {/* Guide Button */}
            <button
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
              <span className="hidden sm:inline">Active Role Overview</span>
              <span className="sm:hidden">Info</span>
            </button>

            {isHelpOpen && (
              <div className="absolute right-24 sm:right-48 top-16 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3 z-50 text-xs animate-scaleUp">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    {getRoleLabel(currentUser.role)} Session
                  </span>
                  <button
                    onClick={() => setIsHelpOpen(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2 text-slate-600">
                  <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-200 text-teal-950">
                    <strong className="text-teal-900 block mb-0.5">Role Isolation Active</strong>
                    You are viewing only the interface designated for your role. Other roles are secured and require signing out.
                  </div>

                  {currentUser.role === 'DOCTOR' && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <strong className="text-slate-900 block">Clinician Capabilities:</strong>
                      <p>Search & filter patients by disease, medication, or demographics. Upload clinical documents for automated AI entity extraction with negation analysis.</p>
                    </div>
                  )}

                  {currentUser.role === 'PATIENT' && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <strong className="text-slate-900 block">Patient Portal Capabilities:</strong>
                      <p>View personal health profile, longitudinal month-wise & year-wise health history, active prescriptions, lab results, and audit logs.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Current Active User Profile (No other 3 logins shown at top corner) */}
            <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-teal-700 font-semibold font-mono">
                  {currentUser.role}
                </div>
              </div>

              {/* Sign Out Button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="ml-1.5 inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
