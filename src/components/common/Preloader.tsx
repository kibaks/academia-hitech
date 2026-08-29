import React, { useEffect, useState } from 'react';
import { GraduationCap, Sparkles, Cpu } from 'lucide-react';

interface PreloaderProps {
  onFinish?: () => void;
  message?: string;
  duration?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onFinish,
  message = "Initialisation de l'Académie IA & des Permissions...",
  duration = 1000,
}) => {
  const [progress, setProgress] = useState(15);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFadeOut(true);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 350);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 10;
      });
    }, duration / 8);

    return () => clearInterval(interval);
  }, [duration, onFinish]);

  return (
    <div
      id="app-preloader"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-350 select-none ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle Background Glow Elements */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute w-80 h-80 rounded-full bg-blue-500/15 blur-[90px] pointer-events-none" />

      {/* Main Animated Logo Box */}
      <div className="relative flex flex-col items-center gap-6 z-10">
        <div className="relative">
          {/* Pulsing Outer Tech Rings */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 opacity-40 blur-lg animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 border border-slate-700/80 p-0.5 shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#4338ca_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />

            {/* Glowing Icon & Cap */}
            <div className="relative flex items-center justify-center text-white">
              <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400 animate-bounce" />
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '3s' }} />
            </div>

            {/* Dynamic Orbit Light Line */}
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Academia</span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-400 tracking-wider">ITECH</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider">
              LMS IA
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            {message}
          </p>
        </div>

        {/* Futuristic Loading Bar */}
        <div className="w-64 sm:w-72 space-y-2 mt-2">
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
              Chargement RBAC & Modules
            </span>
            <span className="text-indigo-300 font-bold">{Math.min(100, progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
