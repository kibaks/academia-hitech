import React, { useRef } from 'react';
import {
  Scissors,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Plus,
  Play,
  Pause,
  Layers,
  Sparkles,
  HelpCircle,
  Code2,
  Mic,
  Music,
  User,
  Video,
} from 'lucide-react';
import { CourseVideoProject, TimelineTrack, TimelineClip } from '../../../types';

interface TimelineTrackViewProps {
  project: CourseVideoProject;
  currentTime: number;
  onSeek: (time: number) => void;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  zoom: number; // pixels per second, e.g. 10 to 30
  onChangeZoom: (zoom: number) => void;
  onSplitClipAtPlayhead: () => void;
  onDuplicateSelectedClip: () => void;
  onDeleteSelectedClip: () => void;
  onUpdateClip: (clipId: string, patch: Partial<TimelineClip>) => void;
  onToggleTrackMute: (trackId: string) => void;
  onToggleTrackLock: (trackId: string) => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  readOnly?: boolean;
}

export const TimelineTrackView: React.FC<TimelineTrackViewProps> = ({
  project,
  currentTime,
  onSeek,
  selectedClipId,
  onSelectClip,
  zoom,
  onChangeZoom,
  onSplitClipAtPlayhead,
  onDuplicateSelectedClip,
  onDeleteSelectedClip,
  onUpdateClip,
  onToggleTrackMute,
  onToggleTrackLock,
  isPlaying = false,
  onTogglePlay,
  readOnly = false,
}) => {
  const timelineContentRef = useRef<HTMLDivElement>(null);
  const totalWidthPx = Math.max(800, project.totalDurationSeconds * zoom + 120);

  // Ruler markings every 5 or 10 seconds
  const stepSeconds = zoom < 12 ? 10 : 5;
  const rulerTicksCount = Math.ceil(project.totalDurationSeconds / stepSeconds) + 1;
  const rulerTicks = Array.from({ length: rulerTicksCount }, (_, i) => i * stepSeconds);

  // Click or drag on ruler / timeline to seek
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineContentRef.current) return;
    const rect = timelineContentRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(project.totalDurationSeconds, clickX / zoom));
    onSeek(newTime);
  };

  const getTrackIcon = (type: string) => {
    switch (type) {
      case 'overlay_text':
        return <Layers className="w-3.5 h-3.5 text-amber-400" />;
      case 'avatar':
        return <User className="w-3.5 h-3.5 text-purple-400" />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-sky-400" />;
      case 'voiceover':
        return <Mic className="w-3.5 h-3.5 text-emerald-400" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-cyan-400" />;
      case 'interactive':
        return <HelpCircle className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden select-none">
      {/* Timeline Controls & Tools Toolbar */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
        {/* Left Tools: Play/Pause, Split, Duplicate, Delete */}
        <div className="flex items-center gap-1.5">
          {onTogglePlay && (
            <button
              type="button"
              onClick={onTogglePlay}
              title="Lecture / Pause de la timeline (Espace)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 shadow-xs'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400 shadow-xs'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Lecture</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            disabled={readOnly || !selectedClipId}
            onClick={onSplitClipAtPlayhead}
            title="Scinder / Couper le clip sous la tête de lecture (Touche C)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-800 text-slate-200 hover:bg-indigo-600 hover:text-white disabled:opacity-40 disabled:hover:bg-slate-800 disabled:hover:text-slate-200 border border-slate-700"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Scinder (Cut)</span>
          </button>

          <button
            type="button"
            disabled={readOnly || !selectedClipId}
            onClick={onDuplicateSelectedClip}
            title="Dupliquer le clip sélectionné"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-40 border border-slate-700"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Dupliquer</span>
          </button>

          <button
            type="button"
            disabled={readOnly || !selectedClipId}
            onClick={onDeleteSelectedClip}
            title="Supprimer le clip sélectionné (Suppr / Backspace)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-slate-800 text-rose-300 hover:bg-rose-950/80 hover:text-rose-100 hover:border-rose-500 disabled:opacity-40 border border-slate-700"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Supprimer</span>
          </button>
        </div>

        {/* Center: Selected Clip quick badge */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          {selectedClipId ? (
            <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold">
              Clip sélectionné : {project.clips.find((c) => c.id === selectedClipId)?.title || selectedClipId}
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">
              Cliquez sur un clip de la timeline pour l'inspecter et le modifier
            </span>
          )}
        </div>

        {/* Right: Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeZoom(Math.max(6, zoom - 3))}
            title="Dézoomer la timeline"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-[11px] font-mono text-slate-400 min-w-[42px] text-center">
            {Math.round((zoom / 15) * 100)}%
          </span>

          <button
            type="button"
            onClick={() => onChangeZoom(Math.min(40, zoom + 3))}
            title="Zoomer la timeline"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Timeline Workspace: Left Track Headers & Right Scrollable Area */}
      <div className="flex overflow-hidden relative">
        {/* Left Track Headers (Fixed width) */}
        <div className="w-48 sm:w-56 shrink-0 bg-slate-900/95 border-r border-slate-800 z-20 flex flex-col divide-y divide-slate-800">
          {/* Header spacer for Ruler */}
          <div className="h-7 px-3 flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 bg-slate-950/60">
            <span>PISTES DE MONTAGE</span>
            <span>ÉTAT</span>
          </div>

          {/* Track Headers */}
          {project.tracks.map((track) => (
            <div
              key={track.id}
              className="h-12 px-3 flex items-center justify-between gap-2 text-xs bg-slate-900 hover:bg-slate-850 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-1.5 h-6 rounded-full shrink-0"
                  style={{ backgroundColor: track.color }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    {getTrackIcon(track.type)}
                    <span className="font-bold text-slate-200 text-xs truncate">
                      {track.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block truncate">
                    {track.label}
                  </span>
                </div>
              </div>

              {/* Track Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleTrackMute(track.id)}
                  title={track.isMuted ? 'Réactiver la piste' : 'Couper le son / Muter la piste'}
                  className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                    track.isMuted ? 'text-rose-400 bg-rose-950/50' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {track.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => onToggleTrackLock(track.id)}
                  title={track.isLocked ? 'Déverrouiller la piste' : 'Verrouiller la piste'}
                  className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                    track.isLocked ? 'text-amber-400 bg-amber-950/50' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {track.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scrollable Timeline Canvas */}
        <div
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-slate-950"
          style={{ height: `${28 + project.tracks.length * 48 + 4}px` }}
        >
          <div
            ref={timelineContentRef}
            onClick={handleTimelineClick}
            className="relative cursor-pointer select-none"
            style={{ width: `${totalWidthPx}px`, minHeight: '100%' }}
          >
            {/* 1. Time Ruler Bar */}
            <div className="h-7 border-b border-slate-800/80 bg-slate-950/80 flex items-center relative font-mono text-[10px] text-slate-500">
              {rulerTicks.map((timeSec) => {
                const leftPx = timeSec * zoom;
                const mins = Math.floor(timeSec / 60);
                const secs = timeSec % 60;
                const timeLabel = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                return (
                  <div
                    key={timeSec}
                    className="absolute top-0 bottom-0 flex flex-col justify-end pointer-events-none"
                    style={{ left: `${leftPx}px` }}
                  >
                    <span className="mb-1 text-[10px] text-slate-400 font-bold -translate-x-1/2">
                      {timeLabel}
                    </span>
                    <div className="w-px h-2 bg-slate-700" />
                  </div>
                );
              })}

              {/* Markers */}
              {project.markers?.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute top-0 bottom-0 flex items-center pointer-events-none z-10"
                  style={{ left: `${marker.timeSeconds * zoom}px` }}
                >
                  <div
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-md -translate-x-1/2 flex items-center gap-1"
                    style={{ backgroundColor: marker.color || '#0284c7' }}
                  >
                    <span>⛳</span>
                    <span>{marker.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Track Lanes Container */}
            <div className="relative divide-y divide-slate-850">
              {project.tracks.map((track) => {
                const trackClips = project.clips.filter((c) => c.trackId === track.id);
                return (
                  <div
                    key={track.id}
                    className="h-12 relative flex items-center bg-slate-950/40 hover:bg-slate-900/40 transition-colors"
                  >
                    {/* Background grid markings */}
                    {rulerTicks.map((timeSec) => (
                      <div
                        key={timeSec}
                        className="absolute top-0 bottom-0 w-px bg-slate-900/60 pointer-events-none"
                        style={{ left: `${timeSec * zoom}px` }}
                      />
                    ))}

                    {/* Clips on this track */}
                    {trackClips.map((clip) => {
                      const isSelected = selectedClipId === clip.id;
                      const clipLeft = clip.startSeconds * zoom;
                      const clipWidth = Math.max(30, clip.durationSeconds * zoom);

                      return (
                        <div
                          key={clip.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectClip(clip.id);
                          }}
                          className={`absolute h-9.5 rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer transition-all shadow-md flex items-center justify-between overflow-hidden group border ${
                            isSelected
                              ? 'ring-2 ring-white border-white brightness-110 shadow-lg z-10'
                              : 'border-white/10 hover:brightness-105'
                          }`}
                          style={{
                            left: `${clipLeft}px`,
                            width: `${clipWidth}px`,
                            backgroundColor: clip.color || track.color,
                          }}
                        >
                          {/* Clip Header Content */}
                          <div className="flex items-center gap-1.5 min-w-0 pr-1">
                            {clip.type === 'b_roll' || clip.type === 'video' ? (
                              <Video className="w-3 h-3 text-white/90 shrink-0" />
                            ) : clip.type === 'avatar' ? (
                              <User className="w-3 h-3 text-white/90 shrink-0" />
                            ) : clip.type === 'code_snippet' ? (
                              <Code2 className="w-3 h-3 text-white/90 shrink-0" />
                            ) : clip.type === 'interactive_quiz' ? (
                              <HelpCircle className="w-3 h-3 text-white/90 shrink-0" />
                            ) : clip.type === 'voiceover' ? (
                              <Mic className="w-3 h-3 text-white/90 shrink-0" />
                            ) : (
                              <Music className="w-3 h-3 text-white/90 shrink-0" />
                            )}
                            <span className="text-white text-[11px] font-bold truncate drop-shadow-xs">
                              {clip.title}
                            </span>
                          </div>

                          {/* Simulated audio waveform for audio/voiceover */}
                          {(clip.type === 'voiceover' || clip.type === 'music') && (
                            <div className="flex items-center gap-0.5 opacity-40 shrink-0 mr-1">
                              <div className="w-0.5 h-3 bg-white animate-pulse" />
                              <div className="w-0.5 h-5 bg-white" />
                              <div className="w-0.5 h-2 bg-white" />
                              <div className="w-0.5 h-4 bg-white" />
                              <div className="w-0.5 h-1.5 bg-white" />
                            </div>
                          )}

                          {/* Duration Pill */}
                          <span className="text-[10px] font-mono font-bold text-white/80 bg-black/30 px-1 py-0.5 rounded shrink-0">
                            {Math.round(clip.durationSeconds)}s
                          </span>

                          {/* Left Trim Handle (active on hover) */}
                          <div
                            title="Ronger le début du clip"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (clip.durationSeconds > 2) {
                                onUpdateClip(clip.id, {
                                  startSeconds: clip.startSeconds + 1,
                                  durationSeconds: clip.durationSeconds - 1,
                                });
                              }
                            }}
                            className="absolute left-0 inset-y-0 w-2 bg-white/20 hover:bg-white/60 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                          />

                          {/* Right Trim Handle (active on hover) */}
                          <div
                            title="Ronger la fin du clip"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (clip.durationSeconds > 2) {
                                onUpdateClip(clip.id, {
                                  durationSeconds: clip.durationSeconds + 1,
                                });
                              }
                            }}
                            className="absolute right-0 inset-y-0 w-2 bg-white/20 hover:bg-white/60 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* 3. Master Playhead Line & Scrubber Handle */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-30"
              style={{ left: `${currentTime * zoom}px` }}
            >
              {/* Playhead Scrubber Handle */}
              <div className="relative -left-[7px] -top-1 w-3.5 h-4 bg-red-500 rounded-b-sm shadow-md flex items-center justify-center">
                <div className="w-1 h-2 bg-white rounded-full" />
              </div>

              {/* Vertical red line spanning all tracks */}
              <div className="w-[2px] h-full bg-red-500 shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
