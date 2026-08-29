import React from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  centerName?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  centerName,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
  };

  return (
    <div id="academia-itech-logo" className={`flex items-center gap-3 cursor-pointer select-none group ${className}`}>
      {/* Polished Executive Icon */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all duration-300`}>
        <div className={`flex items-center justify-center rounded-[10px] bg-slate-900 ${iconSizes[size]} transition-transform duration-300 group-hover:scale-95`}>
          <div className="relative flex items-center justify-center text-white">
            <GraduationCap className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : size === 'xl' ? 'w-9 h-9' : 'w-5 h-5'} />
            <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`tracking-tight text-slate-900 font-extrabold ${titleSizes[size]}`}>
            Academia
          </span>
          <span className={`tracking-wider text-indigo-600 font-black ${titleSizes[size]}`}>
            ITECH
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 uppercase tracking-wider hidden sm:inline-block">
            LMS
          </span>
        </div>

        {centerName ? (
          <span className="text-xs font-semibold text-emerald-600 truncate max-w-[200px] mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            {centerName}
          </span>
        ) : showTagline ? (
          <span className="text-[11px] text-slate-500 tracking-wide font-medium mt-0.5">
            L'Académie Numérique & IA d'Excellence
          </span>
        ) : null}
      </div>
    </div>
  );
};
