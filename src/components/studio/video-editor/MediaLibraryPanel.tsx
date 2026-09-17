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
  Palette,
  Smile,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  UploadCloud,
  FolderOpen,
  Image as ImageIcon,
} from 'lucide-react';
import {
  STOCK_B_ROLL_ITEMS,
  STOCK_MUSIC_ITEMS,
  STOCK_SFX_ITEMS,
  ANIMAKER_CHARACTERS,
  CARTOON_ANIMAKER_CHARACTERS,
  CARTOON_ILLUSTRATED_SCENES,
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
  const [activeTab, setActiveTab] = useState<'cartoon' | 'broll' | 'avatars' | 'titles' | 'audio' | 'quiz' | 'ai_gen'>('cartoon');
  const [cartoonFilter, setCartoonFilter] = useState<'all' | 'characters' | 'scenes' | 'bubbles'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const customMediaInputRef = React.useRef<HTMLInputElement>(null);
  const [isDraggingMedia, setIsDraggingMedia] = useState(false);

  const handleProcessMediaFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const isVideo = file.type.startsWith('video/');
        const newClip: TimelineClip = {
          id: `clip-custom-${Date.now()}`,
          trackId: 'track-video',
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: 'b_roll',
          startSeconds: Math.round(currentTime),
          durationSeconds: isVideo ? 20 : 15,
          sourceUrl: dataUrl,
          thumbnail: dataUrl,
          color: '#0284c7',
          transform: { x: 0, y: 0, scale: 1, opacity: 1 },
          transition: { type: 'crossfade', durationSeconds: 0.6 },
        };
        onAddClipToTimeline(newClip);
      }
    };
    reader.readAsDataURL(file);
  };

  // AI Generator Form State
  const [aiTopic, setAiTopic] = useState('Deep Learning : Mécanisme d’Attention & Transformers');
  const [aiCharacter, setAiCharacter] = useState('prof-nia');
  const [aiDuration, setAiDuration] = useState(2); // 2 minutes

  // Insert Cartoon Illustrated Scene (V1)
  const handleInsertCartoonScene = (scene: typeof CARTOON_ILLUSTRATED_SCENES[0]) => {
    const newClip: TimelineClip = {
      id: `clip-scene-${Date.now()}`,
      trackId: 'track-video',
      title: scene.name,
      type: 'b_roll',
      startSeconds: Math.round(currentTime),
      durationSeconds: 20,
      sourceUrl: scene.previewUrl,
      thumbnail: scene.thumbnail,
      color: '#ec4899',
      transform: { x: 0, y: 0, scale: 1, opacity: 1 },
      transition: { type: 'crossfade', durationSeconds: 0.8 },
    };
    onAddClipToTimeline(newClip);
  };

  // Insert Cartoon Character (V2) with expressive greeting speech bubble
  const handleInsertCartoonCharacter = (char: typeof CARTOON_ANIMAKER_CHARACTERS[0]) => {
    const newClip: TimelineClip = {
      id: `clip-char-${Date.now()}`,
      trackId: 'track-avatar',
      title: `${char.name} (${char.badge})`,
      type: 'avatar',
      startSeconds: Math.round(currentTime),
      durationSeconds: 18,
      sourceUrl: char.avatar,
      color: char.color || '#ec4899',
      transform: {
        x: 34,
        y: 28,
        scale: 0.9,
        opacity: 1,
        pipPosition: 'bottom-right',
        chromaKey: true,
      },
      voiceoverData: {
        characterId: char.id,
        characterName: char.name,
        characterAvatar: char.avatar,
        speechText: `Bonjour ! Je suis ${char.name}. Explorons cette notion ensemble avec simplicité !`,
      },
    };
    onAddClipToTimeline(newClip);
  };

  // Insert Comic Bubble / Callout (V3)
  const handleInsertComicBubble = (badgeType: 'eureka' | 'warning' | 'tip' | 'speech') => {
    let title = 'Bulle BD Eurêka';
    let textContent = 'EURÊKA ! VOICI LA RÈGLE D\'OR';
    let textSubtitle = 'La clé fondamentale à mémoriser pour réussir l\'examen.';
    let bgColor = 'rgba(236, 72, 153, 0.92)';
    let comicBadge: 'eureka' | 'warning' | 'tip' = 'eureka';

    if (badgeType === 'warning') {
      title = 'Alerte BD Vigilance';
      textContent = 'ATTENTION : PIÈGE FRÉQUENT !';
      textSubtitle = 'Ne confondez jamais la latence réseau avec la bande passante.';
      bgColor = 'rgba(239, 68, 68, 0.95)';
      comicBadge = 'warning';
    } else if (badgeType === 'tip') {
      title = 'Bulle Astuce Magique';
      textContent = 'ASTUCE PRO DU PROFESSEUR';
      textSubtitle = 'Utilisez des noms de variables clairs et documentez vos points d\'accès.';
      bgColor = 'rgba(16, 185, 129, 0.92)';
      comicBadge = 'tip';
    } else if (badgeType === 'speech') {
      title = 'Bulle de Dialogue Cartoon';
      textContent = '« Observer d\'abord, expérimenter ensuite ! »';
      textSubtitle = 'Explication en direct de la mascotte pédagogique.';
      bgColor = 'rgba(99, 102, 241, 0.92)';
    }

    const newClip: TimelineClip = {
      id: `clip-bubble-${Date.now()}`,
      trackId: 'track-text',
      title,
      type: 'title_text',
      startSeconds: Math.round(currentTime),
      durationSeconds: 15,
      color: '#ec4899',
      textContent,
      textSubtitle,
      textStyle: {
        fontSize: 'title',
        textColor: '#ffffff',
        bgColor,
        position: 'center-title',
        bubbleStyle: badgeType === 'speech' ? 'speech' : 'comic_badge',
        comicBadge,
      },
    };
    onAddClipToTimeline(newClip);
  };

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
      <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950 p-1 gap-1 text-center">
        <button
          type="button"
          onClick={() => setActiveTab('cartoon')}
          className={`flex flex-col items-center py-2 px-1 rounded-lg text-[10px] font-bold transition-all relative ${
            activeTab === 'cartoon'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm ring-1 ring-pink-400/50'
              : 'text-pink-400/90 hover:text-pink-300 hover:bg-pink-950/30'
          }`}
          title="Modèles & Éléments Dessin Animé Illustratifs"
        >
          <Palette className="w-4 h-4 mb-1 text-pink-300" />
          <span>Dessin Animé</span>
          <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
        </button>

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
        {/* TAB 0: CARTOON ILLUSTRATIFS (DESSIN ANIMÉ, WHITEBOARD, BD) */}
        {activeTab === 'cartoon' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-500/30 text-xs">
              <div className="flex items-center gap-2 font-bold text-pink-300 mb-1">
                <Palette className="w-4 h-4 text-pink-400" />
                <span>Templates & Éléments Dessin Animé Illustratifs</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Insérez des mascottes 2D vectorielles, décors de dessins animés, tableaux blancs et bulles de bandes dessinées au timecode actuel (<span className="text-amber-300 font-mono font-bold">{Math.round(currentTime)}s</span>).
              </p>
            </div>

            {/* Cartoon Sub-Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <button
                type="button"
                onClick={() => setCartoonFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
                  cartoonFilter === 'all'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setCartoonFilter('characters')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
                  cartoonFilter === 'characters'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🎭 Mascottes ({CARTOON_ANIMAKER_CHARACTERS.length})
              </button>
              <button
                type="button"
                onClick={() => setCartoonFilter('scenes')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
                  cartoonFilter === 'scenes'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                🌄 Décors ({CARTOON_ILLUSTRATED_SCENES.length})
              </button>
              <button
                type="button"
                onClick={() => setCartoonFilter('bubbles')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-all ${
                  cartoonFilter === 'bubbles'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                💬 Bulles BD & Callouts
              </button>
            </div>

            {/* SECTION: BULLES BD & CALLOUTS (When 'all' or 'bubbles') */}
            {(cartoonFilter === 'all' || cartoonFilter === 'bubbles') && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                    <span>Bulles BD & Callouts Magiques</span>
                  </h5>
                  <span className="text-[10px] text-pink-400 font-bold">Piste Texte</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleInsertComicBubble('eureka')}
                    className="p-2.5 rounded-xl bg-pink-950/40 border border-pink-500/40 hover:border-pink-400 hover:bg-pink-900/40 transition-all text-left group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300 mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
                      <span>💡 Eurêka !</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">Idée clé & règle d'or</p>
                  </button>

                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleInsertComicBubble('warning')}
                    className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 hover:border-rose-400 hover:bg-rose-900/40 transition-all text-left group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                      <span>⚠️ Alerte Piège</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">Vigilance & sécurité</p>
                  </button>

                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleInsertComicBubble('tip')}
                    className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-900/40 transition-all text-left group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>🪄 Astuce Pro</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">Bonne pratique expert</p>
                  </button>

                  <button
                    type="button"
                    disabled={readOnly}
                    onClick={() => handleInsertComicBubble('speech')}
                    className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-900/40 transition-all text-left group"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 mb-1">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span>🗨️ Bulle Dialogue</span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">Citation de la mascotte</p>
                  </button>
                </div>
              </div>
            )}

            {/* SECTION: MASCOTTES & AVATARS CARTOON (When 'all' or 'characters') */}
            {(cartoonFilter === 'all' || cartoonFilter === 'characters') && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-pink-400" />
                    <span>Mascottes & Présentateurs 2D</span>
                  </h5>
                  <span className="text-[10px] text-pink-400 font-bold">Piste Avatar (PiP)</span>
                </div>

                <div className="space-y-2">
                  {CARTOON_ANIMAKER_CHARACTERS.map((char) => (
                    <div
                      key={char.id}
                      className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-pink-500 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={char.avatar}
                          alt={char.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-pink-500/40 bg-slate-900 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors truncate">
                              {char.name}
                            </p>
                            <span className="px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 text-[9px] font-bold border border-pink-500/30 whitespace-nowrap">
                              {char.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-pink-400 truncate">{char.role}</p>
                          <p className="text-[9px] text-slate-400 truncate">{char.specialty}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={readOnly}
                        onClick={() => handleInsertCartoonCharacter(char)}
                        title="Placer l'avatar cartoon sur la piste PiP"
                        className="px-2.5 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all flex items-center gap-1 shrink-0 shadow-xs hover:scale-105"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Incruster</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: DÉCORS & ARRIÈRE-PLANS ILLUSTRÉS (When 'all' or 'scenes') */}
            {(cartoonFilter === 'all' || cartoonFilter === 'scenes') && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-[11px] font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-sky-400" />
                    <span>Décors & Scènes de Dessin Animé</span>
                  </h5>
                  <span className="text-[10px] text-sky-400 font-bold">Piste Vidéo Fond</span>
                </div>

                <div className="space-y-2">
                  {CARTOON_ILLUSTRATED_SCENES.map((scene) => (
                    <div
                      key={scene.id}
                      className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-sky-500 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={scene.thumbnail}
                          alt={scene.name}
                          className="w-16 h-11 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                            {scene.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                            <span className="px-1.5 py-0.2 rounded bg-slate-700 text-sky-300 font-semibold">
                              {scene.tag}
                            </span>
                            <span>20s</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={readOnly}
                        onClick={() => handleInsertCartoonScene(scene)}
                        title="Placer cette scène de dessin animé sur la piste vidéo principale"
                        className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all flex items-center gap-1 shrink-0 hover:scale-105"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Placer</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: B-ROLL & STOCK VIDEOS */}
        {activeTab === 'broll' && (
          <div className="space-y-3">
            {/* Custom Media Upload Section */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingMedia(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDraggingMedia(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingMedia(false);
                if (e.dataTransfer.files?.[0]) {
                  handleProcessMediaFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => customMediaInputRef.current?.click()}
              className={`p-3.5 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                isDraggingMedia
                  ? 'border-sky-400 bg-sky-950/50 scale-[1.01]'
                  : 'border-slate-700 hover:border-sky-500/70 bg-slate-800/40 hover:bg-slate-800/80'
              }`}
            >
              <input
                ref={customMediaInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleProcessMediaFile(e.target.files[0]);
                  }
                }}
              />
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Téléverser une Image ou Vidéo Locale
                </p>
                <p className="text-[10px] text-slate-400">
                  Glissez-déposez ou <span className="text-sky-400 font-semibold underline">parcourez vos fichiers</span> (PNG, JPG, MP4)
                </p>
              </div>
              <button
                type="button"
                className="mt-1 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-sm"
              >
                <FolderOpen className="w-3 h-3" />
                <span>Sélectionner depuis mon appareil</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
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
                  <option value="itech-droid">Robot Android ITECH (Tuteur Officiel Voix & Lipsync)</option>
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
