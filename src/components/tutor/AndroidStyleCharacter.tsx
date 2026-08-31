import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TutorPersona } from '../../types';
import { Sparkles, Mic, Brain, Volume2, ShieldCheck, Zap, Smile, Heart, Play } from 'lucide-react';

export type VisemeType = 'rest' | 'open_a' | 'open_o' | 'open_e' | 'narrow_m' | 'bite_f' | 'wide_smile';

export interface AndroidStyleCharacterProps {
  persona: TutorPersona;
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  isCalling?: boolean;
  interactiveMood?: 'happy' | 'explaining' | 'celebrating' | 'focused';
  onCharacterClick?: () => void;
}

export const AndroidStyleCharacter: React.FC<AndroidStyleCharacterProps> = ({
  persona,
  state,
  size = 'md',
  isCalling = false,
  interactiveMood = 'explaining',
  onCharacterClick,
}) => {
  // Mouth viseme state for real-time lip movement
  const [viseme, setViseme] = useState<VisemeType>('rest');
  const [isBlinking, setIsBlinking] = useState(false);
  const [headBobPhase, setHeadBobPhase] = useState(0);
  const [soundWaveHeights, setSoundWaveHeights] = useState<number[]>([8, 16, 24, 18, 10]);
  const [sparklesVisible, setSparklesVisible] = useState(false);

  // Visemes cycle when speaking - simulating natural phonemes/syllables
  useEffect(() => {
    if (state !== 'speaking') {
      setViseme('rest');
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
      // Add dynamic randomness for natural mouth variation
      if (Math.random() > 0.7) {
        setViseme(visemeSequence[Math.floor(Math.random() * visemeSequence.length)]);
      } else {
        setViseme(visemeSequence[currentIndex]);
      }

      // Sync sound equalizer / voice vibration waves
      setSoundWaveHeights([
        Math.floor(6 + Math.random() * 26),
        Math.floor(10 + Math.random() * 32),
        Math.floor(14 + Math.random() * 38),
        Math.floor(10 + Math.random() * 30),
        Math.floor(6 + Math.random() * 22),
      ]);

      // Dynamic head bobbing on speech syllables
      setHeadBobPhase((prev) => (prev + 1) % 6);
    }, 110); // 110ms per syllable viseme transition

    return () => clearInterval(interval);
  }, [state]);

  // Natural Eye Blinking loop (every 3 to 4.5 seconds with realistic duration)
  useEffect(() => {
    let blinkTimeout: any;
    const scheduleNextBlink = () => {
      const delay = 2800 + Math.random() * 2200;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          // 20% chance of an immediate cute double-blink like in Android language apps
          if (Math.random() < 0.25) {
            setTimeout(() => {
              setIsBlinking(true);
              setTimeout(() => {
                setIsBlinking(false);
                scheduleNextBlink();
              }, 120);
            }, 100);
          } else {
            scheduleNextBlink();
          }
        }, 140);
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Character specific attributes
  const isMale = persona.gender === 'male';
  const isMarc = persona.id.includes('marc');
  const isDavid = persona.id.includes('david');
  const isSarah = persona.id.includes('sarah');
  const isAida = !isMarc && !isDavid && !isSarah;

  // Skin tones & theme palettes tailored for characters
  const skinColor = isMarc ? '#8D5524' : isDavid ? '#F2C6A0' : isSarah ? '#FBD3B6' : '#C68642'; // AIDA warm glowing melanin tone
  const blushColor = isMarc ? '#A75D37' : isDavid ? '#FFB299' : '#FFAAA6';
  const hairColor = isAida ? '#2D1537' : isMarc ? '#1E1E24' : isSarah ? '#8C3B1E' : '#1A202C';
  const hairHighlight = isAida ? '#6366F1' : isMarc ? '#4A5568' : isSarah ? '#D97706' : '#3B82F6';
  const shirtColor = isAida ? '#4F46E5' : isMarc ? '#0284C7' : isSarah ? '#0D9488' : '#7C3AED';

  // Size definitions for responsive scaling
  const dimensions = {
    sm: { w: 110, h: 120, container: 'w-28 h-30' },
    md: { w: 190, h: 200, container: 'w-44 h-48 sm:w-52 sm:h-56' },
    lg: { w: 250, h: 260, container: 'w-60 h-64 sm:w-72 sm:h-76' },
    fullscreen: { w: 320, h: 330, container: 'w-72 h-76 sm:w-96 sm:h-100 md:w-[380px] md:h-[400px]' },
  };

  const dim = dimensions[size];

  // Head bobbing offset based on speech rhythm
  const headBobY = state === 'speaking' ? (headBobPhase % 2 === 0 ? -2.5 : 1.5) : state === 'listening' ? 1 : 0;
  const headTilt = state === 'listening' ? -3 : state === 'thinking' ? 2.5 : state === 'speaking' ? (headBobPhase % 3 === 0 ? 1 : -1) : 0;

  // Dynamic Lip SVG Paths for real-time Visemes
  // Center of mouth is at (100, 138) in a 200x200 canvas
  const renderMouthViseme = () => {
    switch (viseme) {
      case 'open_a': // Wide Open 'Ah'
        return (
          <g id="viseme-open-a">
            {/* Open Dark Oral Cavity */}
            <ellipse cx="100" cy="138" rx="14" ry="11" fill="#450A0A" />
            {/* Pink Tongue */}
            <ellipse cx="100" cy="144" rx="9" ry="6" fill="#F43F5E" />
            {/* Upper Teeth Bar */}
            <path d="M 88 132 Q 100 134 112 132 Q 100 137 88 132 Z" fill="#FFFFFF" />
            {/* Upper Lip Contour */}
            <path d="M 84 135 Q 92 129 100 131 Q 108 129 116 135" stroke="#E11D48" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            {/* Lower Lip Contour */}
            <path d="M 87 146 Q 100 152 113 146" stroke="#BE123C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'open_o': // Round 'Oh' / 'Ou'
        return (
          <g id="viseme-open-o">
            {/* Round Cavity */}
            <ellipse cx="100" cy="138" rx="9" ry="12" fill="#450A0A" />
            {/* Tongue */}
            <circle cx="100" cy="143" r="5" fill="#F43F5E" />
            {/* Upper Teeth hint */}
            <path d="M 93 131 Q 100 133 107 131 Z" fill="#FFFFFF" />
            {/* Round Lips Outer */}
            <ellipse cx="100" cy="138" rx="11" ry="14" stroke="#E11D48" strokeWidth="2.8" fill="none" />
          </g>
        );

      case 'open_e': // Wide 'Eh' / 'Ee' / Smile Talk
        return (
          <g id="viseme-open-e">
            {/* Wide Shallow Cavity */}
            <path d="M 85 136 Q 100 146 115 136 Q 100 133 85 136 Z" fill="#450A0A" />
            {/* Visible Upper & Lower Teeth */}
            <path d="M 88 135 Q 100 137 112 135 L 112 138 Q 100 140 88 138 Z" fill="#FFFFFF" />
            {/* Upper Lip */}
            <path d="M 82 134 Q 91 129 100 131 Q 109 129 118 134" stroke="#E11D48" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            {/* Lower Lip */}
            <path d="M 86 142 Q 100 148 114 142" stroke="#BE123C" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'bite_f': // Bite 'F' / 'V'
        return (
          <g id="viseme-bite-f">
            {/* Upper Teeth on Lip */}
            <path d="M 90 134 Q 100 136 110 134 L 109 139 Q 100 140 91 139 Z" fill="#FFFFFF" />
            {/* Upper Lip */}
            <path d="M 86 133 Q 100 131 114 133" stroke="#E11D48" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            {/* Lower Lip Tucked */}
            <path d="M 89 139 Q 100 144 111 139" stroke="#BE123C" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'narrow_m': // Closed 'M' / 'B' / 'P'
        return (
          <g id="viseme-narrow-m">
            {/* Closed Pursed Lips */}
            <path d="M 86 137 Q 93 135 100 136 Q 107 135 114 137" stroke="#E11D48" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d="M 90 140 Q 100 143 110 140" stroke="#BE123C" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'wide_smile': // Big Joyful Smile (Speaking)
        return (
          <g id="viseme-wide-smile">
            <path d="M 82 133 Q 100 150 118 133 Q 100 131 82 133 Z" fill="#450A0A" />
            <path d="M 86 133 Q 100 135 114 133 L 113 137 Q 100 139 87 137 Z" fill="#FFFFFF" />
            <ellipse cx="100" cy="143" rx="7" ry="4" fill="#F43F5E" />
            <path d="M 80 132 Q 90 127 100 129 Q 110 127 120 132" stroke="#E11D48" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 84 144 Q 100 152 116 144" stroke="#BE123C" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'rest':
      default:
        // Warm Friendly Smile in Resting / Listening State
        return (
          <g id="viseme-rest">
            {state === 'thinking' ? (
              // Pursed curious mouth
              <path d="M 92 138 Q 100 136 108 138" stroke="#E11D48" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            ) : (
              // Sweet Android-style smile
              <>
                <path d="M 87 135 Q 100 144 113 135" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M 92 141 Q 100 146 108 141" stroke="#BE123C" strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            )}
          </g>
        );
    }
  };

  return (
    <div
      onClick={onCharacterClick}
      className={`relative flex flex-col items-center justify-center select-none ${onCharacterClick ? 'cursor-pointer' : ''}`}
    >
      {/* Dynamic Halo Glow according to state */}
      <AnimatePresence>
        {state === 'speaking' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.35, 0.7, 0.35],
              scale: [1, 1.14, 1],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="absolute -inset-6 rounded-full bg-gradient-to-tr from-cyan-500/25 via-indigo-500/35 to-blue-500/25 blur-2xl pointer-events-none"
          />
        )}
        {state === 'listening' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [0.95, 1.1, 0.95],
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
            className="absolute -inset-6 rounded-full bg-gradient-to-tr from-emerald-500/30 to-teal-500/30 blur-2xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main SVG Rigged Character Container */}
      <motion.div
        animate={{
          y: headBobY,
          rotate: headTilt,
          scale: state === 'speaking' ? 1.03 : 1,
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className={`relative ${dim.container} flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 200 210"
          className="w-full h-full drop-shadow-xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for Skin, Hair, Shirt, and Accessories */}
            <linearGradient id={`skinGrad-${persona.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={skinColor} />
              <stop offset="100%" stopColor={skinColor} stopOpacity="0.88" />
            </linearGradient>

            <linearGradient id={`hairGrad-${persona.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={hairHighlight} />
              <stop offset="60%" stopColor={hairColor} />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id={`shirtGrad-${persona.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={shirtColor} />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>

            <filter id="softGazeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. TORSO / BODY / SHOULDERS */}
          <g id="torso" transform="translate(0, 10)">
            <motion.path
              d="M 45 190 Q 50 160 80 156 L 100 165 L 120 156 Q 150 160 155 190 Z"
              fill={`url(#shirtGrad-${persona.id})`}
              animate={{
                d:
                  state === 'speaking'
                    ? 'M 43 190 Q 48 158 78 155 L 100 164 L 122 155 Q 152 158 157 190 Z'
                    : 'M 45 190 Q 50 160 80 156 L 100 165 L 120 156 Q 150 160 155 190 Z',
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            />
            {/* Collar Detail */}
            <path d="M 85 156 L 100 174 L 115 156" stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.8" />
            {/* Tech Logo / Badge on shirt */}
            <circle cx="128" cy="180" r="4.5" fill="#38BDF8" opacity="0.9" />
            <path d="M 126 180 L 130 180 M 128 178 L 128 182" stroke="#FFFFFF" strokeWidth="1.2" />
          </g>

          {/* 2. HEAD & EARS */}
          <g id="head-group">
            {/* Left Ear */}
            <ellipse cx="56" cy="110" rx="9" ry="12" fill={skinColor} />
            <ellipse cx="56" cy="110" rx="5" ry="7" fill="#000000" opacity="0.1" />

            {/* Right Ear */}
            <ellipse cx="144" cy="110" rx="9" ry="12" fill={skinColor} />
            <ellipse cx="144" cy="110" rx="5" ry="7" fill="#000000" opacity="0.1" />

            {/* Glowing Cyber Earring / Earpiece for AIDA or Headphones for David */}
            {isAida && (
              <g id="aida-earpiece">
                <circle cx="146" cy="114" r="4" fill="#06B6D4" />
                <circle cx="146" cy="114" r="2" fill="#FFFFFF" />
                <motion.circle
                  cx="146"
                  cy="114"
                  r="7"
                  stroke="#06B6D4"
                  strokeWidth="1.5"
                  fill="none"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                />
              </g>
            )}

            {isDavid && (
              <g id="david-headphones">
                <path d="M 52 100 C 52 50, 148 50, 148 100" stroke="#0284C7" strokeWidth="7" fill="none" strokeLinecap="round" />
                <rect x="47" y="96" width="10" height="24" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
                <rect x="143" y="96" width="10" height="24" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
              </g>
            )}

            {/* Main Face Contour */}
            <path
              d="M 60 90 C 60 48, 140 48, 140 90 C 140 135, 128 162, 100 162 C 72 162, 60 135, 60 90 Z"
              fill={`url(#skinGrad-${persona.id})`}
            />

            {/* Cheek Blush (Cute Language App Accent) */}
            <ellipse cx="73" cy="122" rx="7" ry="4" fill={blushColor} opacity={state === 'speaking' ? 0.65 : 0.4} />
            <ellipse cx="127" cy="122" rx="7" ry="4" fill={blushColor} opacity={state === 'speaking' ? 0.65 : 0.4} />

            {/* Marc's Beard & Stubble */}
            {isMarc && (
              <path
                d="M 72 128 C 76 156, 124 156, 128 128 C 120 162, 80 162, 72 128 Z"
                fill="#1E1E24"
                opacity="0.9"
              />
            )}

            {/* 3. HAIR (Styled distinctly per persona) */}
            {isAida && (
              <g id="aida-hair">
                {/* Back Hair */}
                <path d="M 55 95 C 48 55, 152 55, 145 95 C 158 135, 146 155, 142 160 C 136 120, 134 78, 100 78 C 66 78, 64 120, 58 160 C 54 155, 42 135, 55 95 Z" fill={`url(#hairGrad-${persona.id})`} />
                {/* Modern Bangs & Fringe */}
                <path d="M 56 75 Q 100 56 144 75 Q 120 86 100 84 Q 78 88 56 75 Z" fill="#2D1537" />
                <path d="M 68 70 Q 100 86 132 70 Q 112 80 100 78 Q 86 82 68 70 Z" fill="#6366F1" opacity="0.8" />
              </g>
            )}

            {isMarc && (
              <g id="marc-hair">
                {/* Short Trimmed Afro Hairstyle */}
                <path d="M 58 84 C 54 46, 146 46, 142 84 Q 100 66 58 84 Z" fill="#18181B" />
              </g>
            )}

            {isSarah && (
              <g id="sarah-hair">
                {/* Elegant Auburn Bob */}
                <path d="M 54 90 C 50 45, 150 45, 146 90 C 154 135, 144 148, 138 152 C 134 110, 130 75, 100 75 C 70 75, 66 110, 62 152 C 56 148, 46 135, 54 90 Z" fill={`url(#hairGrad-${persona.id})`} />
                {/* Hair Parting */}
                <path d="M 64 72 Q 100 62 136 78 Q 110 82 100 80 Q 82 80 64 72 Z" fill="#D97706" opacity="0.6" />
              </g>
            )}

            {isDavid && (
              <g id="david-hair">
                {/* Modern Tousled Tech Quiff */}
                <path d="M 56 82 C 52 40, 148 40, 144 82 Q 100 68 56 82 Z" fill="#1E293B" />
                <path d="M 75 58 Q 100 35 125 58 Q 100 50 75 58 Z" fill="#3B82F6" opacity="0.75" />
              </g>
            )}

            {/* 4. EYEBROWS */}
            <g id="eyebrows">
              {state === 'thinking' ? (
                // Inquisitive / Furrowed Eyebrow
                <>
                  <path d="M 72 88 Q 84 82 94 88" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 106 91 Q 116 88 128 85" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" fill="none" />
                </>
              ) : state === 'listening' ? (
                // Attentive Raised Eyebrows
                <>
                  <path d="M 70 85 Q 82 78 94 83" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 106 83 Q 118 78 130 85" stroke="#1E1E24" strokeWidth="3" strokeLinecap="round" fill="none" />
                </>
              ) : (
                // Friendly Dynamic Eyebrows (bob with speaking)
                <>
                  <path
                    d={state === 'speaking' ? 'M 71 86 Q 83 79 94 85' : 'M 72 88 Q 83 82 94 87'}
                    stroke="#1E1E24"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d={state === 'speaking' ? 'M 106 85 Q 117 79 129 86' : 'M 106 87 Q 117 82 128 88'}
                    stroke="#1E1E24"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              )}
            </g>

            {/* 5. EYES & BLINKING SYSTEM */}
            <g id="eyes">
              {isBlinking ? (
                // Closed Eyelids (Blink)
                <>
                  <path d="M 72 104 Q 82 110 92 104" stroke="#1E1E24" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                  <path d="M 108 104 Q 118 110 128 104" stroke="#1E1E24" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                </>
              ) : state === 'thinking' ? (
                // Looking slightly upward / to the side
                <>
                  {/* Left Eye Sclera */}
                  <ellipse cx="82" cy="103" rx="10" ry="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
                  <circle cx="84" cy="99" r="4.5" fill="#1E1B4B" />
                  <circle cx="85.5" cy="98" r="1.8" fill="#FFFFFF" />

                  {/* Right Eye Sclera */}
                  <ellipse cx="118" cy="103" rx="10" ry="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
                  <circle cx="120" cy="99" r="4.5" fill="#1E1B4B" />
                  <circle cx="121.5" cy="98" r="1.8" fill="#FFFFFF" />
                </>
              ) : (
                // Open Lively Expressive Eyes (Language App Standard)
                <>
                  {/* Left Eye White */}
                  <ellipse cx="82" cy="103" rx="10.5" ry="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
                  {/* Left Iris */}
                  <circle cx="82" cy="103" r="5.2" fill={isAida ? '#312E81' : isSarah ? '#065F46' : '#1E293B'} />
                  {/* Left Pupil Highlight (Gloss) */}
                  <circle cx="80" cy="100.5" r="2.2" fill="#FFFFFF" />
                  <circle cx="83.5" cy="104.5" r="1.1" fill="#FFFFFF" />

                  {/* Right Eye White */}
                  <ellipse cx="118" cy="103" rx="10.5" ry="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
                  {/* Right Iris */}
                  <circle cx="118" cy="103" r="5.2" fill={isAida ? '#312E81' : isSarah ? '#065F46' : '#1E293B'} />
                  {/* Right Pupil Highlight (Gloss) */}
                  <circle cx="116" cy="100.5" r="2.2" fill="#FFFFFF" />
                  <circle cx="119.5" cy="104.5" r="1.1" fill="#FFFFFF" />
                </>
              )}
            </g>

            {/* 6. GLASSES (For Sarah & Marc) */}
            {(isSarah || isMarc) && (
              <g id="glasses">
                {/* Left Rim */}
                <rect x="68" y="93" width="28" height="20" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#FFFFFF" fillOpacity="0.15" />
                {/* Right Rim */}
                <rect x="104" y="93" width="28" height="20" rx="6" stroke="#0F172A" strokeWidth="2.8" fill="#FFFFFF" fillOpacity="0.15" />
                {/* Bridge */}
                <path d="M 96 100 L 104 100" stroke="#0F172A" strokeWidth="2.8" />
                {/* Temple Arms */}
                <path d="M 68 99 L 56 97" stroke="#0F172A" strokeWidth="2.5" />
                <path d="M 132 99 L 144 97" stroke="#0F172A" strokeWidth="2.5" />
              </g>
            )}

            {/* 7. NOSE */}
            <path d="M 98 116 Q 100 120 103 118" stroke="#1E1E24" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.65" />

            {/* 8. ANIMATED REAL-TIME LIPS & MOUTH (Viseme Engine) */}
            <g id="mouth-viseme-rig" className="transition-all duration-75">
              {renderMouthViseme()}
            </g>
          </g>
        </svg>

        {/* Live Audio Equalizer / Speech Frequency Visualizer in speaking mode */}
        {state === 'speaking' && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-400/60 shadow-lg z-20">
            {soundWaveHeights.map((h, i) => (
              <motion.span
                key={i}
                animate={{ height: `${h}px` }}
                transition={{ duration: 0.1 }}
                className="w-1.5 bg-gradient-to-t from-cyan-400 to-indigo-400 rounded-full"
              />
            ))}
          </div>
        )}

        {/* Listening Ear Rings Overlay */}
        {state === 'listening' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="w-28 h-28 rounded-full border-2 border-emerald-400 border-dashed"
            />
          </div>
        )}

        {/* Thinking Neural Sparkle Overlay */}
        {state === 'thinking' && (
          <div className="absolute top-2 right-2 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360, scale: [0.9, 1.1, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
              className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/80 flex items-center justify-center shadow-lg"
            >
              <Brain className="w-5 h-5 text-amber-300 animate-pulse" />
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Sub-label & Interactive Action Trigger */}
      <div className="mt-2.5 flex flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-1.5">
          <span className="text-sm sm:text-base font-bold text-white tracking-wide">{persona.name}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/90 text-indigo-300 border border-indigo-700/60 font-semibold">
            {persona.badge}
          </span>
        </div>

        {/* State Pill with dynamic animation */}
        <div
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
            state === 'speaking'
              ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500 animate-pulse'
              : state === 'listening'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500'
              : state === 'thinking'
              ? 'bg-amber-950/90 text-amber-300 border-amber-500'
              : 'bg-slate-900/90 text-slate-300 border-slate-700'
          }`}
        >
          {state === 'speaking' ? (
            <>
              <Volume2 className="w-3 h-3 text-cyan-400" />
              <span>Parle & anime ses lèvres</span>
            </>
          ) : state === 'listening' ? (
            <>
              <Mic className="w-3 h-3 text-emerald-400 animate-bounce" />
              <span>À votre écoute...</span>
            </>
          ) : state === 'thinking' ? (
            <>
              <Brain className="w-3 h-3 text-amber-400" />
              <span>Analyse & réflexion...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Tuteur prêt (Style Android)</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
