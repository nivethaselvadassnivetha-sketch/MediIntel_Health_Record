import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, FileWarning, EyeOff } from 'lucide-react';
import { User } from '../../types/healthcare';

interface AccessDeniedProps {
  currentUser: User;
  attemptedTargetId?: string;
  reason?: string;
  onReturnToAuthorized: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  currentUser,
  attemptedTargetId = 'PAT-1002 (Priya Sharma)',
  reason = 'Patient data isolation violation. Patients can only access their own authorized records (PAT-1001).',
  onReturnToAuthorized
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-red-200 shadow-xl overflow-hidden">
        {/* Top Warning Banner */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-700 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide uppercase">
                Access Denied • Security Boundary
              </h2>
              <p className="text-xs text-red-100">
                HTTP 403 Forbidden | RBAC Scope Policy Enforcement
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-red-800/80 rounded font-mono text-xs font-semibold text-red-100">
            ERR_AUTH_SCOPE
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
              <EyeOff className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Unauthorized Medical Record Access Attempt
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your credentials are not authorized to view the requested health records. Patient privacy rules strictly enforce record isolation.
              </p>
            </div>
          </div>

          {/* Incident Details Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-sans">Active Identity:</span>
              <span className="text-slate-900 font-semibold">{currentUser.name} ({currentUser.role})</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-sans">Authorized Scope:</span>
              <span className="text-emerald-700 font-semibold">
                {currentUser.role === 'PATIENT' ? `Self Only (${currentUser.patientId})` : currentUser.hospitalName || 'Assigned Scope'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-sans">Target Record Requested:</span>
              <span className="text-red-600 font-semibold">{attemptedTargetId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Policy Violation:</span>
              <span className="text-red-700 font-medium font-sans text-right max-w-xs">
                {reason}
              </span>
            </div>
          </div>

          {/* Audit Logging Notice */}
          <div className="flex items-start space-x-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
            <FileWarning className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Immutable Audit Log Recorded</span>
              This unauthorized access event has been timestamped and transmitted to the Hospital Privacy Compliance and Security Audit team under HIPAA and Digital Healthcare Security standards.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onReturnToAuthorized}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Authorized Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
