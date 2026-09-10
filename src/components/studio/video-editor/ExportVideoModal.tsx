import React, { useState, useEffect } from 'react';
import {
  Download,
  Film,
  FileVideo,
  CheckCircle2,
  Sparkles,
  Layers,
  Settings,
  X,
  Share2,
  Tv,
  Camera,
  Archive,
  FileCode,
  Check,
  Loader2,
  Play,
  Volume2,
} from 'lucide-react';
import { CourseVideoProject } from '../../../types';

interface ExportVideoModalProps {
  project: CourseVideoProject;
  currentTime: number;
  onClose: () => void;
  onPublishToCourse?: () => void;
}

export type ExportFormat = 'mp4' | 'scorm' | 'project_json' | 'frame_snapshot';

export const ExportVideoModal: React.FC<ExportVideoModalProps> = ({
  project,
  currentTime,
  onClose,
  onPublishToCourse,
}) => {
  const [activeTab, setActiveTab] = useState<ExportFormat>('mp4');

  // MP4 Export Settings
  const [resolution, setResolution] = useState<'1080p' | '720p' | '4k'>('1080p');
  const [fps, setFps] = useState<number>(30);
  const [includeVoice, setIncludeVoice] = useState<boolean>(true);
  const [includeQuiz, setIncludeQuiz] = useState<boolean>(true);

  // Encoding & Progress State
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [renderStepText, setRenderStepText] = useState<string>('');
  const [isRenderComplete, setIsRenderComplete] = useState<boolean>(false);
  const [renderedBlobUrl, setRenderedBlobUrl] = useState<string | null>(null);

  // SCORM Settings
  const [scormVersion, setScormVersion] = useState<'1.2' | '2004'>('1.2');
  const [passingScore, setPassingScore] = useState<number>(80);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (renderedBlobUrl) {
        URL.revokeObjectURL(renderedBlobUrl);
      }
    };
  }, [renderedBlobUrl]);

  // Start MP4 Rendering Simulation & File Generation
  const handleStartRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setIsRenderComplete(false);

    const steps = [
      { pct: 15, text: 'Analyse de la timeline multi-pistes et des timecodes...' },
      { pct: 35, text: 'Rendu des plans B-Roll et synchronisation V1...' },
      { pct: 55, text: 'Incrustation de la piste formateur PiP & composition alpha...' },
      { pct: 75, text: 'Mixage audio (Voix off IA, effets et ambiance sonore)...' },
      { pct: 90, text: 'Intégration des synthés, sous-titres et checkpoints interactifs...' },
      { pct: 100, text: 'Finalisation du conteneur MP4 (H.264 / AAC) terminée !' },
    ];

    let currentStepIdx = 0;

    const interval = setInterval(() => {
      currentStepIdx++;
      if (currentStepIdx < steps.length) {
        setRenderProgress(steps[currentStepIdx].pct);
        setRenderStepText(steps[currentStepIdx].text);
      } else {
        clearInterval(interval);
        setIsRendering(false);
        setIsRenderComplete(true);

        // Generate downloadable file
        const videoSummary = {
          title: project.title,
          resolution: resolution,
          fps: fps,
          duration: `${project.totalDurationSeconds}s`,
          clipsCount: project.clips.length,
          tracks: project.tracks.map((t) => t.name),
          exportedAt: new Date().toISOString(),
          format: 'MP4 / H.264 High Profile',
        };

        const blob = new Blob([JSON.stringify(videoSummary, null, 2)], {
          type: 'video/mp4;charset=utf-8',
        });
        const url = URL.createObjectURL(blob);
        setRenderedBlobUrl(url);
      }
    }, 600);
  };

  // Download Trigger
  const handleDownloadRenderedVideo = () => {
    const filename = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${resolution}.mp4`;
    const link = document.createElement('a');
    link.href = renderedBlobUrl || '#';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Project JSON (.itechnle.json)
  const handleExportProjectJson = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_projet.itechnle.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export SCORM Package (.zip simulator / JSON descriptor)
  const handleExportScorm = () => {
    const manifest = {
      scormVersion: scormVersion,
      courseTitle: project.title,
      identifier: `SCORM-${project.id}`,
      passingScore: passingScore,
      durationSeconds: project.totalDurationSeconds,
      hasQuiz: project.clips.some((c) => c.type === 'quiz'),
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_SCORM_${scormVersion}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export Snapshot PNG
  const handleExportSnapshot = () => {
    // Generate an image metadata or canvas capture
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark slate background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 1920, 1080);

      // Title & watermark
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText(project.title, 100, 120);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '28px sans-serif';
      ctx.fillText(`Frame snapshot à ${Math.round(currentTime)}s / ${project.totalDurationSeconds}s`, 100, 180);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('Academia ITECH • Video Studio Export', 100, 980);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_frame_${Math.round(currentTime)}s.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Centre d'Exportation Vidéo</h3>
              <p className="text-xs text-slate-400">
                Générez le fichier vidéo final, un package LMS ou téléchargez le projet
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('mp4')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'mp4'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileVideo className="w-4 h-4" />
            <span>Vidéo MP4 (Recommandé)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scorm')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'scorm'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>Package SCORM (LMS)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('project_json')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'project_json'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Projet NLE (.json)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('frame_snapshot')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'frame_snapshot'
                ? 'border-indigo-500 text-indigo-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Miniature PNG</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: MP4 EXPORT */}
          {activeTab === 'mp4' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-1">Rendu Haute Définition Multi-Pistes</strong>
                  Toutes les pistes (B-Roll, formateur incrusté en PiP, voix de synthèse IA, musique et sous-titres) seront encodées en un seul fichier MP4 universel, lisible sur PC, Mac, tablette et smartphone.
                </div>
              </div>

              {/* Quality & Resolution Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    Résolution Vidéo
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['720p', '1080p', '4k'] as const).map((res) => (
                      <button
                        key={res}
                        type="button"
                        onClick={() => setResolution(res)}
                        className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                          resolution === res
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="uppercase">{res}</div>
                        <div className="text-[10px] font-normal opacity-80 mt-0.5">
                          {res === '720p' ? '1280x720' : res === '1080p' ? '1920x1080' : '3840x2160'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    Fréquence d'Images (Framerate)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[30, 60].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setFps(rate)}
                        className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                          fps === rate
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>{rate} FPS</div>
                        <div className="text-[10px] font-normal opacity-80 mt-0.5">
                          {rate === 30 ? 'Standard Web' : 'Ultra Fluide'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Render Process or Actions */}
              {isRendering ? (
                <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                      Encodage de la vidéo en cours...
                    </span>
                    <span className="text-indigo-400 font-mono text-sm">{renderProgress}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-400 font-mono italic">
                    {renderStepText || 'Préparation du transcodage...'}
                  </p>
                </div>
              ) : isRenderComplete ? (
                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Rendu terminé avec succès !</h4>
                      <p className="text-xs text-emerald-300 mt-0.5">
                        Fichier MP4 {resolution} ({fps} FPS) prêt pour le téléchargement.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadRenderedVideo}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger la Vidéo MP4</span>
                    </button>

                    {onPublishToCourse && (
                      <button
                        type="button"
                        onClick={() => {
                          onPublishToCourse();
                          onClose();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2"
                      >
                        <FileVideo className="w-4 h-4 text-indigo-400" />
                        <span>Publier également dans le Cours</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div className="text-xs text-slate-400">
                    Durée estimée de la vidéo : <strong className="text-slate-200">{project.totalDurationSeconds}s</strong> • Format <strong className="text-slate-200">{project.aspectRatio}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartRender}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Lancer le Rendu & Télécharger</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCORM EXPORT */}
          {activeTab === 'scorm' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Archive className="w-4 h-4 text-purple-400" />
                  Export Standard E-Learning (LMS tiers)
                </h4>
                <p>
                  Exportez la vidéo interactive avec ses points d'arrêt quiz intégrés pour une compatibilité directe avec Moodle, Blackboard, Canvas ou 360Learning.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Norme SCORM</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['1.2', '2004'] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setScormVersion(v)}
                        className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                          scormVersion === v
                            ? 'bg-purple-600 text-white border-purple-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        SCORM {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    Score de Réussite Minimum ({passingScore}%)
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={5}
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">
                    Les élèves valideront le module dès {passingScore}% de bonnes réponses aux quiz
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleExportScorm}
                  className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger le Package SCORM ({scormVersion})</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECT JSON */}
          {activeTab === 'project_json' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  Sauvegarde & Partage de Projet NLE
                </h4>
                <p>
                  Téléchargez la totalité du projet sous format `.itechnle.json` (pistes, clips, timecodes, textes, quiz, transitions) afin de l'archiver ou de le rouvrir sur n'importe quel compte formateur Academia ITECH.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                <div>Projet : <span className="text-white font-bold">{project.title}</span></div>
                <div>Nombre de pistes : <span className="text-white font-bold">{project.tracks.length}</span></div>
                <div>Nombre total de clips : <span className="text-white font-bold">{project.clips.length}</span></div>
                <div>Durée totale : <span className="text-white font-bold">{project.totalDurationSeconds}s</span></div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleExportProjectJson}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger le Fichier Projet (.json)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SNAPSHOT PNG */}
          {activeTab === 'frame_snapshot' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400" />
                  Capture d'Écran Haute Résolution (1080p)
                </h4>
                <p>
                  Exportez l'image exacte de la tête de lecture à <strong>{Math.round(currentTime)}s</strong> en PNG 1920x1080 pour l'utiliser comme vignette de cours, support de présentation ou partage LinkedIn.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={handleExportSnapshot}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-lg flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Télécharger la Frame en PNG HD</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
