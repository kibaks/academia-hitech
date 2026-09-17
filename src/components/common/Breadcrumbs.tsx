import React from 'react';
import {
  Home,
  ChevronRight,
  BookOpen,
  Play,
  Sparkles,
  Bot,
  Trophy,
  User,
  Building2,
  Shield,
  Coins,
  FileText,
  Layers,
  GraduationCap,
  Compass,
  CheckCircle,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { UserRole } from '../../types';

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  tab?: string;
  onClick?: () => void;
  badge?: string;
  isCurrent?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (tab: string) => void;
  onBack?: () => void;
  currentRole?: UserRole;
  centerName?: string;
  className?: string;
  showHome?: boolean;
  compact?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onNavigate,
  onBack,
  currentRole,
  centerName,
  className = '',
  showHome = true,
  compact = false,
}) => {
  // Check if Home is already present at the start or anywhere in the trail
  const hasHome = items.some(
    (item) => item.id === 'home' || item.tab === 'home' || item.label.trim().toLowerCase() === 'accueil'
  );

  const rawItems: BreadcrumbItem[] = showHome && !hasHome
    ? [
        {
          id: 'home',
          label: 'Accueil',
          icon: Home,
          tab: 'home',
          onClick: onNavigate ? () => onNavigate('home') : undefined,
          isCurrent: items.length === 0,
        },
        ...items,
      ]
    : items;

  // Strict deduplication: remove any duplicate IDs or consecutive identical labels
  const allItems: BreadcrumbItem[] = [];
  const seenIds = new Set<string>();

  for (const item of rawItems) {
    const prev = allItems[allItems.length - 1];
    const isDuplicateLabel = prev && prev.label.trim().toLowerCase() === item.label.trim().toLowerCase();
    
    if (!seenIds.has(item.id) && !isDuplicateLabel) {
      seenIds.add(item.id);
      allItems.push(item);
    }
  }

  // Don't render empty breadcrumb
  if (allItems.length === 0) return null;

  return (
    <nav
      id="app-breadcrumbs-nav"
      aria-label="Fil d'Ariane"
      className={`w-full flex items-center justify-between gap-3 text-xs ${
        compact ? 'py-1' : 'py-2 px-3 sm:px-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs mb-3.5'
      } ${className}`}
    >
      {/* Left: Interactive Trail */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 px-2 py-1 mr-1 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-lg text-xs font-semibold transition-colors shrink-0"
            title="Retour à l'étape précédente"
            aria-label="Retour"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Retour</span>
          </button>
        )}

        <ol className="flex items-center gap-1.5 flex-nowrap min-w-0" role="list">
          {allItems.map((item, idx) => {
            const isLast = idx === allItems.length - 1 || item.isCurrent;
            const Icon = item.icon;
            const isClickable = !isLast && (!!item.onClick || (!!item.tab && !!onNavigate));

            const handleClick = () => {
              if (item.onClick) {
                item.onClick();
              } else if (item.tab && onNavigate) {
                onNavigate(item.tab);
              }
            };

            return (
              <li
                key={`${item.id}-${idx}`}
                className="flex items-center gap-1.5 shrink-0 min-w-0"
                aria-current={isLast ? 'page' : undefined}
              >
                {idx > 0 && (
                  <ChevronRight
                    className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0 select-none"
                    aria-hidden="true"
                  />
                )}

                {isClickable ? (
                  <button
                    type="button"
                    onClick={handleClick}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-slate-600 hover:text-sky-700 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50/70 dark:hover:bg-sky-950/40 rounded-lg font-medium transition-all group max-w-[200px] truncate"
                    title={item.label}
                  >
                    {Icon && (
                      <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 dark:text-slate-500 dark:group-hover:text-sky-400 shrink-0" />
                    )}
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-1 font-semibold truncate max-w-[240px] sm:max-w-md ${
                      isLast
                        ? 'text-slate-900 dark:text-white bg-slate-100/90 dark:bg-slate-800/90 rounded-lg'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                    title={item.label}
                  >
                    {Icon && (
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isLast
                            ? 'text-sky-600 dark:text-sky-400'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      />
                    )}
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-300 text-[10px] font-bold border border-sky-200 dark:border-sky-800">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Right: Context Badge (Center name or Role) */}
      {(centerName || currentRole) && (
        <div className="hidden md:flex items-center gap-2 shrink-0 text-[11px] text-slate-500 dark:text-slate-400 pl-2 border-l border-slate-200/80 dark:border-slate-800">
          {centerName && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60 max-w-[170px] truncate">
              <Building2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{centerName}</span>
            </span>
          )}
        </div>
      )}
    </nav>
  );
};

export default Breadcrumbs;
