import React from 'react';
import {
  BookOpen,
  Bot,
  Globe2,
  LogIn,
  User,
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

  // Strict primary items for all users: Catalogue & Tuteur IA
  const items: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }> }> = isVisitor
    ? [
        { id: 'home', label: 'Accueil', icon: Globe2 },
        { id: 'catalog', label: 'Catalogue', icon: BookOpen },
        { id: 'tuteur', label: 'Tuteur IA', icon: Bot },
      ]
    : [
        { id: 'catalog', label: 'Catalogue', icon: BookOpen },
        { id: 'tuteur', label: 'Tuteur IA', icon: Bot },
        { id: 'profile', label: 'Mon Profil', icon: User },
      ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 md:hidden px-3 py-1.5 shadow-lg safe-area-pb flex items-center justify-between gap-1"
    >
      <div className="flex-1 flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] rounded-xl transition-all ${
                isActive ? 'text-sky-500 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-sky-50 border border-sky-200/80 scale-105' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-sky-500' : 'font-medium text-slate-600'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Dedicated "Menu" (Drawer) trigger button */}
        <button
          id="mobile-nav-drawer-trigger"
          onClick={onOpenDrawer}
          className="flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] transition-all text-slate-600 hover:text-sky-500"
        >
          <div className="p-1 rounded-xl bg-slate-100/90 border border-slate-200/60 hover:bg-sky-50 hover:border-sky-200 transition-colors">
            <Menu className="w-4 h-4 text-slate-700" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-bold text-slate-700">
            Menu
          </span>
        </button>
      </div>

      {isVisitor && (
        <button
          onClick={onOpenAuth}
          className="ml-1 px-3 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold shadow-xs flex items-center gap-1 shrink-0 active:scale-95"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Connexion</span>
        </button>
      )}
    </nav>
  );
};
