import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TutorPersona } from '../../types';
import { VisemeType } from './AndroidStyleCharacter';
import {
  Sparkles,
  Mic,
  Brain,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sliders,
  Smile,
  Activity,
  Zap,
  Gauge,
  Type
} from 'lucide-react';

export interface FacialLipSyncProps {
  persona: TutorPersona;
  textToSync?: string;
  isStreaming?: boolean;
  isPlayingAudio?: boolean;
  onLipSyncFrame?: (viseme: VisemeType, emotion: string, energy: number) => void;
  speed?: number; // 0.8x to 1.5x
  interactiveMood?: 'happy' | 'explaining' | 'celebrating' | 'focused';
}

/**
 * Phoneme / Viseme Map for intelligent French & Multi-lingual Text-to-Viseme parsing
 */
export function charToViseme(char: string, prevChar: string = ''): VisemeType {
  const c = char.toLowerCase();
  const combo = (prevChar + c).toLowerCase();

  // Diphthongs and multi-letter sounds
  if (['ou', 'on', 'eu', 'au', 'eau'].includes(combo)) {
    return 'open_o';
  }
  if (['ch', 'sh', 'ge', 'gi', 'je', 'ji'].includes(combo)) {
    return 'open_e';
  }

  // Vowels
  if (['a', 'à', 'â', 'ä'].includes(c)) return 'open_a';
  if (['o', 'ô', 'ö'].includes(c)) return 'open_o';
  if (['e', 'é', 'è', 'ê', 'ë', 'i', 'î', 'ï', 'y', 'u'].includes(c)) return 'open_e';

  // Bilabial consonants (Lips closed)
  if (['m', 'b', 'p'].includes(c)) return 'narrow_m';

  // Labiodental (Teeth touching lower lip)
  if (['f', 'v', 'w'].includes(c)) return 'bite_f';

  // Sibilants / Dentals / Alveolar (Teeth shown / Wide mouth)
  if (['s', 'z', 't', 'd', 'n', 'l', 'r', 'c', 'k', 'q', 'g', 'x'].includes(c)) return 'wide_smile';

  // Punctuation or space
  if ([' ', ',', '.', '!', '?', ';', ':', '\n'].includes(c)) return 'rest';

  return 'open_a';
}

