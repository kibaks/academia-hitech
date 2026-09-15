import React, { useState, useEffect, useRef } from 'react';
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
  Award,
  Layers,
  Clock,
  BookOpen,
  User,
  Film,
  Check,
} from 'lucide-react';
import { CourseVideoProject, TimelineClip } from '../../types';
import { playTutorSpeech, stopTutorSpeech } from '../tutor/speechUtils';
import { AndroidStyleCharacter } from '../tutor/AndroidStyleCharacter';
import { TUTOR_PERSONAS } from '../tutor/personaData';

interface GeneratedVideoPlayerProps {
  project: CourseVideoProject;
  lessonTitle?: string;
  courseTitle?: string;
  onLessonComplete?: () => void;
  autoPlay?: boolean;
  hasRawVideo?: boolean;
  onSwitchToRawVideo?: () => void;
  onOpenVideoStudio?: () => void;
  canEdit?: boolean;
}

const isVideoSourceUrl = (url?: string, type?: string) => {
  if (!url) return false;
  if (type === 'video' || type === 'screen_recording') {
    if (
      url.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i) ||
      url.startsWith('blob:') ||
      url.startsWith('data:video') ||
      url.includes('commondatastorage.googleapis.com')
    ) {
      return true;
    }
  }
  return Boolean(
    url.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i) ||
    url.startsWith('blob:') ||
    url.startsWith('data:video') ||
    url.includes('commondatastorage.googleapis.com')
  );
};

