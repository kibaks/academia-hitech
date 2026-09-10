import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Code2,
  Film,
  Layers,
  Award,
} from 'lucide-react';
import { CourseVideoProject, TimelineClip } from '../../../types';

interface VideoMonitorProps {
  project: CourseVideoProject;
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onTimeStep: (delta: number) => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  activeClips: TimelineClip[];
  onSelectClip?: (clipId: string) => void;
  readOnly?: boolean;
}

export const VideoMonitor: React.FC<VideoMonitorProps> = ({
  project,
  currentTime,
  isPlaying,
  onTogglePlay,
  onSeek,
  onTimeStep,
  playbackRate,
  onChangePlaybackRate,
  activeClips,
  onSelectClip,
  readOnly = false,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Active layer clips at currentTime
  const activeVideoClip = activeClips.find((c) => c.trackId === 'track-video');
  const activeAvatarClip = activeClips.find((c) => c.trackId === 'track-avatar');
  const activeTextClip = activeClips.find((c) => c.trackId === 'track-text');
  const activeQuizClip = activeClips.find((c) => c.trackId === 'track-quiz');

  // Format timecode (00:00:00:00)
  const formatTimecode = (seconds: number) => {
    const totalSecs = Math.max(0, seconds);
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.floor(totalSecs % 60);
    const frames = Math.floor((totalSecs - Math.floor(totalSecs)) * project.fps);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  const handleQuizAnswer = (index: number) => {
    setQuizSelectedOption(index);
    setQuizSubmitted(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Top Monitor Bar */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono font-bold text-slate-300">MONITEUR PROGRAMME</span>
          <span className="text-slate-500">•</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-sky-400">
            {project.resolution} {project.fps}fps
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-purple-400">
            {project.aspectRatio}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            {formatTimecode(currentTime)}
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            / {formatTimecode(project.totalDurationSeconds)}
          </span>
        </div>
      </div>

      {/* Main 16:9 Screen Canvas */}
      <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden min-h-[300px] select-none">
        <div
          className={`relative overflow-hidden bg-black shadow-2xl transition-all duration-200 ${
            project.aspectRatio === '9:16'
              ? 'aspect-[9/16] h-[94%] max-w-[280px] rounded-xl border border-slate-700'
              : project.aspectRatio === '1:1'
              ? 'aspect-square h-[94%] max-w-[420px] rounded-xl border border-slate-700'
              : 'aspect-video w-[96%] max-w-[840px] rounded-xl border border-slate-800'
          }`}
        >
          {/* Layer 1: Background Video / B-Roll */}
          {activeVideoClip ? (
            <motion.div
              key={activeVideoClip.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeVideoClip.transform?.opacity ?? 1 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full"
              onClick={() => onSelectClip?.(activeVideoClip.id)}
            >
              <img
                src={activeVideoClip.sourceUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'}
                alt={activeVideoClip.title}
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${activeVideoClip.transform?.scale || 1}) translate(${activeVideoClip.transform?.x || 0}%, ${activeVideoClip.transform?.y || 0}%)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-slate-950 p-6 text-center">
              <Film className="w-12 h-12 mb-2 text-slate-700 stroke-1" />
              <p className="text-xs font-semibold text-slate-400">Piste V1 vide à ce timecode</p>
              <p className="text-[10px] text-slate-600 mt-1">Glissez un clip vidéo ou B-Roll depuis la bibliothèque</p>
            </div>
          )}

          {/* Layer 2: Text / Lower-Third / Code Snippet */}
          <AnimatePresence>
            {activeTextClip && (
              <motion.div
                key={activeTextClip.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className={`absolute z-20 cursor-pointer ${
                  activeTextClip.textStyle?.position === 'center-title'
                    ? 'inset-x-6 top-1/3 text-center'
                    : activeTextClip.textStyle?.position === 'top-banner'
                    ? 'top-4 inset-x-6'
                    : 'bottom-6 left-6 max-w-[70%]'
                }`}
                onClick={() => onSelectClip?.(activeTextClip.id)}
              >
                {activeTextClip.type === 'code_snippet' && activeTextClip.codeContent ? (
                  <div className="p-3.5 rounded-xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{activeTextClip.codeContent.language.toUpperCase()} SNIPPET</span>
                      </span>
                      <span className="text-slate-500">Live Code Demonstration</span>
                    </div>
                    <pre className="text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                      <code>{activeTextClip.codeContent.code}</code>
                    </pre>
                  </div>
                ) : (
                  <div
                    className="p-3.5 rounded-xl shadow-2xl backdrop-blur-md border border-white/10"
                    style={{
                      backgroundColor: activeTextClip.textStyle?.bgColor || 'rgba(15, 23, 42, 0.85)',
                    }}
                  >
                    <h3
                      className={`font-black tracking-tight ${
                        activeTextClip.textStyle?.fontSize === 'title'
                          ? 'text-lg md:text-2xl text-amber-300'
                          : 'text-sm md:text-base text-white'
                      }`}
                      style={{ color: activeTextClip.textStyle?.textColor || '#ffffff' }}
                    >
                      {activeTextClip.textContent}
                    </h3>
                    {activeTextClip.textSubtitle && (
                      <p className="text-xs text-slate-300 mt-1 font-medium leading-normal">
                        {activeTextClip.textSubtitle}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Layer 3: Avatar PiP (Incrustation Formateur) */}
          <AnimatePresence>
            {activeAvatarClip && (
              <motion.div
                key={activeAvatarClip.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: activeAvatarClip.transform?.scale ?? 0.85, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`absolute z-30 cursor-pointer ${
                  activeAvatarClip.transform?.pipPosition === 'bottom-left'
                    ? 'bottom-4 left-4'
                    : activeAvatarClip.transform?.pipPosition === 'top-right'
                    ? 'top-4 right-4'
                    : activeAvatarClip.transform?.pipPosition === 'top-left'
                    ? 'top-4 left-4'
                    : 'bottom-4 right-4'
                }`}
                onClick={() => onSelectClip?.(activeAvatarClip.id)}
              >
                <div className="relative group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 shadow-2xl">
                    <img
                      src={
                        activeAvatarClip.sourceUrl ||
                        activeAvatarClip.voiceoverData?.characterAvatar ||
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
                      }
                      alt={activeAvatarClip.title}
                      className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                    />
                  </div>

                  {/* Speaker Wave indicator if speaking */}
                  {isPlaying && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md flex items-center justify-center animate-pulse">
                      <Volume2 className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Character Name badge */}
                  <div className="absolute -bottom-2 inset-x-0 mx-auto w-max max-w-[120px] px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] font-bold text-slate-200 text-center truncate shadow-md">
                    {activeAvatarClip.voiceoverData?.characterName || 'Formateur IA'}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Layer 4: Interactive Quiz Modal Overlay (Points d'Arrêt) */}
          <AnimatePresence>
            {activeQuizClip && activeQuizClip.quizData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center"
              >
                <div className="max-w-md w-full bg-slate-900 border border-pink-500/40 rounded-2xl p-5 shadow-2xl text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-400 text-xs font-bold flex items-center gap-1.5 border border-pink-500/30">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Point d'Arrêt Interactif
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Arrêt à {formatTimecode(activeQuizClip.startSeconds)}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">
                    {activeQuizClip.quizData.question}
                  </h4>

                  <div className="space-y-2">
                    {activeQuizClip.quizData.options.map((opt, oIdx) => {
                      const isSelected = quizSelectedOption === oIdx;
                      const isCorrect = oIdx === activeQuizClip.quizData?.correctIndex;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleQuizAnswer(oIdx)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between border ${
                            quizSubmitted
                              ? isCorrect
                                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                                : isSelected
                                ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                                : 'bg-slate-800/40 border-slate-700 text-slate-400 opacity-60'
                              : 'bg-slate-800/70 border-slate-700 text-slate-200 hover:bg-slate-700/80 hover:border-pink-500'
                          }`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {quizSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                      <p className="font-bold text-indigo-300 mb-1">Explication Pédagogique :</p>
                      <p>{activeQuizClip.quizData.explanation}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Watermark */}
          <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs text-[10px] font-mono text-slate-400 border border-white/10 select-none">
            Academia ITECH • Video Studio
          </div>
        </div>
      </div>

      {/* Transport Controls Bar */}
      <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4">
        {/* Left: Frame steps & Play */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Revenir au début (00:00)"
            onClick={() => onSeek(0)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Reculer de 2 secondes (-2s)"
            onClick={() => onTimeStep(-2)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            title="Lecture / Pause (Barre Espace ou touche K)"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black scale-105'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Lecture</span>
              </>
            )}
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono opacity-80 border border-white/20">
              Espace
            </span>
          </button>

          <button
            type="button"
            title="Avancer de 2 secondes (+2s)"
            onClick={() => onTimeStep(2)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Playback Speed */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => onChangePlaybackRate(rate)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                playbackRate === rate
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Right: Audio mute & Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Plein écran"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
