import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Film,
  CheckCircle2,
  Settings,
  ExternalLink,
  ChevronRight,
  Tv,
  Edit3,
} from 'lucide-react';

interface VideoLessonPlayerProps {
  videoUrl?: string;
  lessonTitle: string;
  courseTitle?: string;
  authorName?: string;
  onLessonComplete?: () => void;
  hasMountedVideo?: boolean;
  onSwitchToMountedVideo?: () => void;
  onOpenVideoStudio?: () => void;
  canEdit?: boolean;
}

// Convert common video URLs to embeddable URLs
export function getEmbeddableVideoInfo(url?: string): {
  isHtml5Video: boolean;
  embedUrl?: string;
  type: 'html5' | 'youtube' | 'vimeo' | 'loom' | 'iframe' | 'empty';
} {
  if (!url || url.trim() === '') {
    return { isHtml5Video: false, type: 'empty' };
  }

  const cleanUrl = url.trim();

  // HTML5 direct video extensions or blob
  if (
    cleanUrl.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i) ||
    cleanUrl.startsWith('blob:') ||
    cleanUrl.startsWith('data:video') ||
    cleanUrl.includes('commondatastorage.googleapis.com/gtv-videos-bucket')
  ) {
    return { isHtml5Video: true, embedUrl: cleanUrl, type: 'html5' };
  }

  // YouTube detection
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (ytMatch) {
    return {
      isHtml5Video: false,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`,
      type: 'youtube',
    };
  }

  // Vimeo detection
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/(?:video\/)?)([\d]+)/);
  if (vimeoMatch) {
    return {
      isHtml5Video: false,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?color=0284c7&title=0&byline=0&portrait=0`,
      type: 'vimeo',
    };
  }

  // Loom detection
  const loomMatch = cleanUrl.match(/(?:loom\.com\/share\/)([\w-]+)/);
  if (loomMatch) {
    return {
      isHtml5Video: false,
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      type: 'loom',
    };
  }

  // Generic fallback: treat as iframe or direct URL
  return { isHtml5Video: false, embedUrl: cleanUrl, type: 'iframe' };
}

