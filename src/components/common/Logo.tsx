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
      {/* Polished Sky Blue Executive Icon (Inspired by modern digital tech & X) */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-0.5 shadow-md shadow-sky-500/25 group-hover:shadow-sky-500/40 transition-all duration-300`}>
        <div className={`flex items-center justify-center rounded-[10px] bg-slate-900 ${iconSizes[size]} transition-transform duration-300 group-hover:scale-95`}>
          <div className="relative flex items-center justify-center text-white">
            <GraduationCap className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : size === 'xl' ? 'w-9 h-9' : 'w-5 h-5'} />
            <Sparkles className="w-2.5 h-2.5 text-sky-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 leading-none shrink-0">
          <span className={`tracking-tight text-slate-900 font-extrabold ${titleSizes[size]}`}>
            Academia
          </span>
          <span className={`tracking-wider text-sky-500 font-black ${titleSizes[size]}`}>
            ITECH
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 uppercase tracking-wider hidden sm:inline-block">
            AFRIQUE
          </span>
        </div>

        {centerName ? (
          <span className="text-xs font-semibold text-sky-600 truncate max-w-[125px] xs:max-w-[160px] sm:max-w-[220px] mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block shrink-0" />
            <span className="truncate">{centerName}</span>
          </span>
        ) : showTagline ? (
          <span className="text-[11px] text-slate-500 tracking-wide font-medium mt-0.5 truncate max-w-[150px] sm:max-w-none">
            Excellence Technologique Panafricaine & IA
          </span>
        ) : null}
      </div>
    </div>
  );
};
