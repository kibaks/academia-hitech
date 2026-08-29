import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Bot,
  Trophy,
  Building2,
  ShieldCheck,
  Globe2,
  LogIn,
  User,
  Layers,
  Users,
  Menu
} from 'lucide-react';
import { UserRole } from '../../types';

interface MobileNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  userRole: UserRole;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onOpenDrawer: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onNavigate,
  userRole,
  isAuthenticated,
  onOpenAuth,
  onOpenDrawer,
}) => {
  const isVisitor = !isAuthenticated || userRole === 'visitor';

  if (isVisitor) {
    const visitorItems = [
      { id: 'home', label: 'Accueil', icon: Globe2 },
      { id: 'catalog', label: 'Formations', icon: BookOpen },
      { id: 'permissions', label: 'Sécurité', icon: ShieldCheck },
    ];

    return (
      <nav
        id="mobile-bottom-nav"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 md:hidden px-2 py-1.5 shadow-lg safe-area-pb flex items-center justify-between gap-1"
      >
        <div className="flex-1 flex items-center justify-around">
          {visitorItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] rounded-xl transition-all ${
                  isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive ? 'bg-indigo-50 border border-indigo-200/80 scale-105' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              </button>
            );
          })}

          {/* Drawer Menu Button */}
          <button
            id="mobile-nav-visitor-drawer-btn"
            onClick={onOpenDrawer}
            className="flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] rounded-xl text-slate-500 hover:text-indigo-600 transition-all"
          >
            <div className="p-1 rounded-xl bg-slate-100 hover:bg-indigo-50 transition-colors">
              <Menu className="w-4 h-4 text-slate-700" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 font-semibold text-slate-700">Menu</span>
          </button>
        </div>

        <button
          onClick={onOpenAuth}
          className="ml-1 px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs flex items-center gap-1 shrink-0"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Connexion</span>
        </button>
      </nav>
    );
  }

  // 4 Primary Quick Access items for each role + 1 "Menu" button
  let items: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }> }> = [];

  switch (userRole) {
    case 'learner':
      items = [
        { id: 'learner-journey', label: 'Parcours', icon: GraduationCap },
        { id: 'catalog', label: 'Catalogue', icon: BookOpen },
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'tuteur', label: 'Tuteur IA', icon: Bot },
      ];
      break;

    case 'trainer':
      items = [
        { id: 'course-builder', label: 'Créer Cours', icon: Layers },
        { id: 'progress-tracker', label: 'Suivi', icon: Users },
        { id: 'studio', label: 'Studio IA', icon: Sparkles },
        { id: 'profile', label: 'Profil', icon: User },
      ];
      break;

    case 'center_admin':
      items = [
        { id: 'center-management', label: 'Mon Centre', icon: Building2 },
        { id: 'progress-tracker', label: 'Suivi', icon: Users },
        { id: 'course-builder', label: 'Créer', icon: Layers },
        { id: 'profile', label: 'Profil', icon: User },
      ];
      break;

    case 'super_admin':
      items = [
        { id: 'center-management', label: 'Direction', icon: Building2 },
        { id: 'centers', label: 'Campus', icon: Building2 },
        { id: 'course-builder', label: 'Créer', icon: Layers },
        { id: 'profile', label: 'Profil', icon: User },
      ];
      break;

    default:
      items = [
        { id: 'home', label: 'Accueil', icon: Globe2 },
        { id: 'catalog', label: 'Catalogue', icon: BookOpen },
        { id: 'permissions', label: 'Sécurité', icon: ShieldCheck },
      ];
  }

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 md:hidden px-2 py-1 shadow-lg safe-area-pb"
    >
      <div className="flex items-center justify-around w-full">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] transition-all ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-indigo-50 border border-indigo-200/80 scale-105' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 truncate max-w-[68px] ${isActive ? 'font-bold text-indigo-600' : 'font-medium text-slate-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Dedicated "Menu" (Drawer) trigger button */}
        <button
          id="mobile-nav-drawer-trigger"
          onClick={onOpenDrawer}
          className="flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] transition-all text-slate-600 hover:text-indigo-600"
        >
          <div className="p-1 rounded-xl bg-slate-100/90 border border-slate-200/60 hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
            <Menu className="w-4 h-4 text-slate-700" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-bold text-slate-700">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
};
