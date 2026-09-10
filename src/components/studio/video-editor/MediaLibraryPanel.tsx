import React, { useState } from 'react';
import {
  Film,
  User,
  Type,
  Music,
  HelpCircle,
  Sparkles,
  Plus,
  Play,
  Code2,
  Layers,
  Wand2,
  Search,
  Check,
  ChevronRight,
  Shield,
  Clock,
  Mic,
} from 'lucide-react';
import {
  STOCK_B_ROLL_ITEMS,
  STOCK_MUSIC_ITEMS,
  STOCK_SFX_ITEMS,
  ANIMAKER_CHARACTERS,
} from '../../../data/videoProjectsData';
import { TimelineClip } from '../../../types';

interface MediaLibraryPanelProps {
  currentTime: number;
  onAddClipToTimeline: (newClip: TimelineClip) => void;
  onGenerateWithAI: (topic: string, characterId: string, durationMinutes: number) => void;
  isGeneratingAI: boolean;
  readOnly?: boolean;
}

export const MediaLibraryPanel: React.FC<MediaLibraryPanelProps> = ({
  currentTime,
  onAddClipToTimeline,
  onGenerateWithAI,
  isGeneratingAI,
  readOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState<'broll' | 'avatars' | 'titles' | 'audio' | 'quiz' | 'ai_gen'>('broll');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Generator Form State
  const [aiTopic, setAiTopic] = useState('Deep Learning : Mécanisme d’Attention & Transformers');
  const [aiCharacter, setAiCharacter] = useState('fatou-sow');
  const [aiDuration, setAiDuration] = useState(2); // 2 minutes

  // Insert B-Roll clip
  const handleInsertBRoll = (item: typeof STOCK_B_ROLL_ITEMS[0]) => {
    const newClip: TimelineClip = {
      id: `clip-v1-${Date.now()}`,
      trackId: 'track-video',
      title: item.name,
      type: 'b_roll',
      startSeconds: Math.round(currentTime),
      durationSeconds: item.durationSeconds || 15,
      sourceUrl: item.previewUrl,
      thumbnail: item.thumbnail,
      color: '#0284c7',
      transform: { x: 0, y: 0, scale: 1, opacity: 1 },
      transition: { type: 'crossfade', durationSeconds: 0.8 },
    };
    onAddClipToTimeline(newClip);
  };

  // Insert Avatar Clip
  const handleInsertAvatar = (char: typeof ANIMAKER_CHARACTERS[0]) => {
    const newClip: TimelineClip = {
      id: `clip-v2-${Date.now()}`,
      trackId: 'track-avatar',
      title: `${char.name} (PiP Formateur)`,
      type: 'avatar',
      startSeconds: Math.round(currentTime),
      durationSeconds: 15,
      sourceUrl: char.avatar,
      color: '#8b5cf6',
      transform: {
        x: 34,
        y: 28,
        scale: 0.85,
        opacity: 1,
        pipPosition: 'bottom-right',
        chromaKey: true,
      },
      voiceoverData: {
        characterId: char.id,
        characterName: char.name,
        characterAvatar: char.avatar,
        speechText: `Bonjour et bienvenue dans cette leçon. Aujourd'hui, nous allons approfondir les points essentiels.`,
      },
    };
    onAddClipToTimeline(newClip);
  };

  // Insert Title / Text Clip
  const handleInsertTitle = (style: 'title' | 'lower_third' | 'code') => {
    if (style === 'code') {
      const newClip: TimelineClip = {
        id: `clip-t1-${Date.now()}`,
        trackId: 'track-text',
        title: 'Snippet Code Python / PyTorch',
        type: 'code_snippet',
        startSeconds: Math.round(currentTime),
        durationSeconds: 20,
        color: '#f59e0b',
        codeContent: {
          language: 'python',
          code: `# Exemple d'implémentation\ndef forward(self, x):\n    scores = torch.matmul(x, self.weights)\n    return F.softmax(scores, dim=-1)`,
          highlightLines: [2, 3],
        },
      };
      onAddClipToTimeline(newClip);
    } else if (style === 'lower_third') {
      const newClip: TimelineClip = {
        id: `clip-t1-${Date.now()}`,
        trackId: 'track-text',
        title: 'Bandeau Lower-Third Formateur',
        type: 'lower_third',
        startSeconds: Math.round(currentTime),
        durationSeconds: 8,
        color: '#f59e0b',
        textContent: 'Nom du Formateur & Titre',
        textSubtitle: 'Expert Technique • Academia ITECH',
        textStyle: {
          fontSize: 'medium',
          textColor: '#ffffff',
          bgColor: 'rgba(79, 70, 229, 0.9)',
          position: 'lower-third',
          animation: 'fade',
        },
      };
      onAddClipToTimeline(newClip);
    } else {
      const newClip: TimelineClip = {
        id: `clip-t1-${Date.now()}`,
        trackId: 'track-text',
        title: 'Titre Principal Animé',
        type: 'title_text',
        startSeconds: Math.round(currentTime),
        durationSeconds: 8,
        color: '#f59e0b',
        textContent: 'TITRE DU CHAPITRE',
        textSubtitle: 'Sous-titre explicatif & concepts fondamentaux',
        textStyle: {
          fontSize: 'title',
          textColor: '#ffffff',
          bgColor: 'rgba(15, 23, 42, 0.9)',
          position: 'center-title',
          animation: 'slide-up',
        },
      };
      onAddClipToTimeline(newClip);
    }
  };

  // Insert Audio Clip
  const handleInsertAudio = (music: typeof STOCK_MUSIC_ITEMS[0]) => {
    const newClip: TimelineClip = {
      id: `clip-a2-${Date.now()}`,
      trackId: 'track-audio',
      title: music.name,
      type: 'music',
      startSeconds: Math.round(currentTime),
      durationSeconds: music.durationSeconds || 60,
      color: '#06b6d4',
      volume: music.volume || 30,
      fadeIn: 1.5,
      fadeOut: 2,
    };
    onAddClipToTimeline(newClip);
  };

  // Insert Interactive Quiz Clip
  const handleInsertQuiz = () => {
    const newClip: TimelineClip = {
      id: `clip-m1-${Date.now()}`,
      trackId: 'track-quiz',
      title: 'Arrêt Quiz Interactif',
      type: 'interactive_quiz',
      startSeconds: Math.round(currentTime),
      durationSeconds: 15,
      color: '#ec4899',
      quizData: {
        question: 'Quelle est la fonction principale du mécanisme d’attention ?',
        options: [
          'Compresser les images sans perte',
          'Pondérer dynamiquement l’importance de chaque élément par rapport aux autres',
          'Remplacer complètement la mémoire RAM',
          'Chiffrer les données sensibles',
        ],
        correctIndex: 1,
        explanation: 'Le mécanisme d’attention calcule des coefficients de corrélation pour pondérer les éléments clés.',
      },
    };
    onAddClipToTimeline(newClip);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-200 overflow-hidden select-none">
      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-6 border-b border-slate-800 bg-slate-950 p-1 gap-1 text-center">
        <button
          type="button"
          onClick={() => setActiveTab('broll')}
          className={`flex flex-col items-center py-2 px-1 rounded-lg text-[10px] font-bold transition-all ${
            activeTab === 'broll' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Vidéos & B-Roll"
        >
          <Film className="w-4 h-4 mb-1 text-sky-400" />
          <span>Vidéos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('avatars')}
          className={`flex flex-col items-center py-2 px-1 rounded-lg text-[10px] font-bold transition-all ${
            activeTab === 'avatars' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Avatars & Formateurs"
        >
          <User className="w-4 h-4 mb-1 text-purple-400" />
          <span>Avatars</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('titles')}
          className={`flex flex-col items-center py-2 px-1 rounded-lg text-[10px] font-bold transition-all ${
            activeTab === 'titles' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Titres & Code"
        >
          <Type className="w-4 h-4 mb-1 text-amber-400" />
          <span>Titres</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audio')}
          className={`flex flex-col items-center py-2 px-1 rounded-lg text-[10px] font-bold transition-all ${
            activeTab === 'audio' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Musique & Sons"
        >
          <Music className="w-4 h-4 mb-1 text-cyan-400" />
          <span>Audio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className={`flex flex-col items-center py-2 px-1 rounded-lg text-[10px] font-bold transition-all ${
            activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Quiz Interactifs"
        >
          <HelpCircle className="w-4 h-4 mb-1 text-pink-400" />
          <span>Quiz</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai_gen')}
          className={`flex flex-col items-center py-2 px-1 rounded-lg text-[10px] font-bold transition-all ${
            activeTab === 'ai_gen' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Générateur IA Gemini"
        >
          <Sparkles className="w-4 h-4 mb-1 text-amber-300 animate-pulse" />
          <span>IA Studio</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* TAB 1: B-ROLL & STOCK VIDEOS */}
        {activeTab === 'broll' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Bibliothèque B-Roll & Plans Vidéo
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                {STOCK_B_ROLL_ITEMS.length} disponibles
              </span>
            </div>

            <div className="space-y-2.5">
              {STOCK_B_ROLL_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="group p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-sky-500 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-16 h-11 rounded-lg object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                        <span className="px-1.5 py-0.2 rounded bg-slate-700 text-sky-300 font-semibold">
                          {item.badge}
                        </span>
                        <span>{item.durationSeconds}s</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleInsertBRoll(item)}
                    title="Insérer sur la piste V1 au timecode actuel"
                    className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Placer</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AVATARS & TRAINERS */}
        {activeTab === 'avatars' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Formateurs IA & Incrustation PiP
              </h4>
            </div>

            <div className="space-y-2.5">
              {ANIMAKER_CHARACTERS.map((char) => (
                <div
                  key={char.id}
                  className="group p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-purple-500 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-purple-500/50 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                        {char.name}
                      </p>
                      <p className="text-[10px] text-purple-400 truncate">{char.role}</p>
                      <p className="text-[9px] text-slate-400 truncate">{char.specialty}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleInsertAvatar(char)}
                    title="Incruster l'avatar sur la piste V2"
                    className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Incruster</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TITLES & TEXT OVERLAYS */}
        {activeTab === 'titles' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Titres, Lower-Thirds & Code
            </h4>

            <div className="space-y-2">
              <div
                onClick={() => handleInsertTitle('title')}
                className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-amber-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Type className="w-4 h-4" />
                    Titre Principal Animé
                  </span>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Gros titre centré avec animation d'entrée et sous-titre pour chapitres.
                </p>
              </div>

              <div
                onClick={() => handleInsertTitle('lower_third')}
                className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-amber-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" />
                    Bandeau Lower-Third
                  </span>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Bandeau d'identification en bas d'écran avec nom du formateur et titre.
                </p>
              </div>

              <div
                onClick={() => handleInsertTitle('code')}
                className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-indigo-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" />
                    Bloc de Code Interactif
                  </span>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Fenêtre de code syntax-highlighted (Python, TS, SQL) incrustée sur la vidéo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIO & BGM */}
        {activeTab === 'audio' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Musiques de Fond & Effets Sonores
            </h4>

            <div className="space-y-2">
              {STOCK_MUSIC_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-cyan-500 transition-all flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{item.name}</p>
                    <p className="text-[10px] text-cyan-400">{item.genre} • {item.durationSeconds}s</p>
                  </div>
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleInsertAudio(item)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INTERACTIVE QUIZ POP-UP */}
        {activeTab === 'quiz' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Points d'Arrêt & Quiz Interactifs
            </h4>

            <div className="p-4 rounded-xl bg-slate-800/90 border border-pink-500/40 space-y-3">
              <div className="flex items-center gap-2 text-pink-400">
                <HelpCircle className="w-5 h-5" />
                <span className="text-xs font-bold">Quiz au Timecode</span>
              </div>
              <p className="text-xs text-slate-300">
                Ajoute un point d'arrêt sur la vidéo au timecode {Math.round(currentTime)}s.
                La vidéo s'arrête automatiquement et demande à l'apprenant de valider la question avant de continuer.
              </p>
              <button
                type="button"
                disabled={readOnly}
                onClick={handleInsertQuiz}
                className="w-full py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Créer un Quiz Interactif</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: AI GEMINI TIMELINE GENERATOR */}
        {activeTab === 'ai_gen' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Assistant de Montage IA</h4>
                <p className="text-[10px] text-indigo-300">Génération automatique de timeline multi-piste</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                  Sujet du cours ou de la leçon vidéo
                </label>
                <textarea
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500 resize-none"
                  placeholder="Ex : Réseaux de neurones, consignation usine..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                  Formateur Principal
                </label>
                <select
                  value={aiCharacter}
                  onChange={(e) => setAiCharacter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="fatou-sow">Fatou Sow (Lead Data & IA)</option>
                  <option value="alex-chen">Alex Chen (Sécurité Usine & HSE)</option>
                  <option value="landry-bakweto">Dr. Landry Bakweto (Cloud & DevOps)</option>
                  <option value="amina-diallo">Amina Diallo (Fintech & Sécurité)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                  Durée estimée de la capsule vidéo
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setAiDuration(dur)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        aiDuration === dur
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {dur} min
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={isGeneratingAI || !aiTopic.trim()}
                onClick={() => onGenerateWithAI(aiTopic, aiCharacter, aiDuration)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Génération du montage en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Monter automatiquement la vidéo avec l'IA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