export const FacialLipSyncModule: React.FC<FacialLipSyncProps> = ({
  persona,
  textToSync = '',
  isStreaming = false,
  isPlayingAudio = false,
  onLipSyncFrame,
  speed = 1.0,
  interactiveMood = 'explaining'
}) => {
  const [currentViseme, setCurrentViseme] = useState<VisemeType>('rest');
  const [currentEmotion, setCurrentEmotion] = useState<'neutral' | 'happy' | 'thinking' | 'speaking' | 'excited'>('neutral');
  const [voiceEnergy, setVoiceEnergy] = useState<number>(0);
  const [activeWord, setActiveWord] = useState<string>('');
  const [charIndex, setCharIndex] = useState<number>(0);
  const [realtimePhonemeStream, setRealtimePhonemeStream] = useState<string[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Synchronize facial visemes with text stream / audio playback
  useEffect(() => {
    if (!isPlayingAudio && !isStreaming) {
      setCurrentViseme('rest');
      setCurrentEmotion('neutral');
      setVoiceEnergy(0);
      setActiveWord('');
      if (onLipSyncFrame) onLipSyncFrame('rest', 'neutral', 0);
      return;
    }

    let currentIndex = 0;
    const cleanText = textToSync.trim();
    if (!cleanText) {
      // Idle talking cycle if no specific text
      const fallbackVisemes: VisemeType[] = ['open_a', 'open_e', 'open_o', 'narrow_m', 'bite_f', 'wide_smile'];
      const interval = setInterval(() => {
        const randomV = fallbackVisemes[Math.floor(Math.random() * fallbackVisemes.length)];
        setCurrentViseme(randomV);
        setVoiceEnergy(Math.random() * 0.8 + 0.2);
        if (onLipSyncFrame) onLipSyncFrame(randomV, 'speaking', 0.6);
      }, 120 / speed);
      return () => clearInterval(interval);
    }

    const words = cleanText.split(/\s+/);
    const charDelay = Math.max(35, Math.floor(75 / speed));

    const textInterval = setInterval(() => {
      if (currentIndex >= cleanText.length) {
        if (!isStreaming) {
          setCurrentViseme('rest');
          setCurrentEmotion('neutral');
          setVoiceEnergy(0);
          clearInterval(textInterval);
        } else {
          // Keep looping subtle breath viseme while waiting for next stream chunk
          setCurrentViseme(Math.random() > 0.6 ? 'open_e' : 'rest');
        }
        return;
      }

      const char = cleanText[currentIndex];
      const prevChar = currentIndex > 0 ? cleanText[currentIndex - 1] : '';
      const matchedViseme = charToViseme(char, prevChar);

      // Find current word
      let wordAccum = 0;
      let targetWord = words[0] || '';
      for (const w of words) {
        wordAccum += w.length + 1;
        if (currentIndex < wordAccum) {
          targetWord = w;
          break;
        }
      }

      // Energy modulation based on punctuation and vowels
      const energy = matchedViseme === 'rest' ? 0 : matchedViseme === 'open_a' || matchedViseme === 'open_o' ? 0.9 : 0.65;
      
      setCurrentViseme(matchedViseme);
      setVoiceEnergy(energy);
      setActiveWord(targetWord);
      setCharIndex(currentIndex);
      setRealtimePhonemeStream((prev) => [matchedViseme, ...prev.slice(0, 4)]);

      // Dynamic emotion based on mood and sentence marks
      let emotion: 'neutral' | 'happy' | 'thinking' | 'speaking' | 'excited' = 'speaking';
      if (char === '!' || cleanText.includes('super') || cleanText.includes('bravo')) {
        emotion = 'excited';
      } else if (char === '?' || isStreaming && cleanText.length < 15) {
        emotion = 'thinking';
      } else if (interactiveMood === 'happy' || interactiveMood === 'celebrating') {
        emotion = 'happy';
      }
      setCurrentEmotion(emotion);

      if (onLipSyncFrame) {
        onLipSyncFrame(matchedViseme, emotion, energy);
      }

      currentIndex++;
    }, charDelay);

    return () => clearInterval(textInterval);
  }, [textToSync, isStreaming, isPlayingAudio, speed, interactiveMood]);

  return (
    <div
      id="facial-lip-sync-module"
      className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-white space-y-3 backdrop-blur-md shadow-lg"
    >
      {/* Module Title Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-100 flex items-center gap-1.5">
              <span>Moteur Lip-Sync Framer Motion</span>
              <span className="px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                TEMPS RÉEL
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-cyan-400 font-bold">
            Visème : <span className="uppercase text-white font-extrabold">{currentViseme}</span>
          </span>
        </div>
      </div>

      {/* Real-time Facial Morphing Visualizer */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Current Viseme Shape Visualizer */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Ouverture Bouche
          </span>
          <div className="w-14 h-9 flex items-center justify-center">
            <motion.div
              animate={{
                scaleX: currentViseme === 'wide_smile' ? 1.4 : currentViseme === 'open_o' ? 0.8 : 1.1,
                scaleY: currentViseme === 'open_a' ? 1.6 : currentViseme === 'open_o' ? 1.4 : currentViseme === 'narrow_m' ? 0.2 : 0.8,
                borderRadius: currentViseme === 'open_o' ? '50%' : '12px',
              }}
              transition={{ type: 'spring', damping: 14, stiffness: 220 }}
              className="w-8 h-4 bg-gradient-to-r from-rose-500 to-red-500 border-2 border-rose-300 shadow-md shadow-rose-900/40 flex items-center justify-center"
            >
              {currentViseme === 'open_a' || currentViseme === 'wide_smile' ? (
                <div className="w-4 h-1 bg-white rounded-full opacity-80" />
              ) : null}
            </motion.div>
          </div>
          <span className="text-[10px] font-extrabold text-indigo-300 mt-1 capitalize">
            {currentViseme.replace('_', ' ')}
          </span>
        </div>

        {/* Emotion State Track */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Expression Faciale
          </span>
          <motion.div
            animate={{
              scale: isPlayingAudio || isStreaming ? [1, 1.15, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-lg"
          >
            {currentEmotion === 'excited'
              ? '🤩'
              : currentEmotion === 'happy'
              ? '😊'
              : currentEmotion === 'thinking'
              ? '🤔'
              : currentEmotion === 'speaking'
              ? '🗣️'
              : '🙂'}
          </motion.div>
          <span className="text-[10px] font-extrabold text-cyan-300 mt-1 capitalize">
            {currentEmotion}
          </span>
        </div>

        {/* Voice Audio Energy Meter */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Énergie Vocale
          </span>
          <div className="flex items-end gap-1 h-8 w-12 justify-center pb-1">
            {[0.4, 0.8, 1, 0.7, 0.5].map((h, i) => (
              <motion.div
                key={i}
                animate={{
                  height: isPlayingAudio || isStreaming ? `${Math.max(4, voiceEnergy * h * 24)}px` : '4px',
                }}
                transition={{ duration: 0.1 }}
                className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500 to-cyan-400"
              />
            ))}
          </div>
          <span className="text-[10px] font-extrabold text-slate-300">
            {Math.round(voiceEnergy * 100)}%
          </span>
        </div>
      </div>

      {/* Dynamic Subtitles Phoneme Highlight */}
      {activeWord && (
        <div className="p-2 rounded-xl bg-indigo-950/50 border border-indigo-800/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[10px] text-indigo-400 font-bold uppercase">Mot synchronisé :</span>
            <span className="font-mono font-black text-yellow-300 tracking-wider">"{activeWord}"</span>
          </div>
          <span className="text-[9px] font-semibold text-slate-400">
            {charIndex + 1}/{textToSync.length} car.
          </span>
        </div>
      )}
    </div>
  );
};
