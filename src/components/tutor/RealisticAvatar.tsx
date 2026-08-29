import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TutorPersona } from '../../types';
import { Sparkles, Mic, Brain, Volume2, ShieldCheck, Zap } from 'lucide-react';

interface RealisticAvatarProps {
  persona: TutorPersona;
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  isCalling?: boolean;
  showControlsOverlay?: boolean;
  speedMode?: 'flash' | 'pro';
}

export const RealisticAvatar: React.FC<RealisticAvatarProps> = ({
  persona,
  state,
  size = 'md',
  isCalling = false,
  speedMode = 'flash',
}) => {
  const [mouthPhase, setMouthPhase] = useState(0);
  const [audioWaves, setAudioWaves] = useState<number[]>([12, 24, 18, 32, 16, 28, 14]);

  // Syllable/mouth animation simulation when speaking
  useEffect(() => {
    if (state !== 'speaking') return;
    const interval = setInterval(() => {
      setMouthPhase((prev) => (prev + 1) % 4);
      setAudioWaves([
        Math.floor(10 + Math.random() * 25),
        Math.floor(15 + Math.random() * 30),
        Math.floor(10 + Math.random() * 28),
        Math.floor(20 + Math.random() * 35),
        Math.floor(15 + Math.random() * 30),
        Math.floor(10 + Math.random() * 25),
        Math.floor(12 + Math.random() * 20),
      ]);
    }, 110);
    return () => clearInterval(interval);
  }, [state]);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-44 h-44 sm:w-52 sm:h-52',
    lg: 'w-60 h-60 sm:w-72 sm:h-72',
    fullscreen: 'w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px]',
  };

  const stateColors = {
    idle: 'from-blue-500/20 to-indigo-500/20 border-slate-700/50',
    listening: 'from-emerald-500/30 to-teal-500/30 border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.35)]',
    thinking: 'from-amber-500/30 to-purple-500/30 border-amber-500/60 shadow-[0_0_35px_rgba(245,158,11,0.35)]',
    speaking: 'from-indigo-500/40 to-cyan-500/40 border-cyan-400/80 shadow-[0_0_45px_rgba(6,182,212,0.45)]',
  };

  const stateBadge = {
    idle: { label: 'En veille active', icon: Sparkles, color: 'text-slate-300 bg-slate-800/80 border-slate-700' },
    listening: { label: 'À votre écoute...', icon: Mic, color: 'text-emerald-300 bg-emerald-950/80 border-emerald-700 animate-pulse' },
    thinking: { label: 'Analyse IA rapide...', icon: Brain, color: 'text-amber-300 bg-amber-950/80 border-amber-700' },
    speaking: { label: 'En train de parler', icon: Volume2, color: 'text-cyan-300 bg-cyan-950/80 border-cyan-700' },
  };

  const CurrentBadgeIcon = stateBadge[state].icon;

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Dynamic Background Halo Pulse */}
      <AnimatePresence>
        {state === 'speaking' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.12, 1],
            }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-500/30 to-blue-500/20 blur-2xl pointer-events-none"
          />
        )}
        {state === 'listening' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: [0.5, 0.9, 0.5],
              scale: [0.95, 1.08, 0.95],
            }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-tr from-emerald-500/25 to-teal-500/25 blur-2xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main Avatar Container */}
      <motion.div
        animate={{
          y: state === 'speaking' ? [0, -3, 0] : state === 'listening' ? [-1, 1, -1] : [0, -2, 0],
          scale: state === 'speaking' ? 1.02 : 1,
        }}
        transition={{ repeat: Infinity, duration: state === 'speaking' ? 1.2 : 3.5, ease: 'easeInOut' }}
        className={`relative rounded-3xl p-1.5 bg-gradient-to-b ${stateColors[state]} backdrop-blur-xl border transition-all duration-500 ${
          isCalling ? 'shadow-2xl' : 'shadow-lg'
        }`}
      >
        {/* Avatar Image Frame */}
        <div className={`relative overflow-hidden rounded-[22px] bg-slate-950 ${sizeClasses[size]}`}>
          <img
            src={persona.avatarUrl}
            alt={persona.name}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-top transition-transform duration-700 ${
              state === 'speaking' ? 'scale-105 filter brightness-105' : 'scale-100'
            }`}
          />

          {/* Subtitle / Gender Watermark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

          {/* Live Speaking Lip-Sync / Sound Equalizer Ribbon */}
          {state === 'speaking' && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-1 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/50 shadow-lg">
              {audioWaves.map((h, i) => (
                <motion.span
                  key={i}
                  animate={{ height: `${h}px` }}
                  transition={{ duration: 0.12 }}
                  className="w-1 bg-gradient-to-t from-cyan-400 to-indigo-400 rounded-full"
                />
              ))}
            </div>
          )}

          {/* Thinking Neural Wave Indicator */}
          {state === 'thinking' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-2 border-amber-400 border-t-transparent flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)]"
              >
                <Brain className="w-6 h-6 text-amber-300 animate-pulse" />
              </motion.div>
            </div>
          )}

          {/* Persona Gender & Verification Badge */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[10px] text-white font-medium">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>{persona.gender === 'female' ? 'IA Féminine' : 'IA Masculine'}</span>
          </div>

          {/* Mode Indicator */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[10px] text-amber-300 font-medium">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{speedMode === 'flash' ? 'Éclair <0.8s' : 'Pro'}</span>
          </div>
        </div>
      </motion.div>

      {/* Name and State Pill */}
      <div className="mt-3 flex flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-bold text-white tracking-wide">{persona.name}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 font-medium">
            {persona.badge}
          </span>
        </div>
        <span className="text-xs text-slate-400 max-w-[240px] truncate">{persona.specialty}</span>

        {/* Live State Badge */}
        <div
          className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${stateBadge[state].color}`}
        >
          <CurrentBadgeIcon className="w-3.5 h-3.5" />
          <span>{stateBadge[state].label}</span>
        </div>
      </div>
    </div>
  );
};
