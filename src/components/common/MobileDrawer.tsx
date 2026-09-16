import React, { useState } from 'react';
import { UserRole, Center, UserProfile } from '../../types';
import { ROLE_DETAILS, hasPermission } from '../../lib/permissions';
import { useCurrency } from '../../context/CurrencyContext';
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
  ChevronDown,
  Coins,
  Settings,
  Download,
  FileText,
  Loader2,
} from 'lucide-react';
import { Logo } from './Logo';
import { generateUserGuidePDF } from '../../lib/pdfGuideGenerator';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  centers: Center[];
  activeCenter: Center;
  onSelectCenter: (center: Center) => void;
  onSelectRole?: (role: UserRole) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenCertVerifier: () => void;
  onOpenUserGuide?: () => void;
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
  activeTab,
  onNavigate,
  onOpenCertVerifier,
  onOpenUserGuide,
  onOpenAuth,
  onLogout,
  searchQuery,
  onSearchChange,
}) => {
  const [showCenterSelector, setShowCenterSelector] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const { currencyCode, currencyInfo, setCurrencyCode, availableCurrencies } = useCurrency();

  const handleMobileDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await generateUserGuidePDF();
      onClose();
    } catch (err) {
      console.error('Erreur lors de la génération du PDF:', err);
      window.open('/api/documentation/html', '_blank');
      onClose();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  if (!isOpen) return null;

  const isVisitor = !isAuthenticated || currentUser.role === 'visitor';

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
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50/90 to-blue-50/70 border border-sky-100 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                  }}
                  className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-sm text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-600 text-white shadow-2xs shrink-0">
                      {ROLE_DETAILS[currentUser.role]?.badgeLabel || currentUser.role}
                    </span>
                    <span className="text-[11px] text-sky-700 font-semibold truncate flex items-center gap-1 min-w-0">
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{activeCenter.city}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Gamification Stats for Learner */}
              {currentUser.role === 'learner' && (
                <div className="pt-2 border-t border-sky-100/80">
                  <div
                    onClick={() => handleLinkClick('gamification')}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-sky-100 text-xs font-extrabold text-sky-700 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                      <span>{currentUser.xp || 0} XP</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">Niveau {currentUser.level || 1}</span>
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
              <p className="text-xs text-slate-500 leading-relaxed">
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
                  <LogIn className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="truncate">Connexion</span>
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('demo');
                    onClose();
                  }}
                  className="py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span className="truncate">Démo 1-Clic</span>
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
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
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

          {/* 3. CAMPUS (ACCORDION) */}
          <div className="space-y-2">
            {/* Campus Selector */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => setShowCenterSelector(!showCenterSelector)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                  <span className="truncate">Campus : {activeCenter?.name || 'Academia ITECH'}</span>
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
                    const isSelected = activeCenter?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectCenter(c);
                          setShowCenterSelector(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-sky-50 text-sky-900 font-bold border border-sky-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold">{c.name}</div>
                          <div className="text-[10px] text-slate-500">{c.city} • {c.country}</div>
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-sky-600 ml-1">Choisi</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Currency Selector Accordion */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
              <button
                type="button"
                onClick={() => setShowCurrencySelector(!showCurrencySelector)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-100/80 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <Coins className="w-4 h-4 text-sky-500 shrink-0" />
                  <span className="truncate">Devise : {currencyInfo?.flag || '💵'} {currencyInfo?.name || 'Devise'} ({currencyInfo?.code || 'USD'})</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    showCurrencySelector ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showCurrencySelector && (
                <div className="p-2 border-t border-slate-200 space-y-1 bg-white max-h-52 overflow-y-auto">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                    <span>Devise & Monnaie locale :</span>
                  </div>
                  {availableCurrencies.map((curr) => {
                    const isSelected = curr.code === currencyCode;
                    return (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setCurrencyCode(curr.code);
                          setShowCurrencySelector(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-sky-50 text-sky-950 font-bold border border-sky-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{curr.flag}</span>
                          <div>
                            <div className="font-semibold text-slate-900">{curr.name}</div>
                            <div className="text-[10px] text-slate-500">{curr.country}</div>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-sky-600 bg-sky-100/60 px-1.5 py-0.5 rounded-md">
                          {curr.symbol}
                        </span>
                      </button>
                    );
                  })}

                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleLinkClick('admin-currency')}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold text-sky-600 hover:bg-sky-50 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Gérer les conversions (Admin)</span>
                    </button>
                  </div>
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
                  ? 'bg-sky-500 text-white shadow-xs'
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
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Catalogue & Formations</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            {/* Tuteur IA Link */}
            <button
              onClick={() => handleLinkClick('tuteur')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'tuteur'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-sky-500" />
                <span>Tuteur Intelligent AIDA (24/7)</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                WhatsApp
              </span>
            </button>
          </div>

          {/* 5. PEDAGOGICAL & PRO TOOLS (ROLE GUARDED - Trainers & Directors only) */}
          {(hasPermission(currentUser.role, 'create_and_publish_course') ||
            hasPermission(currentUser.role, 'access_ai_studio') ||
            hasPermission(currentUser.role, 'view_center_analytics') ||
            hasPermission(currentUser.role, 'manage_trainers')) && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2">
                Espace Formateur & Administration
              </div>

              {hasPermission(currentUser.role, 'create_and_publish_course') && (
                <button
                  onClick={() => handleLinkClick('course-builder')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'course-builder'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">Plan & Création de Cours</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-black shrink-0">
                    Mind Map
                  </span>
                </button>
              )}

              {hasPermission(currentUser.role, 'access_ai_studio') && (
                <button
                  onClick={() => handleLinkClick('studio')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'studio'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
                    <span className="truncate">Studio IA Pédagogique (Gemini)</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold shrink-0">
                    IA
                  </span>
                </button>
              )}

              {hasPermission(currentUser.role, 'view_center_analytics') && (
                <button
                  onClick={() => handleLinkClick('progress-tracker')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'progress-tracker'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Users className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="truncate">Suivi & Notes des Apprenants</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>
              )}

              {hasPermission(currentUser.role, 'manage_trainers') && (
                <button
                  onClick={() => handleLinkClick('center-management')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'center-management'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="truncate">Direction & Gestion du Campus</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                </button>
              )}
            </div>
          )}

          {(currentUser.role === 'super_admin' || currentUser.role === 'center_admin') && (
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleLinkClick('centers')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'centers'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="truncate">Réseau Multi-Campus ITECH</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
              </button>
            </div>
          )}

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
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <User className="w-4 h-4 text-sky-500 shrink-0" />
                    <span className="truncate">Mon Profil & Formations</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold shrink-0">
                    {currentUser.enrolledCourseIds?.length || 0} Cours
                  </span>
                </button>

                <button
                  onClick={() => handleLinkClick('learner-journey')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'learner-journey'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GraduationCap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">Mon Parcours Pédagogique</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold shrink-0">
                    Nv.{currentUser.level || 1}
                  </span>
                </button>

                <button
                  onClick={() => handleLinkClick('gamification')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                    activeTab === 'gamification'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate">Badges, Succès & Récompenses</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 shrink-0">
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
              <div className="flex items-center gap-2.5 min-w-0">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">Vérificateur de Diplôme (QR Code)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
            </button>

            <button
              onClick={() => handleLinkClick('permissions')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'permissions'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="truncate">Matrice des Permissions (RBAC)</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
            </button>

            {/* Dedicated User Guide & PDF Download Banner in Mobile Drawer */}
            <div className="p-3 my-2 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-sky-950 truncate">Manuel & Guide Utilisateur</div>
                  <div className="text-[10px] text-sky-700">Guide illustré A4 • 14 scénarios</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  id="mobile-drawer-open-guide-btn"
                  onClick={() => {
                    if (onOpenUserGuide) onOpenUserGuide();
                    onClose();
                  }}
                  className="py-2 px-2 rounded-xl bg-white border border-sky-300 text-sky-800 text-[11px] font-bold text-center hover:bg-sky-50 transition-colors flex items-center justify-center gap-1 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Consulter</span>
                </button>
                <button
                  id="mobile-drawer-download-pdf-btn"
                  onClick={handleMobileDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="py-2 px-2 rounded-xl bg-sky-600 text-white text-[11px] font-bold text-center hover:bg-sky-500 disabled:opacity-60 transition-colors flex items-center justify-center gap-1 shadow-xs active:scale-95"
                >
                  {isDownloadingPdf ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                      <span>Génération...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 shrink-0" />
                      <span>Télécharger PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
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
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="truncate">Se Déconnecter ({currentUser?.name || ''})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth('demo');
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="truncate">Explorer la Plateforme (Démo 1-Clic)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
