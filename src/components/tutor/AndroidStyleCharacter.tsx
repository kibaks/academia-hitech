import React, { useEffect, useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TutorPersona } from '../../types';
import { Sparkles, Mic, Brain, Volume2, ThumbsUp, PartyPopper, Bot } from 'lucide-react';
import { AndroidRobotRig } from './AndroidRobotRig';
import { subscribeSpeechSync } from './speechUtils';

export type VisemeType = 'rest' | 'open_a' | 'open_o' | 'open_e' | 'narrow_m' | 'bite_f' | 'wide_smile';

export type CharacterPose =
  | 'neutral'
  | 'explaining'
  | 'waving'
  | 'pointing'
  | 'celebrating'
  | 'thumbs_up'
  | 'thinking';

export interface AndroidStyleCharacterProps {
  persona: TutorPersona;
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  isCalling?: boolean;
  interactiveMood?: 'happy' | 'explaining' | 'celebrating' | 'focused' | 'waving' | 'pointing' | 'thumbs_up';
  currentPose?: CharacterPose;
  characterModel?: 'android_robot' | 'fatou_cartoon';
  onCharacterClick?: () => void;
  showVoiceWaves?: boolean;
  showBadge?: boolean;
  showModelSwitcher?: boolean;
}

export const AndroidStyleCharacter: React.FC<AndroidStyleCharacterProps> = ({
  persona,
  state,
  size = 'md',
  isCalling = false,
  interactiveMood = 'explaining',
  currentPose,
  characterModel = 'android_robot',
  onCharacterClick,
  showVoiceWaves = true,
  showBadge = true,
  showModelSwitcher = true,
}) => {
  const uid = useId().replace(/:/g, '-');
  const [activeModel, setActiveModel] = useState<'android_robot' | 'fatou_cartoon'>(characterModel);
  const [viseme, setViseme] = useState<VisemeType>('rest');
  const [isBlinking, setIsBlinking] = useState(false);
  const [syllablePhase, setSyllablePhase] = useState(0);
  const [soundWaveHeights, setSoundWaveHeights] = useState<number[]>([8, 16, 24, 18, 10]);
  const [liveSpeechAmplitude, setLiveSpeechAmplitude] = useState<number>(0);
  const [isLiveSpeaking, setIsLiveSpeaking] = useState<boolean>(false);

  // Sync state with incoming prop if changed
  useEffect(() => {
    if (characterModel) {
      setActiveModel(characterModel);
    }
  }, [characterModel]);

  // Real-time speech synchronization listener (master control for lip-sync & cadence)
  useEffect(() => {
    const unsubscribe = subscribeSpeechSync((data) => {
      if (data && data.isSpeaking) {
        setIsLiveSpeaking(true);
        setViseme(data.viseme);
        setLiveSpeechAmplitude(data.amplitude);
        setSyllablePhase((prev) => (prev + 1) % 8);
        setSoundWaveHeights([
          Math.round(8 + data.amplitude * 24),
          Math.round(14 + data.amplitude * 30),
          Math.round(18 + data.amplitude * 36),
          Math.round(14 + data.amplitude * 28),
          Math.round(8 + data.amplitude * 20),
        ]);
      } else {
        setIsLiveSpeaking(false);
        setLiveSpeechAmplitude(0);
        if (state !== 'speaking') {
          setViseme('rest');
        }
      }
    });
    return unsubscribe;
  }, [state]);

  // Determine active pose based on direct prop, mood or state
  const effectivePose: CharacterPose =
    currentPose ||
    (interactiveMood === 'celebrating'
      ? 'celebrating'
      : interactiveMood === 'waving'
      ? 'waving'
      : interactiveMood === 'pointing'
      ? 'pointing'
      : interactiveMood === 'thumbs_up'
      ? 'thumbs_up'
      : state === 'thinking'
      ? 'thinking'
      : state === 'speaking'
      ? 'explaining'
      : 'neutral');

  // Fallback Viseme cycle ONLY when simulated speaking WITHOUT active live audio
  useEffect(() => {
    if (state !== 'speaking' || isLiveSpeaking) {
      if (!isLiveSpeaking && state !== 'speaking') {
        setViseme('rest');
      }
      return;
    }

    const visemeSequence: VisemeType[] = [
      'open_a',
      'open_e',
      'narrow_m',
      'open_o',
      'bite_f',
      'open_a',
      'wide_smile',
      'open_e',
      'open_o',
      'narrow_m',
    ];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % visemeSequence.length;
      setViseme(visemeSequence[currentIndex]);

      setSoundWaveHeights([
        Math.floor(8 + Math.random() * 26),
        Math.floor(12 + Math.random() * 32),
        Math.floor(16 + Math.random() * 38),
        Math.floor(12 + Math.random() * 30),
        Math.floor(8 + Math.random() * 22),
      ]);

      setSyllablePhase((prev) => (prev + 1) % 8);
    }, 115);

    return () => clearInterval(interval);
  }, [state, isLiveSpeaking]);

  // Cartoon Eye Blinking loop (with occasional playful double-blink)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const scheduleNextBlink = () => {
      const delay = 2500 + Math.random() * 2500;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          if (Math.random() < 0.28) {
            setTimeout(() => {
              setIsBlinking(true);
              setTimeout(() => {
                setIsBlinking(false);
                scheduleNextBlink();
              }, 110);
            }, 90);
          } else {
            scheduleNextBlink();
          }
        }, 130);
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Character identification
  const personaIdLower = persona.id.toLowerCase();
  const personaNameLower = persona.name.toLowerCase();

  const isFatou =
    personaIdLower.includes('fatou') ||
    personaNameLower.includes('fatou') ||
    (!personaIdLower.includes('landry') &&
      !personaIdLower.includes('amina') &&
      !personaIdLower.includes('koffi') &&
      !personaIdLower.includes('sarah') &&
      persona.gender === 'female');

  const isLandry =
    personaIdLower.includes('landry') ||
    personaNameLower.includes('landry') ||
    (persona.gender === 'male' && !personaIdLower.includes('koffi'));

  const isAmina = personaIdLower.includes('amina') || personaNameLower.includes('amina');
  const isKoffi = personaIdLower.includes('koffi') || personaNameLower.includes('koffi');
  const isSarah = personaIdLower.includes('sarah') || personaNameLower.includes('sarah');

  // Cartoon color palettes
  // Fatou Sow: Radiant African Tech Queen with golden braids and emerald/gold blazer
  const skinColor = isFatou
    ? '#7A4B2A' // warm rich melanin
    : isLandry
    ? '#693E20' // deep warm bronze
    : isAmina
    ? '#8D562D' // glowing warm amber
    : isKoffi
    ? '#5C3317' // deep cocoa
    : '#F4C8A6'; // Sarah

  const skinHighlight = isFatou
    ? '#965E36'
    : isLandry
    ? '#7F4E2B'
    : isAmina
    ? '#A76939'
    : isKoffi
    ? '#734220'
    : '#FFE4CF';

  const blushColor = isFatou ? '#C06346' : isLandry ? '#8A4828' : isAmina ? '#C86840' : '#FF9F9B';

  const primaryBlazerColor = isFatou
    ? '#047857' // Emerald green
    : isLandry
    ? '#1E3A8A' // Royal navy
    : isAmina
    ? '#D97706' // Warm tech amber
    : isKoffi
    ? '#0E7490' // Cyber cyan
    : '#4338CA'; // Indigo

  const secondaryAccentColor = isFatou
    ? '#F59E0B' // Gold
    : isLandry
    ? '#38BDF8' // Sky blue
    : isAmina
    ? '#EC4899' // Hot pink
    : isKoffi
    ? '#10B981' // Emerald
    : '#A855F7'; // Purple

  // Size scaling definitions
  const dimensions = {
    sm: { w: 120, h: 130, container: 'w-28 h-32' },
    md: { w: 200, h: 220, container: 'w-48 h-52 sm:w-56 sm:h-60' },
    lg: { w: 280, h: 300, container: 'w-64 h-72 sm:w-80 sm:h-88' },
    fullscreen: { w: 360, h: 390, container: 'w-80 h-88 sm:w-96 sm:h-104 md:w-[440px] md:h-[480px]' },
  };

  const dim = dimensions[size];

  // Head and body animation dynamics
  const headBobY =
    state === 'speaking'
      ? syllablePhase % 2 === 0
        ? -2.8
        : 1.8
      : state === 'listening'
      ? 1.2
      : 0;

  const headTilt =
    effectivePose === 'thinking'
      ? 4.5
      : state === 'listening'
      ? -3.5
      : state === 'speaking'
      ? syllablePhase % 3 === 0
        ? 1.8
        : -1.2
      : 0;

  // Render cartoon mouth visemes for dynamic speech
  const renderCartoonMouth = () => {
    switch (viseme) {
      case 'open_a': // Grand ouvert pour les voyelles A
        return (
          <g id="viseme-open-a">
            {/* Cavité buccale cartoon */}
            <ellipse cx="120" cy="148" rx="14" ry="12" fill="#3B0707" />
            {/* Dents du haut visibles */}
            <path d="M 109 140 Q 120 143 131 140 Q 120 146 109 140 Z" fill="#FFFFFF" />
            {/* Langue cartoon rose vif */}
            <ellipse cx="120" cy="155" rx="9" ry="6" fill="#F43F5E" />
            {/* Lèvre supérieure pulpeuse */}
            <path
              d="M 104 142 Q 112 136 120 138 Q 128 136 136 142"
              stroke="#BE185D"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lèvre inférieure */}
            <path
              d="M 107 156 Q 120 162 133 156"
              stroke="#9D174D"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case 'open_o': // Bouche en 'O' / 'OU'
        return (
          <g id="viseme-open-o">
            <ellipse cx="120" cy="148" rx="10" ry="13" fill="#3B0707" />
            <ellipse cx="120" cy="154" rx="6" ry="4" fill="#F43F5E" />
            <path d="M 113 139 Q 120 141 127 139 Z" fill="#FFFFFF" />
            <ellipse cx="120" cy="148" rx="12" ry="15" stroke="#BE185D" strokeWidth="3" fill="none" />
          </g>
        );

      case 'open_e': // Grand sourire ouvert 'É' / 'I'
        return (
          <g id="viseme-open-e">
            <path d="M 105 145 Q 120 156 135 145 Q 120 141 105 145 Z" fill="#3B0707" />
            {/* Dents supérieures et inférieures éclatantes */}
            <path d="M 108 144 Q 120 146 132 144 L 132 148 Q 120 150 108 148 Z" fill="#FFFFFF" />
            <ellipse cx="120" cy="152" rx="7" ry="3.5" fill="#F43F5E" />
            <path
              d="M 102 143 Q 111 137 120 139 Q 129 137 138 143"
              stroke="#BE185D"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 106 151 Q 120 158 134 151"
              stroke="#9D174D"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case 'bite_f': // Sons 'F' et 'V'
        return (
          <g id="viseme-bite-f">
            <path d="M 110 143 Q 120 145 130 143 L 129 148 Q 120 149 111 148 Z" fill="#FFFFFF" />
            <path
              d="M 106 142 Q 120 139 134 142"
              stroke="#BE185D"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 108 149 Q 120 154 132 149"
              stroke="#9D174D"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case 'narrow_m': // Lèvres pincées 'M' / 'P' / 'B'
        return (
          <g id="viseme-narrow-m">
            <path
              d="M 106 146 Q 113 143 120 144 Q 127 143 134 146"
              stroke="#BE185D"
              strokeWidth="3.6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 110 149 Q 120 152 130 149"
              stroke="#9D174D"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case 'wide_smile': // Grand rire / expression joyeuse
        return (
          <g id="viseme-wide-smile">
            <path d="M 102 143 Q 120 162 138 143 Q 120 140 102 143 Z" fill="#3B0707" />
            <path d="M 106 143 Q 120 145 134 143 L 133 148 Q 120 150 107 148 Z" fill="#FFFFFF" />
            <ellipse cx="120" cy="154" rx="8" ry="4.5" fill="#F43F5E" />
            <path
              d="M 100 141 Q 110 135 120 137 Q 130 135 140 141"
              stroke="#BE185D"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 104 154 Q 120 164 136 154"
              stroke="#9D174D"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );

      case 'rest':
      default:
        // Repos : Sourire bienveillant et chaleureux
        return (
          <g id="viseme-rest">
            {effectivePose === 'thinking' ? (
              <path
                d="M 112 147 Q 120 144 128 147"
                stroke="#BE185D"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <>
                {/* Sourire gracieux naturel */}
                <path
                  d="M 106 144 Q 120 154 134 144"
                  stroke="#BE185D"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 111 150 Q 120 156 129 150"
                  stroke="#9D174D"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            )}
          </g>
        );
    }
  };

  return (
    <div
      onClick={onCharacterClick}
      className={`relative flex flex-col items-center justify-center select-none ${
        onCharacterClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* 0. Modèle Switcher : Robot Android vs Fatou Cartoon */}
      {showModelSwitcher && (
        <div className="mb-2.5 flex items-center justify-center gap-1 p-1 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 shadow-md">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveModel('android_robot');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeModel === 'android_robot'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60 border border-emerald-400/50'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Activer le Robot Android (Voix synchrone & motions)"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-300" />
            <span>Robot Android</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveModel('fatou_cartoon');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              activeModel === 'fatou_cartoon'
                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-950/60 border border-amber-400/50'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Activer l'avatar dessin animé Fatou"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Fatou Cartoon</span>
          </button>
        </div>
      )}

      {/* 1. Halo magique d'ambiance dessin animé */}
      <AnimatePresence>
        {state === 'speaking' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.35, 0.75, 0.35],
              scale: [1, 1.15, 1],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="absolute -inset-6 rounded-full bg-gradient-to-tr from-emerald-500/25 via-amber-500/25 to-indigo-500/30 blur-2xl pointer-events-none"
          />
        )}
        {state === 'listening' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [0.95, 1.12, 0.95],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="absolute -inset-6 rounded-full bg-gradient-to-tr from-cyan-500/30 to-teal-500/30 blur-2xl pointer-events-none"
          />
        )}
        {effectivePose === 'celebrating' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            className="absolute -inset-8 rounded-full border-2 border-dashed border-amber-400/40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 2. Conteneur principal du dessin animé SVG avec animation globale */}
      <motion.div
        animate={{
          y: headBobY,
          rotate: headTilt,
          scale: state === 'speaking' ? 1.025 : 1,
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className={`relative ${dim.container} flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 240 260"
          className="w-full h-full drop-shadow-2xl overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dégradés du teint et de l'ombre de dessin animé */}
            <linearGradient id={`skinGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={skinHighlight} />
              <stop offset="50%" stopColor={skinColor} />
              <stop offset="100%" stopColor="#4A2510" />
            </linearGradient>

            {/* Dégradé du Blazer Tech */}
            <linearGradient id={`blazerGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryBlazerColor} />
              <stop offset="100%" stopColor="#06251A" />
            </linearGradient>

            {/* Dégradé Tresses Noires & Reflets Dorés pour Fatou */}
            <linearGradient id={`braidsGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A1B18" />
              <stop offset="40%" stopColor="#120A08" />
              <stop offset="100%" stopColor="#090504" />
            </linearGradient>

            {/* Dégradé Perles d'Or */}
            <linearGradient id={`goldGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Ombre portée douce */}
            <filter id={`softShadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* ===== SWITCHER DE RENDU : ROBOT ANDROID VS FATOU CARTOON ===== */}
          {activeModel === 'android_robot' ? (
            <AndroidRobotRig
              uid={uid}
              state={state}
              effectivePose={effectivePose}
              viseme={viseme}
              isBlinking={isBlinking}
              liveSpeechAmplitude={liveSpeechAmplitude}
              syllablePhase={syllablePhase}
              soundWaveHeights={soundWaveHeights}
              onRobotClick={onCharacterClick}
            />
          ) : (
            <>
              {/* ===== COUCHE 1 : COIFFURE ARRIÈRE (Pour Fatou : Chignon haut & tresses arrière) ===== */}
              {isFatou && (
                <g id="fatou-back-hair">
                  {/* Grand Chignon Tressé Haut de Reine Africaine */}
                  <ellipse cx="120" cy="50" rx="38" ry="34" fill={`url(#braidsGrad-${uid})`} filter={`url(#softShadow-${uid})`} />
                  {/* Motifs de tresses stylisées dans le chignon */}
                  <path
                    d="M 92 48 Q 120 30 148 48 M 96 38 Q 120 22 144 38 M 98 58 Q 120 42 142 58"
                    stroke="#3D261E"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  {/* Couronne de perles d'or africaines sur le chignon */}
                  <circle cx="100" cy="45" r="3.2" fill={`url(#goldGrad-${uid})`} />
                  <circle cx="110" cy="38" r="3.5" fill={`url(#goldGrad-${uid})`} />
                  <circle cx="120" cy="35" r="4" fill={`url(#goldGrad-${uid})`} />
                  <circle cx="130" cy="38" r="3.5" fill={`url(#goldGrad-${uid})`} />
                  <circle cx="140" cy="45" r="3.2" fill={`url(#goldGrad-${uid})`} />

                  {/* Tresses longues retombant gracieusement derrière les épaules */}
                  <path
                    d="M 86 85 C 72 110, 68 150, 72 185 C 76 186, 82 184, 84 175 C 80 145, 84 110, 94 90 Z"
                    fill={`url(#braidsGrad-${uid})`}
                  />
                  <path
                    d="M 154 85 C 168 110, 172 150, 168 185 C 164 186, 158 184, 156 175 C 160 145, 156 110, 146 90 Z"
                    fill={`url(#braidsGrad-${uid})`}
                  />
                </g>
              )}

              {/* ===== COUCHE 2 : CORPS, BUSTE & BRAS DE DESSIN ANIMÉ ===== */}
              <g id="character-body">
                {/* Respiration douce du torse */}
                <motion.g
                  animate={{
                    scaleY: [1, 1.018, 1],
                    y: [0, -1.2, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                >
                  {/* Cou élégant */}
                  <path
                    d="M 108 145 L 108 178 Q 120 184 132 178 L 132 145 Z"
                    fill={`url(#skinGrad-${uid})`}
                  />
                  {/* Ombre douce sous le menton */}
                  <ellipse cx="120" cy="150" rx="14" ry="4" fill="#3D1E0C" opacity="0.4" />

                  {/* T-shirt intérieur sous le blazer */}
                  <path d="M 102 174 Q 120 196 138 174 L 144 240 L 96 240 Z" fill="#F8FAFC" />
                  {/* Petit logo Tech ITECH sur le col */}
                  <circle cx="120" cy="190" r="3.5" fill="#047857" />
                  <path d="M 118 190 L 122 190 M 120 188 L 120 192" stroke="#FFFFFF" strokeWidth="1" />

                  {/* Blazer Tech cintré cartoon */}
                  {/* Côté gauche du blazer */}
                  <path
                    d="M 72 180 Q 88 172 105 174 L 114 245 L 60 245 Q 64 210 72 180 Z"
                    fill={`url(#blazerGrad-${uid})`}
                    filter={`url(#softShadow-${uid})`}
                  />
                  {/* Côté droit du blazer */}
              <path
                d="M 168 180 Q 152 172 135 174 L 126 245 L 180 245 Q 176 210 168 180 Z"
                fill={`url(#blazerGrad-${uid})`}
                filter={`url(#softShadow-${uid})`}
              />

              {/* Revers et col chic avec liseré doré pour Fatou */}
              <path
                d="M 96 174 L 112 210 L 100 245 M 144 174 L 128 210 L 140 245"
                stroke={secondaryAccentColor}
                strokeWidth="2.5"
                fill="none"
              />
            </motion.g>

            {/* ===== BRAS ET MAINS ANIMÉS DU DESSIN ANIMÉ ===== */}
            {/* BRAS GAUCHE (Waving ou gestuelle d'explication) */}
            {effectivePose === 'waving' ? (
              <g id="arm-left-waving">
                {/* Bras levé qui salue */}
                <path
                  d="M 72 180 Q 52 155 42 125 L 54 120 Q 64 150 82 175 Z"
                  fill={`url(#blazerGrad-${uid})`}
                />
                {/* Avant-bras & Main qui fait signe */}
                <motion.g
                  animate={{ rotate: [-16, 16, -16] }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                  style={{ originX: '48px', originY: '120px' }}
                >
                  <path d="M 44 122 L 36 90 L 48 88 L 54 120 Z" fill={`url(#skinGrad-${uid})`} />
                  {/* Main cartoon avec 4 doigts ouverts */}
                  <g transform="translate(30, 70)">
                    <circle cx="12" cy="14" r="8" fill={skinColor} />
                    {/* Doigts ouverts */}
                    <rect x="4" y="2" width="4" height="12" rx="2" fill={skinColor} />
                    <rect x="9" y="0" width="4.2" height="14" rx="2.1" fill={skinColor} />
                    <rect x="14" y="2" width="4" height="12" rx="2" fill={skinColor} />
                    <rect x="19" y="5" width="3.8" height="10" rx="1.9" fill={skinColor} />
                    {/* Pouce */}
                    <path d="M 4 12 Q -2 14 0 18 Q 4 18 6 15 Z" fill={skinColor} />
                  </g>
                </motion.g>
              </g>
            ) : effectivePose === 'celebrating' ? (
              <g id="arm-left-cheering">
                {/* Bras levé en fête */}
                <path d="M 72 180 Q 48 145 38 105 L 50 100 Q 62 140 82 175 Z" fill={`url(#blazerGrad-${uid})`} />
                <circle cx="44" cy="95" r="9" fill={skinColor} />
              </g>
            ) : (
              <g id="arm-left-natural">
                {/* Bras au repos / léger geste d'explication */}
                <motion.path
                  animate={{
                    d:
                      state === 'speaking'
                        ? 'M 72 180 Q 56 205 60 230 L 72 230 Q 68 208 82 185 Z'
                        : 'M 72 180 Q 58 205 62 235 L 74 235 Q 70 210 82 185 Z',
                  }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  fill={`url(#blazerGrad-${uid})`}
                />
                {/* Main gauche posée élégamment */}
                <motion.circle
                  cx="66"
                  cy="236"
                  r="7.5"
                  fill={skinColor}
                  animate={{ y: state === 'speaking' ? [-1, 2, -1] : [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                />
              </g>
            )}

            {/* BRAS DROIT (Pointing, Thumbs Up, Explaining, ou Thinking) */}
            {effectivePose === 'pointing' ? (
              <g id="arm-right-pointing">
                {/* Bras tendu vers le cours / le contenu */}
                <path
                  d="M 168 180 Q 192 165 210 155 L 214 167 Q 194 178 172 195 Z"
                  fill={`url(#blazerGrad-${uid})`}
                />
                {/* Main avec index pointé 👉 */}
                <g transform="translate(208, 146)">
                  <ellipse cx="10" cy="14" rx="7" ry="8" fill={skinColor} />
                  {/* Index tendu */}
                  <rect x="14" y="9" width="16" height="5" rx="2.5" fill={skinColor} />
                  {/* Ongle cartoon net */}
                  <rect x="26" y="10" width="3" height="3" rx="1" fill="#F87171" opacity="0.6" />
                  {/* Pouce plié */}
                  <ellipse cx="8" cy="10" rx="4" ry="4" fill={skinColor} />
                </g>
              </g>
            ) : effectivePose === 'thumbs_up' ? (
              <g id="arm-right-thumbsup">
                {/* Bras levé avec pouce 👍 */}
                <path
                  d="M 168 180 Q 185 160 195 140 L 206 145 Q 194 170 174 195 Z"
                  fill={`url(#blazerGrad-${uid})`}
                />
                <g transform="translate(192, 122)">
                  <circle cx="10" cy="14" r="8" fill={skinColor} />
                  {/* Pouce dressé vers le haut */}
                  <rect x="8" y="-4" width="6" height="15" rx="3" fill={skinColor} />
                  {/* Étoile de réussite dorée */}
                  <motion.path
                    d="M 11 -12 L 13 -7 L 18 -7 L 14 -3 L 16 2 L 11 -1 L 7 2 L 8 -3 L 5 -7 L 10 -7 Z"
                    fill="#F59E0B"
                    animate={{ scale: [1, 1.35, 1], rotate: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                  />
                </g>
              </g>
            ) : effectivePose === 'thinking' ? (
              <g id="arm-right-thinking">
                {/* Main posée sous le menton pour la réflexion */}
                <path
                  d="M 168 180 Q 175 165 162 148 L 152 153 Q 165 170 162 195 Z"
                  fill={`url(#blazerGrad-${uid})`}
                />
                <circle cx="140" cy="154" r="7" fill={skinColor} />
                <rect x="133" y="148" width="5" height="10" rx="2.5" fill={skinColor} />
              </g>
            ) : effectivePose === 'celebrating' ? (
              <g id="arm-right-cheering">
                <path
                  d="M 168 180 Q 192 145 202 105 L 190 100 Q 178 140 158 175 Z"
                  fill={`url(#blazerGrad-${uid})`}
                />
                <circle cx="196" cy="95" r="9" fill={skinColor} />
              </g>
            ) : (
              <g id="arm-right-explaining">
                {/* Gestuelle d'explication pédagogique active */}
                <motion.g
                  animate={{
                    y: state === 'speaking' ? [-3, 3, -3] : [0, 0, 0],
                    rotate: state === 'speaking' ? [-4, 4, -4] : [0, 0, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  style={{ originX: '168px', originY: '180px' }}
                >
                  <path
                    d="M 168 180 Q 188 195 198 180 L 206 188 Q 192 210 172 195 Z"
                    fill={`url(#blazerGrad-${uid})`}
                  />
                  {/* Main ouverte paume vers l'apprenant */}
                  <g transform="translate(196, 172)">
                    <circle cx="8" cy="8" r="7.5" fill={skinColor} />
                    {/* Doigts déliés en geste pédagogique */}
                    <rect x="6" y="-2" width="3.5" height="9" rx="1.75" fill={skinColor} />
                    <rect x="10" y="-1" width="3.5" height="8" rx="1.75" fill={skinColor} />
                    <rect x="14" y="1" width="3.5" height="7" rx="1.75" fill={skinColor} />
                  </g>
                </motion.g>
              </g>
            )}
          </g>

          {/* ===== COUCHE 3 : TÊTE, OREILLES, VISAGE CARTOON & EXPRESSIONS ===== */}
          <g id="head-group">
            {/* Oreille Gauche */}
            <ellipse cx="68" cy="115" rx="8" ry="12" fill={skinColor} />
            <ellipse cx="69" cy="115" rx="4.5" ry="7" fill="#3D1E0C" opacity="0.3" />

            {/* Oreille Droite */}
            <ellipse cx="172" cy="115" rx="8" ry="12" fill={skinColor} />
            <ellipse cx="171" cy="115" rx="4.5" ry="7" fill="#3D1E0C" opacity="0.3" />

            {/* Boucle d'oreille anneau doré pour Fatou Sow */}
            {isFatou && (
              <motion.g
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                style={{ originX: '68px', originY: '122px' }}
              >
                <circle
                  cx="67"
                  cy="126"
                  r="6.5"
                  stroke={`url(#goldGrad-${uid})`}
                  strokeWidth="2.4"
                  fill="none"
                />
              </motion.g>
            )}

            {/* Oreillette Tech intelligente sur l'oreille droite pour Fatou / Amina */}
            {(isFatou || isAmina) && (
              <g id="tech-earpiece">
                <circle cx="174" cy="117" r="4.5" fill="#0284C7" />
                <circle cx="174" cy="117" r="2.2" fill="#38BDF8" />
                <motion.circle
                  cx="174"
                  cy="117"
                  r="7.5"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  fill="none"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                />
              </g>
            )}

            {/* Forme du Visage Cartoon Expressif (Machoires douces, menton fin) */}
            <path
              d="M 72 96 C 72 52, 168 52, 168 96 C 168 142, 152 166, 120 166 C 88 166, 72 142, 72 96 Z"
              fill={`url(#skinGrad-${uid})`}
              filter={`url(#softShadow-${uid})`}
            />

            {/* Pommettes lumineuses et blush cartoon */}
            <ellipse
              cx="86"
              cy="128"
              rx="9"
              ry="5"
              fill={blushColor}
              opacity={state === 'speaking' ? 0.75 : 0.5}
            />
            <ellipse
              cx="154"
              cy="128"
              rx="9"
              ry="5"
              fill={blushColor}
              opacity={state === 'speaking' ? 0.75 : 0.5}
            />

            {/* Barbe soignée si Dr. Landry */}
            {isLandry && (
              <path
                d="M 88 135 C 92 165, 148 165, 152 135 C 144 168, 96 168, 88 135 Z"
                fill="#18181B"
                opacity="0.9"
              />
            )}

            {/* ===== COIFFURE AVANT DU PERSONNAGE ===== */}
            {isFatou && (
              <g id="fatou-front-hair">
                {/* Ligne frontale stylisée avec baby hairs élégants */}
                <path
                  d="M 72 94 C 84 68, 105 76, 120 72 C 135 76, 156 68, 168 94 C 160 84, 140 76, 120 76 C 100 76, 80 84, 72 94 Z"
                  fill="#120A08"
                />
                {/* Deux tresses signature encadrant gracieusement les tempes */}
                {/* Tresse gauche */}
                <path
                  d="M 80 88 C 76 110, 78 135, 82 155 C 84 155, 87 154, 88 150 C 84 130, 83 110, 88 88 Z"
                  fill={`url(#braidsGrad-${uid})`}
                />
                {/* Bague dorée au bout de la tresse gauche */}
                <rect x="80" y="145" width="5" height="3" rx="1" fill={`url(#goldGrad-${uid})`} />

                {/* Tresse droite */}
                <path
                  d="M 160 88 C 164 110, 162 135, 158 155 C 156 155, 153 154, 152 150 C 156 130, 157 110, 152 88 Z"
                  fill={`url(#braidsGrad-${uid})`}
                />
                {/* Bague dorée au bout de la tresse droite */}
                <rect x="155" y="145" width="5" height="3" rx="1" fill={`url(#goldGrad-${uid})`} />
              </g>
            )}

            {isLandry && (
              <g id="landry-hair">
                {/* Dégradé propre tech afro */}
                <path d="M 70 90 C 66 50, 174 50, 170 90 Q 120 70 70 90 Z" fill="#18181B" />
              </g>
            )}

            {isAmina && (
              <g id="amina-hair">
                {/* Foulard moderne stylisé / serre-tête chic */}
                <path d="M 68 88 C 65 48, 175 48, 172 88 Q 120 68 68 88 Z" fill="#D97706" />
                <path d="M 72 84 Q 120 64 168 84" stroke="#FBBF24" strokeWidth="3" fill="none" />
              </g>
            )}

            {/* ===== SOURCILS CARTOON HYPER EXPRESSIFS ===== */}
            <g id="cartoon-eyebrows">
              {effectivePose === 'thinking' ? (
                <>
                  {/* Sourcil gauche haussé, sourcil droit froncé */}
                  <path
                    d="M 85 92 Q 98 84 110 91"
                    stroke="#18100C"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 130 96 Q 142 94 155 90"
                    stroke="#18100C"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              ) : state === 'listening' ? (
                <>
                  {/* Sourcils haussés d'attention bienveillante */}
                  <path
                    d="M 84 90 Q 98 83 111 88"
                    stroke="#18100C"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 129 88 Q 142 83 156 90"
                    stroke="#18100C"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              ) : (
                <>
                  {/* Sourcils cartoon vivants en rythme avec la parole */}
                  <motion.path
                    animate={{
                      d:
                        state === 'speaking'
                          ? 'M 85 91 Q 98 84 111 89'
                          : 'M 86 93 Q 98 87 110 92',
                    }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    stroke="#18100C"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <motion.path
                    animate={{
                      d:
                        state === 'speaking'
                          ? 'M 129 89 Q 142 84 155 91'
                          : 'M 130 92 Q 142 87 154 93',
                    }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    stroke="#18100C"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
            </g>

            {/* ===== YEUX DE DESSIN ANIMÉ AVEC REGARD VIVANT & CLIGNEMENT ===== */}
            <g id="cartoon-eyes">
              {isBlinking ? (
                // Clignement d'œil cartoon (arc de cercle avec cils élégants)
                <>
                  <path
                    d="M 85 114 Q 98 122 111 114"
                    stroke="#18100C"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Petits cils extérieurs */}
                  <path d="M 83 113 L 78 110 M 85 116 L 81 116" stroke="#18100C" strokeWidth="2" strokeLinecap="round" />

                  <path
                    d="M 129 114 Q 142 122 155 114"
                    stroke="#18100C"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path d="M 157 113 L 162 110 M 155 116 L 159 116" stroke="#18100C" strokeWidth="2" strokeLinecap="round" />
                </>
              ) : effectivePose === 'thinking' ? (
                // Regard pensif vers le haut à droite
                <>
                  {/* Œil gauche */}
                  <ellipse cx="98" cy="112" rx="12.5" ry="10.5" fill="#FFFFFF" stroke="#18100C" strokeWidth="1.4" />
                  <circle cx="102" cy="108" r="6" fill="#78350F" />
                  <circle cx="102" cy="108" r="3.2" fill="#18100C" />
                  <circle cx="104" cy="106" r="2.2" fill="#FFFFFF" />

                  {/* Œil droit */}
                  <ellipse cx="142" cy="112" rx="12.5" ry="10.5" fill="#FFFFFF" stroke="#18100C" strokeWidth="1.4" />
                  <circle cx="146" cy="108" r="6" fill="#78350F" />
                  <circle cx="146" cy="108" r="3.2" fill="#18100C" />
                  <circle cx="148" cy="106" r="2.2" fill="#FFFFFF" />
                </>
              ) : (
                // Yeux cartoon grandioses et pétillants (Disney/Pixar 2D anime style)
                <>
                  {/* Œil Gauche */}
                  <ellipse cx="98" cy="113" rx="13" ry="11.5" fill="#FFFFFF" stroke="#18100C" strokeWidth="1.6" />
                  {/* Iris Noisette / Ambre chaud */}
                  <circle cx="98" cy="113" r="6.8" fill={isSarah ? '#047857' : '#92400E'} />
                  {/* Pupille noire profonde */}
                  <circle cx="98" cy="113" r="3.8" fill="#18100C" />
                  {/* Reflet de lumière principal (Star specular) */}
                  <circle cx="95.5" cy="110" r="2.8" fill="#FFFFFF" />
                  {/* Deuxième reflet cartoon (Twinkle) */}
                  <circle cx="100.5" cy="115" r="1.4" fill="#FFFFFF" />
                  {/* Eyeliner et cils courbés */}
                  <path
                    d="M 85 110 Q 98 102 111 110"
                    stroke="#18100C"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {isFatou && (
                    <path d="M 84 109 Q 80 106 78 103" stroke="#18100C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  )}

                  {/* Œil Droit */}
                  <ellipse cx="142" cy="113" rx="13" ry="11.5" fill="#FFFFFF" stroke="#18100C" strokeWidth="1.6" />
                  {/* Iris Noisette / Ambre chaud */}
                  <circle cx="142" cy="113" r="6.8" fill={isSarah ? '#047857' : '#92400E'} />
                  {/* Pupille noire profonde */}
                  <circle cx="142" cy="113" r="3.8" fill="#18100C" />
                  {/* Reflet de lumière principal */}
                  <circle cx="139.5" cy="110" r="2.8" fill="#FFFFFF" />
                  {/* Deuxième reflet cartoon */}
                  <circle cx="144.5" cy="115" r="1.4" fill="#FFFFFF" />
                  {/* Eyeliner et cils courbés */}
                  <path
                    d="M 129 110 Q 142 102 155 110"
                    stroke="#18100C"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {isFatou && (
                    <path d="M 156 109 Q 160 106 162 103" stroke="#18100C" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                  )}
                </>
              )}
            </g>

            {/* Lunettes modernes intelligentes pour Dr. Landry ou Sarah */}
            {(isLandry || isSarah) && (
              <g id="character-glasses">
                <rect x="83" y="102" width="30" height="22" rx="7" stroke="#1E293B" strokeWidth="3" fill="#FFFFFF" fillOpacity="0.1" />
                <rect x="127" y="102" width="30" height="22" rx="7" stroke="#1E293B" strokeWidth="3" fill="#FFFFFF" fillOpacity="0.1" />
                <path d="M 113 111 L 127 111" stroke="#1E293B" strokeWidth="3" />
              </g>
            )}

            {/* Nez cartoon mignon et stylisé */}
            <path
              d="M 118 126 Q 120 131 123 129"
              stroke="#3D1E0C"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />

            {/* ===== BOUCHE ET VISÈMES DE SYNCHRONISATION LABIALE ===== */}
            <g id="mouth-viseme-rig" className="transition-all duration-75">
              {renderCartoonMouth()}
            </g>
          </g>
            </>
          )}
        </svg>

        {/* 3. Égaliseur vocal dynamique au bas du personnage en mode parole */}
        {state === 'speaking' && showVoiceWaves && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-emerald-400/60 shadow-xl z-30">
            {soundWaveHeights.map((h, i) => (
              <motion.span
                key={i}
                animate={{ height: `${h}px` }}
                transition={{ duration: 0.1 }}
                className="w-1.5 bg-gradient-to-t from-emerald-400 to-amber-300 rounded-full"
              />
            ))}
          </div>
        )}

        {/* 4. Ondes d'écoute en mode listening */}
        {state === 'listening' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="w-32 h-32 rounded-full border-2 border-cyan-400 border-dashed"
            />
          </div>
        )}

        {/* 5. Cerveau IA étincelant en mode réflexion */}
        {state === 'thinking' && (
          <div className="absolute top-2 right-2 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360, scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
              className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/80 flex items-center justify-center shadow-lg"
            >
              <Brain className="w-5 h-5 text-amber-300 animate-pulse" />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Badge et Statut du Personnage */}
      {showBadge && (
        <div className="mt-2.5 flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-1.5">
            <span className="text-sm sm:text-base font-black text-white tracking-wide drop-shadow-md">
              {persona.name}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-600/60 font-bold">
              {persona.badge || 'Avatar Cartoon ITECH'}
            </span>
          </div>

          {/* Badge d'action live */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold border transition-all ${
              state === 'speaking' || isLiveSpeaking
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 animate-pulse shadow-md shadow-emerald-950/50'
                : state === 'listening'
                ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500'
                : state === 'thinking'
                ? 'bg-amber-950/90 text-amber-300 border-amber-500'
                : 'bg-slate-900/90 text-slate-300 border-slate-700'
            }`}
          >
            {state === 'speaking' || isLiveSpeaking ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {activeModel === 'android_robot'
                    ? 'Robot Android : Voix Synchrone 🤖'
                    : 'Animation Dessin Animé & Lèvres'}
                </span>
              </>
            ) : state === 'listening' ? (
              <>
                <Mic className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                <span>
                  {activeModel === 'android_robot' ? 'Robot Android à l\'écoute...' : 'Fatou à votre écoute...'}
                </span>
              </>
            ) : state === 'thinking' ? (
              <>
                <Brain className="w-3.5 h-3.5 text-amber-400" />
                <span>Réflexion & Analyse IA...</span>
              </>
            ) : effectivePose === 'pointing' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>Pointeur Laser PowerPoint 🎯</span>
              </>
            ) : effectivePose === 'waving' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {activeModel === 'android_robot' ? 'Le Robot vous salue 👋' : 'Fatou vous salue 👋'}
                </span>
              </>
            ) : effectivePose === 'celebrating' ? (
              <>
                <PartyPopper className="w-3.5 h-3.5 text-amber-300" />
                <span>Félicitations ! 🎉</span>
              </>
            ) : effectivePose === 'thumbs_up' ? (
              <>
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bravo ! 👍</span>
              </>
            ) : (
              <>
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {activeModel === 'android_robot' ? 'Robot Android Prêt' : 'Dessin Animé Prêt'}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
