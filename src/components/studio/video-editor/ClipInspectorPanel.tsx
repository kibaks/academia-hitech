import React from 'react';
import {
  Sliders,
  Clock,
  Type,
  User,
  Video,
  Music,
  HelpCircle,
  Code2,
  Trash2,
  Copy,
  Volume2,
  Sparkles,
  Move,
  Layers,
  Palette,
  Play,
  Square,
} from 'lucide-react';
import { CourseVideoProject, TimelineClip } from '../../../types';
import { ANIMAKER_CHARACTERS } from '../../../data/videoProjectsData';
import { playTutorSpeech } from '../../tutor/speechUtils';

interface ClipInspectorPanelProps {
  project: CourseVideoProject;
  selectedClip: TimelineClip | null;
  onUpdateClip: (clipId: string, patch: Partial<TimelineClip>) => void;
  onDeleteClip: (clipId: string) => void;
  onDuplicateClip: (clipId: string) => void;
  readOnly?: boolean;
}

export const ClipInspectorPanel: React.FC<ClipInspectorPanelProps> = ({
  project,
  selectedClip,
  onUpdateClip,
  onDeleteClip,
  onDuplicateClip,
  readOnly = false,
}) => {
  if (!selectedClip) {
    return (
      <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 p-4 text-slate-200 overflow-y-auto select-none">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Inspecteur de Projet</span>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h4 className="font-bold text-white text-sm truncate">{project.title}</h4>
            <p className="text-[11px] text-slate-400">{project.topic}</p>
            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span>Durée totale :</span>
              <span className="font-bold text-emerald-400">{Math.round(project.totalDurationSeconds)}s</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Configuration Export</span>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Résolution :</span>
              <span className="font-bold text-slate-200">{project.resolution} @ {project.fps}fps</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Format d'image :</span>
              <span className="font-bold text-purple-400">{project.aspectRatio}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Pistes actives :</span>
              <span className="font-bold text-sky-400">{project.tracks.length}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Total clips :</span>
              <span className="font-bold text-amber-400">{project.clips.length}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200">
            💡 <strong>Astuce de montage :</strong> Cliquez sur n'importe quel clip sur la timeline pour régler ses paramètres (timing, volume, texte, code, incrustation PiP et quiz).
          </div>
        </div>
      </div>
    );
  }

  const handleTestSpeech = () => {
    if (selectedClip.voiceoverData?.speechText) {
      playTutorSpeech({
        text: selectedClip.voiceoverData.speechText,
        gender: 'female',
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-200 overflow-hidden select-none">
      {/* Inspector Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: selectedClip.color || '#8b5cf6' }}
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{selectedClip.title}</h4>
            <span className="text-[10px] text-slate-400 font-mono uppercase">
              {selectedClip.type.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={readOnly}
            onClick={() => onDuplicateClip(selectedClip.id)}
            title="Dupliquer ce clip"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={readOnly}
            onClick={() => onDeleteClip(selectedClip.id)}
            title="Supprimer ce clip"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900 text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inspector Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Timing Controls (Start & Duration) */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Position & Durée (secondes)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Début (s)</label>
              <input
                type="number"
                disabled={readOnly}
                value={selectedClip.startSeconds}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    startSeconds: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Durée (s)</label>
              <input
                type="number"
                disabled={readOnly}
                value={selectedClip.durationSeconds}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    durationSeconds: Math.max(1, parseFloat(e.target.value) || 1),
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Clip Title Rename */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
            Libellé du Clip
          </label>
          <input
            type="text"
            disabled={readOnly}
            value={selectedClip.title}
            onChange={(e) => onUpdateClip(selectedClip.id, { title: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
          />
        </div>

        {/* SPECIFIC: AVATAR / PIP SETTINGS */}
        {selectedClip.type === 'avatar' && (
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-3">
            <span className="text-[10px] font-bold text-purple-300 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              Incrustation Formateur (PiP)
            </span>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Position dans l'écran</label>
              <select
                disabled={readOnly}
                value={selectedClip.transform?.pipPosition || 'bottom-right'}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    transform: {
                      ...selectedClip.transform,
                      scale: selectedClip.transform?.scale || 0.85,
                      opacity: selectedClip.transform?.opacity ?? 1,
                      x: e.target.value === 'bottom-left' ? -34 : 34,
                      y: 28,
                      pipPosition: e.target.value as any,
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
              >
                <option value="bottom-right">Coin Bas Droit</option>
                <option value="bottom-left">Coin Bas Gauche</option>
                <option value="top-right">Coin Haut Droit</option>
                <option value="top-left">Coin Haut Gauche</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Taille Incrustation : {Math.round((selectedClip.transform?.scale || 0.85) * 100)}%
              </label>
              <input
                type="range"
                min="0.4"
                max="1.5"
                step="0.05"
                disabled={readOnly}
                value={selectedClip.transform?.scale || 0.85}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    transform: {
                      ...selectedClip.transform,
                      x: selectedClip.transform?.x || 0,
                      y: selectedClip.transform?.y || 0,
                      opacity: selectedClip.transform?.opacity ?? 1,
                      scale: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Texte de parole / Discours</label>
              <textarea
                disabled={readOnly}
                rows={3}
                value={selectedClip.voiceoverData?.speechText || ''}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    voiceoverData: {
                      characterId: selectedClip.voiceoverData?.characterId || 'trainer',
                      characterName: selectedClip.voiceoverData?.characterName || 'Formateur',
                      characterAvatar: selectedClip.voiceoverData?.characterAvatar || '',
                      speechText: e.target.value,
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 resize-none"
              />
              <button
                type="button"
                onClick={handleTestSpeech}
                className="mt-1.5 w-full py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white text-[11px] font-bold flex items-center justify-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Tester la voix TTS</span>
              </button>
            </div>
          </div>
        )}

        {/* SPECIFIC: TEXT & TITLES */}
        {(selectedClip.type === 'title_text' || selectedClip.type === 'lower_third') && (
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
            <span className="text-[10px] font-bold text-amber-300 uppercase flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-amber-400" />
              Personnalisation Texte
            </span>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Titre principal</label>
              <input
                type="text"
                disabled={readOnly}
                value={selectedClip.textContent || ''}
                onChange={(e) => onUpdateClip(selectedClip.id, { textContent: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Sous-titre explicatif</label>
              <input
                type="text"
                disabled={readOnly}
                value={selectedClip.textSubtitle || ''}
                onChange={(e) => onUpdateClip(selectedClip.id, { textSubtitle: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Position à l'écran</label>
              <select
                disabled={readOnly}
                value={selectedClip.textStyle?.position || 'lower-third'}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    textStyle: {
                      ...selectedClip.textStyle,
                      position: e.target.value as any,
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
              >
                <option value="lower-third">Lower-Third (Bas)</option>
                <option value="center-title">Titre Centré (Milieu)</option>
                <option value="top-banner">Bandeau Supérieur (Haut)</option>
              </select>
            </div>
          </div>
        )}

        {/* SPECIFIC: CODE SNIPPET */}
        {selectedClip.type === 'code_snippet' && selectedClip.codeContent && (
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
            <span className="text-[10px] font-bold text-indigo-300 uppercase flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              Éditeur de Code Incrusté
            </span>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Langage de programmation</label>
              <select
                disabled={readOnly}
                value={selectedClip.codeContent.language}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    codeContent: {
                      ...selectedClip.codeContent!,
                      language: e.target.value,
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
              >
                <option value="python">Python</option>
                <option value="typescript">TypeScript / JavaScript</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash / Terminal</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Code source</label>
              <textarea
                disabled={readOnly}
                rows={6}
                value={selectedClip.codeContent.code}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    codeContent: {
                      ...selectedClip.codeContent!,
                      code: e.target.value,
                    },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-emerald-400 resize-none"
              />
            </div>
          </div>
        )}

        {/* SPECIFIC: AUDIO / VOICEOVER */}
        {(selectedClip.type === 'audio' || selectedClip.type === 'music' || selectedClip.type === 'voiceover') && (
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
            <span className="text-[10px] font-bold text-cyan-300 uppercase flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              Réglages Piste Audio
            </span>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Volume : {selectedClip.volume ?? 100}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                disabled={readOnly}
                value={selectedClip.volume ?? 100}
                onChange={(e) => onUpdateClip(selectedClip.id, { volume: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Fade In (s)</label>
                <input
                  type="number"
                  disabled={readOnly}
                  value={selectedClip.fadeIn || 0}
                  onChange={(e) => onUpdateClip(selectedClip.id, { fadeIn: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Fade Out (s)</label>
                <input
                  type="number"
                  disabled={readOnly}
                  value={selectedClip.fadeOut || 0}
                  onChange={(e) => onUpdateClip(selectedClip.id, { fadeOut: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs font-mono text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SPECIFIC: INTERACTIVE QUIZ */}
        {selectedClip.type === 'interactive_quiz' && selectedClip.quizData && (
          <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-500/30 space-y-3">
            <span className="text-[10px] font-bold text-pink-300 uppercase flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
              Éditeur de Quiz Interactif
            </span>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Question</label>
              <textarea
                disabled={readOnly}
                rows={2}
                value={selectedClip.quizData.question}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    quizData: { ...selectedClip.quizData!, question: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 block">Options & Bonne Réponse</label>
              {selectedClip.quizData.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct-option"
                    disabled={readOnly}
                    checked={selectedClip.quizData?.correctIndex === oIdx}
                    onChange={() =>
                      onUpdateClip(selectedClip.id, {
                        quizData: { ...selectedClip.quizData!, correctIndex: oIdx },
                      })
                    }
                    className="accent-pink-500"
                  />
                  <input
                    type="text"
                    disabled={readOnly}
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...selectedClip.quizData!.options];
                      newOpts[oIdx] = e.target.value;
                      onUpdateClip(selectedClip.id, {
                        quizData: { ...selectedClip.quizData!, options: newOpts },
                      });
                    }}
                    className="flex-1 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Explication</label>
              <textarea
                disabled={readOnly}
                rows={2}
                value={selectedClip.quizData.explanation}
                onChange={(e) =>
                  onUpdateClip(selectedClip.id, {
                    quizData: { ...selectedClip.quizData!, explanation: e.target.value },
                  })
                }
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
