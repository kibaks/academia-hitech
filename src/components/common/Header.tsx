import React, { useState } from 'react';
import { Logo } from './Logo';
import { UserRole, Center, UserProfile } from '../../types';
import { ROLE_DETAILS, hasPermission } from '../../lib/permissions';
import {
  Search,
  Flame,
  Zap,
  Bell,
  Sparkles,
  BookOpen,
  Wand2,
  Bot,
  Trophy,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  GraduationCap,
  ChevronDown,
  Menu,
  X,
  Award,
  Globe2,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Sliders,
  CheckCircle2,
  PlayCircle,
  Layers,
  Users
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
  requiredPermission?: Parameters<typeof hasPermission>[1];
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
  onOpenAuth,
  onLogout,
  onOpenDrawer,
  searchQuery,
  onSearchChange,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isVisitor = !isAuthenticated || currentUser.role === 'visitor';
  const rolesOrder: UserRole[] = ['visitor', 'learner', 'trainer', 'center_admin', 'super_admin'];

  // STRICT ROLE-BASED NAVIGATION ITEMS DEFINITION (Fitted to container)
  const getNavItemsForRole = (role: UserRole): NavItem[] => {
    switch (role) {
      case 'visitor':
        return [
          { id: 'home', label: 'Accueil', shortLabel: 'Accueil', icon: Globe2 },
          { id: 'catalog', label: 'Formations & Catalogue', shortLabel: 'Catalogue', icon: BookOpen },
        ];

      case 'learner':
        // Core learner actions in navbar: Catalogue, Mon Parcours, Mes Formations, Tuteur AIDA
        // (Profil Facebook, Badges & XP, Permissions are in Profile dropdown)
        return [
          { id: 'catalog', label: 'Catalogue de Cours', shortLabel: 'Catalogue', icon: BookOpen },
          { id: 'learner-journey', label: 'Mon Parcours', shortLabel: 'Mon Parcours', icon: GraduationCap, badge: `Nv.${currentUser.level}`, badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'my-learning', label: 'Mes Formations', shortLabel: 'Mes Formations', icon: BookOpen, badge: `${currentUser.earnedCertificates.length > 0 ? currentUser.earnedCertificates.length : ''}` },
          { id: 'tuteur', label: 'Tuteur AIDA', shortLabel: 'Tuteur IA', icon: Bot, badge: 'WhatsApp', badgeColor: 'bg-emerald-100 text-emerald-800' },
        ];

      case 'trainer':
        // Core trainer actions in navbar: Créer Cours, Suivi Apprenants, Studio IA, Catalogue
        // (Profil, Tuteur, Analytiques, Permissions are in Profile dropdown)
        return [
          { id: 'course-builder', label: 'Plan & Création de Cours', shortLabel: 'Créer Cours', icon: Layers, badge: 'Nano Banana', badgeColor: 'bg-amber-100 text-amber-900' },
          { id: 'progress-tracker', label: 'Suivi des Apprenants', shortLabel: 'Suivi Apprenants', icon: Users, badge: 'Temps Réel', badgeColor: 'bg-emerald-100 text-emerald-800' },
          { id: 'studio', label: 'Studio IA Pédagogique', shortLabel: 'Studio IA', icon: Sparkles },
          { id: 'catalog', label: 'Catalogue', shortLabel: 'Catalogue', icon: BookOpen },
        ];

      case 'center_admin':
        // Core center admin actions in navbar: Mon Centre, Suivi Apprenants, Créer Cours, Catalogue
        // (Profil, Studio IA, Multi-Campus, Matrice RBAC are in Profile dropdown)
        return [
          { id: 'center-management', label: 'Gestion du Centre', shortLabel: 'Mon Centre', icon: Building2, badge: 'Directeur', badgeColor: 'bg-blue-100 text-blue-800' },
          { id: 'progress-tracker', label: 'Suivi des Apprenants', shortLabel: 'Suivi Apprenants', icon: Users },
          { id: 'course-builder', label: 'Création de Cours', shortLabel: 'Créer Cours', icon: Layers },
          { id: 'catalog', label: 'Catalogue', shortLabel: 'Catalogue', icon: BookOpen },
        ];

      case 'super_admin':
        // Core super admin actions in navbar: Direction, Réseau Multi-Campus, Suivi, Créer Cours
        // (Profil, Matrice RBAC, Studio, Catalogue are in Profile dropdown)
        return [
          { id: 'center-management', label: 'Direction Campus', shortLabel: 'Direction', icon: Building2, badge: 'Admin', badgeColor: 'bg-amber-100 text-amber-800' },
          { id: 'centers', label: 'Réseau Multi-Campus', shortLabel: 'Multi-Campus', icon: Building2 },
          { id: 'progress-tracker', label: 'Suivi Global', shortLabel: 'Suivi Global', icon: Users },
          { id: 'course-builder', label: 'Créateur de Cours', shortLabel: 'Créer Cours', icon: Layers },
        ];

      default:
        return [
          { id: 'home', label: 'Accueil', icon: Globe2 },
          { id: 'catalog', label: 'Catalogue', icon: BookOpen },
        ];
    }
  };

  const navItems = getNavItemsForRole(currentUser.role);

  const closeAllMenus = () => {
    setShowRoleMenu(false);
    setShowUserMenu(false);
    setShowNotifications(false);
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
              onNavigate(isVisitor ? 'home' : currentUser.role === 'trainer' ? 'studio' : currentUser.role === 'center_admin' ? 'centers' : 'catalog');
              closeAllMenus();
            }}
            className="flex-shrink-0 cursor-pointer"
          >
            <Logo size="sm" showTagline={false} centerName={currentUser.role !== 'visitor' ? activeCenter.name : undefined} />
          </div>

          {/* 2. Center: STRICT PROFILE-BASED NAVIGATION TABS (Desktop - Fitted to container) */}
          <nav className="hidden md:flex items-center gap-1 xl:gap-1.5 flex-shrink-0 whitespace-nowrap">
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
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.shortLabel || item.label}</span>
                  {item.badge && item.badge !== '' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
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

          {/* 3. Search Bar (Fitted to container) */}
          <div className="hidden lg:flex items-center w-32 xl:w-48 relative shrink">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-header-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-7 pr-3 py-1.5 text-xs bg-slate-100/90 text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200/80 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
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

          {/* 4. Right: Profile Controls, Role Switcher, Notifications & Auth */}
          <div className="flex items-center gap-2">
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

            {/* IF VISITOR / NOT AUTHENTICATED */}
            {isVisitor ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Connexion</span>
                </button>
                <button
                  onClick={() => onOpenAuth('demo')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Démo 1-Clic</span>
                </button>
              </div>
            ) : (
              /* AUTHENTICATED USER WIDGETS */
              <>
                {/* Learner Streak & XP (Only for learners) */}
                {currentUser.role === 'learner' && (
                  <div className="hidden sm:flex items-center gap-1.5">
                    <div
                      title={`${currentUser.streakDays} jours consécutifs d'apprentissage !`}
                      className="flex items-center gap-1 px-2 py-1 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold"
                    >
                      <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                      <span>{currentUser.streakDays}j</span>
                    </div>

                    <div
                      onClick={() => onNavigate('gamification')}
                      title={`Niveau ${currentUser.level} - Cliquez pour voir les récompenses`}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold cursor-pointer hover:bg-indigo-100 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{currentUser.xp} XP</span>
                    </div>
                  </div>
                )}

                {/* Role Switcher Pill (Quick Demo switcher) */}
                <div className="relative hidden md:block">
                  <button
                    id="role-switcher-toggle"
                    onClick={() => {
                      setShowRoleMenu(!showRoleMenu);
                      setShowUserMenu(false);
                      setShowNotifications(false);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${
                      ROLE_DETAILS[currentUser.role]?.badgeStyle || 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{ROLE_DETAILS[currentUser.role]?.badgeLabel || currentUser.role}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  {/* Role Dropdown */}
                  {showRoleMenu && (
                    <div
                      id="role-switcher-dropdown"
                      className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between">
                        <span>Changer de profil (Démo) :</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <div className="mt-1 space-y-1">
                        {rolesOrder.map((r) => {
                          const info = ROLE_DETAILS[r];
                          const isCurrent = currentUser.role === r;
                          return (
                            <button
                              key={r}
                              id={`role-option-${r}`}
                              onClick={() => {
                                onSelectRole(r);
                                setShowRoleMenu(false);
                              }}
                              className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                                isCurrent
                                  ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200'
                                  : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex-1">
                                <div className="text-xs font-bold flex items-center justify-between text-slate-900">
                                  <span>{info.title}</span>
                                  {isCurrent && (
                                    <span className="text-[10px] text-indigo-600 font-extrabold">Actif</span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight line-clamp-1">
                                  {info.description}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notifications Bell */}
                <div className="relative hidden md:block">
                  <button
                    id="notifications-toggle"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowRoleMenu(false);
                      setShowUserMenu(false);
                    }}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1 right-1 ring-2 ring-white" />
                  </button>

                  {showNotifications && (
                    <div
                      id="notifications-dropdown"
                      className="absolute right-0 mt-2 w-76 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900">Notifications</span>
                        <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer">Tout lire</span>
                      </div>
                      <div className="mt-2 space-y-1.5 text-xs">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="font-semibold text-indigo-700 text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            Session Prête
                          </div>
                          <p className="text-slate-600 text-[11px]">Votre module d'IA Générative est disponible.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar Menu */}
                <div className="relative hidden md:block">
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowRoleMenu(false);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-1.5 p-0.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-xl object-cover border border-slate-200"
                    />
                    <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100 max-h-[85vh] overflow-y-auto">
                      {/* 1. User Identity Header */}
                      <div className="p-2 pb-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                            <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                            <div className="text-[10px] text-indigo-600 font-semibold mt-0.5 flex items-center gap-1 truncate">
                              <Building2 className="w-3 h-3 shrink-0" />
                              <span className="truncate">{currentUser.centerName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats Pill */}
                        <div className="mt-2.5 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                          <span className="px-1.5 py-0.5 rounded-md bg-white font-bold text-slate-700 shadow-2xs border border-slate-200/60">
                            {ROLE_DETAILS[currentUser.role]?.title || 'Utilisateur'}
                          </span>
                          {currentUser.role === 'learner' && (
                            <span className="text-amber-700 font-bold ml-auto flex items-center gap-0.5">
                              <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {currentUser.xp || 0} XP (Nv.{currentUser.level || 1})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 2. Section: Mon Espace & Profil (Moved items) */}
                      <div className="py-2 space-y-0.5 text-xs">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Mon Espace Personnel
                        </div>

                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left font-medium group transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 group-hover:text-indigo-600">Profil & Paramètres</div>
                              <div className="text-[10px] text-slate-400">Mur, biographie & sécurité</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">FB</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('learner-journey');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left font-medium group transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                              <GraduationCap className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 group-hover:text-indigo-600">Mon Parcours & Micro-cours</div>
                              <div className="text-[10px] text-slate-400">Jalons & Nano Banana</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('gamification');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left font-medium group transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                              <Trophy className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 group-hover:text-indigo-600">Badges & Gamification</div>
                              <div className="text-[10px] text-slate-400">{(currentUser.unlockedBadgeIds?.length || 0)} badges débloqués</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            {currentUser.xp || 0} XP
                          </span>
                        </button>
                      </div>

                      {/* 3. Section: Outils Pédagogiques & IA (Role Guarded) */}
                      <div className="py-2 space-y-0.5 text-xs">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Outils & Pédagogie
                        </div>

                        {hasPermission(currentUser.role, 'access_ai_studio') && (
                          <button
                            onClick={() => {
                              onNavigate('studio');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left font-medium group transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                                <Sparkles className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800 group-hover:text-indigo-600">Studio IA Pédagogique</div>
                                <div className="text-[10px] text-slate-400">Générateur de cours Gemini</div>
                              </div>
                            </div>
                          </button>
                        )}

                        {hasPermission(currentUser.role, 'create_and_publish_course') && (
                          <button
                            onClick={() => {
                              onNavigate('course-builder');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left font-medium group transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                <Layers className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800 group-hover:text-indigo-600">Créateur de Cours</div>
                                <div className="text-[10px] text-slate-400">Plan & Nano Banana</div>
                              </div>
                            </div>
                          </button>
                        )}

                        {hasPermission(currentUser.role, 'view_center_analytics') && (
                          <button
                            onClick={() => {
                              onNavigate('progress-tracker');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left font-medium group transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                                <Users className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800 group-hover:text-indigo-600">Suivi des Apprenants</div>
                                <div className="text-[10px] text-slate-400">Progression & Notes</div>
                              </div>
                            </div>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onNavigate('tuteur');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left font-medium group transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                              <Bot className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 group-hover:text-indigo-600">Tuteur IA AIDA</div>
                              <div className="text-[10px] text-slate-400">Assistance 24/7 & WhatsApp</div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            onOpenCertVerifier();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left font-medium group transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                              <Award className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 group-hover:text-indigo-600">Vérificateur de Diplômes</div>
                              <div className="text-[10px] text-slate-400">Contrôle QR & Blockchain</div>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* 4. Section: Administration & Sécurité */}
                      <div className="py-2 space-y-0.5 text-xs">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Administration & Sécurité
                        </div>

                        {(currentUser.role === 'center_admin' || currentUser.role === 'super_admin') && (
                          <button
                            onClick={() => {
                              onNavigate('centers');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left font-medium group transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                                <Building2 className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800 group-hover:text-indigo-600">Réseau Multi-Campus</div>
                                <div className="text-[10px] text-slate-400">Vue globale des centres</div>
                              </div>
                            </div>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onNavigate('permissions');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-slate-700 hover:bg-slate-50 text-left font-medium group transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 group-hover:text-indigo-600">Matrice des Permissions</div>
                              <div className="text-[10px] text-slate-400">Audit des rôles RBAC</div>
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* 5. Section: Déconnexion */}
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100/90 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/80 md:hidden transition-colors"
            >
              <Menu className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold">Menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