export const VideoLessonPlayer: React.FC<VideoLessonPlayerProps> = ({
  videoUrl,
  lessonTitle,
  courseTitle,
  authorName,
  onLessonComplete,
  hasMountedVideo = false,
  onSwitchToMountedVideo,
  onOpenVideoStudio,
  canEdit = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [bufferedEnd, setBufferedEnd] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const videoInfo = getEmbeddableVideoInfo(videoUrl);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const totalSecs = Math.max(0, Math.floor(secs));
    const mins = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Keyboard navigation & hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkeys if user is in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seekBy(10);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seekBy(-10);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, isFullscreen, duration]);

  // Video element events
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 0;
    setCurrentTime(current);

    // Buffer update
    if (videoRef.current.buffered.length > 0) {
      setBufferedEnd(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
    }

    // Auto complete at 95%
    if (total > 0 && current / total >= 0.95 && !hasCompleted) {
      setHasCompleted(true);
      onLessonComplete?.();
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsVideoLoading(false);
    setLoadError(null);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => {
        console.warn('Playback error:', err);
      });
      setIsPlaying(true);
    }
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    const nextTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleSeek = (newTime: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    const clamped = Math.max(0, Math.min(1, newVol));
    videoRef.current.volume = clamped;
    setVolume(clamped);
    if (clamped === 0) {
      setIsMuted(true);
      videoRef.current.muted = true;
    } else {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRateChange = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2600);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl select-none group ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen border-none' : ''
      }`}
    >
      {/* Top Floating Badge & Action Bar */}
      <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-sky-400 border border-sky-500/30 flex items-center gap-1.5 shadow-md">
            <Film className="w-3.5 h-3.5" />
            <span>
              {videoInfo.type === 'html5'
                ? 'Vidéo Haute Définition'
                : videoInfo.type === 'youtube'
                ? 'Flux YouTube'
                : 'Lecteur Multimédia'}
            </span>
          </span>

          {hasCompleted && (
            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Leçon Validée</span>
            </span>
          )}
        </div>

        {/* Action buttons: Switch to mounted video or edit in studio */}
        <div className="flex items-center gap-2">
          {hasMountedVideo && onSwitchToMountedVideo && (
            <button
              type="button"
              onClick={onSwitchToMountedVideo}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Voir la Version Montée (Studio)</span>
            </button>
          )}

          {canEdit && onOpenVideoStudio && (
            <button
              type="button"
              onClick={onOpenVideoStudio}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 backdrop-blur-md transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Monter dans le Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Video Viewport (16:9 Aspect Ratio) */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {videoInfo.type === 'html5' ? (
          <>
            <video
              ref={videoRef}
              src={videoInfo.embedUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => {
                setIsPlaying(false);
                setHasCompleted(true);
                onLessonComplete?.();
              }}
              onError={() => {
                setIsVideoLoading(false);
                setLoadError('Impossible de charger le fichier vidéo. Vérifiez le lien source.');
              }}
              playsInline
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
            />

            {/* Loading Indicator */}
            {isVideoLoading && !loadError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xs text-white gap-2">
                <div className="w-10 h-10 border-3 border-sky-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-300 font-medium">Chargement du flux vidéo...</p>
              </div>
            )}

            {/* Load error message with fallback */}
            {loadError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 text-slate-200 space-y-3">
                <p className="text-sm font-bold text-rose-400">{loadError}</p>
                {hasMountedVideo && onSwitchToMountedVideo && (
                  <button
                    type="button"
                    onClick={onSwitchToMountedVideo}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                  >
                    Basculer sur la vidéo montée interactive
                  </button>
                )}
              </div>
            )}

            {/* Big Center Play Button Overlay on Click/Pause */}
            <AnimatePresence>
              {(!isPlaying || showControls) && !isVideoLoading && !loadError && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer pointer-events-none"
                >
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    type="button"
                    className="p-4 sm:p-5 rounded-full bg-sky-500/90 hover:bg-sky-400 text-white shadow-2xl backdrop-blur-md transition-all hover:scale-110 pointer-events-auto"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <Play className="w-8 h-8 translate-x-0.5" />
                    )}
                  </motion.button>
                </div>
              )}
            </AnimatePresence>

            {/* Bottom Controls Bar for HTML5 Video */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute inset-x-0 bottom-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2"
                >
                  {/* Progress Scrubber */}
                  <div className="relative group w-full h-3 flex items-center cursor-pointer">
                    {/* Buffer bar */}
                    {duration > 0 && (
                      <div
                        className="absolute h-1.5 bg-slate-700 rounded-full pointer-events-none"
                        style={{ width: `${(bufferedEnd / duration) * 100}%` }}
                      />
                    )}

                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      value={currentTime}
                      onChange={(e) => handleSeek(parseFloat(e.target.value))}
                      className="relative z-10 w-full h-1.5 group-hover:h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400 transition-all"
                    />
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between gap-2 text-xs text-white">
                    {/* Left: Play/Pause, -10s, +10s, Timecode */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => seekBy(-10)}
                        className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors text-[11px] font-mono"
                        title="Reculer de 10s (Flèche gauche)"
                      >
                        -10s
                      </button>

                      <button
                        type="button"
                        onClick={() => seekBy(10)}
                        className="p-1 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white transition-colors text-[11px] font-mono"
                        title="Avancer de 10s (Flèche droite)"
                      >
                        +10s
                      </button>

                      {/* Time text */}
                      <span className="font-mono text-slate-200 text-xs">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    {/* Right: Volume, Speed, Fullscreen */}
                    <div className="flex items-center gap-3">
                      {/* Volume Slider & Mute */}
                      <div className="flex items-center gap-1.5 group/vol">
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                          title={isMuted ? 'Rétablir le son (M)' : 'Couper le son (M)'}
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX className="w-4 h-4 text-rose-400" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-sky-400"
                        />
                      </div>

                      {/* Playback rate select */}
                      <select
                        value={playbackRate}
                        onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                        className="bg-black/60 hover:bg-black/90 border border-white/20 text-white text-[11px] font-bold rounded-lg px-2 py-0.5 cursor-pointer outline-none"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1.0x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2.0x</option>
                      </select>

                      {/* Fullscreen button */}
                      <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
                        title={isFullscreen ? 'Quitter plein écran (F)' : 'Plein écran (F)'}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="w-4 h-4" />
                        ) : (
                          <Maximize2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : videoInfo.embedUrl ? (
          /* Embed (YouTube, Vimeo, Loom, iframe) */
          <iframe
            src={videoInfo.embedUrl}
            title={lessonTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          /* Empty / No video URL available */
          <div className="p-8 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-indigo-900/40 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-inner">
              <Film className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">Vidéo de Cours non assignée</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Cette leçon n'a pas encore de flux vidéo associé. Vous pouvez monter une vidéo
                interactive dans le Studio IA ou insérer un lien vidéo.
              </p>
            </div>

            {onOpenVideoStudio && (
              <button
                type="button"
                onClick={onOpenVideoStudio}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 mx-auto transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Monter la vidéo avec le Studio IA</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Video Footer Info Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
            <Film className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h4 className="font-bold text-white truncate">{lessonTitle}</h4>
            <p className="text-[11px] text-slate-400 truncate">
              {courseTitle || 'Formation Academia ITECH'} • {authorName || 'Instructeur Certifié'}
            </p>
          </div>
        </div>

        {/* Mark completed manual trigger */}
        <div className="flex items-center gap-2">
          {!hasCompleted ? (
            <button
              type="button"
              onClick={() => {
                setHasCompleted(true);
                onLessonComplete?.();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Marquer comme visionné</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visionnage complété (+50 XP)</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
