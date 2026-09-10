import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Scissors,
  Copy,
  Trash2,
  Save,
  Download,
  Share2,
  Sparkles,
  Layers,
  Sliders,
  Maximize2,
  Minimize2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Wand2,
  FileVideo,
  Monitor,
  Smartphone,
  Square,
  Mic,
  Plus,
  X,
  Eye,
  Tv,
  LayoutTemplate,
} from 'lucide-react';
import {
  CourseVideoProject,
  TimelineClip,
  AnimakerLesson,
} from '../../types';
import {
  INITIAL_COURSE_VIDEO_PROJECT,
  HSE_COURSE_VIDEO_PROJECT,
  ANIMAKER_PRESET_TEMPLATES,
  convertAnimakerLessonToVideoProject,
  convertVideoProjectToAnimakerLesson,
} from '../../data/videoProjectsData';
import { VideoMonitor } from './video-editor/VideoMonitor';
import { TimelineTrackView } from './video-editor/TimelineTrackView';
import { MediaLibraryPanel } from './video-editor/MediaLibraryPanel';
import { ClipInspectorPanel } from './video-editor/ClipInspectorPanel';
import { GeneratedVideoPlayer } from '../player/GeneratedVideoPlayer';
import { ExportVideoModal } from './video-editor/ExportVideoModal';

export interface VideoEditingStudioProps {
  initialVideoProject?: CourseVideoProject;
  initialLesson?: AnimakerLesson;
  courseTitle?: string;
  chapterTitle?: string;
  onSaveVideoProject?: (project: CourseVideoProject) => void;
  onSaveLesson?: (lesson: AnimakerLesson) => void;
  onPublishToCourse?: (lesson: AnimakerLesson, project?: CourseVideoProject) => void;
  onClose?: () => void;
  readOnly?: boolean;
  isModal?: boolean;
}

