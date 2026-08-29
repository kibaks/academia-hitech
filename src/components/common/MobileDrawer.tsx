import React, { useState } from 'react';
import { UserRole, Center, UserProfile } from '../../types';
import { ROLE_DETAILS, hasPermission } from '../../lib/permissions';
import {
  X,
  Search,
  Flame,
  Zap,
  BookOpen,
  GraduationCap,
  Bot,
  Sparkles,
  Layers,
  Users,
  Building2,
  Trophy,
  ShieldCheck,
  Award,
  Globe2,
  LogIn,
  LogOut,
  User,
  ChevronRight,
  CheckCircle2,
  Sliders,
  MapPin,
  HelpCircle,
  FolderDown,
  ChevronDown
} from 'lucide-react';
import { Logo } from './Logo';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  centers: Center[];
  activeCenter: Center;
  onSelectCenter: (center: Center) => void;
  onSelectRole: (role: UserRole) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenCertVerifier: () => void;
  onOpenAuth: (mode: 'login' | 'register' | 'demo') => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  isAuthenticated,
  centers,
  activeCenter,
  onSelectCenter,
  onSelectRole,
  activeTab,
  onNavigate,
  onOpenCertVerifier,
  onOpenAuth,
  onLogout,
  searchQuery,
  onSearchChange,
}) => {
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showCenterSelector, setShowCenterSelector] = useState(false);

  if (!isOpen) return null;

  const isVisitor = !isAuthenticated || currentUser.role === 'visitor';
  const rolesOrder: UserRole[] = ['visitor', 'learner', 'trainer', 'center_admin', 'super_admin'];

  const handleLinkClick = (tabId: string) => {
    onNavigate(tabId);
    onClose();
  };

  return (
    <div id="mobile-nav-drawer-backdrop" className="fixed inset-0 z-50 flex justify-end md:hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer content sliding from the right */}
      <div
        id="mobile-drawer-panel"
        className="relative w-[88vw] max-w-sm h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250 ease-out overflow-hidden"
      >
        {/* TOP BAR: Logo & Close Button */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div
            onClick={() => {
              handleLinkClick(isVisitor ? 'home' : 'catalog');
            }}
            className="cursor-pointer"
          >
            <Logo size="sm" showTagline={false} />
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SCROLLABLE DRAWER BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* 1. USER IDENTITY CARD OR VISITOR CALLOUT */}
          {!isVisitor ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-purple-50/70 border border-indigo-100 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-sm text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-2xs">
                      {ROLE_DETAILS[currentUser.role]?.badgeLabel || currentUser.role}
                    </span>
                    <span className="text-[11px] text-indigo-700 font-semibold truncate flex items-center gap-1">
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{activeCenter.city}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Gamification Stats for Learner */}
              {currentUser.role === 'learner' && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-100/80">
                  <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/80 border border-indigo-100 text-xs font-bold text-slate-800">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
                    <span>{currentUser.streakDays || 0} jours conséc.</span>
                  </div>
                  <div
                    onClick={() => handleLinkClick('gamification')}
                    className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/80 border border-indigo-100 text-xs font-extrabold text-indigo-700 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                    <span>{currentUser.xp || 0} XP (Nv.{currentUser.level || 1})</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Mode Visiteur</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Non connecté
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Connectez-vous pour accéder à vos cours certifiants et à votre espace personnalisé.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    onClose();
                  }}
                  className="py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-300 shadow-2xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Connexion</span>
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('demo');
                    onClose();
                  }}
                  className="py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Démo 1-Clic</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. SEARCH BAR */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher formations, compétences..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* 3. SWITCH RÔLE & CAMPUS (ACCORDIONS) */}
          <div className="space-y-2">
            {/* Role Switcher */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Profil & Rôle ({ROLE_DETAILS[currentUser.role]?.title || currentUser.role})</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    showRoleSelector ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showRoleSelector && (
                <div className="p-2 border-t border-slate-200 space-y-1 bg-white">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Changer de rôle (Démo) :
                  </div>
                  {rolesOrder.map((r) => {
                    const info = ROLE_DETAILS[r];
                    const isCurrent = currentUser.role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          onSelectRole(r);
                          setShowRoleSelector(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                          isCurrent
                            ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isCurrent ? 'bg-indigo-600' : 'bg-slate-300'
                            }`}
                          />
                          <span>{info.title}</span>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-indigo-600">Actif</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Campus Selector */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => setShowCenterSelector(!showCenterSelector)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Campus : {activeCenter.name}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    showCenterSelector ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showCenterSelector && (
                <div className="p-2 border-t border-slate-200 space-y-1 bg-white max-h-48 overflow-y-auto">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Sélectionner un campus :
                  </div>
                  {centers.map((c) => {
                    const isSelected = activeCenter.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectCenter(c);
                          setShowCenterSelector(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">{c.name}</div>
                          <div className="text-[10px] text-slate-500">{c.city} • {c.country}</div>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-600 ml-1">Choisi</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 4. PRIMARY NAVIGATION SECTION */}
          <div className="space-y-1">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
              Navigation Principale
            </div>

            {/* General Home & Catalog */}
            <button
              onClick={() => handleLinkClick('home')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'home'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe2 className="w-4 h-4" />
                <span>Accueil du Site</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => handleLinkClick('catalog')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Catalogue & Formations</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            {/* Learner specific links */}
            {currentUser.role === 'learner' && (
              <>
                <button
                  onClick={() => handleLinkClick('learner-journey')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'learner-journey'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-amber-500" />
                    <span>Mon Parcours & Jalons</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                    Nv.{currentUser.level || 1}
                  </span>
                </button>

                <button
                  onClick={() => handleLinkClick('my-learning')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'my-learning'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>Mes Formations en Cours</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-900 font-bold">
                    {currentUser.enrolledCourseIds?.length || 0}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* 5. PEDAGOGICAL & PRO TOOLS (ROLE GUARDED) */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
              Outils Pédagogiques & IA
            </div>

            {hasPermission(currentUser.role, 'create_and_publish_course') && (
              <button
                onClick={() => handleLinkClick('course-builder')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'course-builder'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Créateur MasterStudy & Elementor</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-black">
                  LMS
                </span>
              </button>
            )}

            {hasPermission(currentUser.role, 'access_ai_studio') && (
              <button
                onClick={() => handleLinkClick('studio')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'studio'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Studio IA Pédagogique (Gemini)</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                  IA
                </span>
              </button>
            )}

            {hasPermission(currentUser.role, 'view_center_analytics') && (
              <button
                onClick={() => handleLinkClick('progress-tracker')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'progress-tracker'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span>Suivi & Notes des Apprenants</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            )}

            {hasPermission(currentUser.role, 'manage_trainers') && (
              <button
                onClick={() => handleLinkClick('center-management')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'center-management'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Direction & Gestion du Campus</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            )}

            {(currentUser.role === 'super_admin' || currentUser.role === 'center_admin') && (
              <button
                onClick={() => handleLinkClick('centers')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'centers'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Réseau Multi-Campus ITECH</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            )}

            <button
              onClick={() => handleLinkClick('tuteur')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'tuteur'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>Tuteur Intelligent AIDA (24/7)</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                WhatsApp
              </span>
            </button>
          </div>

          {/* 6. PERSONAL SPACE & CERTIFICATION */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
              Mon Espace & Certifications
            </div>

            {!isVisitor && (
              <>
                <button
                  onClick={() => handleLinkClick('profile')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Profil & Mur Social (Style FB)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </button>

                <button
                  onClick={() => handleLinkClick('gamification')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'gamification'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Badges, Succès & Récompenses</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700">
                    {currentUser.xp || 0} XP
                  </span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                onOpenCertVerifier();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Vérificateur de Diplôme (QR Code)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => handleLinkClick('permissions')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'permissions'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Matrice des Permissions (RBAC)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/90 shrink-0">
          {!isVisitor ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 border border-rose-200 transition-colors shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Se Déconnecter ({currentUser.name})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth('demo');
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Explorer la Plateforme (Démo 1-Clic)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
