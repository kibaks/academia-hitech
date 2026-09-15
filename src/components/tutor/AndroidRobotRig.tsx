import React from 'react';
import { motion } from 'motion/react';
import { CharacterPose, VisemeType } from './AndroidStyleCharacter';

interface AndroidRobotRigProps {
  uid: string;
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
  effectivePose: CharacterPose;
  viseme: VisemeType;
  isBlinking: boolean;
  liveSpeechAmplitude: number;
  syllablePhase: number;
  soundWaveHeights: number[];
  onRobotClick?: () => void;
}

export const AndroidRobotRig: React.FC<AndroidRobotRigProps> = ({
  uid,
  state,
  effectivePose,
  viseme,
  isBlinking,
  liveSpeechAmplitude,
  syllablePhase,
  soundWaveHeights,
  onRobotClick,
}) => {
  const isSpeaking = state === 'speaking' || liveSpeechAmplitude > 0.05;
  const isThinking = state === 'thinking' || effectivePose === 'thinking';
  const amp = Math.max(0.2, Math.min(1.0, liveSpeechAmplitude || (isSpeaking ? 0.75 : 0.2)));

  // Head bobbing and tilt synchronized with speech or thoughtful reflection
  const headBobY = isSpeaking ? (syllablePhase % 2 === 0 ? -2.5 : 1.5) : isThinking ? -2.0 : 0;
  const headTilt =
    isThinking
      ? 6.8
      : state === 'listening'
      ? -4.0
      : isSpeaking
      ? syllablePhase % 3 === 0
        ? 2.2
        : -1.5
      : 0;

  // Real-time mouth equalizer bar heights based on amplitude
  const eqBars = [
    Math.round(4 + amp * 9),
    Math.round(6 + amp * 15),
    Math.round(9 + amp * 20),
    Math.round(11 + amp * 24),
    Math.round(9 + amp * 20),
    Math.round(6 + amp * 15),
    Math.round(4 + amp * 9),
  ];

  // Real-time Cybernetic Lips Rig synchronized with Vocal Sound & Visemes (Zero lag)
  const renderRobotCyberLips = () => {
    // Thoughtful Pensive Mouth when in thinking mode
    if (isThinking && !isSpeaking) {
      return (
        <g id="robot-lips-thinking">
          {/* Subtle computing oral port */}
          <path
            d="M 110 89.5 Q 115 87 120 90 Q 125 93 130 89.5"
            stroke="#78350F"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Curious thoughtful cybernetic mouth wave */}
          <motion.path
            d="M 110 89.5 Q 115 87 120 90 Q 125 93 130 89.5"
            stroke="#F59E0B"
            strokeWidth="2.6"
            fill="none"
            strokeLinecap="round"
            filter={`url(#ledEyeGlow-${uid})`}
            animate={{
              d: [
                'M 110 89.5 Q 115 87 120 90 Q 125 93 130 89.5',
                'M 110 90.5 Q 115 93 120 89.5 Q 125 87 130 90.5',
                'M 110 89.5 Q 115 87 120 90 Q 125 93 130 89.5',
              ],
            }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          />
          {/* Computing status diodes at corners */}
          <motion.circle
            cx="109"
            cy="89.5"
            r="1.8"
            fill="#FBBF24"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.circle
            cx="131"
            cy="89.5"
            r="1.8"
            fill="#FBBF24"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
          />
        </g>
      );
    }

    // Vertical aperture expansion based on speech amplitude
    const openGap = Math.max(2, amp * 8.5);
    const cornerNodePulse = isSpeaking ? 1.6 + amp * 1.4 : 1.8;

    if (!isSpeaking || viseme === 'rest') {
      return (
        <g id="robot-lips-idle">
          {/* Subtle acoustic port backdrop */}
          <path
            d="M 108 89 Q 120 92 132 89"
            stroke="#064E3B"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Sleek Upper/Lower Cybernetic Lip Contour */}
          <path
            d="M 108 89 Q 120 93.5 132 89"
            stroke="#00FFA3"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            filter={`url(#ledEyeGlow-${uid})`}
          />
          {/* Inner laser seam */}
          <path
            d="M 112 89.8 Q 120 92 128 89.8"
            stroke="#67E8F9"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Cybernetic Lip Corner Terminals */}
          <circle cx="108" cy="89" r="1.8" fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
          <circle cx="132" cy="89" r="1.8" fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
        </g>
      );
    }

    switch (viseme) {
      case 'open_a': // Grande ouverture vocale (A, Â, À)
        return (
          <g id="robot-lips-open-a">
            {/* Cavité buccale cybernétique ouverte */}
            <path
              d={`M 106 87 Q 120 ${82 - amp * 2} 134 87 Q 136 ${91 + openGap} 120 ${93 + openGap} Q 104 ${91 + openGap} 106 87 Z`}
              fill="#01160C"
              stroke="#047857"
              strokeWidth="1.2"
            />

            {/* Égaliseur vocal et plasma acoustique dans la bouche */}
            <g id="intra-mouth-equalizer">
              {eqBars.slice(1, 6).map((h, i) => {
                const xPos = 108 + i * 6;
                const barHeight = Math.min(openGap * 1.5, h * 0.7);
                return (
                  <rect
                    key={i}
                    x={xPos}
                    y={90 - barHeight / 2}
                    width="2.6"
                    height={barHeight}
                    rx="1.3"
                    fill={i === 2 ? '#67E8F9' : '#00FFA3'}
                    filter={`url(#ledEyeGlow-${uid})`}
                  />
                );
              })}
            </g>

            {/* Dents / Grille acoustique supérieure */}
            <path
              d={`M 110 ${86.5 - amp} Q 120 ${88 - amp} 130 ${86.5 - amp}`}
              stroke="#E0F2FE"
              strokeWidth="1.8"
              strokeDasharray="3 1.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Lèvre Cybernétique Supérieure arquée vers le haut */}
            <path
              d={`M 105 87 Q 120 ${82 - amp * 2} 135 87`}
              stroke="#00FFA3"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter={`url(#ledEyeGlow-${uid})`}
              fill="none"
            />

            {/* Lèvre Cybernétique Inférieure abaissée par la parole */}
            <path
              d={`M 107 ${91 + openGap} Q 120 ${94.5 + openGap} 133 ${91 + openGap}`}
              stroke="#22D3EE"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter={`url(#ledEyeGlow-${uid})`}
              fill="none"
            />

            {/* Bornes LED aux commissures des lèvres */}
            <circle cx="105" cy="87" r={cornerNodePulse} fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
            <circle cx="135" cy="87" r={cornerNodePulse} fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
          </g>
        );

      case 'open_o': // Lèvres arrondies en 'O' / 'OU'
        return (
          <g id="robot-lips-open-o">
            {/* Cavité buccale circulaire */}
            <ellipse
              cx="120"
              cy="91"
              rx={7 + amp * 3.5}
              ry={6 + amp * 4.5}
              fill="#01160C"
              stroke="#047857"
              strokeWidth="1.2"
            />

            {/* Cœur plasma vocal au centre */}
            <circle
              cx="120"
              cy="91"
              r={2.5 + amp * 3}
              fill="#67E8F9"
              filter={`url(#ledEyeGlow-${uid})`}
              opacity="0.9"
            />

            {/* Lèvres cybernétiques en anneau 'O' concentrique */}
            <ellipse
              cx="120"
              cy="91"
              rx={8.5 + amp * 3.5}
              ry={7.5 + amp * 4.5}
              stroke="#00FFA3"
              strokeWidth="3"
              fill="none"
              filter={`url(#ledEyeGlow-${uid})`}
            />
            <ellipse
              cx="120"
              cy="91"
              rx={6 + amp * 2.5}
              ry={5 + amp * 3}
              stroke="#22D3EE"
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        );

      case 'open_e': // Lèvres étirées en sourire 'É' / 'I' avec fente horizontale
        return (
          <g id="robot-lips-open-e">
            {/* Cavité horizontale étirée */}
            <path
              d={`M 103 89 Q 120 86 137 89 Q 135 ${91 + openGap * 0.65} 120 ${93 + openGap * 0.65} Q 105 ${91 + openGap * 0.65} 103 89 Z`}
              fill="#01160C"
              stroke="#047857"
              strokeWidth="1"
            />

            {/* Grille de dents matricielles illuminées en arc */}
            <path
              d="M 107 88.5 Q 120 89.8 133 88.5"
              stroke="#E0F2FE"
              strokeWidth="1.8"
              strokeDasharray="3 1.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M 108 ${90 + openGap * 0.4} Q 120 ${91 + openGap * 0.4} 132 ${90 + openGap * 0.4}`}
              stroke="#E0F2FE"
              strokeWidth="1.4"
              strokeDasharray="3 1.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Lèvre Supérieure fine et étirée */}
            <path
              d="M 103 89 Q 120 86 137 89"
              stroke="#00FFA3"
              strokeWidth="3"
              strokeLinecap="round"
              filter={`url(#ledEyeGlow-${uid})`}
              fill="none"
            />

            {/* Lèvre Inférieure synchronisée */}
            <path
              d={`M 105 ${91 + openGap * 0.65} Q 120 ${93.5 + openGap * 0.65} 135 ${91 + openGap * 0.65}`}
              stroke="#22D3EE"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter={`url(#ledEyeGlow-${uid})`}
              fill="none"
            />

            {/* Noeuds de commissure */}
            <circle cx="103" cy="89" r={cornerNodePulse} fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
            <circle cx="137" cy="89" r={cornerNodePulse} fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
          </g>
        );

      case 'narrow_m': // Lèvres pincées/fermées pour M, B, P
        return (
          <g id="robot-lips-narrow-m">
            {/* Lèvre supérieure et inférieure fermées ensemble sans espace vertical */}
            <path
              d="M 106 90.5 Q 120 89.5 134 90.5"
              stroke="#00FFA3"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter={`url(#ledEyeGlow-${uid})`}
              fill="none"
            />
            <path
              d="M 108 92.5 Q 120 93.5 132 92.5"
              stroke="#22D3EE"
              strokeWidth="2.6"
              strokeLinecap="round"
              filter={`url(#ledEyeGlow-${uid})`}
              fill="none"
            />
            {/* Faisceau laser de contact bilabial à haute intensité */}
            <line
              x1="110"
              y1="91.5"
              x2="130"
              y2="91.5"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              filter={`url(#ledEyeGlow-${uid})`}
            />
            <circle cx="106" cy="90.5" r="2.2" fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
            <circle cx="134" cy="90.5" r="2.2" fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
          </g>
        );

      case 'bite_f': // Sons F et V (dents supérieures posées sur lèvre inférieure)
        return (
          <g id="robot-lips-bite-f">
            {/* Lèvre supérieure */}
            <path
              d="M 106 87.5 Q 120 86 134 87.5"
              stroke="#00FFA3"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter={`url(#ledEyeGlow-${uid})`}
              fill="none"
            />
            {/* Dents supérieures proéminentes */}
            <path
              d="M 109 89 Q 120 90.5 131 89"
              stroke="#E0F2FE"
              strokeWidth="2.2"
              strokeDasharray="3.2 1.4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lèvre inférieure incurvée en contact avec les dents */}
            <path
              d={`M 108 ${92.5 + openGap * 0.4} Q 120 ${95 + openGap * 0.4} 132 ${92.5 + openGap * 0.4}`}
              stroke="#22D3EE"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter={`url(#ledEyeGlow-${uid})`}
              fill="none"
            />
            <circle cx="106" cy="87.5" r="2" fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
            <circle cx="134" cy="87.5" r="2" fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
          </g>
        );

      case 'wide_smile': // Consonnes expressives & sourire vocal actif
      default:
        return (
          <g id="robot-lips-wide-smile">
            {/* Cavité buccale dynamique */}
            <path
              d={`M 105 88 Q 120 84 135 88 Q 133 ${92 + openGap * 0.8} 120 ${95 + openGap * 0.8} Q 107 ${92 + openGap * 0.8} 105 88 Z`}
              fill="#01160C"
              stroke="#047857"
              strokeWidth="1.2"
            />

            {/* Égaliseur sonore dynamique dans l'ouverture des lèvres */}
            <g id="intra-mouth-equalizer-smile">
              {eqBars.slice(1, 6).map((h, i) => {
                const xPos = 109 + i * 5.5;
                const barHeight = Math.min(openGap * 1.3, h * 0.65);
                return (
                  <rect
                    key={i}
                    x={xPos}
                    y={90 - barHeight / 2}
                    width="2.4"
                    height={barHeight}
                    rx="1.2"
                    fill={i === 2 ? '#67E8F9' : '#00FFA3'}
                    filter={`url(#ledEyeGlow-${uid})`}
                  />
                );
              })}
            </g>

            {/* Dents supérieures expressives */}
            <path
              d="M 108 87.5 Q 120 89 132 87.5"
              stroke="#E0F2FE"
              strokeWidth="1.8"
              strokeDasharray="3 1.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Lèvre Supérieure souriante */}
            <path
              d="M 105 88 Q 120 84 135 88"
              stroke="#00FFA3"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter={`url(#ledEyeGlow-${uid})`}
              fill="none"
            />

            {/* Lèvre Inférieure souriante */}
            <path
              d={`M 107 ${92 + openGap * 0.8} Q 120 ${95.5 + openGap * 0.8} 133 ${92 + openGap * 0.8}`}
              stroke="#22D3EE"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter={`url(#ledEyeGlow-${uid})`}
              fill="none"
            />

            {/* Commissures lumineuses */}
            <circle cx="105" cy="88" r={cornerNodePulse} fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
            <circle cx="135" cy="88" r={cornerNodePulse} fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
          </g>
        );
    }
  };

  return (
    <g id={`android-robot-rig-${uid}`} onClick={onRobotClick} className="cursor-pointer select-none">
      <defs>
        {/* Android Bugdroid Primary Green Gradient */}
        <linearGradient id={`androidHeadGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="45%" stopColor="#3DDC84" />
          <stop offset="100%" stopColor="#1DA858" />
        </linearGradient>

        <linearGradient id={`androidBodyGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3DDC84" />
          <stop offset="70%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        {/* Metallic Highlight Arc */}
        <linearGradient id={`androidShine-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Cyber Visor Glow */}
        <linearGradient id={`visorGlassGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#031A0F" />
          <stop offset="50%" stopColor="#072918" />
          <stop offset="100%" stopColor="#02120A" />
        </linearGradient>

        {/* Glowing Arc Reactor Core */}
        <radialGradient id={`coreGlowGrad-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67E8F9" stopOpacity="1" />
          <stop offset="40%" stopColor="#22D3EE" stopOpacity="0.8" />
          <stop offset="75%" stopColor="#06B6D4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0891B2" stopOpacity="0" />
        </radialGradient>

        {/* Glowing Filter for LEDs & Laser */}
        <filter id={`laserGlow-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={`ledEyeGlow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. HOVER BASE & PLASMA RINGS (Floating Thruster) */}
      <g id="android-hover-thruster">
        {/* Anti-gravity plasma rings pulsing underneath */}
        <motion.ellipse
          cx="120"
          cy="222"
          rx="38"
          ry="7"
          fill="#00FFA3"
          opacity={0.35}
          animate={{
            rx: [34, 42, 34],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />
        <motion.ellipse
          cx="120"
          cy="228"
          rx="24"
          ry="4.5"
          fill="#38BDF8"
          opacity={0.5}
          animate={{
            rx: [20, 28, 20],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />

        {/* Dual Thruster Nozzles */}
        <rect x="92" y="196" width="18" height="12" rx="4" fill="#0F2B1C" stroke="#22C55E" strokeWidth="1.5" />
        <ellipse cx="101" cy="207" rx="6" ry="2" fill="#00FFA3" />
        <rect x="130" y="196" width="18" height="12" rx="4" fill="#0F2B1C" stroke="#22C55E" strokeWidth="1.5" />
        <ellipse cx="139" cy="207" rx="6" ry="2" fill="#00FFA3" />
      </g>

      {/* 2. CHASSIS / TORSO OF THE ANDROID ROBOT */}
      <g id="android-torso">
        {/* Main curved cyber torso */}
        <rect
          x="72"
          y="108"
          width="96"
          height="88"
          rx="22"
          fill={`url(#androidBodyGrad-${uid})`}
          stroke="#166534"
          strokeWidth="2.5"
        />

        {/* Metallic bevel shine */}
        <path
          d="M 80 114 Q 120 110 160 114"
          stroke="#86EFAC"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />

        {/* Cybernetic seam lines */}
        <path
          d="M 74 135 L 94 135 M 146 135 L 166 135"
          stroke="#14532D"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 74 172 L 94 172 M 146 172 L 166 172"
          stroke="#14532D"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Central Illuminated Arc Reactor / Heartbeat Core */}
        <g id="android-arc-reactor" className="transition-transform duration-100">
          {/* Outer reactor housing */}
          <circle cx="120" cy="148" r="22" fill="#041B10" stroke="#22C55E" strokeWidth="2" />
          <circle cx="120" cy="148" r="18" fill="#021008" stroke="#10B981" strokeWidth="1" strokeDasharray="4 2" />

          {/* Pulsing Core Energy Glow (Synchronized with speech voice or active thinking!) */}
          <motion.circle
            cx="120"
            cy="148"
            r={13}
            fill={isThinking ? '#F59E0B' : `url(#coreGlowGrad-${uid})`}
            animate={{
              scale: isSpeaking ? [1, 1.18 + amp * 0.15, 1] : isThinking ? [1, 1.25, 1] : [1, 1.05, 1],
              opacity: isSpeaking ? [0.8, 1, 0.8] : isThinking ? [0.75, 1, 0.75] : [0.5, 0.75, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: isSpeaking ? 0.35 : isThinking ? 0.8 : 2.0,
              ease: 'easeInOut',
            }}
          />

          {/* Android ITECH Emblem in Core Center */}
          <circle cx="120" cy="148" r={5} fill={isThinking ? '#FBBF24' : '#00FFA3'} filter={`url(#ledEyeGlow-${uid})`} />
          <circle cx="120" cy="148" r={2} fill="#FFFFFF" />
        </g>

        {/* Tech Badge 'ITECH DROID' / 'IA PROCESSING' */}
        <g id="android-chest-badge">
          <rect x="94" y="178" width="52" height="10" rx="3" fill="#062013" stroke={isThinking ? '#F59E0B' : '#22C55E'} strokeWidth="1" />
          <text
            x="120"
            y="185.5"
            textAnchor="middle"
            fill={isThinking ? '#FDE68A' : '#86EFAC'}
            fontSize="5.2"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="0.4"
          >
            {isThinking ? 'IA EN RÉFLEXION' : isSpeaking ? 'VOX ACTIVE' : 'ITECH DROID'}
          </text>
        </g>
      </g>

      {/* 3. LEFT ROBOTIC ARM */}
      <g id="android-left-arm">
        {effectivePose === 'celebrating' ? (
          // Left Arm Raised Up in Celebration
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{ originX: '65px', originY: '118px' }}
          >
            <rect x="36" y="70" width="20" height="60" rx="10" fill={`url(#androidBodyGrad-${uid})`} stroke="#166534" strokeWidth="2" />
            <circle cx="46" cy="65" r="8" fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
          </motion.g>
        ) : effectivePose === 'explaining' ? (
          // Left Arm Gesturing Forward (Hologram Palm)
          <motion.g
            animate={{ y: [0, -3, 0], rotate: [-2, 4, -2] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            style={{ originX: '65px', originY: '118px' }}
          >
            <rect x="44" y="112" width="20" height="58" rx="10" fill={`url(#androidBodyGrad-${uid})`} stroke="#166534" strokeWidth="2" />
            <ellipse cx="54" cy="168" rx="9" ry="5" fill="#22C55E" />
            {/* Holographic light beam from palm */}
            <path d="M 46 166 L 30 145 L 70 145 Z" fill="#06B6D4" opacity="0.25" />
          </motion.g>
        ) : (
          // Default Relaxed Left Arm
          <motion.g
            animate={{ y: [0, -1.5, 0] }}
            transition={{ repeat: Infinity, duration: 3.0, ease: 'easeInOut' }}
          >
            <rect x="46" y="112" width="20" height="66" rx="10" fill={`url(#androidBodyGrad-${uid})`} stroke="#166534" strokeWidth="2" />
            <ellipse cx="56" cy="176" rx="8" ry="4" fill="#15803D" />
          </motion.g>
        )}
      </g>

      {/* 4. RIGHT ROBOTIC ARM (Interactive with Poses, Laser Pointer, Waving, Thumbs Up) */}
      <g id="android-right-arm">
        {effectivePose === 'waving' ? (
          // Waving Gesture with Hand greeting
          <motion.g
            animate={{ rotate: [-20, 22, -20] }}
            transition={{ repeat: Infinity, duration: 0.75, ease: 'easeInOut' }}
            style={{ originX: '176px', originY: '118px' }}
          >
            <rect x="174" y="70" width="20" height="60" rx="10" fill={`url(#androidBodyGrad-${uid})`} stroke="#166534" strokeWidth="2" />
            <ellipse cx="184" cy="65" rx="8" ry="7" fill="#4ADE80" />
            {/* Cute greeting spark */}
            <circle cx="184" cy="52" r="3" fill="#FBBF24" filter={`url(#ledEyeGlow-${uid})`} />
          </motion.g>
        ) : effectivePose === 'pointing' ? (
          // Pointing Gesture with Glowing PowerPoint Laser Pointer Beam
          <motion.g
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2.0 }}
            style={{ originX: '176px', originY: '118px' }}
          >
            {/* Extended horizontal arm */}
            <rect x="168" y="110" width="46" height="18" rx="9" fill={`url(#androidBodyGrad-${uid})`} stroke="#166534" strokeWidth="2" />
            {/* Laser emitter nozzle on fingertips */}
            <circle cx="216" cy="119" r="6" fill="#1E293B" stroke="#EF4444" strokeWidth="1.5" />
            <circle cx="216" cy="119" r="3" fill="#EF4444" filter={`url(#laserGlow-${uid})`} />

            {/* Glowing PowerPoint Laser Beam projecting rightward */}
            <motion.line
              x1="219"
              y1="119"
              x2="239"
              y2="114"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              filter={`url(#laserGlow-${uid})`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 0.2 }}
            />
            {/* Laser target pulse */}
            <circle cx="239" cy="114" r="3" fill="#EF4444" filter={`url(#laserGlow-${uid})`} />
          </motion.g>
        ) : effectivePose === 'thumbs_up' ? (
          // Thumbs Up Robotic Hand
          <motion.g
            animate={{ scale: [1, 1.05, 1], y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            style={{ originX: '176px', originY: '118px' }}
          >
            <rect x="174" y="102" width="20" height="52" rx="10" fill={`url(#androidBodyGrad-${uid})`} stroke="#166534" strokeWidth="2" />
            {/* Thumb sticking up */}
            <path
              d="M 184 100 L 184 84 Q 189 80 194 84 L 194 100 Z"
              fill="#4ADE80"
              stroke="#166534"
              strokeWidth="1.5"
            />
            <circle cx="189" cy="80" r="3" fill="#22C55E" filter={`url(#ledEyeGlow-${uid})`} />
          </motion.g>
        ) : effectivePose === 'celebrating' ? (
          // Both arms raised
          <motion.g
            animate={{ rotate: [5, -5, 5] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            style={{ originX: '176px', originY: '118px' }}
          >
            <rect x="184" y="70" width="20" height="60" rx="10" fill={`url(#androidBodyGrad-${uid})`} stroke="#166534" strokeWidth="2" />
            <circle cx="194" cy="65" r="8" fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
          </motion.g>
        ) : isThinking ? (
          // Thoughtful Analytical Arm Pose: Hand resting pensive at chin/visor with tapping finger
          <motion.g
            animate={{ rotate: [-2, 3, -2] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            style={{ originX: '176px', originY: '118px' }}
          >
            {/* Robotic Arm bending up to chin */}
            <path
              d="M 174 120 Q 196 112 184 88 Q 172 74 154 78"
              stroke="#22C55E"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 174 120 Q 196 112 184 88 Q 172 74 154 78"
              stroke="#86EFAC"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
            {/* Cyber Hand resting near chin with glowing joint */}
            <circle cx="152" cy="78" r="7" fill="#4ADE80" stroke="#166534" strokeWidth="1.5" />
            <circle cx="152" cy="78" r="3.2" fill="#FBBF24" filter={`url(#ledEyeGlow-${uid})`} />
            {/* Index finger tapping pensively */}
            <motion.line
              x1="150"
              y1="75"
              x2="145"
              y2="71"
              stroke="#00FFA3"
              strokeWidth="3.2"
              strokeLinecap="round"
              animate={{ rotate: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
            />
          </motion.g>
        ) : (
          // Default Relaxed Right Arm
          <motion.g
            animate={{ y: [0, -1.5, 0] }}
            transition={{ repeat: Infinity, duration: 3.0, ease: 'easeInOut' }}
          >
            <rect x="174" y="112" width="20" height="66" rx="10" fill={`url(#androidBodyGrad-${uid})`} stroke="#166534" strokeWidth="2" />
            <ellipse cx="184" cy="176" rx="8" ry="4" fill="#15803D" />
          </motion.g>
        )}
      </g>

      {/* 5. DOME HEAD, ANTENNAS, VISOR & EQUALIZER MOUTH */}
      <motion.g
        id="android-head-assembly"
        animate={{
          y: headBobY,
          rotate: headTilt,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        style={{ originX: '120px', originY: '100px' }}
      >
        {/* Antennas (Left & Right) */}
        {/* Left Antenna */}
        <motion.g
          animate={
            isSpeaking
              ? { rotate: [-28, -20, -32, -28] }
              : isThinking
              ? { rotate: [-32, -24, -32] }
              : state === 'listening'
              ? { rotate: [-18, -22, -18] }
              : { rotate: -28 }
          }
          transition={{ repeat: Infinity, duration: isSpeaking ? 0.4 : isThinking ? 1.0 : 2.5 }}
          style={{ originX: '94px', originY: '52px' }}
        >
          <line x1="94" y1="52" x2="78" y2="24" stroke="#22C55E" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="77" cy="22" r="5" fill={isThinking ? '#FBBF24' : '#4ADE80'} stroke="#166534" strokeWidth="1.5" />
          {/* Signal wave emitting from antenna tip */}
          {(isSpeaking || isThinking) && (
            <motion.circle
              cx="77"
              cy="22"
              r={10}
              stroke={isThinking ? '#F59E0B' : '#00FFA3'}
              strokeWidth="1.6"
              fill="none"
              animate={{ r: [5, 16, 5], opacity: [0.95, 0, 0.95] }}
              transition={{ repeat: Infinity, duration: isThinking ? 0.8 : 0.6 }}
            />
          )}
        </motion.g>

        {/* Right Antenna */}
        <motion.g
          animate={
            isSpeaking
              ? { rotate: [28, 20, 32, 28] }
              : isThinking
              ? { rotate: [32, 24, 32] }
              : state === 'listening'
              ? { rotate: [18, 22, 18] }
              : { rotate: 28 }
          }
          transition={{ repeat: Infinity, duration: isSpeaking ? 0.45 : isThinking ? 1.0 : 2.5 }}
          style={{ originX: '146px', originY: '52px' }}
        >
          <line x1="146" y1="52" x2="162" y2="24" stroke="#22C55E" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="163" cy="22" r="5" fill={isThinking ? '#FBBF24' : '#4ADE80'} stroke="#166534" strokeWidth="1.5" />
          {/* Signal wave */}
          {(isSpeaking || isThinking) && (
            <motion.circle
              cx="163"
              cy="22"
              r={10}
              stroke={isThinking ? '#F59E0B' : '#00FFA3'}
              strokeWidth="1.6"
              fill="none"
              animate={{ r: [5, 16, 5], opacity: [0.95, 0, 0.95] }}
              transition={{ repeat: Infinity, duration: isThinking ? 0.8 : 0.6, delay: 0.15 }}
            />
          )}
        </motion.g>

        {/* HOLOGRAPHIC NEURAL COGNITIVE CLOUD (VISIBLE WHEN THINKING) */}
        {isThinking && (
          <g id="android-thought-halo">
            {/* Rotating Neural Orbit Ring */}
            <motion.ellipse
              cx="120"
              cy="12"
              rx="42"
              ry="12"
              stroke="#F59E0B"
              strokeWidth="1.4"
              strokeDasharray="4 3"
              fill="none"
              filter={`url(#ledEyeGlow-${uid})`}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
              style={{ originX: '120px', originY: '12px' }}
            />
            {/* Expanding Thought Wave Rings */}
            <motion.ellipse
              cx="120"
              cy="12"
              rx="20"
              ry="6"
              stroke="#67E8F9"
              strokeWidth="1.5"
              fill="none"
              animate={{ rx: [14, 46], ry: [4, 14], opacity: [0.9, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeOut' }}
            />
            {/* Floating Cognitive Glyphs: AI logic, formulas, math */}
            <motion.g animate={{ y: [-3, 3, -3], opacity: [0.75, 1, 0.75] }} transition={{ repeat: Infinity, duration: 2 }}>
              <rect x="70" y="-3" width="24" height="13" rx="6.5" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />
              <text x="82" y="6.5" fill="#FDE68A" fontSize="7" fontWeight="bold" textAnchor="middle">∑ f(x)</text>
            </motion.g>
            <motion.g animate={{ y: [3, -3, 3], opacity: [0.75, 1, 0.75] }} transition={{ repeat: Infinity, duration: 2.3 }}>
              <rect x="146" y="-5" width="22" height="13" rx="6.5" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1" />
              <text x="157" y="4.5" fill="#BAE6FD" fontSize="7" fontWeight="bold" textAnchor="middle">0101</text>
            </motion.g>
            <motion.g animate={{ y: [-4, 2, -4], opacity: [0.8, 1, 0.8] }} transition={{ repeat: Infinity, duration: 1.8 }}>
              <rect x="108" y="-14" width="24" height="13" rx="6.5" fill="#14532D" stroke="#4ADE80" strokeWidth="1" />
              <text x="120" y="-4.5" fill="#DCFCE7" fontSize="7" fontWeight="bold" textAnchor="middle">🧠 IA</text>
            </motion.g>
          </g>
        )}

        {/* Dome Head (Official Bugdroid semi-circle) */}
        <path
          d="M 70 100 A 50 50 0 0 1 170 100 Z"
          fill={`url(#androidHeadGrad-${uid})`}
          stroke="#166534"
          strokeWidth="2.5"
        />

        {/* Top Metallic Highlight Rim */}
        <path
          d="M 80 82 A 44 44 0 0 1 160 82"
          stroke="#DCFCE7"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />

        {/* Head-to-torso shadow / separator */}
        <line x1="70" y1="100" x2="170" y2="100" stroke="#14532D" strokeWidth="2.5" strokeLinecap="round" />

        {/* Curved Futuristic Visor Display */}
        <rect
          x="80"
          y="64"
          width="80"
          height="28"
          rx="12"
          fill={`url(#visorGlassGrad-${uid})`}
          stroke="#22C55E"
          strokeWidth="1.8"
          filter="drop-shadow(0 2px 6px rgba(0,0,0,0.5))"
        />

        {/* SCANNING LASER BEAM (ACTIVATED DURING THINKING) */}
        {isThinking && (
          <motion.line
            x1="84"
            y1="76"
            x2="156"
            y2="76"
            stroke="#FBBF24"
            strokeWidth="2.2"
            strokeLinecap="round"
            filter={`url(#ledEyeGlow-${uid})`}
            animate={{ y: [-7, 9, -7], opacity: [0.35, 1, 0.35] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          />
        )}

        {/* EXPRESSIVE LED MATRIX EYES */}
        <g id="android-led-eyes">
          {isBlinking ? (
            // Blinking Slits
            <>
              <line x1="97" y1="76" x2="107" y2="76" stroke="#4ADE80" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="133" y1="76" x2="143" y2="76" stroke="#4ADE80" strokeWidth="2.8" strokeLinecap="round" />
            </>
          ) : effectivePose === 'celebrating' || effectivePose === 'thumbs_up' || effectivePose === 'waving' ? (
            // Cute Arched Smiling Eyes (^ ^)
            <>
              <path
                d="M 96 79 Q 102 71 108 79"
                stroke="#00FFA3"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
                filter={`url(#ledEyeGlow-${uid})`}
              />
              <path
                d="M 132 79 Q 138 71 144 79"
                stroke="#00FFA3"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
                filter={`url(#ledEyeGlow-${uid})`}
              />
            </>
          ) : isThinking ? (
            // Thinking Eyes: Revolving Quantum Cogitation Nodes
            <g id="eyes-thinking-active">
              {/* Left eye: revolving orbital quantum ring */}
              <g transform="translate(104, 76)">
                <circle cx="0" cy="0" r="5.5" fill="#01160C" stroke="#F59E0B" strokeWidth="1.6" />
                <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}>
                  <circle cx="0" cy="-4.2" r="1.5" fill="#67E8F9" filter={`url(#ledEyeGlow-${uid})`} />
                  <circle cx="0" cy="4.2" r="1.5" fill="#FBBF24" filter={`url(#ledEyeGlow-${uid})`} />
                </motion.g>
                <circle cx="0" cy="0" r="2.8" fill="#F59E0B" filter={`url(#ledEyeGlow-${uid})`} />
                <circle cx="0.8" cy="-0.8" r="1" fill="#FFFFFF" />
              </g>
              {/* Right eye: revolving orbital quantum ring */}
              <g transform="translate(138, 76)">
                <circle cx="0" cy="0" r="5.5" fill="#01160C" stroke="#F59E0B" strokeWidth="1.6" />
                <motion.g animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}>
                  <circle cx="0" cy="-4.2" r="1.5" fill="#FBBF24" filter={`url(#ledEyeGlow-${uid})`} />
                  <circle cx="0" cy="4.2" r="1.5" fill="#67E8F9" filter={`url(#ledEyeGlow-${uid})`} />
                </motion.g>
                <circle cx="0" cy="0" r="2.8" fill="#F59E0B" filter={`url(#ledEyeGlow-${uid})`} />
                <circle cx="0.8" cy="-0.8" r="1" fill="#FFFFFF" />
              </g>
              {/* Pensive thinking badge indicator */}
              <motion.g
                animate={{ opacity: [0.75, 1, 0.75], scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                <rect x="146" y="60" width="24" height="9" rx="4.5" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />
                <text x="158" y="66.5" fill="#FDE68A" fontSize="5.8" fontWeight="bold" textAnchor="middle">RÉFLEXION</text>
              </motion.g>
            </g>
          ) : (
            // Default Circular Expressive LED Eyes
            <>
              <circle cx="102" cy="76" r="4.8" fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
              <circle cx="100.5" cy="74.5" r="1.6" fill="#FFFFFF" />
              <circle cx="138" cy="76" r="4.8" fill="#00FFA3" filter={`url(#ledEyeGlow-${uid})`} />
              <circle cx="136.5" cy="74.5" r="1.6" fill="#FFFFFF" />
            </>
          )}
        </g>

        {/* REAL-TIME CYBERNETIC LIPS & VOCAL APERTURE RIG (INSTANTANEOUS ZERO-LAG RENDERING) */}
        <g id="android-cyber-lips-rig">
          {renderRobotCyberLips()}
        </g>
      </motion.g>
    </g>
  );
};