export const GeneratedVideoPlayer: React.FC<GeneratedVideoPlayerProps> = ({
  project,
  lessonTitle,
  courseTitle,
  onLessonComplete,
  autoPlay = false,
  hasRawVideo = false,
  onSwitchToRawVideo,
  onOpenVideoStudio,
  canEdit = false,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  // Active quiz state
  const [activeQuizClip, setActiveQuizClip] = useState<TimelineClip | null>(null);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizAnsweredCorrectly, setQuizAnsweredCorrectly] = useState<boolean | null>(null);
  const [answeredQuizIds, setAnsweredQuizIds] = useState<Set<string>>(new Set());
  const [pipAvatarStyle, setPipAvatarStyle] = useState<'cartoon' | 'photo'>('cartoon');

  // Show controls on hover
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  // Playhead animation loop
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());
  const currentSpokenClipIdRef = useRef<string | null>(null);

  // Format time (00:00)
  const formatTime = (seconds: number) => {
    const totalSecs = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Find active clips at currentTime
  const activeClips = (project.clips || []).filter(
    (c) => currentTime >= c.startSeconds && currentTime < c.startSeconds + c.durationSeconds
  );
  const activeVideoClip = activeClips.find((c) => c.trackId === 'track-video');
  const activeAvatarClip = activeClips.find((c) => c.trackId === 'track-avatar');
  const activeTextClip = activeClips.find((c) => c.trackId === 'track-text');

  // Synchronize underlying video element if active clip is a video
  useEffect(() => {
    if (videoElementRef.current && activeVideoClip && isVideoSourceUrl(activeVideoClip.sourceUrl, activeVideoClip.type)) {
      const clipOffset = Math.max(0, currentTime - activeVideoClip.startSeconds);
      if (Math.abs(videoElementRef.current.currentTime - clipOffset) > 0.45) {
        videoElementRef.current.currentTime = clipOffset;
      }
      videoElementRef.current.playbackRate = playbackRate;
      videoElementRef.current.muted = isMuted;

      if (isPlaying) {
        videoElementRef.current.play().catch(() => {});
      } else {
        videoElementRef.current.pause();
      }
    }
  }, [isPlaying, currentTime, activeVideoClip, playbackRate, isMuted]);

  // Check for quiz checkpoint
  useEffect(() => {
    const quizClip = activeClips.find((c) => c.trackId === 'track-quiz' && c.quizData);
    if (quizClip && !answeredQuizIds.has(quizClip.id) && !activeQuizClip) {
      setIsPlaying(false);
      if (videoElementRef.current) videoElementRef.current.pause();
      setActiveQuizClip(quizClip);
      setQuizSelectedOption(null);
      setQuizAnsweredCorrectly(null);
    }
  }, [currentTime, activeClips, answeredQuizIds, activeQuizClip]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeek(currentTime + 5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(currentTime - 5);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        handleToggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, hasEnded, currentTime, isFullscreen, isMuted, project.totalDurationSeconds]);

  // Voiceover playback when avatar clip enters
  useEffect(() => {
    if (isPlaying && !isMuted && activeAvatarClip && activeAvatarClip.voiceoverData?.speechText) {
      if (currentSpokenClipIdRef.current !== activeAvatarClip.id) {
        currentSpokenClipIdRef.current = activeAvatarClip.id;
        playTutorSpeech({
          text: activeAvatarClip.voiceoverData.speechText,
          gender: 'female',
          pitch: 1.0,
          rate: playbackRate,
        });
      }
    } else if (!isPlaying || isMuted) {
      stopTutorSpeech();
    }
  }, [isPlaying, isMuted, activeAvatarClip, playbackRate]);

  // Main playback timer
  useEffect(() => {
    if (isPlaying) {
      lastTickTimeRef.current = Date.now();
      const step = () => {
        const now = Date.now();
        const deltaSec = ((now - lastTickTimeRef.current) / 1000) * playbackRate;
        lastTickTimeRef.current = now;

        setCurrentTime((prevTime) => {
          const nextTime = prevTime + deltaSec;
          if (nextTime >= project.totalDurationSeconds) {
            setIsPlaying(false);
            setHasEnded(true);
            onLessonComplete?.();
            stopTutorSpeech();
            return project.totalDurationSeconds;
          }
          return nextTime;
        });

        animationFrameRef.current = requestAnimationFrame(step);
      };

      animationFrameRef.current = requestAnimationFrame(step);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, playbackRate, project.totalDurationSeconds, onLessonComplete]);

  // Handle controls hide on inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  const handleTogglePlay = () => {
    if (hasEnded) {
      setCurrentTime(0);
      setHasEnded(false);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (newTime: number) => {
    const clamped = Math.max(0, Math.min(project.totalDurationSeconds, newTime));
    setCurrentTime(clamped);
    if (hasEnded && clamped < project.totalDurationSeconds) {
      setHasEnded(false);
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleAnswerQuiz = (index: number) => {
    if (!activeQuizClip || !activeQuizClip.quizData) return;
    setQuizSelectedOption(index);
    const isCorrect = index === activeQuizClip.quizData.correctIndex;
    setQuizAnsweredCorrectly(isCorrect);
  };

  const handleResumeAfterQuiz = () => {
    if (activeQuizClip) {
      setAnsweredQuizIds((prev) => new Set([...prev, activeQuizClip.id]));
      setActiveQuizClip(null);
      setQuizSelectedOption(null);
      setQuizAnsweredCorrectly(null);
      setIsPlaying(true);
    }
  };

  // Video markers (chapters / checkpoints)
  const videoClipsWithTitles = project.clips.filter(
    (c) => c.trackId === 'track-video' || (c.trackId === 'track-text' && c.textContent)
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full bg-slate-950 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800 select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : ''
      }`}
    >
      {/* Top Floating Badge & Action Bar */}
      <div className="absolute top-3 inset-x-3 z-35 flex items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/85 backdrop-blur-md text-pink-300 border border-pink-500/30 flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>
              {project.theme === 'cartoon' || project.theme === 'comic' || project.theme === 'whiteboard'
                ? 'Cours Dessin Animé Illustré • Rendu Apprenant'
                : canEdit
                ? 'Montage Enseignant • Studio ITECH'
                : 'Cours Vidéo Pédagogique'}
            </span>
          </span>

          {hasEnded && (
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Complétée (+50 XP)</span>
            </span>
          )}
        </div>

        {/* Action buttons: Switch to raw video or edit in studio */}
        <div className="flex items-center gap-2">
          {hasRawVideo && onSwitchToRawVideo && (
            <button
              type="button"
              onClick={onSwitchToRawVideo}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-sky-300 hover:text-white text-xs font-bold border border-sky-500/30 flex items-center gap-1.5 backdrop-blur-md transition-all shadow-md"
            >
              <Film className="w-3.5 h-3.5 text-sky-400" />
              <span>Voir la Vidéo Source</span>
            </button>
          )}

          {canEdit && onOpenVideoStudio && (
            <button
              type="button"
              onClick={onOpenVideoStudio}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Modifier le Montage</span>
            </button>
          )}
        </div>
      </div>

      {/* 16:9 VIDEO CANVAS */}
      <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
        {/* Layer 1: Background Video Clip / B-Roll */}
        {activeVideoClip ? (
          <motion.div
            key={activeVideoClip.id}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: activeVideoClip.transform?.opacity ?? 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 w-full h-full"
          >
            {isVideoSourceUrl(activeVideoClip.sourceUrl, activeVideoClip.type) ? (
              <video
                ref={videoElementRef}
                src={activeVideoClip.sourceUrl}
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${activeVideoClip.transform?.scale || 1})`,
                }}
              />
            ) : (
              <img
                src={
                  activeVideoClip.sourceUrl ||
                  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
                }
                alt={activeVideoClip.title}
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${activeVideoClip.transform?.scale || 1})`,
                }}
              />
            )}
            {/* Cinematic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-slate-500">
            <Film className="w-12 h-12 text-slate-700 mb-2" />
            <p className="text-sm font-semibold text-slate-400">Capsule Vidéo de Formation</p>
          </div>
        )}

        {/* Layer 2: Synchronized Text, Lower-Third or Live Code Snippet */}
        <AnimatePresence>
          {activeTextClip && (
            <motion.div
              key={activeTextClip.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`absolute z-20 pointer-events-none ${
                activeTextClip.textStyle?.position === 'center-title'
                  ? 'inset-x-6 top-1/4 text-center'
                  : activeTextClip.textStyle?.position === 'top-banner'
                  ? 'top-4 inset-x-6'
                  : 'bottom-16 left-6 max-w-[70%]'
              }`}
            >
              {activeTextClip.type === 'code_snippet' && activeTextClip.codeContent ? (
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-indigo-500/50 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{activeTextClip.codeContent.language.toUpperCase()}</span>
                    </span>
                    <span className="text-slate-500">Code en Direct</span>
                  </div>
                  <pre className="text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    <code>{activeTextClip.codeContent.code}</code>
                  </pre>
                </div>
              ) : activeTextClip.bubbleStyle || activeTextClip.comicBadge ? (
                <div className="relative p-3.5 sm:p-4 rounded-2xl bg-amber-50 text-slate-950 border-3 border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] select-none">
                  {activeTextClip.comicBadge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-pink-600 text-white text-[10px] font-black uppercase tracking-wider mb-1.5 shadow-xs border border-pink-700">
                      {activeTextClip.comicBadge}
                    </span>
                  )}
                  <h3 className="font-black text-sm sm:text-base md:text-lg text-slate-950 tracking-tight leading-snug">
                    {activeTextClip.textContent}
                  </h3>
                  {activeTextClip.textSubtitle && (
                    <p className="text-xs text-slate-800 font-bold mt-1 leading-normal">
                      {activeTextClip.textSubtitle}
                    </p>
                  )}
                  {/* Comic bubble arrow */}
                  <div className="absolute -bottom-2.5 left-7 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[11px] border-t-slate-900" />
                  <div className="absolute -bottom-1.5 left-[30px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[9px] border-t-amber-50" />
                </div>
              ) : (
                <div
                  className="p-3 sm:p-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/10"
                  style={{
                    backgroundColor: activeTextClip.textStyle?.bgColor || 'rgba(15, 23, 42, 0.85)',
                  }}
                >
                  <h3
                    className={`font-black tracking-tight ${
                      activeTextClip.textStyle?.fontSize === 'title'
                        ? 'text-base sm:text-xl md:text-2xl text-amber-300'
                        : 'text-xs sm:text-base text-white'
                    }`}
                    style={{ color: activeTextClip.textStyle?.textColor || '#ffffff' }}
                  >
                    {activeTextClip.textContent}
                  </h3>
                  {activeTextClip.textSubtitle && (
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium leading-normal">
                      {activeTextClip.textSubtitle}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layer 3: Trainer Avatar PiP (Incrustation Formateur) */}
        <AnimatePresence>
          {activeAvatarClip && (() => {
            const charName = activeAvatarClip.voiceoverData?.characterName || project.leadCharacterName || 'Robot Android ITECH';
            const matchedPersona = TUTOR_PERSONAS.find(
              (p) =>
                p.name.toLowerCase().includes(charName.toLowerCase().split(' ')[0]) ||
                charName.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
            ) || TUTOR_PERSONAS[0];

            return (
              <motion.div
                key={activeAvatarClip.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: activeAvatarClip.transform?.scale ?? 0.85, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`absolute z-30 pointer-events-auto ${
                  activeAvatarClip.transform?.pipPosition === 'bottom-left'
                    ? 'bottom-16 left-4'
                    : activeAvatarClip.transform?.pipPosition === 'top-right'
                    ? 'top-4 right-4'
                    : activeAvatarClip.transform?.pipPosition === 'top-left'
                    ? 'top-4 left-4'
                    : 'bottom-16 right-4'
                }`}
              >
                {pipAvatarStyle === 'cartoon' ? (
                  <div className="relative flex flex-col items-center">
                    <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl p-1 bg-slate-950/90 border-2 border-emerald-500/50 shadow-2xl backdrop-blur-md flex items-center justify-center overflow-hidden">
                      <AndroidStyleCharacter
                        persona={matchedPersona}
                        state={isPlaying ? 'speaking' : 'idle'}
                        size="sm"
                        currentPose={isPlaying ? 'explaining' : 'waving'}
                        showBadge={false}
                        showVoiceWaves={false}
                      />
                    </div>
                    {/* Style switcher & name pill */}
                    <div className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/90 border border-emerald-500/50 text-[10px] font-bold text-emerald-300 shadow-md">
                      <span className="truncate max-w-[90px]">{charName}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPipAvatarStyle('photo');
                        }}
                        title="Passer en photo"
                        className="text-slate-400 hover:text-white"
                      >
                        📷
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 shadow-2xl">
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

                    {/* Animated speaker badge */}
                    {isPlaying && (
                      <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-md flex items-center justify-center animate-pulse">
                        <Volume2 className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Trainer Name Pill & switch to cartoon */}
                    <div className="absolute -bottom-2 inset-x-0 mx-auto w-max max-w-[140px] px-2 py-0.5 rounded-full bg-slate-900/95 border border-slate-700 text-[10px] font-bold text-slate-200 text-center truncate shadow-md flex items-center gap-1">
                      <span className="truncate max-w-[85px]">{charName}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPipAvatarStyle('cartoon');
                        }}
                        title="Activer l'avatar Robot Android ITECH"
                        className="text-emerald-400 hover:text-emerald-200 font-bold"
                      >
                        🤖 Robot
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* Big Center Play/Pause button on Click/Tap */}
        <div
          onClick={handleTogglePlay}
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
        >
          {(!isPlaying || showControls) && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              type="button"
              className="p-4 sm:p-5 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-2xl backdrop-blur-md transition-all hover:scale-110"
            >
              {hasEnded ? (
                <RotateCcw className="w-8 h-8" />
              ) : isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 translate-x-0.5" />
              )}
            </motion.button>
          )}
        </div>

        {/* Layer 4: Interactive Quiz Modal Overlay (Point d'arrêt interactif) */}
        <AnimatePresence>
          {activeQuizClip && activeQuizClip.quizData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center"
            >
              <div className="w-full max-w-lg bg-slate-900 rounded-2xl border border-indigo-500/50 p-5 sm:p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">Validation des Acquis</h4>
                      <p className="text-xs text-slate-400">Point d'arrêt interactif de la vidéo</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-[10px] font-bold text-indigo-300">
                    QUIZ INTÉGRÉ
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-100">
                  {activeQuizClip.quizData.question}
                </p>

                <div className="space-y-2">
                  {activeQuizClip.quizData.options.map((option, idx) => {
                    const isSelected = quizSelectedOption === idx;
                    const isCorrect = idx === activeQuizClip.quizData!.correctIndex;
                    let styleClass = 'bg-slate-800 hover:bg-slate-700/80 text-slate-200 border-slate-700';

                    if (quizSelectedOption !== null) {
                      if (isCorrect) {
                        styleClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                      } else if (isSelected) {
                        styleClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAnswerQuiz(idx)}
                        disabled={quizSelectedOption !== null}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${styleClass}`}
                      >
                        <span>{option}</span>
                        {quizSelectedOption !== null && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {quizSelectedOption !== null && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizAnsweredCorrectly !== null && (
                  <div
                    className={`p-3 rounded-xl text-xs border ${
                      quizAnsweredCorrectly
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                    }`}
                  >
                    <p className="font-bold">
                      {quizAnsweredCorrectly ? 'Excellent ! Bonne réponse.' : 'Attention à ce point clé !'}
                    </p>
                    {activeQuizClip.quizData.explanation && (
                      <p className="mt-1 text-[11px] opacity-90 leading-relaxed">
                        {activeQuizClip.quizData.explanation}
                      </p>
                    )}
                  </div>
                )}

                {quizSelectedOption !== null && (
                  <button
                    type="button"
                    onClick={handleResumeAfterQuiz}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Continuer la Vidéo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM VIDEO CONTROLS OVERLAY */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-x-0 bottom-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2"
            >
              {/* Interactive Scrub Bar */}
              <div className="relative group w-full h-3 flex items-center cursor-pointer">
                {/* Track background */}
                <input
                  type="range"
                  min={0}
                  max={project.totalDurationSeconds}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full h-1.5 group-hover:h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all"
                />

                {/* Checkpoint Markers on Scrub Bar */}
                <div className="absolute inset-x-0 pointer-events-none flex items-center h-full">
                  {project.clips
                    .filter((c) => c.trackId === 'track-quiz')
                    .map((quizClip) => {
                      const posPct = (quizClip.startSeconds / project.totalDurationSeconds) * 100;
                      return (
                        <div
                          key={quizClip.id}
                          className="absolute w-2 h-2 rounded-full bg-amber-400 border border-slate-900 shadow-sm transform -translate-x-1/2"
                          style={{ left: `${posPct}%` }}
                          title={`Quiz interactif à ${formatTime(quizClip.startSeconds)}`}
                        />
                      );
                    })}
                </div>
              </div>

              {/* Controls Toolbar */}
              <div className="flex items-center justify-between gap-2 text-xs">
                {/* Left: Play/Pause, Replay, Timecode */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                  >
                    {hasEnded ? (
                      <RotateCcw className="w-5 h-5" />
                    ) : isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSeek(currentTime - 5)}
                    className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors text-[11px] font-mono"
                    title="-5 secondes"
                  >
                    -5s
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSeek(currentTime + 5)}
                    className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors text-[11px] font-mono"
                    title="+5 secondes"
                  >
                    +5s
                  </button>

                  {/* Timecode */}
                  <span className="font-mono text-slate-200 text-xs">
                    {formatTime(currentTime)} / {formatTime(project.totalDurationSeconds)}
                  </span>
                </div>

                {/* Right: Sound, Speed, Fullscreen */}
                <div className="flex items-center gap-3">
                  {/* Speaker Mute/Unmute */}
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                    title={isMuted ? 'Activer la voix' : 'Couper le son'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Playback speed */}
                  <select
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    className="bg-black/50 hover:bg-black/80 border border-white/20 text-white text-[11px] font-bold rounded-lg px-2 py-0.5 cursor-pointer outline-none"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1.0x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2.0x</option>
                  </select>

                  {/* Fullscreen button */}
                  <button
                    type="button"
                    onClick={handleToggleFullscreen}
                    className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                    title="Plein écran"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* VIDEO FOOTER / LESSON SUMMARY */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shrink-0 shadow-md">
            <img
              src={project.leadCharacterAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
              alt={project.leadCharacterName || 'Formateur'}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="truncate">
            <h4 className="font-bold text-white truncate">{lessonTitle || project.title}</h4>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
              <span>{project.leadCharacterName || 'Formateur Expert'}</span>
              <span>•</span>
              <span className="text-indigo-400">{project.topic}</span>
            </p>
          </div>
        </div>

        {/* Quick jump to chapter markers */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full sm:max-w-md">
          {project.markers && project.markers.length > 0
            ? project.markers.map((marker, index) => {
                const nextMarkerTime =
                  index < project.markers!.length - 1
                    ? project.markers![index + 1].timeSeconds
                    : project.totalDurationSeconds;
                const isActive = currentTime >= marker.timeSeconds && currentTime < nextMarkerTime;
                return (
                  <button
                    key={marker.id}
                    type="button"
                    onClick={() => handleSeek(marker.timeSeconds)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs scale-102'
                        : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: marker.color || '#a855f7' }}
                    />
                    <span>{marker.label}</span>
                  </button>
                );
              })
            : project.clips
                .filter((c) => c.trackId === 'track-video')
                .map((clip, index) => (
                  <button
                    key={clip.id}
                    type="button"
                    onClick={() => handleSeek(clip.startSeconds)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                      currentTime >= clip.startSeconds &&
                      currentTime < clip.startSeconds + clip.durationSeconds
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    Partie {index + 1}
                  </button>
                ))}
        </div>
      </div>
    </div>
  );
};
