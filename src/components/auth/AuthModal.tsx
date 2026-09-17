import React, { useState } from 'react';
import { UserProfile, UserRole, Center } from '../../types';
import { DEMO_PROFILES } from '../../data/initialData';
import { getEffectiveProfile, setStoredUserProfileLocally, setStoredActiveUserId } from '../../lib/firebase';
import {
  X,
  Lock,
  Mail,
  User,
  Building2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Camera,
  UploadCloud
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'demo';
  defaultRole?: UserRole;
  centers: Center[];
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  defaultRole = 'learner',
  centers,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'demo'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [registerStep, setRegisterStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [selectedCenterId, setSelectedCenterId] = useState(centers[0]?.id || 'center-1');
  const [registeredAvatar, setRegisteredAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
  const avatarFileInputRef = React.useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check if matching demo profile or create custom session
    const matchedProfile = DEMO_PROFILES.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());

    if (matchedProfile) {
      const effective = getEffectiveProfile(matchedProfile);
      setStoredActiveUserId(effective.id);
      setSuccessMessage(`Bienvenue, ${effective.name} !`);
      setTimeout(() => {
        onLoginSuccess(effective);
        onClose();
      }, 500);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    // Default dynamic user creation
    const dynamicUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'learner',
      centerId: selectedCenterId,
      centerName: centers.find((c) => c.id === selectedCenterId)?.name || 'ITECH Campus Paris',
      xp: 100,
      level: 1,
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      enrolledCourseIds: ['course-ia-llm'],
      completedLessonIds: [],
      unlockedBadgeIds: ['badge-1'],
      earnedCertificates: [],
    };

    setStoredUserProfileLocally(dynamicUser);
    setStoredActiveUserId(dynamicUser.id);
    setSuccessMessage('Connexion réussie !');
    setTimeout(() => {
      onLoginSuccess(dynamicUser);
      onClose();
    }, 500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const assignedCenter = centers.find((c) => c.id === selectedCenterId) || centers[0];

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: fullName,
      email: email,
      avatar: registeredAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: selectedRole === 'visitor' ? 'learner' : selectedRole,
      centerId: assignedCenter.id,
      centerName: assignedCenter.name,
      xp: selectedRole === 'trainer' ? 1500 : 50,
      level: 1,
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      enrolledCourseIds: ['course-ia-llm'],
      completedLessonIds: [],
      unlockedBadgeIds: ['badge-1'],
      earnedCertificates: [],
    };

    setStoredUserProfileLocally(newUser);
    setStoredActiveUserId(newUser.id);
    setSuccessMessage('Votre compte a été créé avec succès !');
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 500);
  };

  const handleSelectDemoProfile = (profile: UserProfile) => {
    const effective = getEffectiveProfile(profile);
    setStoredActiveUserId(effective.id);
    setSuccessMessage(`Connexion instantanée en tant que ${effective.name} (${effective.role})`);
    setTimeout(() => {
      onLoginSuccess(effective);
      onClose();
    }, 300);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {mode === 'login' && 'Connexion à Academia ITECH'}
            {mode === 'register' && 'Créer un Compte Certifiant'}
            {mode === 'demo' && 'Comptes Démo en 1 Clic'}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Accédez à vos formations, votre tuteur IA AIDA, vos certificats ou à votre studio formateur.
          </p>
        </div>

        {/* Tab Switcher (Connexion / Inscription / Comptes Démo) */}
        <div className="flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inscription
          </button>
          <button
            onClick={() => {
              setMode('demo');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              mode === 'demo' ? 'bg-indigo-600 text-white shadow-xs' : 'text-indigo-700 hover:text-indigo-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Démo Rapide</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Adresse Email :</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Mot de passe :</label>
                <button
                  type="button"
                  onClick={() => alert('Veuillez utiliser un compte démo en 1 clic pour tester immédiatement.')}
                  className="text-[11px] text-indigo-600 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Se Connecter</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Helper to switch to Demo Tab */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setMode('demo')}
                className="text-xs text-slate-500 hover:text-indigo-600 font-medium inline-flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Tester instantanément avec les comptes rôles préconfigurés</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Stepper Indicator */}
            <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setRegisterStep(1)}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  registerStep === 1
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  registerStep === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  1
                </span>
                <span>1. Identité</span>
              </button>

              <div className="w-4 h-0.5 bg-slate-300 mx-1 shrink-0" />

              <button
                type="button"
                onClick={() => {
                  if (!fullName.trim() || !email.trim() || !password.trim()) {
                    setErrorMessage('Veuillez remplir vos identifiants avant de continuer.');
                    return;
                  }
                  setErrorMessage('');
                  setRegisterStep(2);
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  registerStep === 2
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  registerStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  2
                </span>
                <span>2. Rôle & Campus</span>
              </button>
            </div>

            {/* STEP 1: IDENTITÉ */}
            {registerStep === 1 && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Nom complet :</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex : Amina Diallo"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Adresse Email :</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@domaine.com"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Mot de passe :</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 caractères"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!fullName.trim() || !email.trim() || !password.trim()) {
                      setErrorMessage('Veuillez remplir vos identifiants avant de continuer.');
                      return;
                    }
                    setErrorMessage('');
                    setRegisterStep(2);
                  }}
                  className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Étape suivante (Rôle & Campus)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: RÔLE ET CAMPUS */}
            {registerStep === 2 && (
              <div className="space-y-3 animate-in fade-in duration-150">
                {/* Role Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Rôle souhaité sur la plateforme :</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { r: 'learner' as UserRole, label: 'Apprenant', icon: GraduationCap },
                      { r: 'trainer' as UserRole, label: 'Formateur', icon: Sparkles },
                      { r: 'center_admin' as UserRole, label: 'Directeur', icon: Building2 },
                    ].map(({ r, label, icon: Icon }) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setSelectedRole(r)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedRole === r
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 mx-auto mb-1" />
                        <div className="text-xs">{label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Center Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Campus / Centre d’affiliation :</label>
                  <select
                    value={selectedCenterId}
                    onChange={(e) => setSelectedCenterId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    {centers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Photo de Profil / Avatar Upload */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={registeredAvatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200 shrink-0"
                    />
                    <div className="min-w-0 text-xs">
                      <span className="font-bold text-slate-800 block">Photo de profil</span>
                      <span className="text-[10px] text-slate-500">Optionnelle (depuis votre appareil)</span>
                    </div>
                  </div>
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setRegisteredAvatar(ev.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Charger</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setRegisterStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Retour</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Créer mon Compte</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* TAB 3: 1-CLICK DEMO PROFILES */}
        {mode === 'demo' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-900 leading-relaxed">
              💡 <strong>Accès instantané :</strong> Choisissez un profil ci-dessous pour tester immédiatement les permissions et vues associées à chaque rôle.
            </div>

            <div className="space-y-2.5">
              {DEMO_PROFILES.map((profile) => {
                const roleColors: Record<UserRole, string> = {
                  visitor: 'border-slate-200',
                  learner: 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50',
                  trainer: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50',
                  center_admin: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50',
                  super_admin: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50',
                };

                const roleBadge: Record<UserRole, { label: string; style: string }> = {
                  visitor: { label: 'Visiteur', style: 'bg-slate-100 text-slate-700' },
                  learner: { label: 'Apprenant', style: 'bg-indigo-100 text-indigo-700' },
                  trainer: { label: 'Formateur IA', style: 'bg-emerald-100 text-emerald-800' },
                  center_admin: { label: 'Directeur Centre', style: 'bg-blue-100 text-blue-800' },
                  super_admin: { label: 'Super Admin', style: 'bg-amber-100 text-amber-900 font-bold' },
                };

                return (
                  <button
                    key={profile.id}
                    onClick={() => handleSelectDemoProfile(profile)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      roleColors[profile.role]
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{profile.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleBadge[profile.role].style}`}>
                            {roleBadge[profile.role].label}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {profile.email}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                        <span>Choisir</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[10px] text-slate-400">{profile.xp} XP</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
