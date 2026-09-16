import React, { useState } from 'react';
import { Logo } from './Logo';
import { UserRole, Center, UserProfile } from '../../types';
import { ROLE_DETAILS } from '../../lib/permissions';
import { useCurrency } from '../../context/CurrencyContext';
import {
  Search,
  Zap,
  Bell,
  Sparkles,
  BookOpen,
  Bot,
  Trophy,
  ChevronDown,
  Menu,
  Award,
  LogIn,
  LogOut,
  User,
  GraduationCap,
  Building2,
  Coins,
  Settings,
  ShieldCheck,
  Layers,
  FileText,
  Download,
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  centers: Center[];
  activeCenter: Center;
  onSelectCenter: (center: Center) => void;
  onSelectRole: (role: UserRole) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenCertVerifier: () => void;
  onOpenUserGuide?: () => void;
  onOpenAuth: (mode: 'login' | 'register' | 'demo') => void;
  onLogout: () => void;
  onOpenDrawer?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  isAuthenticated,
  centers,
  activeCenter,
  onSelectCenter,
  onSelectRole,
  activeTab,
  onNavigate,
  onOpenCertVerifier,
  onOpenUserGuide,
  onOpenAuth,
  onLogout,
  onOpenDrawer,
  searchQuery,
  onSearchChange,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const { currencyCode, currencyInfo, setCurrencyCode, availableCurrencies } = useCurrency();

  const isVisitor = !isAuthenticated || currentUser.role === 'visitor';

  // Navigation épurée : Uniquement Catalogue et Tuteur IA pour TOUS les profils
  const navItems: NavItem[] = [
    {
      id: 'catalog',
      label: 'Catalogue',
      shortLabel: 'Catalogue',
      icon: BookOpen,
    },
    {
      id: 'tuteur',
      label: 'Tuteur IA',
      shortLabel: 'Tuteur IA',
      icon: Bot,
      badge: 'AIDA',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  const closeAllMenus = () => {
    setShowUserMenu(false);
    setShowNotifications(false);
    setShowCurrencyMenu(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs transition-all select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* 1. Left: Logo & Campus */}
          <div
            onClick={() => {
              onNavigate(isVisitor ? 'home' : 'catalog');
              closeAllMenus();
            }}
            className="flex-shrink-0 cursor-pointer min-w-0 max-w-[220px] sm:max-w-none"
          >
            <Logo size="sm" showTagline={false} centerName={currentUser.role !== 'visitor' ? activeCenter.name : undefined} />
          </div>

          {/* 2. Center: STRICT NAVIGATION TABS (Only Catalogue & Tuteur IA across ALL profiles) */}
          <nav className="hidden sm:flex items-center gap-1.5 md:gap-2 flex-shrink-0 whitespace-nowrap">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCurrent = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    closeAllMenus();
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                    isCurrent
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-sky-600'}`} />
                  <span>{item.shortLabel || item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold uppercase ${
                        isCurrent
                          ? 'bg-white/25 text-white'
                          : item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Search Bar */}
          <div className="hidden lg:flex items-center w-36 xl:w-52 relative shrink">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-header-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher formations..."
              className="w-full pl-7 pr-3 py-1.5 text-xs bg-slate-100/90 text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/80 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* 4. Right: Currency, Notifications & User Menu (No Profile Switcher) */}
          <div className="flex items-center gap-2">
            {/* Configurable Multi-Currency Switcher */}
            <div className="relative">
              <button
                id="currency-switcher-toggle"
                onClick={() => {
                  setShowCurrencyMenu(!showCurrencyMenu);
                  setShowUserMenu(false);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80 shadow-2xs transition-all active:scale-95"
                title={`Devise active : ${currencyInfo.name} (${currencyInfo.symbol})`}
              >
                <span className="text-sm">{currencyInfo.flag}</span>
                <span className="font-mono text-xs">{currencyInfo.code}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showCurrencyMenu && (
                <div
                  id="currency-switcher-dropdown"
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Devise & Monnaie :</span>
                    <Coins className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                  <div className="mt-1 space-y-1 max-h-64 overflow-y-auto">
                    {availableCurrencies.map((curr) => {
                      const isSelected = curr.code === currencyCode;
                      return (
                        <button
                          key={curr.code}
                          id={`currency-option-${curr.code}`}
                          onClick={() => {
                            setCurrencyCode(curr.code);
                            setShowCurrencyMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                            isSelected
                              ? 'bg-sky-50 text-sky-950 font-bold border border-sky-200'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{curr.flag}</span>
                            <div>
                              <div className="text-xs font-bold text-slate-900 leading-tight">
                                {curr.name}
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium">
                                {curr.country}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-sky-600 bg-sky-100/60 px-1.5 py-0.5 rounded-md">
                            {curr.symbol}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 mt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setShowCurrencyMenu(false);
                        onNavigate('admin-currency');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Paramétrage des Taux (Admin)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Diploma Verifier for Visitor */}
            {isVisitor && (
              <button
                id="verify-diploma-btn"
                onClick={onOpenCertVerifier}
                title="Vérifier l'authenticité d'un diplôme officiel"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden xl:inline">Vérifier Diplôme</span>
              </button>
            )}

            {/* Quick Guide Utilisateur PDF Button (Mobile & Desktop) */}
            {onOpenUserGuide && (
              <button
                id="open-user-guide-btn"
                onClick={onOpenUserGuide}
                title="Manuel Utilisateur & Téléchargement Guide PDF"
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors shrink-0 active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="hidden xs:inline text-[11px] sm:text-xs">Guide PDF</span>
                <span className="xs:hidden text-[10px]">Guide</span>
              </button>
            )}

            {/* IF VISITOR / NOT AUTHENTICATED */}
            {isVisitor ? (
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-600 hover:bg-sky-50 border border-slate-200 transition-all flex items-center gap-1 whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span className="hidden xs:inline">Connexion</span>
                </button>
                <button
                  onClick={() => onOpenAuth('demo')}
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-xs shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-1 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>Démo 1-Clic</span>
                </button>
              </div>
            ) : (
              /* AUTHENTICATED USER WIDGETS */
              <>
                {/* Learner XP (Only for learners) */}
                {currentUser.role === 'learner' && (
                  <div className="hidden sm:flex items-center gap-1.5">
                    <div
                      onClick={() => onNavigate('gamification')}
                      title={`Niveau ${currentUser.level} - Cliquez pour voir les récompenses`}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-extrabold cursor-pointer hover:bg-sky-100 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{currentUser.xp} XP</span>
                    </div>
                  </div>
                )}

                {/* Notifications Bell */}
                <div className="relative hidden md:block">
                  <button
                    id="notifications-toggle"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="w-2 h-2 rounded-full bg-sky-500 absolute top-1 right-1 ring-2 ring-white" />
                  </button>

                  {showNotifications && (
                    <div
                      id="notifications-dropdown"
                      className="absolute right-0 mt-2 w-76 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900">Notifications</span>
                        <span className="text-[10px] text-sky-600 font-semibold cursor-pointer">Tout lire</span>
                      </div>
                      <div className="mt-2 space-y-1.5 text-xs">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="font-semibold text-sky-700 text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-sky-600" />
                            Session Prête
                          </div>
                          <p className="text-slate-600 text-[11px]">Votre module interactif est disponible.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar Menu */}
                <div className="relative hidden md:block">
                  <button
                    id="header-user-menu-button"
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-50 hover:bg-sky-50/60 border border-slate-200/90 hover:border-sky-300 transition-all cursor-pointer shadow-2xs group shrink-0"
                    title={`Connecté en tant que ${currentUser.name}`}
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-2xs shrink-0"
                    />
                    <div className="text-left hidden lg:block min-w-0 pr-1 max-w-[130px] xl:max-w-[160px]">
                      <div className="text-xs font-black text-slate-900 leading-tight truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-sky-700 font-bold leading-tight truncate">
                        {ROLE_DETAILS[currentUser.role]?.badgeLabel || currentUser.role}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform shrink-0" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100 max-h-[85vh] overflow-y-auto">
                      {/* 1. User Identity Header */}
                      <div className="p-3 bg-gradient-to-br from-sky-50 to-slate-50 border border-sky-100/70 rounded-xl">
                        <div className="flex items-center gap-3">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-black text-slate-950 truncate tracking-tight">{currentUser.name}</div>
                            <div className="text-xs text-slate-600 truncate font-semibold">{currentUser.email}</div>
                            <div className="text-[11px] text-sky-800 font-bold mt-0.5 flex items-center gap-1 truncate">
                              <Building2 className="w-3.5 h-3.5 shrink-0 text-sky-600" />
                              <span className="truncate">{currentUser.centerName || 'Campus Central ITECH'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Role & XP Badge */}
                        <div className="mt-2.5 flex items-center gap-1.5 p-1.5 rounded-xl bg-white border border-slate-200/80 text-[11px] shadow-2xs">
                          <span className="px-2 py-0.5 rounded-md bg-sky-50 font-extrabold text-sky-800 border border-sky-200/80">
                            {ROLE_DETAILS[currentUser.role]?.title || 'Utilisateur'}
                          </span>
                          {currentUser.role === 'learner' && (
                            <span className="text-amber-800 font-bold ml-auto flex items-center gap-0.5">
                              <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {currentUser.xp || 0} XP (Nv.{currentUser.level || 1})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 2. User Links */}
                      <div className="py-2 space-y-1 text-xs">
                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-sky-50 hover:text-sky-900 text-left font-semibold group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-sky-700">Mon Profil</div>
                              <div className="text-[10px] text-slate-500">Mur, couverture, photo et paramètres</div>
                            </div>
                          </div>
                        </button>

                        {/* Direct Role View Shortcuts */}
                        {currentUser.role === 'learner' && (
                          <button
                            onClick={() => {
                              onNavigate('learner-journey');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-sky-50 text-left font-medium group transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-800 group-hover:text-sky-600">Parcours Apprenant</div>
                                <div className="text-[10px] text-slate-400">Progression, XP et jalons</div>
                              </div>
                            </div>
                          </button>
                        )}

                        {currentUser.role === 'trainer' && (
                          <button
                            onClick={() => {
                              onNavigate('course-builder');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-sky-50 text-left font-medium group transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-800 group-hover:text-sky-600">Studio Formateur</div>
                                <div className="text-[10px] text-slate-400">Création et publication de cours</div>
                              </div>
                            </div>
                          </button>
                        )}

                        {(currentUser.role === 'center_admin' || currentUser.role === 'super_admin') && (
                          <button
                            onClick={() => {
                              onNavigate('center-management');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-sky-50 text-left font-medium group transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-800 group-hover:text-sky-600">Direction de Centre</div>
                                <div className="text-[10px] text-slate-400">Administration et formateurs</div>
                              </div>
                            </div>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onNavigate('catalog');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-sky-50 text-left font-medium group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 group-hover:text-sky-600">Catalogue des Cours</div>
                              <div className="text-[10px] text-slate-400">Explorer toutes les formations</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('tuteur');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-sky-50 text-left font-medium group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                              <Bot className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 group-hover:text-sky-600">Tuteur IA AIDA</div>
                              <div className="text-[10px] text-slate-400">Assistance pédagogique 24/7</div>
                            </div>
                          </div>
                        </button>

                        {onOpenUserGuide && (
                          <button
                            onClick={() => {
                              onOpenUserGuide();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-sky-50 text-left font-medium group transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-800 group-hover:text-sky-600">Manuel Utilisateur (PDF)</div>
                                <div className="text-[10px] text-slate-400">Documentation & guide A4 complet</div>
                              </div>
                            </div>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onOpenCertVerifier();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-sky-50 text-left font-medium group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                              <Award className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 group-hover:text-sky-600">Vérificateur de Diplômes</div>
                              <div className="text-[10px] text-slate-400">Authentification QR & Blockchain</div>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* 3. Section: Déconnexion */}
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            onLogout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-left font-semibold transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Se Déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile Menu Hamburger / Drawer Trigger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => {
                if (onOpenDrawer) {
                  onOpenDrawer();
                }
              }}
              aria-label="Ouvrir le menu latéral"
              title="Menu latéral"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100/90 text-slate-700 hover:text-sky-600 hover:bg-sky-50 border border-slate-200/80 md:hidden transition-all active:scale-95 shrink-0"
            >
              <Menu className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