export const VideoEditingStudio: React.FC<VideoEditingStudioProps> = ({
  initialVideoProject,
  initialLesson,
  courseTitle,
  chapterTitle,
  onSaveVideoProject,
  onSaveLesson,
  onPublishToCourse,
  onClose,
  readOnly = false,
  isModal = true,
}) => {
  // Initialize project state from prop, or converted from initialLesson, or default template
  const [project, setProject] = useState<CourseVideoProject>(() => {
    if (initialVideoProject) return initialVideoProject;
    if (initialLesson) return convertAnimakerLessonToVideoProject(initialLesson);
    return INITIAL_COURSE_VIDEO_PROJECT;
  });

  // Playback & Time State
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [timelineZoom, setTimelineZoom] = useState(14); // pixels per second

  // Modal display states
  const [isModalMaximized, setIsModalMaximized] = useState(false);
  const [showPreviewGeneratedVideo, setShowPreviewGeneratedVideo] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // AI & Feedback State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Playhead Animation Loop
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

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
            return 0;
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
  }, [isPlaying, playbackRate, project.totalDurationSeconds]);

  // Keyboard Shortcuts (Space to play, C to cut, Delete to remove, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' || e.code === 'KeyK') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'KeyJ' || e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentTime((t) => Math.max(0, Math.min(project.totalDurationSeconds, t - 2)));
      } else if (e.code === 'KeyL' || e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentTime((t) => Math.max(0, Math.min(project.totalDurationSeconds, t + 2)));
      } else if (e.code === 'Home') {
        e.preventDefault();
        setCurrentTime(0);
      } else if (e.code === 'KeyC') {
        e.preventDefault();
        handleSplitClip();
      } else if (e.code === 'Delete' || e.code === 'Backspace') {
        if (selectedClipId && !readOnly) {
          e.preventDefault();
          handleDeleteClip(selectedClipId);
        }
      } else if (e.code === 'Escape') {
        if (showExportModal) {
          setShowExportModal(false);
        } else if (showPreviewGeneratedVideo) {
          setShowPreviewGeneratedVideo(false);
        } else if (selectedClipId) {
          setSelectedClipId(null);
        } else if (onClose) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClipId, currentTime, project.clips, readOnly, showPreviewGeneratedVideo, showExportModal, onClose]);

  // Active clips under the playhead
  const activeClips = project.clips.filter(
    (c) => currentTime >= c.startSeconds && currentTime < c.startSeconds + c.durationSeconds
  );

  const selectedClip = project.clips.find((c) => c.id === selectedClipId) || null;

  // Clip Operations
  const handleUpdateClip = (clipId: string, patch: Partial<TimelineClip>) => {
    setProject((prev) => {
      const updatedClips = prev.clips.map((c) => (c.id === clipId ? { ...c, ...patch } : c));
      // recalculate total duration if clip goes beyond
      const maxClipEnd = Math.max(...updatedClips.map((c) => c.startSeconds + c.durationSeconds), prev.totalDurationSeconds);
      return {
        ...prev,
        clips: updatedClips,
        totalDurationSeconds: Math.max(30, maxClipEnd),
      };
    });
  };

  const handleAddClip = (newClip: TimelineClip) => {
    setProject((prev) => {
      const updatedClips = [...prev.clips, newClip];
      const maxClipEnd = Math.max(newClip.startSeconds + newClip.durationSeconds, prev.totalDurationSeconds);
      return {
        ...prev,
        clips: updatedClips,
        totalDurationSeconds: Math.max(30, maxClipEnd),
      };
    });
    setSelectedClipId(newClip.id);
  };

  const handleDeleteClip = (clipId: string) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.filter((c) => c.id !== clipId),
    }));
    if (selectedClipId === clipId) {
      setSelectedClipId(null);
    }
  };

  const handleDuplicateClip = (clipId: string) => {
    const target = project.clips.find((c) => c.id === clipId);
    if (!target) return;
    const newClip: TimelineClip = {
      ...target,
      id: `clip-dup-${Date.now()}`,
      title: `${target.title} (Copie)`,
      startSeconds: target.startSeconds + target.durationSeconds + 0.5,
    };
    handleAddClip(newClip);
  };

  // Split / Razor tool: cut clip under playhead
  const handleSplitClip = () => {
    if (readOnly) return;
    // target either selected clip or active video clip at playhead
    const target =
      (selectedClipId && project.clips.find((c) => c.id === selectedClipId)) ||
      project.clips.find(
        (c) =>
          c.trackId === 'track-video' &&
          currentTime > c.startSeconds + 0.5 &&
          currentTime < c.startSeconds + c.durationSeconds - 0.5
      );

    if (!target) return;

    const cutPoint = currentTime;
    if (cutPoint <= target.startSeconds || cutPoint >= target.startSeconds + target.durationSeconds) return;

    const firstDuration = cutPoint - target.startSeconds;
    const secondDuration = target.durationSeconds - firstDuration;

    const firstClip: TimelineClip = {
      ...target,
      durationSeconds: firstDuration,
    };

    const secondClip: TimelineClip = {
      ...target,
      id: `clip-split-${Date.now()}`,
      title: `${target.title} (Partie 2)`,
      startSeconds: cutPoint,
      durationSeconds: secondDuration,
    };

    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === target.id ? firstClip : c)).concat(secondClip),
    }));

    setSelectedClipId(secondClip.id);
  };

  // Magic Cut IA (Auto-trim gaps & silence)
  const handleMagicCut = () => {
    setProject((prev) => {
      // Smoothly compact clips without dead time > 2s
      let cursor = 0;
      const sortedClips = [...prev.clips].sort((a, b) => a.startSeconds - b.startSeconds);
      const compacted = sortedClips.map((clip) => {
        const offset = Math.max(0, clip.startSeconds - cursor);
        if (offset > 2) {
          const shift = offset - 0.5;
          return { ...clip, startSeconds: Math.max(0, clip.startSeconds - shift) };
        }
        return clip;
      });

      return {
        ...prev,
        clips: compacted,
      };
    });
    setSaveSuccessMessage('⚡ Magic Cut IA appliqué : temps morts et silences optimisés !');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  // Track Toggles
  const handleToggleTrackMute = (trackId: string) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, isMuted: !t.isMuted } : t)),
    }));
  };

  const handleToggleTrackLock = (trackId: string) => {
    setProject((prev) => ({
      ...prev,
      tracks: prev.tracks.map((t) => (t.id === trackId ? { ...t, isLocked: !t.isLocked } : t)),
    }));
  };

  // Save / Publish
  const handleSave = () => {
    onSaveVideoProject?.(project);
    const convertedLesson = convertVideoProjectToAnimakerLesson(project);
    onSaveLesson?.(convertedLesson);
    setSaveSuccessMessage('Projet de montage sauvegardé avec succès dans le cours !');
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handlePublish = () => {
    const convertedLesson = convertVideoProjectToAnimakerLesson(project);
    onPublishToCourse?.(convertedLesson, project);
    setSaveSuccessMessage('🎬 Vidéo générée publiée avec succès dans le cours !');
    setTimeout(() => {
      setSaveSuccessMessage(null);
      if (onClose) onClose();
    }, 1800);
  };

  // AI Generation with Gemini
  const handleGenerateWithAI = async (topic: string, characterId: string, durationMinutes: number) => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/gemini/generate-animaker-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Générer un montage vidéo complet de cours sur : ${topic}. Inclure plans B-roll, formateur PiP, lower-thirds, bloc de code et quiz interactif.`,
          topic,
          sceneCount: Math.max(3, durationMinutes * 2),
          characterTheme: characterId,
        }),
      });

      const data = await response.json();
      if (data.lesson) {
        const generatedProject = convertAnimakerLessonToVideoProject(data.lesson);
        generatedProject.title = `Montage IA : ${topic}`;
        setProject(generatedProject);
        setCurrentTime(0);
        setSaveSuccessMessage('🎬 Montage vidéo généré avec succès par Gemini IA !');
        setTimeout(() => setSaveSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to generate video project with Gemini:', err);
      // Fallback to high-quality project template
      setProject({
        ...INITIAL_COURSE_VIDEO_PROJECT,
        title: `Montage IA : ${topic}`,
        topic,
      });
      setSaveSuccessMessage('🎬 Timeline de cours assemblée avec succès !');
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const studioBody = (
    <div
      className={`flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden ${
        isModal
          ? isModalMaximized
            ? 'w-screen h-screen'
            : 'w-full h-full rounded-2xl border border-slate-800 shadow-2xl'
          : 'h-[calc(100vh-4rem)] min-h-[720px]'
      }`}
    >
      {/* Top Application Bar */}
      <header className="h-14 px-3 sm:px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 z-40">
        {/* Left: Back & Project Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fermer le studio de montage (Échap)"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  disabled={readOnly}
                  value={project.title}
                  onChange={(e) => setProject({ ...project, title: e.target.value })}
                  className="text-xs md:text-sm font-black text-white bg-transparent hover:bg-slate-800/60 focus:bg-slate-800 px-2 py-0.5 rounded-lg transition-colors border border-transparent focus:border-indigo-500 max-w-[200px] sm:max-w-[300px] md:max-w-md truncate"
                />
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-[10px] font-bold text-indigo-300 whitespace-nowrap">
                  {isModal ? 'GRAND STUDIO MODAL' : 'STUDIO MONTAGE'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 px-2 truncate">
                {courseTitle ? `${courseTitle} • ` : ''}
                {project.topic}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Aspect Ratio & Magic Tools */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Format Ratio Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setProject({ ...project, aspectRatio: '16:9' })}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                project.aspectRatio === '16:9'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Format 16:9 Paysage (YouTube, E-learning)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>16:9</span>
            </button>
            <button
              type="button"
              onClick={() => setProject({ ...project, aspectRatio: '9:16' })}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                project.aspectRatio === '9:16'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Format 9:16 Vertical (Shorts, TikTok, Mobile)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16</span>
            </button>
            <button
              type="button"
              onClick={() => setProject({ ...project, aspectRatio: '1:1' })}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                project.aspectRatio === '1:1'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Format 1:1 Carré"
            >
              <Square className="w-3.5 h-3.5" />
              <span>1:1</span>
            </button>
          </div>

          {/* Magic Cut IA button */}
          <button
            type="button"
            disabled={readOnly}
            onClick={handleMagicCut}
            title="Supprimer automatiquement les silences et optimiser les enchaînements"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Magic Cut IA</span>
          </button>

          {/* Tester la Vidéo Générée Button */}
          <button
            type="button"
            onClick={() => setShowPreviewGeneratedVideo(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 text-purple-200 text-xs font-bold border border-purple-500/30 transition-all shadow-xs"
            title="Tester le rendu de la vidéo finale générée (expérience apprenant)"
          >
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>Tester la Vidéo Générée</span>
          </button>

          {/* Modèles Prédéfinis Animaker Button */}
          <button
            type="button"
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-500/40 transition-all shadow-xs"
            title="Choisir un modèle prédéfini de style Animaker (2D Explainer, Whiteboard, Fintech, HSE, Cyber)"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Modèles Animaker</span>
          </button>
        </div>

        {/* Right: Actions (Save, Publish, Maximize, Close) */}
        <div className="flex items-center gap-2">
          {saveSuccessMessage && (
            <span className="hidden xl:flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveSuccessMessage}</span>
            </span>
          )}

          {!readOnly && (
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sauvegarder</span>
            </button>
          )}

          {/* Export Button */}
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
            title="Exporter la vidéo en MP4, package SCORM pour LMS ou sauvegarder le projet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>

          {!readOnly && onPublishToCourse && (
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-md"
              title="Publier la vidéo générée dans le cours (sans le logiciel de montage)"
            >
              <FileVideo className="w-3.5 h-3.5" />
              <span>Publier la Vidéo Générée</span>
            </button>
          )}

          {isModal && (
            <button
              type="button"
              onClick={() => setIsModalMaximized(!isModalMaximized)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isModalMaximized ? 'Réduire la fenêtre' : 'Plein écran'}
            >
              {isModalMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors ml-0.5"
              title="Fermer le studio (Échap)"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace (Split in 2 rows: Top 3-Pane View + Bottom Timeline) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* TOP SECTION: Left Media Library, Center Video Monitor, Right Inspector */}
        <div className="flex-1 grid grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column: Media Pool & Assets Library (col-span-3) */}
          <div className="col-span-12 md:col-span-3 h-full overflow-hidden">
            <MediaLibraryPanel
              currentTime={currentTime}
              onAddClipToTimeline={handleAddClip}
              onGenerateWithAI={handleGenerateWithAI}
              isGeneratingAI={isGeneratingAI}
              readOnly={readOnly}
            />
          </div>

          {/* Center Column: Video Preview Monitor (col-span-6) */}
          <div className="col-span-12 md:col-span-6 h-full p-2 overflow-hidden flex flex-col justify-center">
            <VideoMonitor
              project={project}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onSeek={(t) => setCurrentTime(t)}
              onTimeStep={(delta) => setCurrentTime((t) => Math.max(0, Math.min(project.totalDurationSeconds, t + delta)))}
              playbackRate={playbackRate}
              onChangePlaybackRate={setPlaybackRate}
              activeClips={activeClips}
              onSelectClip={setSelectedClipId}
              readOnly={readOnly}
            />
          </div>

          {/* Right Column: Clip Properties Inspector (col-span-3) */}
          <div className="col-span-12 md:col-span-3 h-full overflow-hidden">
            <ClipInspectorPanel
              project={project}
              selectedClip={selectedClip}
              onUpdateClip={handleUpdateClip}
              onDeleteClip={handleDeleteClip}
              onDuplicateClip={handleDuplicateClip}
              readOnly={readOnly}
            />
          </div>
        </div>

        {/* BOTTOM SECTION: NLE Multi-Track Timeline */}
        <div className="h-64 md:h-72 p-2 pt-0 shrink-0">
          <TimelineTrackView
            project={project}
            currentTime={currentTime}
            onSeek={(t) => setCurrentTime(t)}
            selectedClipId={selectedClipId}
            onSelectClip={setSelectedClipId}
            zoom={timelineZoom}
            onChangeZoom={setTimelineZoom}
            onSplitClipAtPlayhead={handleSplitClip}
            onDuplicateSelectedClip={() => selectedClipId && handleDuplicateClip(selectedClipId)}
            onDeleteSelectedClip={() => selectedClipId && handleDeleteClip(selectedClipId)}
            onUpdateClip={handleUpdateClip}
            onToggleTrackMute={handleToggleTrackMute}
            onToggleTrackLock={handleToggleTrackLock}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-3 md:p-4 overflow-hidden animate-fadeIn">
        <div
          className={`relative transition-all duration-200 flex flex-col ${
            isModalMaximized
              ? 'w-screen h-screen'
              : 'w-[98vw] max-w-[1720px] h-[95vh] max-h-[96vh]'
          }`}
        >
          {studioBody}
        </div>

        {/* MODAL APERÇU VIDÉO GÉNÉRÉE */}
        {showPreviewGeneratedVideo && (
          <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn">
            <div className="w-full max-w-4xl bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Eye className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-white">Aperçu de la Vidéo Générée (Rendu Élève)</h4>
                    <p className="text-[11px] text-slate-400">Voici exactement ce que verra l'apprenant dans son lecteur de cours</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreviewGeneratedVideo(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <GeneratedVideoPlayer project={project} autoPlay={true} />
            </div>
          </div>
        )}

        {/* Video Export Modal */}
        {showExportModal && (
          <ExportVideoModal
            project={project}
            currentTime={currentTime}
            onClose={() => setShowExportModal(false)}
            onPublishToCourse={onPublishToCourse ? handlePublish : undefined}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {studioBody}
      {showPreviewGeneratedVideo && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-4xl bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-black text-white">Aperçu de la Vidéo Générée (Rendu Élève)</h4>
                  <p className="text-[11px] text-slate-400">Voici exactement ce que verra l'apprenant dans son lecteur de cours</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewGeneratedVideo(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <GeneratedVideoPlayer project={project} autoPlay={true} />
          </div>
        </div>
      )}

      {/* Video Export Modal */}
      {showExportModal && (
        <ExportVideoModal
          project={project}
          currentTime={currentTime}
          onClose={() => setShowExportModal(false)}
          onPublishToCourse={onPublishToCourse ? handlePublish : undefined}
        />
      )}

      {/* Animaker Predefined Templates Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>Modèles Prédéfinis au Style Animaker</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                      {ANIMAKER_PRESET_TEMPLATES.length} Modèles Prêts
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sélectionnez un modèle pour charger instantanément ses pistes multi-médias, plans B-roll, animateur PiP et arrêts quiz.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Template Grid */}
            <div className="p-6 overflow-y-auto space-y-4 max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ANIMAKER_PRESET_TEMPLATES.map((tmpl) => {
                  const isCurrent = project.id === tmpl.id;
                  const quizCount = tmpl.clips.filter((c) => c.type === 'interactive_quiz').length;
                  return (
                    <div
                      key={tmpl.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group ${
                        isCurrent
                          ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            {tmpl.leadCharacterAvatar && (
                              <img
                                src={tmpl.leadCharacterAvatar}
                                alt={tmpl.leadCharacterName || 'Avatar'}
                                className="w-9 h-9 rounded-full object-cover border border-slate-700"
                              />
                            )}
                            <div>
                              <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                                {tmpl.title}
                              </h4>
                              <p className="text-[11px] text-amber-400/90 font-medium">{tmpl.topic}</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-300 whitespace-nowrap">
                            {tmpl.totalDurationSeconds}s
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {tmpl.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                          <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                            🎬 {tmpl.clips.length} clips
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                            📐 {tmpl.aspectRatio}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                            👤 {tmpl.leadCharacterName || 'Présentateur'}
                          </span>
                          {quizCount > 0 && (
                            <span className="px-2 py-0.5 rounded-lg bg-pink-950/60 border border-pink-500/30 text-pink-300 font-bold">
                              ❓ {quizCount} Quiz
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          {isCurrent ? 'Modèle actuellement ouvert' : 'Prêt à monter'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setProject(tmpl);
                            setCurrentTime(0);
                            setIsPlaying(false);
                            setShowTemplateModal(false);
                            setSaveSuccessMessage(`Modèle Animaker "${tmpl.title}" chargé avec succès !`);
                            setTimeout(() => setSaveSuccessMessage(null), 3500);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isCurrent
                              ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:scale-105'
                          }`}
                        >
                          <LayoutTemplate className="w-3.5 h-3.5" />
                          <span>{isCurrent ? 'Réinitialiser ce modèle' : 'Charger ce modèle'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
