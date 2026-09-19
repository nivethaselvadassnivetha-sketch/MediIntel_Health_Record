import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Shield,
  Stethoscope,
  Users,
  Building2,
  Server,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { User, UserRole } from '../../types/healthcare';
import { api } from '../../services/api';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [selectedIndividual, setSelectedIndividual] = useState<'doctor' | 'patient' | 'hospitalAdmin' | 'systemAdmin'>('doctor');
  const [email, setEmail] = useState('sarah.mathew@apexhospital.org');
  const [password, setPassword] = useState('clinical•secure•2026');
  const [fullName, setFullName] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('PATIENT');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('nivethaselvadassnivetha@gmail.com');
  const [googleName, setGoogleName] = useState('Dr. Nivetha Selvadass, MD');
  const [googleRole, setGoogleRole] = useState<UserRole>('DOCTOR');
  const [isCustomGoogleAccount, setIsCustomGoogleAccount] = useState(false);

  const individuals = [
    {
      key: 'patient' as const,
      role: 'PATIENT' as const,
      title: 'Patient',
      name: 'Arun Kumar',
      subtitle: 'PAT-1001 • Chronic Disease Care',
      email: 'arun.kumar@gmail.com',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      icon: Heart,
      accent: 'from-cyan-500 to-teal-600',
      tagColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      features: ['View own profile & QR ID', 'View own timeline & labs', 'Strict self-access isolation']
    },
    {
      key: 'doctor' as const,
      role: 'DOCTOR' as const,
      title: 'Doctor',
      name: 'Dr. Sarah Mathew, MD',
      subtitle: 'Endocrinology & Internal Medicine',
      email: 'sarah.mathew@apexhospital.org',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
      icon: Stethoscope,
      accent: 'from-teal-600 to-emerald-600',
      tagColor: 'bg-teal-50 text-teal-800 border-teal-200',
      features: ['Search & filter 15 patients', 'AI extraction with negation', 'Clinical trend graphs & longitudinal records']
    },
    {
      key: 'hospitalAdmin' as const,
      role: 'HOSPITAL_ADMIN' as const,
      title: 'Hospital Admin',
      name: 'Marcus Vance',
      subtitle: 'Apex City Hospital Administration',
      email: 'marcus.vance@apexhospital.org',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      icon: Building2,
      accent: 'from-blue-600 to-indigo-600',
      tagColor: 'bg-blue-50 text-blue-800 border-blue-200',
      features: ['Hospital doctors directory', 'Scoped patients & documents', 'Facility compliance logs']
    },
    {
      key: 'systemAdmin' as const,
      role: 'SYSTEM_ADMIN' as const,
      title: 'System Admin',
      name: 'Dr. Clara Chen',
      subtitle: 'Global Infrastructure Oversight',
      email: 'clara.chen@mediintel.org',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      icon: Server,
      accent: 'from-slate-700 to-slate-900',
      tagColor: 'bg-slate-100 text-slate-800 border-slate-300',
      features: ['Microservice health probes', 'Global audit log monitoring', 'Cross-facility analytics']
    }
  ];

  const handleSelectIndividual = (key: 'doctor' | 'patient' | 'hospitalAdmin' | 'systemAdmin') => {
    setSelectedIndividual(key);
    const ind = individuals.find((i) => i.key === key);
    if (ind) {
      setEmail(ind.email);
      setPassword('clinical•secure•2026');
      setSignupRole(ind.role);
      setGoogleRole(ind.role);
      if (ind.role === 'DOCTOR') {
        setGoogleName('Dr. Nivetha Selvadass, MD');
        setGoogleEmail('nivethaselvadassnivetha@gmail.com');
      } else if (ind.role === 'PATIENT') {
        setGoogleName('Nivetha Selvadass');
        setGoogleEmail('nivethaselvadassnivetha@gmail.com');
      }
    }
    setErrorMessage('');
  };

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await api.login(selectedIndividual, email, password);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await api.signUp({
        name: fullName || (signupRole === 'DOCTOR' ? 'Dr. Sarah Mathew, MD' : 'New Healthcare Member'),
        email,
        role: signupRole,
        hospitalId: 'HOSP-01'
      });
      onLoginSuccess(res.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteGoogleSignIn = async (emailToUse: string, nameToUse: string, roleToUse: UserRole) => {
    setIsLoading(true);
    try {
      const res = await api.loginWithGoogle(emailToUse, nameToUse, roleToUse);
      setShowGoogleModal(false);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setErrorMessage('Google Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentIndividual = individuals.find((i) => i.key === selectedIndividual)!;

  return (
    <div className="min-h-screen bg-linear-to-b from-cyan-50/60 via-slate-50 to-white flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Decorative Brand Top Banner */}
      <div className="max-w-6xl w-full mx-auto space-y-8 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 border border-teal-200 text-teal-900 text-xs font-bold shadow-2xs">
            <Activity className="w-4 h-4 text-teal-700" />
            <span>MediIntel • Intelligent Healthcare Medical Record Platform</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Secure Digital Healthcare Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Choose your healthcare role to access longitudinal medical records, AI document intelligence with negation detection, clinical charts, and secure role-based access.
          </p>
        </div>

        {/* Step 1: Four Individuals Selection Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <Users className="w-4 h-4 mr-1.5 text-teal-600" />
              Select Individual User Profile:
            </span>
            <span className="text-[11px] text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              4 Roles Configured
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {individuals.map((ind) => {
              const Icon = ind.icon;
              const isSelected = selectedIndividual === ind.key;

              return (
                <button
                  key={ind.key}
                  type="button"
                  onClick={() => handleSelectIndividual(ind.key)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={ind.image}
                      alt={ind.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ind.tagColor}`}>
                          {ind.title}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                        {ind.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {ind.subtitle}
                      </p>
                    </div>
                  </div>

                  <ul className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                    {ind.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {ind.email}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Login / Sign Up Form Box */}
        <div className="max-w-xl w-full mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
          {/* Tabs: Login / Sign In vs Sign Up */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('LOGIN')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authMode === 'LOGIN'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In (Login)
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('SIGNUP')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                authMode === 'SIGNUP'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account (Sign Up)
            </button>
          </div>

          {/* Selected individual confirmation bar */}
          <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <img
                src={currentIndividual.image}
                alt={currentIndividual.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase block">Selected Role</span>
                <span className="font-bold text-slate-900">{currentIndividual.title}: {currentIndividual.name}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold bg-white text-teal-900 border border-teal-200">
              {currentIndividual.role}
            </span>
          </div>

          {/* Working "Continue with Google" Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all flex items-center justify-center space-x-3 text-xs font-bold text-slate-700 shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-semibold">Or with credentials</span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          {authMode === 'LOGIN' ? (
            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Authenticating...' : `Sign In as ${currentIndividual.title}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Gupta"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Register As Role
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                >
                  <option value="PATIENT">Patient (Self Health Records)</option>
                  <option value="DOCTOR">Doctor (Clinician Search & Review)</option>
                  <option value="HOSPITAL_ADMIN">Hospital Administrator</option>
                  <option value="SYSTEM_ADMIN">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@health.org"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Creating Account...' : 'Complete Sign Up'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* MHealth Style Caring Hands Banner (Referencing Uploaded Image) */}
        <div className="max-w-xl mx-auto bg-white/90 rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=300&q=80"
            alt="Caring hands"
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="text-xs">
            <h5 className="font-bold text-slate-900">
              Let's connect care & show support for our health
            </h5>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Role-based authorization and patient consent policies guarantee that sensitive diagnostic records are accessible exclusively by permitted healthcare professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Google Sign-In Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">Google Identity Provider</h4>
                  <p className="text-[11px] text-slate-500">Real-time OAuth Authentication</p>
                </div>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Active / Detected Google Account Card */}
              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    {googleName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{googleName}</div>
                    <div className="text-[11px] text-slate-500 font-mono truncate">{googleEmail}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomGoogleAccount(!isCustomGoogleAccount)}
                  className="text-[11px] text-teal-800 font-semibold underline shrink-0 hover:text-teal-900"
                >
                  {isCustomGoogleAccount ? 'Use Default' : 'Switch Account'}
                </button>
              </div>

              {/* Editable Real-Time Account Form */}
              {isCustomGoogleAccount && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Your Google Account Email
                    </label>
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="e.g. Dr. Ramesh Gupta or Arun Kumar"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Role Selection for Google Token Claims */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sign In As (Authorized Healthcare Role):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { role: 'DOCTOR' as const, label: 'Doctor (MD Clinician)', defaultName: 'Dr. Nivetha Selvadass, MD', defaultEmail: 'nivethaselvadassnivetha@gmail.com' },
                    { role: 'PATIENT' as const, label: 'Patient (Self Record)', defaultName: 'Nivetha Selvadass', defaultEmail: 'nivethaselvadassnivetha@gmail.com' },
                    { role: 'HOSPITAL_ADMIN' as const, label: 'Hospital Admin', defaultName: 'Marcus Vance', defaultEmail: 'marcus.vance@apexhospital.org' },
                    { role: 'SYSTEM_ADMIN' as const, label: 'System Admin', defaultName: 'Dr. Clara Chen', defaultEmail: 'clara.chen@mediintel.org' }
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        setGoogleRole(r.role);
                        if (!isCustomGoogleAccount) {
                          setGoogleName(r.defaultName);
                          setGoogleEmail(r.defaultEmail);
                        }
                      }}
                      className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
                        googleRole === r.role
                          ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-2xs font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{r.label}</span>
                        {googleRole === r.role && (
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant OAuth Authorize Button */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleExecuteGoogleSignIn(googleEmail, googleName, googleRole)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isLoading ? 'Verifying OAuth Claims...' : `Authorize as ${googleRole}`}</span>
              </button>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Direct OAuth2 Bearer Claims</span>
                <span>HIPAA-Compliant Session</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
