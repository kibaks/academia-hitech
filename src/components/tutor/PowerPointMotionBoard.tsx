import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Layers,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sliders,
  Target,
} from 'lucide-react';
import { playTutorSpeech, stopTutorSpeech } from './speechUtils';

export type PPTMotionType = 'fly_in' | 'wipe' | 'zoom' | 'float';

export interface PowerPointSlideData {
  id?: string;
  title: string;
  subtitle?: string;
  type?: 'three_cards' | 'numbered_steps' | 'bullet_points' | 'correct_incorrect' | 'four_grid' | 'danger_alert';
  highlightText?: string;
  speakerNotes?: string;
  cards?: Array<{
    title: string;
    desc: string;
    icon?: string;
    badge?: string;
  }>;
  steps?: Array<{
    title: string;
    desc: string;
    icon?: string;
  }>;
  items?: string[];
  gridItems?: Array<{
    title: string;
    desc: string;
    badge?: string;
  }>;
  correctPoints?: string[];
  incorrectPoints?: string[];
  dangerBannerText?: string;
  requiredActions?: string[];
  prohibitedActions?: string[];
}

interface PowerPointMotionBoardProps {
  slides?: PowerPointSlideData[];
  activeSlideData?: PowerPointSlideData;
  onSlideChange?: (index: number) => void;
  onRequestRobotPose?: (pose: 'pointing' | 'explaining' | 'celebrating' | 'thumbs_up' | 'thinking') => void;
  className?: string;
  showPresenterControls?: boolean;
}

export const PowerPointMotionBoard: React.FC<PowerPointMotionBoardProps> = ({
  slides: initialSlides,
  activeSlideData,
  onSlideChange,
  onRequestRobotPose,
  className = '',
  showPresenterControls = true,
}) => {
  const defaultSlides: PowerPointSlideData[] = [
    {
      title: '1. Architecture & Fondations du Robot Android',
      subtitle: 'Composants matériels & Synthèse vocale multimodale',
      type: 'three_cards',
      highlightText: 'Le robot Android synchronise ses mouvements à chaque phonème audio généré en direct.',
      speakerNotes: 'Expliquer l\'interaction entre le moteur de synthèse vocale et la matrice LED du visage.',
      cards: [
        {
          title: 'Visème Labial & Égaliseur LED',
          desc: 'Ouverture dynamique de la mâchoire et oscillateur de fréquences audio temps réel.',
          badge: 'Temps Réel <10ms',
          icon: '🎙️',
        },
        {
          title: 'Gesticulation Articulée',
          desc: 'Bras asservis pour pointer le tableau, saluer, encourager ou analyser un problème.',
          badge: '6 Degrés',
          icon: '🤖',
        },
        {
          title: 'Présentations PowerPoint Motion',
          desc: 'Affichage des diapositives pédagogiques avec transitions de vol et balayages cinétiques.',
          badge: 'Fluidité 60fps',
          icon: '📊',
        },
      ],
    },
    {
      title: '2. Déroulé Pédagogique Interactif',
      subtitle: 'Étapes progressives d\'assimilation des concepts',
      type: 'numbered_steps',
      highlightText: 'Chaque diapositive se dévoile point par point au rythme de l\'explication vocale.',
      speakerNotes: 'Guider l\'étudiant à travers les trois étapes clés de la méthode.',
      steps: [
        {
          title: 'Étape 1 : Écoute Active & Visualisation',
          desc: 'Le robot Android introduit la notion avec pointer laser et faisceau holographique.',
          icon: '🎯',
        },
        {
          title: 'Étape 2 : Démonstration Pratique',
          desc: 'Animation motion progressive dévoilant les composants critiques de la machine.',
          icon: '⚡',
        },
        {
          title: 'Étape 3 : Synthèse & Validation des Acquis',
          desc: 'Mini-évaluation interactive avec feedback immédiat et encouragement.',
          icon: '🏆',
        },
      ],
    },
    {
      title: '3. Règles d\'Or & Bonnes Pratiques',
      subtitle: 'Conformité et vigilance sur le terrain',
      type: 'correct_incorrect',
      highlightText: 'La rigueur opérationnelle garantit la sécurité et l\'efficacité du système.',
      speakerNotes: 'Mettre en contraste immédiat les réflexes conformes face aux erreurs critiques.',
      correctPoints: [
        'Vérifier les voyants de statut LED avant toute manipulation',
        'Conserver la synchronisation vocale active pour le guidage sonore',
        'Valider chaque étape séquentielle sur la console de contrôle',
      ],
      incorrectPoints: [
        'Ignorer les alertes visuelles du tableau de bord',
        'Forcer l\'exécution sans calibration des visèmes du robot',
        'Court-circuiter les étapes de contrôle de sécurité',
      ],
    },
  ];

  const slides = initialSlides && initialSlides.length > 0 ? initialSlides : defaultSlides;
  const [slideIndex, setSlideIndex] = useState(0);
  const [motionType, setMotionType] = useState<PPTMotionType>('fly_in');
  const [activeStepReveal, setActiveStepReveal] = useState<number>(3);
  const [isLaserPointerActive, setIsLaserPointerActive] = useState<boolean>(false);
  const [laserPosition, setLaserPosition] = useState<{ x: number; y: number }>({ x: 280, y: 160 });
  const [isSpeakingSlide, setIsSpeakingSlide] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [slideTheme, setSlideTheme] = useState<'dark_office' | 'emerald_tech' | 'cyber_slate'>('emerald_tech');

  const currentSlide = activeSlideData || slides[slideIndex] || slides[0];

  // Motion variants mapped to PowerPoint Entrance styles
  const getCardMotionVariants = (idx: number) => {
    switch (motionType) {
      case 'fly_in':
        return {
          initial: { opacity: 0, y: 45, scale: 0.94 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: {
            type: 'spring',
            damping: 15,
            stiffness: 110,
            delay: 0.1 + idx * 0.14,
          },
        };
      case 'wipe':
        return {
          initial: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
          animate: { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
          transition: {
            duration: 0.55,
            ease: [0.25, 1, 0.5, 1],
            delay: 0.08 + idx * 0.16,
          },
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.65, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          transition: {
            type: 'spring',
            damping: 18,
            stiffness: 130,
            delay: 0.08 + idx * 0.14,
          },
        };
      case 'float':
      default:
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.45,
            ease: 'easeOut',
            delay: 0.06 + idx * 0.12,
          },
        };
    }
  };

  const handleNextSlide = () => {
    const nextIdx = (slideIndex + 1) % slides.length;
    setSlideIndex(nextIdx);
    setActiveStepReveal(3);
    if (onSlideChange) onSlideChange(nextIdx);
    if (onRequestRobotPose) onRequestRobotPose('explaining');
  };

  const handlePrevSlide = () => {
    const prevIdx = (slideIndex - 1 + slides.length) % slides.length;
    setSlideIndex(prevIdx);
    setActiveStepReveal(3);
    if (onSlideChange) onSlideChange(prevIdx);
    if (onRequestRobotPose) onRequestRobotPose('explaining');
  };

  // Synchronous Speech Narration of the current slide
  const handleNarrateCurrentSlide = () => {
    if (isSpeakingSlide) {
      stopTutorSpeech();
      setIsSpeakingSlide(false);
      return;
    }

    let speechScript = `${currentSlide.title}. ${currentSlide.subtitle || ''}. `;
    if (currentSlide.cards) {
      speechScript += currentSlide.cards.map((c, i) => `Point ${i + 1} : ${c.title}. ${c.desc}`).join('. ');
    } else if (currentSlide.steps) {
      speechScript += currentSlide.steps.map((s, i) => `Étape ${i + 1} : ${s.title}. ${s.desc}`).join('. ');
    } else if (currentSlide.correctPoints) {
      speechScript += `Pratiques conformes : ${currentSlide.correctPoints.join('. ')}. Pratiques à éviter : ${currentSlide.incorrectPoints?.join('. ') || ''}`;
    }

    if (onRequestRobotPose) {
      onRequestRobotPose('pointing');
    }

    setIsSpeakingSlide(true);
    playTutorSpeech({
      text: speechScript,
      pitch: 1.08,
      rate: 1.05,
      onStart: () => {
        setIsSpeakingSlide(true);
      },
      onEnd: () => {
        setIsSpeakingSlide(false);
        if (onRequestRobotPose) onRequestRobotPose('thumbs_up');
      },
      onError: () => {
        setIsSpeakingSlide(false);
      },
    });
  };

  // Theme styling definitions
  const themeClasses = {
    emerald_tech: {
      container: 'bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950 border-emerald-500/40 shadow-2xl shadow-emerald-950/40',
      headerBg: 'bg-emerald-950/50 border-emerald-800/40 text-emerald-300',
      cardBg: 'bg-slate-900/90 hover:bg-slate-800/90 border-emerald-500/30 hover:border-emerald-400/70',
      accentText: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    },
    dark_office: {
      container: 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50 border-indigo-500/40 shadow-2xl shadow-indigo-950/40',
      headerBg: 'bg-indigo-950/50 border-indigo-800/40 text-indigo-300',
      cardBg: 'bg-slate-900/90 hover:bg-slate-800/90 border-indigo-500/30 hover:border-indigo-400/70',
      accentText: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    },
    cyber_slate: {
      container: 'bg-gradient-to-br from-slate-950 via-cyan-950/40 to-slate-950 border-cyan-500/40 shadow-2xl shadow-cyan-950/40',
      headerBg: 'bg-cyan-950/50 border-cyan-800/40 text-cyan-300',
      cardBg: 'bg-slate-900/90 hover:bg-slate-800/90 border-cyan-500/30 hover:border-cyan-400/70',
      accentText: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    },
  }[slideTheme];

  return (
    <div
      className={`relative w-full rounded-3xl border transition-all duration-300 overflow-hidden select-none flex flex-col ${themeClasses.container} ${className}`}
      onMouseMove={(e) => {
        if (isLaserPointerActive) {
          const rect = e.currentTarget.getBoundingClientRect();
          setLaserPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }
      }}
    >
      {/* Laser Pointer Spot & Ray */}
      {isLaserPointerActive && (
        <div
          className="absolute z-50 pointer-events-none transition-all duration-75"
          style={{
            left: `${laserPosition.x}px`,
            top: `${laserPosition.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_14px_4px_rgba(239,68,68,0.9)] animate-ping" />
          <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-white border border-red-400" />
          <div className="absolute -top-6 -right-16 px-1.5 py-0.5 rounded bg-red-950/90 border border-red-500 text-[9px] font-mono text-red-300 whitespace-nowrap shadow-sm">
            Laser Robot
          </div>
        </div>
      )}

      {/* TOP SLIDE PRESENTATION BAR */}
      <div className="px-4 sm:px-6 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/40 backdrop-blur-md">
        {/* PowerPoint Logo & Slide Counter */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-orange-950/40 border border-amber-300/40">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Diapositive {slideIndex + 1} / {slides.length}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold uppercase">
                Motion PPT
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
              {currentSlide.subtitle || 'Présentation Pédagogique Active'}
            </div>
          </div>
        </div>

        {/* Motion Style Selector & Presenter Controls */}
        {showPresenterControls && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Motion type toggles */}
            <div className="hidden sm:flex items-center gap-1 p-0.5 rounded-xl bg-slate-900 border border-slate-700/60 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setMotionType('fly_in')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  motionType === 'fly_in' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Animation Vol Entrant (Fly In)"
              >
                🚀 Vol Entrant
              </button>
              <button
                type="button"
                onClick={() => setMotionType('wipe')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  motionType === 'wipe' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Animation Balayage (Wipe)"
              >
                🧹 Balayage
              </button>
              <button
                type="button"
                onClick={() => setMotionType('zoom')}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  motionType === 'zoom' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Animation Zoom Avant (Grow)"
              >
                🔍 Zoom
              </button>
            </div>

            {/* Laser Pointer Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsLaserPointerActive(!isLaserPointerActive);
                if (onRequestRobotPose) onRequestRobotPose('pointing');
              }}
              className={`p-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                isLaserPointerActive
                  ? 'bg-red-950/80 border-red-500 text-red-300 shadow-md shadow-red-950/60 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Activer le pointeur laser PowerPoint du robot"
            >
              <Target className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline">Laser</span>
            </button>

            {/* Audio Voice Narration */}
            <button
              type="button"
              onClick={handleNarrateCurrentSlide}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                isSpeakingSlide
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-400 text-white animate-pulse'
                  : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 border-indigo-400/50 text-white'
              }`}
              title="Faire lire cette diapositive au Robot Android de manière synchronisée"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>{isSpeakingSlide ? 'Arrêter Voix' : 'Présenter en Voix'}</span>
            </button>

            {/* Prev / Next Slide Nav */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handlePrevSlide}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
                title="Diapositive précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
                title="Diapositive suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MAIN SLIDE CANVAS (16:9 feel, animated slide transitions) */}
      <div className="p-5 sm:p-7 min-h-[340px] flex flex-col justify-between relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={`slide-${slideIndex}-${currentSlide.title}`}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full flex-1 flex flex-col justify-between"
          >
            {/* Slide Title & Subtitle Banner */}
            <div className="mb-6">
              <motion.h3
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-lg sm:text-xl md:text-2xl font-black text-white flex items-center gap-2.5 tracking-tight"
              >
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                <span>{currentSlide.title}</span>
              </motion.h3>
              {currentSlide.subtitle && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="mt-1 text-xs sm:text-sm text-slate-300 font-medium"
                >
                  {currentSlide.subtitle}
                </motion.p>
              )}
            </div>

            {/* SLIDE CONTENT TYPES */}

            {/* 1. THREE CARDS (Concept / Architecture / Points Clés) */}
            {(!currentSlide.type || currentSlide.type === 'three_cards') && currentSlide.cards && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 my-auto">
                {currentSlide.cards.map((card, idx) => {
                  const variants = getCardMotionVariants(idx);
                  return (
                    <motion.div
                      key={idx}
                      {...variants}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group shadow-lg ${themeClasses.cardBg}`}
                      onClick={() => {
                        if (onRequestRobotPose) onRequestRobotPose('pointing');
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{card.icon || '📌'}</span>
                          {card.badge && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${themeClasses.badgeBg}`}>
                              {card.badge}
                            </span>
                          )}
                        </div>
                        <h5 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                          {card.title}
                        </h5>
                        <p className="mt-1.5 text-xs text-slate-300 leading-relaxed font-normal">
                          {card.desc}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Élément Motion {idx + 1}</span>
                        <span className="font-mono text-emerald-400 font-bold">PowerPoint</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* 2. NUMBERED STEPS (Processus / Étapes Pédagogiques) */}
            {currentSlide.type === 'numbered_steps' && currentSlide.steps && (
              <div className="space-y-3 my-auto">
                {currentSlide.steps.map((st, idx) => {
                  const variants = getCardMotionVariants(idx);
                  return (
                    <motion.div
                      key={idx}
                      {...variants}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3.5 shadow-lg ${themeClasses.cardBg}`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{st.icon || '🚀'}</span>
                          <h5 className="font-extrabold text-sm text-white">{st.title}</h5>
                        </div>
                        <p className="mt-1 text-xs text-slate-300 leading-relaxed">{st.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* 3. CORRECT VS INCORRECT (Sécurité / Bonnes Pratiques) */}
            {currentSlide.type === 'correct_incorrect' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-auto">
                {/* Column Conforme */}
                <motion.div
                  {...getCardMotionVariants(0)}
                  className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 shadow-lg space-y-2.5"
                >
                  <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm pb-2 border-b border-emerald-800/50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Pratiques Conformes (Recommandé)</span>
                  </div>
                  <ul className="space-y-2">
                    {currentSlide.correctPoints?.map((pt, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="text-xs text-emerald-100 flex items-start gap-2"
                      >
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span>{pt}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Column Incorrect */}
                <motion.div
                  {...getCardMotionVariants(1)}
                  className="p-4 rounded-2xl bg-red-950/40 border border-red-500/50 shadow-lg space-y-2.5"
                >
                  <div className="flex items-center gap-2 text-red-300 font-extrabold text-sm pb-2 border-b border-red-800/50">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Comportements Interdits (Danger)</span>
                  </div>
                  <ul className="space-y-2">
                    {currentSlide.incorrectPoints?.map((pt, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="text-xs text-red-100 flex items-start gap-2"
                      >
                        <span className="text-red-400 font-bold shrink-0">✕</span>
                        <span>{pt}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            )}

            {/* 4. BULLET POINTS (Puces animées) */}
            {currentSlide.type === 'bullet_points' && currentSlide.items && (
              <div className="space-y-2.5 my-auto max-w-xl">
                {currentSlide.items.map((it, idx) => (
                  <motion.div
                    key={idx}
                    {...getCardMotionVariants(idx)}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center gap-3 text-xs text-slate-200"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" />
                    <span>{it}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Slide Highlight Text Callout */}
            {currentSlide.highlightText && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center gap-2.5 text-xs text-amber-200"
              >
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">{currentSlide.highlightText}</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FOOTER BAR WITH PRESENTER NOTES & CONTROLS */}
      <div className="px-4 sm:px-6 py-2.5 border-t border-white/10 bg-black/50 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-[11px]"
          >
            <span>📝 Notes de Présentation</span>
            <span className="text-[10px] text-amber-400">{showSpeakerNotes ? '▲' : '▼'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-emerald-400 font-mono font-bold">
            {motionType === 'fly_in' ? 'Effet : Vol Entrant' : motionType === 'wipe' ? 'Effet : Balayage' : 'Effet : Zoom'}
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">Academia ITECH Presentation Suite</span>
        </div>
      </div>

      {/* Collapsible Speaker Notes Drawer */}
      <AnimatePresence>
        {showSpeakerNotes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-amber-500/30 bg-amber-950/30 px-5 py-3 text-xs text-amber-100"
          >
            <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              <span>Guidage pour le Robot Android / Formateur :</span>
            </div>
            <p className="italic text-slate-300">
              {currentSlide.speakerNotes ||
                'Insister sur les notions fondamentales et pointer les éléments clés du tableau pendant l\'animation vocale synchrone.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
