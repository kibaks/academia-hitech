import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AnimakerLesson,
  AnimakerScene,
  AnimakerCharacterPose,
  AnimakerSceneBackground,
  AnimakerBoardContent,
} from '../../types';
import { TUTOR_PERSONAS } from '../tutor/personaData';
import { AndroidStyleCharacter } from '../tutor/AndroidStyleCharacter';
import { playTutorSpeech } from '../tutor/speechUtils';
import { ANIMAKER_MOTION_PRESETS } from '../../data/templatesData';
import { PowerPointMotionBoard, PowerPointSlideData } from '../tutor/PowerPointMotionBoard';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Wand2,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Layout,
  User,
  MessageSquare,
  Award,
  Layers,
  Save,
  Copy,
  Check,
  CheckCircle2,
  HelpCircle,
  Code2,
  Cpu,
  Shield,
  Zap,
  Globe,
  Sliders,
  Maximize2,
  Minimize2,
  Film,
  Download,
  ArrowLeft,
  AlertTriangle,
  AlertOctagon,
  CheckSquare,
  XCircle,
  ArrowRight,
  Eye,
  RefreshCw,
  Split,
  Music,
  Gauge,
  Clock,
  Settings2,
  FileText,
  Flame,
} from 'lucide-react';

export interface AnimakerLessonStudioProps {
  initialLesson?: AnimakerLesson;
  courseTitle?: string;
  chapterTitle?: string;
  onSaveLesson?: (lesson: AnimakerLesson) => void;
  onPublishToCourse?: (lesson: AnimakerLesson) => void;
  onClose?: () => void;
  readOnly?: boolean;
}

// Preset characters with specialized animations and avatars
export const ANIMAKER_CHARACTERS = [
  {
    id: 'itech-droid',
    name: 'Robot Android ITECH',
    role: 'Tuteur Robot Android & Motions PowerPoint',
    avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&auto=format&fit=crop&q=80',
    gender: 'female' as const,
    color: '#22c55e',
    specialty: 'Robot Pédagogique, Voix Synchrone & Diapositives PowerPoint Motion',
  },
  {
    id: 'alex-chen',
    name: 'Alex Chen',
    role: 'Expert HSE & Sécurité Usine',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    gender: 'male' as const,
    color: '#eab308',
    specialty: 'Prévention des Risques, EPI & LOTO',
  },
  {
    id: 'landry-bakweto',
    name: 'Dr. Landry Bakweto',
    role: 'Architecte Cloud & Systèmes Distribués',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    gender: 'male' as const,
    color: '#4f46e5',
    specialty: 'Microservices, Kubernetes & Haute Dispo',
  },
  {
    id: 'amina-diallo',
    name: 'Amina Diallo',
    role: 'Ingénieure Fintech & Sécurité Bancaire',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    gender: 'female' as const,
    color: '#059669',
    specialty: 'Mobile Money, ISO 20022 & Cryptographie',
  },
  {
    id: 'koffi-mensah',
    name: 'Koffi Mensah',
    role: 'Staff Engineer Fullstack & DevSecOps',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    gender: 'male' as const,
    color: '#d97706',
    specialty: 'React 19, TypeScript & Pentest',
  },
  {
    id: 'sarah-rostova',
    name: 'Dr. Sarah Rostova',
    role: 'Chercheuse & Spécialiste Deep Learning',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&auto=format&fit=crop&q=80',
    gender: 'female' as const,
    color: '#0d9488',
    specialty: 'Réseaux de Neurones & Vision par Ordinateur',
  },
];

// Background Themes Visual Styles
export const BACKGROUND_THEMES: {
  [key in AnimakerSceneBackground]: {
    name: string;
    bgClass: string;
    boardClass: string;
    decorIcon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  };
} = {
  factory_floor: {
    name: 'Atelier & Usine de Production',
    bgClass: 'bg-gradient-to-br from-slate-950 via-amber-950/70 to-slate-900 text-amber-50',
    boardClass: 'bg-slate-900/90 border-amber-500/40 text-amber-100 shadow-2xl backdrop-blur-md',
    decorIcon: AlertTriangle,
    accentColor: '#f59e0b',
  },
  tech_classroom: {
    name: 'Amphithéâtre Tech',
    bgClass: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white',
    boardClass: 'bg-slate-800/90 border-indigo-500/40 text-slate-100',
    decorIcon: Cpu,
    accentColor: '#6366f1',
  },
  ai_lab: {
    name: 'Laboratoire IA & Robotique',
    bgClass: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white',
    boardClass: 'bg-purple-900/60 border-purple-400/40 text-purple-100 backdrop-blur-md',
    decorIcon: Sparkles,
    accentColor: '#a855f7',
  },
  modern_office: {
    name: 'Silicon Savannah Hub',
    bgClass: 'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white',
    boardClass: 'bg-emerald-900/70 border-emerald-400/30 text-emerald-100',
    decorIcon: Globe,
    accentColor: '#10b981',
  },
  cloud_datacenter: {
    name: 'Datacenter & Cloud',
    bgClass: 'bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950 text-white',
    boardClass: 'bg-cyan-950/80 border-cyan-400/40 text-cyan-100',
    decorIcon: Layers,
    accentColor: '#06b6d4',
  },
  hacker_terminal: {
    name: 'Terminal Cybersécurité',
    bgClass: 'bg-gradient-to-br from-black via-slate-950 to-emerald-950 text-emerald-400 font-mono',
    boardClass: 'bg-black/90 border-emerald-500/60 text-emerald-300',
    decorIcon: Shield,
    accentColor: '#10b981',
  },
  startup_hub: {
    name: 'Startup Pitch Studio',
    bgClass: 'bg-gradient-to-br from-amber-950 via-slate-900 to-rose-950 text-white',
    boardClass: 'bg-amber-950/70 border-amber-400/30 text-amber-100',
    decorIcon: Zap,
    accentColor: '#f43f5e',
  },
  whiteboard_studio: {
    name: 'Tableau Blanc Épuré',
    bgClass: 'bg-gradient-to-br from-slate-100 via-white to-sky-50 text-slate-900',
    boardClass: 'bg-white border-slate-300 text-slate-800 shadow-xl',
    decorIcon: Layout,
    accentColor: '#0284c7',
  },
  industrial_lab: {
    name: 'Laboratoire Industriel & Métrologie',
    bgClass: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-slate-100',
    boardClass: 'bg-slate-900/90 border-blue-400/40 text-blue-100 shadow-xl',
    decorIcon: Cpu,
    accentColor: '#38bdf8',
  },
  warehouse: {
    name: 'Entrepôt & Logistique Sécurisée',
    bgClass: 'bg-gradient-to-br from-stone-900 via-amber-950/60 to-slate-900 text-amber-100',
    boardClass: 'bg-stone-900/90 border-amber-500/40 text-amber-100 shadow-xl',
    decorIcon: AlertTriangle,
    accentColor: '#f59e0b',
  },
  construction_site: {
    name: 'Chantier & Travaux Extérieurs',
    bgClass: 'bg-gradient-to-br from-zinc-900 via-orange-950 to-slate-950 text-orange-100',
    boardClass: 'bg-zinc-900/90 border-orange-500/40 text-orange-100 shadow-xl',
    decorIcon: AlertTriangle,
    accentColor: '#f97316',
  },
};

export const INITIAL_ANIMAKER_LESSON: AnimakerLesson =
  ANIMAKER_MOTION_PRESETS[0] || {
    id: 'lesson-animaker-default',
    title: 'Formation Sécurité Usine & Procédures Vitales',
    topic: 'Sécurité Industrielle, Port des EPI & Consignation LOTO',
    targetAudience: 'Opérateurs, Techniciens & Ingénieurs HSE',
    leadCharacterName: 'Alex Chen',
    leadCharacterAvatar: ANIMAKER_CHARACTERS[0].avatar,
    totalDurationSeconds: 180,
    scenes: [],
  };

export const AnimakerLessonStudio: React.FC<AnimakerLessonStudioProps> = ({
  initialLesson = INITIAL_ANIMAKER_LESSON,
  courseTitle,
  chapterTitle,
  onSaveLesson,
  onPublishToCourse,
  onClose,
  readOnly = false,
}) => {
  const [lesson, setLesson] = useState<AnimakerLesson>(initialLesson);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoVoice, setAutoVoice] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>(readOnly ? 'preview' : 'editor');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'montage' | 'dialogue' | 'character' | 'board' | 'quiz'>('montage');
  const [showCaptions, setShowCaptions] = useState(true);
  const [usePowerPointBoard, setUsePowerPointBoard] = useState(true);

  // AI Prompt State
  const [aiTopicPrompt, setAiTopicPrompt] = useState('Formation Sécurité Usine : Règles EPI, Protecteurs Machine & Déversements');
  const [aiScenesCount, setAiScenesCount] = useState(4);
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState(false);
  const [aiGenStatusText, setAiGenStatusText] = useState('');

  // Quiz state in player
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Timeline & Playhead simulation
  const [sceneProgress, setSceneProgress] = useState(0);
  const progressTimerRef = useRef<any>(null);

  const activeScene: AnimakerScene =
    lesson.scenes[currentSceneIdx] ||
    lesson.scenes[0] || {
      id: 'sc-default',
      title: 'Scène 1',
      characterId: ANIMAKER_CHARACTERS[0].id,
      characterName: ANIMAKER_CHARACTERS[0].name,
      characterAvatar: ANIMAKER_CHARACTERS[0].avatar,
      pose: 'explaining',
      dialogueText: 'Bienvenue dans cette leçon animée motion.',
      background: 'factory_floor',
      boardContent: {
        type: 'three_cards',
        title: 'Points Clés :',
        cards: [],
      },
      durationSeconds: 30,
    };

  const activeBg = BACKGROUND_THEMES[activeScene.background] || BACKGROUND_THEMES.factory_floor;
  const DecorIcon = activeBg.decorIcon;

  // Speak when switching scene if voice is enabled
  useEffect(() => {
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
    setSceneProgress(0);

    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    if (autoVoice && activeScene?.dialogueText) {
      speakSceneDialogue();
    }
  }, [currentSceneIdx]);

  // Voice speech synthesis with French natural voices
  const speakSceneDialogue = () => {
    if (!activeScene?.dialogueText) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(true);
    setSceneProgress(0);

    const character =
      ANIMAKER_CHARACTERS.find((c) => c.id === activeScene.characterId) || ANIMAKER_CHARACTERS[0];

    // Progress simulation
    const estimatedDurationMs = Math.max(3000, (activeScene.dialogueText.length / 15) * 1000 / playbackSpeed);
    const startTimestamp = Date.now();

    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimestamp;
      const pct = Math.min(100, (elapsed / estimatedDurationMs) * 100);
      setSceneProgress(pct);
      if (pct >= 100) clearInterval(progressTimerRef.current);
    }, 100);

    playTutorSpeech({
      text: activeScene.dialogueText,
      langCode: 'fr-FR',
      gender: character.gender,
      pitch: character.gender === 'female' ? 1.08 : 0.96,
      rate: playbackSpeed,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setSceneProgress(100);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);

        if (isPlaying && currentSceneIdx < lesson.scenes.length - 1) {
          setTimeout(() => {
            setCurrentSceneIdx((prev) => prev + 1);
          }, 1000);
        } else if (isPlaying && currentSceneIdx === lesson.scenes.length - 1) {
          setIsPlaying(false);
        }
      },
      onError: () => {
        setIsSpeaking(false);
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      },
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    } else {
      setIsPlaying(true);
      speakSceneDialogue();
    }
  };

  const handleNextScene = () => {
    if (currentSceneIdx < lesson.scenes.length - 1) {
      setCurrentSceneIdx(currentSceneIdx + 1);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx(currentSceneIdx - 1);
    }
  };

  // Add new scene
  const handleAddScene = () => {
    const newSceneId = `sc-${Date.now()}`;
    const newScene: AnimakerScene = {
      id: newSceneId,
      title: `${lesson.scenes.length + 1}. Nouvelle Scène Animée`,
      characterId: activeScene.characterId || ANIMAKER_CHARACTERS[0].id,
      characterName: activeScene.characterName || ANIMAKER_CHARACTERS[0].name,
      characterAvatar: activeScene.characterAvatar || ANIMAKER_CHARACTERS[0].avatar,
      characterLayout: 'left',
      cameraShot: 'medium',
      pose: 'explaining',
      dialogueText:
        'Dans cette nouvelle scène, nous analysons une règle fondamentale et sa démonstration visuelle.',
      background: activeScene.background || 'factory_floor',
      boardContent: {
        type: 'three_cards',
        title: 'Points Clés de la Démonstration :',
        highlightText: 'Norme et sécurité validée en atelier',
        cards: [
          { title: 'Élément Clé 1', subtitle: 'Principe fondamental et contrôle initial', category: 'Norme' },
          { title: 'Démonstration 2', subtitle: 'Application concrète sur machine', category: 'Pratique' },
          { title: 'Bonne Pratique 3', subtitle: 'Règle vitale à appliquer systématiquement', category: 'Sécurité' },
        ],
      },
      keyTakeaway: 'Appliquez systématiquement cette règle lors de chaque opération.',
      durationSeconds: 40,
    };

    setLesson({
      ...lesson,
      scenes: [...lesson.scenes, newScene],
    });
    setCurrentSceneIdx(lesson.scenes.length);
  };

  // Duplicate scene
  const handleDuplicateScene = (idx: number) => {
    const target = lesson.scenes[idx];
    if (!target) return;
    const duplicated: AnimakerScene = {
      ...JSON.parse(JSON.stringify(target)),
      id: `sc-dup-${Date.now()}`,
      title: `${target.title} (Copie)`,
    };
    const updated = [...lesson.scenes];
    updated.splice(idx + 1, 0, duplicated);
    setLesson({ ...lesson, scenes: updated });
    setCurrentSceneIdx(idx + 1);
  };

  // Delete scene
  const handleDeleteScene = (idxToDelete: number) => {
    if (lesson.scenes.length <= 1) {
      alert('Une vidéo animée doit comporter au moins 1 scène.');
      return;
    }
    const updated = lesson.scenes.filter((_, i) => i !== idxToDelete);
    setLesson({ ...lesson, scenes: updated });
    setCurrentSceneIdx(Math.max(0, currentSceneIdx - 1));
  };

  // Update scene property
  const updateActiveScene = (patch: Partial<AnimakerScene>) => {
    const updatedScenes = [...lesson.scenes];
    updatedScenes[currentSceneIdx] = {
      ...updatedScenes[currentSceneIdx],
      ...patch,
    };
    setLesson({
      ...lesson,
      scenes: updatedScenes,
    });
  };

  // AI Prompt to Video Generator using /api/gemini/generate-animaker-video
  const handleGenerateAnimakerVideoWithAI = async () => {
    if (!aiTopicPrompt.trim()) return;
    setIsGeneratingWithAi(true);
    setAiGenStatusText('🧠 Analyse du prompt & structuration des scènes motion...');

    try {
      setTimeout(() => setAiGenStatusText('🎭 Sélection des avatars & attribution des postures de dialogue...'), 1200);
      setTimeout(() => setAiGenStatusText('🎨 Conception des infographies, tableaux & codes couleurs...'), 2400);
      setTimeout(() => setAiGenStatusText('🎬 Assemblage du montage Animaker & synchronisation vocale...'), 3600);

      const response = await fetch('/api/gemini/generate-animaker-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopicPrompt,
          scenesCount: aiScenesCount,
          targetAudience: 'Opérateurs, Techniciens & Formateurs',
        }),
      });

      const data = await response.json();
      if (data.lesson && data.lesson.scenes && data.lesson.scenes.length > 0) {
        setLesson(data.lesson);
        setCurrentSceneIdx(0);
      }
    } catch (err) {
      console.warn('Fallback generation Animaker:', err);
    } finally {
      setIsGeneratingWithAi(false);
      setAiGenStatusText('');
    }
  };

  // Preset quick prompt selector
  const PRESET_PROMPTS = [
    {
      title: '🏭 Sécurité Usine (EPI, Protecteurs & LOTO)',
      prompt: 'Formation Sécurité Usine : Règles EPI, Protecteurs Machine & Déversements',
      presetId: 'animaker-factory-hse-motion',
    },
    {
      title: '🤖 IA & Transformers (Embeddings & Attention)',
      prompt: 'Comprendre l’Architecture des Transformers & l’Auto-Attention en IA',
      presetId: 'animaker-transformers-motion',
    },
    {
      title: '🛡️ Cybersécurité & Architecture Zero-Trust',
      prompt: 'Principes de la Cybersécurité Zero Trust, MFA et Micro-segmentation',
      presetId: undefined,
    },
    {
      title: '⚡ Consignation Électrique & Procédure LOTO',
      prompt: 'Procédure complète de Consignation Électrique LOTO en 4 étapes',
      presetId: undefined,
    },
    {
      title: '☁️ Cloud & Microservices Résilients',
      prompt: 'Architecture Cloud Microservices, API Gateway et Message Brokers',
      presetId: 'animaker-cloud-arch-motion',
    },
  ];

  // Match avatar persona for AndroidStyleCharacter
  const matchedPersona =
    TUTOR_PERSONAS.find(
      (p) =>
        p.name.toLowerCase().includes(activeScene.characterName.toLowerCase().split(' ')[0]) ||
        activeScene.characterId.toLowerCase().includes(p.id.toLowerCase().split('-')[0]) ||
        activeScene.characterName.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
    ) || TUTOR_PERSONAS[0];

  return (
    <div id="animaker-lesson-studio" className="space-y-6 pb-12">
      {/* 1. TOP HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-950 text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-amber-500/30">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Studio Animaker 2D & Montage Vidéo IA
            </span>
            {courseTitle && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/40">
                Formation : {courseTitle}
              </span>
            )}
            {chapterTitle && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-slate-300">
                {chapterTitle}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">{lesson.title}</h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Concevez des vidéos motion pédagogiques avec avatar animé virtuel parlant, synthèse vocale
            labiale, tableaux infographiques et timeline de montage.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-600 transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
          )}

          {!readOnly && (
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'editor' ? 'preview' : 'editor')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                viewMode === 'preview'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              {viewMode === 'preview' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span>{viewMode === 'preview' ? 'Mode Montage' : 'Plein Écran'}</span>
            </button>
          )}

          {!readOnly && onSaveLesson && (
            <button
              type="button"
              onClick={() => onSaveLesson(lesson)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder</span>
            </button>
          )}

          {!readOnly && onPublishToCourse && (
            <button
              type="button"
              onClick={() => onPublishToCourse(lesson)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publier au Cours</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. AI VIDEO GENERATOR VIA PROMPTS (Only in Authoring / Trainer Mode) */}
      {!readOnly && (
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">
                Générer une Vidéo Motion Complète par Prompt IA (Gemini 2.5)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Création Instantanée de Scènes, Avatars & Tableaux
            </span>
          </div>

          {/* Preset Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 text-[11px] font-bold shrink-0">Suggestions :</span>
            {PRESET_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAiTopicPrompt(p.prompt);
                  if (p.presetId) {
                    const preset = ANIMAKER_MOTION_PRESETS.find((m) => m.id === p.presetId);
                    if (preset) {
                      setLesson(preset);
                      setCurrentSceneIdx(0);
                    }
                  }
                }}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200 text-slate-700 font-medium whitespace-nowrap transition-colors"
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <input
                type="text"
                value={aiTopicPrompt}
                onChange={(e) => setAiTopicPrompt(e.target.value)}
                placeholder="Ex: Sécurité Usine : Règles EPI, Protecteurs Machine, Consignation LOTO..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <select
                value={aiScenesCount}
                onChange={(e) => setAiScenesCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white font-medium"
              >
                <option value={3}>3 Scènes (Court)</option>
                <option value={4}>4 Scènes (Complet)</option>
                <option value={5}>5 Scènes (Master)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={handleGenerateAnimakerVideoWithAI}
                disabled={isGeneratingWithAi || !aiTopicPrompt.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black disabled:opacity-50 flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                {isGeneratingWithAi ? (
                  <>
                    <Wand2 className="w-4 h-4 animate-spin" />
                    <span>Génération du Montage...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Générer la Vidéo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {isGeneratingWithAi && aiGenStatusText && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
              <span className="font-semibold">{aiGenStatusText}</span>
            </div>
          )}
        </div>
      )}

      {/* 3. MAIN ANIMAKER VIDEO STAGE & CANVAS */}
      <div className="rounded-3xl border-2 border-slate-800 shadow-2xl overflow-hidden bg-slate-950 relative">
        {/* Top Video Status & Controls Bar */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-black text-[10px] border border-amber-500/40">
              Scène {currentSceneIdx + 1} / {lesson.scenes.length}
            </span>
            <span className="font-bold truncate max-w-xs sm:max-w-md">{activeScene.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] hidden sm:flex">
              <DecorIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeBg.name}</span>
            </div>

            {/* Captions toggle */}
            <button
              type="button"
              onClick={() => setShowCaptions(!showCaptions)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                showCaptions ? 'bg-white/20 text-white border-white/30' : 'bg-transparent text-slate-500 border-slate-700'
              }`}
              title="Sous-titres vidéo"
            >
              CC
            </button>

            {/* Speed Control */}
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-slate-800 text-slate-200 text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-700 focus:outline-none"
            >
              <option value={0.85}>0.85x</option>
              <option value={1.0}>1.0x</option>
              <option value={1.2}>1.2x</option>
              <option value={1.35}>1.35x</option>
            </select>

            {/* Audio Voice Toggle */}
            <button
              type="button"
              onClick={() => setAutoVoice(!autoVoice)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                autoVoice ? 'text-amber-400 bg-amber-950/60' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={autoVoice ? 'Synthèse vocale active' : 'Voix coupée'}
            >
              {autoVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ANIMAKER STAGE CANVAS */}
        <div
          className={`min-h-[480px] sm:min-h-[540px] p-6 sm:p-8 flex flex-col justify-between transition-colors duration-500 relative ${activeBg.bgClass}`}
        >
          {/* Ambient Background Watermark Icon */}
          <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
            <DecorIcon className="w-64 h-64 text-white" />
          </div>

          {/* MAIN GRAPHICS BOARD AREA */}
          <div className="relative z-10 w-full mb-6">
            {/* Display Mode Switcher: PowerPoint Motion vs Standard */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                <button
                  type="button"
                  onClick={() => setUsePowerPointBoard(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    usePowerPointBoard
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Diaporama PowerPoint Motion</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUsePowerPointBoard(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    !usePowerPointBoard
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Vue Tableau Simple</span>
                </button>
              </div>

              {activeScene.pose === 'pointing' && (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-[11px] font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>Laser Pointeur Robot Actif</span>
                </div>
              )}
            </div>

            {usePowerPointBoard ? (
              <PowerPointMotionBoard
                activeSlideData={{
                  id: `pp-slide-${activeScene.id}`,
                  title: activeScene.boardContent?.title || activeScene.title,
                  subtitle: activeScene.boardContent?.type
                    ? `Animation Motion Diapositive • ${activeScene.boardContent.type.replace('_', ' ')}`
                    : 'Animation Motion PowerPoint Synchronisée',
                  type:
                    activeScene.boardContent?.type === 'correct_incorrect'
                      ? 'correct_incorrect'
                      : activeScene.boardContent?.type === 'numbered_steps'
                      ? 'numbered_steps'
                      : activeScene.boardContent?.type === 'four_grid'
                      ? 'four_grid'
                      : 'three_cards',
                  cards:
                    activeScene.boardContent?.cards && activeScene.boardContent.cards.length > 0
                      ? activeScene.boardContent.cards.map((c) => ({
                          title: c.title,
                          desc: c.subtitle || c.category || 'Point clé',
                          badge: c.category,
                        }))
                      : [
                          { title: 'Étape 1 : Diagnostic', desc: 'Vérification préalable du poste de travail et des flux', badge: 'Init' },
                          { title: 'Étape 2 : Sécurité', desc: 'Application stricte des protocoles et normes', badge: 'Action' },
                          { title: 'Étape 3 : Validation', desc: 'Clôture et enregistrement de conformité', badge: 'Succès' },
                        ],
                  gridItems:
                    activeScene.boardContent?.gridItems && activeScene.boardContent.gridItems.length > 0
                      ? activeScene.boardContent.gridItems.map((item) => ({
                          title: item.title,
                          desc: item.desc,
                          badge: item.badge,
                        }))
                      : undefined,
                  correctPoints: activeScene.boardContent?.correctPoints || [
                    'Port complet des EPI obligatoires',
                    'Vérification visuelle des dispositifs de coupure',
                    'Consignation physique avec cadenas personnel',
                  ],
                  incorrectPoints: activeScene.boardContent?.incorrectPoints || [
                    'Intervention sans coupure d’énergie préalable',
                    'Désactivation manuelle des protecteurs de machines',
                    'Non-signalisation de la zone de maintenance',
                  ],
                  steps:
                    activeScene.boardContent?.type === 'numbered_steps' && activeScene.boardContent.steps
                      ? activeScene.boardContent.steps.map((st) => ({
                          title: st.title,
                          desc: st.desc,
                        }))
                      : undefined,
                  speakerNotes: activeScene.dialogueText,
                  highlightText: activeScene.boardContent?.highlightText,
                }}
              />
            ) : (
              activeScene.boardContent && (
              <div
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${activeBg.boardClass}`}
              >
                {/* Board Header Title */}
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2.5">
                  <h4 className="text-sm sm:text-base font-black flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{activeScene.boardContent.title}</span>
                  </h4>
                  {activeScene.boardContent.type && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/40 text-amber-300 border border-amber-400/30">
                      {activeScene.boardContent.type.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {/* 1. FOUR GRID LAYOUT (Ideal for EPI & Multi-Items) */}
                {activeScene.boardContent.type === 'four_grid' &&
                  activeScene.boardContent.gridItems && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {activeScene.boardContent.gridItems.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.12 }}
                          className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400/50 flex flex-col justify-between transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-black text-xs text-white">{item.title}</span>
                              {item.badge && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                {/* 2. CORRECT / INCORRECT SPLIT SCREEN (Ideal for Safety rules) */}
                {activeScene.boardContent.type === 'correct_incorrect' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Correct Side */}
                    <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-100 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wide">
                        <CheckSquare className="w-4 h-4" />
                        <span>{activeScene.boardContent.correctTitle || 'Pratiques Conformes (Sécurisé)'}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs">
                        {activeScene.boardContent.correctPoints?.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span className="leading-snug">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Incorrect Side */}
                    <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-100 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black text-rose-400 uppercase tracking-wide">
                        <AlertOctagon className="w-4 h-4" />
                        <span>{activeScene.boardContent.incorrectTitle || 'Comportements Interdits (Danger)'}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs">
                        {activeScene.boardContent.incorrectPoints?.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-400 font-bold">✗</span>
                            <span className="leading-snug">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 3. NUMBERED STEPS FLOW (Ideal for LOTO procedures) */}
                {activeScene.boardContent.type === 'numbered_steps' &&
                  activeScene.boardContent.steps && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {activeScene.boardContent.steps.map((st, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.12 }}
                          className="p-3.5 rounded-xl bg-black/40 border border-white/10 relative flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center mb-2 shadow-md">
                              {st.stepNumber || idx + 1}
                            </div>
                            <h5 className="font-bold text-xs text-white mb-1">{st.title}</h5>
                            <p className="text-[11px] text-slate-300 leading-relaxed">{st.desc}</p>
                          </div>
                          {idx < (activeScene.boardContent.steps?.length || 0) - 1 && (
                            <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-amber-400 font-bold z-20">
                              →
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}

                {/* 4. DANGER ALERT BANNER (Spill & Chemical Risk) */}
                {activeScene.boardContent.type === 'danger_alert' && (
                  <div className="space-y-3.5">
                    {activeScene.boardContent.dangerBannerText && (
                      <div className="p-3 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-black text-xs flex items-center gap-2 tracking-wide uppercase">
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
                        <span>{activeScene.boardContent.dangerBannerText}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {activeScene.boardContent.requiredActions && (
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                          <span className="font-bold text-emerald-400 block mb-1">Actions Réflexes Obligatoires :</span>
                          {activeScene.boardContent.requiredActions.map((act, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-slate-200">
                              <span className="text-emerald-400 font-bold">▶</span>
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {activeScene.boardContent.prohibitedActions && (
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                          <span className="font-bold text-rose-400 block mb-1">Interdictions Formelles :</span>
                          {activeScene.boardContent.prohibitedActions.map((act, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-slate-200">
                              <span className="text-rose-400 font-bold">⛔</span>
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. THREE CARDS FORMAT */}
                {activeScene.boardContent.type === 'three_cards' &&
                  activeScene.boardContent.cards && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {activeScene.boardContent.cards.map((c, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5"
                        >
                          {c.category && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                              {c.category}
                            </span>
                          )}
                          <h5 className="font-bold text-xs text-white">{c.title}</h5>
                          <p className="text-[11px] text-slate-300">{c.subtitle}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                {/* 6. BULLET POINTS FORMAT */}
                {activeScene.boardContent.type === 'bullet_points' &&
                  activeScene.boardContent.items && (
                    <ul className="space-y-2 text-xs sm:text-sm">
                      {activeScene.boardContent.items.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.12 }}
                          className="flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed text-slate-200">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}

                {/* 7. CODE SNIPPET FORMAT */}
                {activeScene.boardContent.type === 'code' &&
                  activeScene.boardContent.codeSnippet && (
                    <pre className="p-3.5 rounded-xl bg-black/70 border border-white/10 text-[11px] sm:text-xs font-mono overflow-x-auto text-cyan-200 leading-relaxed shadow-inner">
                      <code>{activeScene.boardContent.codeSnippet}</code>
                    </pre>
                  )}

                {/* Highlight Footer */}
                {activeScene.boardContent.highlightText && (
                  <div className="mt-3.5 pt-2.5 border-t border-white/10 text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeScene.boardContent.highlightText}</span>
                  </div>
                )}
              </div>
            )
            )}

            {/* MINI QUIZ CARD (IF PRESENT) */}
            {activeScene.miniQuiz && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-900/95 border border-amber-500/50 text-white shadow-2xl backdrop-blur-md space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <HelpCircle className="w-4 h-4" />
                  <span>Question d’Évaluation en Direct :</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-100">{activeScene.miniQuiz.question}</p>

                <div className="space-y-2 pt-1">
                  {activeScene.miniQuiz.options.map((option, idx) => {
                    const isSelected = selectedQuizAnswer === idx;
                    const isCorrect = idx === activeScene.miniQuiz?.correctIndex;
                    let btnStyle = 'bg-white/5 hover:bg-white/15 text-slate-200 border-white/10';

                    if (quizSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-900/80 border-emerald-400 text-emerald-100 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-900/80 border-rose-400 text-rose-100';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-amber-500 text-slate-950 border-amber-300 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!quizSubmitted) setSelectedQuizAnswer(idx);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {quizSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    type="button"
                    disabled={selectedQuizAnswer === null}
                    onClick={() => setQuizSubmitted(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-black transition-all"
                  >
                    Valider ma réponse
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-400/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
                    <span>💡 {activeScene.miniQuiz.explanation}</span>
                    <span className="font-bold text-amber-300 shrink-0">+50 XP</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BOTTOM ROW: ANIMATED TUTOR AVATAR & SPEECH CAPTIONS */}
          <div className="mt-4 flex flex-col sm:flex-row items-end sm:items-center gap-4 relative z-10">
            {/* 2D Animated Tutor Puppet with Live Visemes & Blinking */}
            <div className="relative shrink-0 flex flex-col items-center">
              <div className="relative">
                <AndroidStyleCharacter
                  persona={matchedPersona}
                  state={isSpeaking ? 'speaking' : 'idle'}
                  size="md"
                  characterModel="android_robot"
                  currentPose={
                    activeScene.pose === 'waving'
                      ? 'waving'
                      : activeScene.pose === 'pointing'
                      ? 'pointing'
                      : activeScene.pose === 'celebrating'
                      ? 'celebrating'
                      : activeScene.pose === 'warning' || activeScene.pose === 'alert_danger'
                      ? 'thinking'
                      : isSpeaking
                      ? 'explaining'
                      : 'neutral'
                  }
                  interactiveMood={
                    activeScene.pose === 'celebrating' || activeScene.pose === 'thumbs_up'
                      ? 'celebrating'
                      : activeScene.pose === 'alert_danger' || activeScene.pose === 'warning'
                      ? 'focused'
                      : activeScene.pose === 'waving'
                      ? 'waving'
                      : activeScene.pose === 'pointing'
                      ? 'pointing'
                      : 'explaining'
                  }
                />

                {/* Animated Character Pose Badge */}
                <div className="absolute bottom-0 -left-2 px-2.5 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md text-slate-950 text-[9px] font-black tracking-wider uppercase border border-amber-400 shadow-lg z-20">
                  {activeScene.pose === 'alert_danger'
                    ? '⚠️ Alerte Vitale'
                    : activeScene.pose === 'warning'
                    ? '🛑 Prévention'
                    : activeScene.pose === 'pointing'
                    ? '👉 Démonstration'
                    : activeScene.pose === 'celebrating'
                    ? '🎉 Bravo'
                    : activeScene.pose === 'waving'
                    ? '👋 Accueil'
                    : '🎓 Pédagogie'}
                </div>
              </div>

              <span className="mt-1 text-xs font-bold text-white drop-shadow-md bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                {activeScene.characterName}
              </span>
            </div>

            {/* Live Captions & Dialogue Speech Bubble */}
            {showCaptions && (
              <div className="flex-1 w-full">
                <div className="p-4 sm:p-5 rounded-3xl bg-white/95 text-slate-900 shadow-2xl border-2 border-white relative before:content-[''] before:absolute before:-left-3 before:bottom-6 before:border-y-8 before:border-y-transparent before:border-r-12 before:border-r-white/95">
                  <div className="text-xs sm:text-sm font-semibold leading-relaxed">
                    {activeScene.dialogueText}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="italic">
                      {isSpeaking ? '🗣️ Le tuteur virtuel est en train de parler...' : 'Cliquez sur Play pour écouter'}
                    </span>
                    <button
                      type="button"
                      onClick={speakSceneDialogue}
                      className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Réécouter</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. MONTAGE TIMELINE CONTROLS & TRACKS (Animaker Style) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3 text-white">
          {/* Main Playback Buttons & Live Progress Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className={`p-2.5 rounded-xl font-black flex items-center gap-1.5 text-xs transition-all active:scale-95 ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/30'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Pause' : 'Lire la vidéo'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.speechSynthesis?.cancel();
                  setIsPlaying(false);
                  setIsSpeaking(false);
                  setCurrentSceneIdx(0);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Recommencer depuis la première scène"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Time progress indicators */}
            <div className="flex-1 max-w-xs sm:max-w-md mx-2 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>00:{Math.floor((sceneProgress / 100) * (activeScene.durationSeconds || 30)).toString().padStart(2, '0')}</span>
                <span>00:{(activeScene.durationSeconds || 30).toString().padStart(2, '0')}</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-100 rounded-full"
                  style={{ width: `${sceneProgress}%` }}
                />
              </div>
            </div>

            {/* Next / Prev Scene buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentSceneIdx === 0}
                onClick={handlePrevScene}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                title="Scène précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentSceneIdx === lesson.scenes.length - 1}
                onClick={handleNextScene}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
                title="Scène suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VISUAL SCENE STRIP (Animaker Timeline Thumbnails) */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
              <span>Timeline des Scènes & Pistes de Montage :</span>
              <span className="text-amber-400">{lesson.scenes.length} scènes synchronisées</span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
              {lesson.scenes.map((sc, idx) => {
                const isCurrent = idx === currentSceneIdx;
                const bgInfo = BACKGROUND_THEMES[sc.background] || BACKGROUND_THEMES.factory_floor;

                return (
                  <div
                    key={sc.id}
                    onClick={() => setCurrentSceneIdx(idx)}
                    className={`min-w-[150px] p-2.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between shrink-0 select-none ${
                      isCurrent
                        ? 'border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-500/20'
                        : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black text-amber-400">Scène {idx + 1}</span>
                      <span className="text-[9px] font-mono text-slate-400">{sc.durationSeconds || 30}s</span>
                    </div>

                    <div className="text-[11px] font-bold text-slate-200 truncate mb-2">
                      {sc.title.replace(/^\d+\.\s*/, '')}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800">
                      <span className="truncate max-w-[80px]">{sc.characterName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] uppercase">
                        {sc.boardContent?.type || 'board'}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Add scene quick button in timeline (Only in editor mode) */}
              {!readOnly && (
                <button
                  type="button"
                  onClick={handleAddScene}
                  className="min-w-[120px] p-3 rounded-2xl border-2 border-dashed border-slate-800 hover:border-amber-500/60 bg-slate-900/40 hover:bg-amber-950/20 text-slate-400 hover:text-amber-400 text-xs font-bold flex flex-col items-center justify-center gap-1 shrink-0 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter Scène</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. MONTAGE DIRECTOR & INSPECTOR (EDITOR MODE - Only for Trainers) */}
      {!readOnly && viewMode === 'editor' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          {/* Tabs bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-black text-slate-900">
                Directeur de Scène & Montage Animaker
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { id: 'montage', label: 'Scène & Décor', icon: Layout },
                { id: 'dialogue', label: 'Dialogue & Voix', icon: MessageSquare },
                { id: 'character', label: 'Avatar & Posture', icon: User },
                { id: 'board', label: 'Graphiques & Tableaux', icon: Layers },
                { id: 'quiz', label: 'Quiz & Validation', icon: HelpCircle },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeInspectorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveInspectorTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDuplicateScene(currentSceneIdx)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                title="Dupliquer la scène active"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Dupliquer</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteScene(currentSceneIdx)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>

          {/* INSPECTOR TAB 1: SCENE & BACKGROUND */}
          {activeInspectorTab === 'montage' && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              <div className="sm:col-span-6 space-y-2">
                <label className="text-xs font-bold text-slate-700">Titre de la Scène :</label>
                <input
                  type="text"
                  value={activeScene.title}
                  onChange={(e) => updateActiveScene({ title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-3 space-y-2">
                <label className="text-xs font-bold text-slate-700">Durée Estimée (secondes) :</label>
                <input
                  type="number"
                  min={15}
                  max={180}
                  value={activeScene.durationSeconds || 35}
                  onChange={(e) => updateActiveScene({ durationSeconds: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-3 space-y-2">
                <label className="text-xs font-bold text-slate-700">Plan Caméra :</label>
                <select
                  value={activeScene.cameraShot || 'medium'}
                  onChange={(e: any) => updateActiveScene({ cameraShot: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="wide">Plan Large (Vue d'ensemble)</option>
                  <option value="medium">Plan Moyen (Standard)</option>
                  <option value="close_up">Gros Plan (Avatar Focal)</option>
                </select>
              </div>

              <div className="sm:col-span-12 space-y-2">
                <label className="text-xs font-bold text-slate-700">Décor & Environnement 3D :</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Object.entries(BACKGROUND_THEMES).map(([bgKey, bgVal]) => {
                    const isSelected = activeScene.background === bgKey;
                    const Icon = bgVal.decorIcon;
                    return (
                      <button
                        key={bgKey}
                        type="button"
                        onClick={() => updateActiveScene({ background: bgKey as any })}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-2 ring-amber-400/40'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-xs truncate">{bgVal.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* INSPECTOR TAB 2: DIALOGUE & SPEECH */}
          {activeInspectorTab === 'dialogue' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Texte Prononcé par l'Avatar Virtuel (Synthèse Vocale & Lip-Sync) :</span>
                  <span className="text-slate-400 font-normal">{activeScene.dialogueText?.length || 0} caractères</span>
                </label>
                <textarea
                  rows={4}
                  value={activeScene.dialogueText}
                  onChange={(e) => updateActiveScene({ dialogueText: e.target.value })}
                  placeholder="Écrivez le discours de l'instructeur..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Idée Maîtresse (À Retenir) :</label>
                <input
                  type="text"
                  value={activeScene.keyTakeaway || ''}
                  onChange={(e) => updateActiveScene({ keyTakeaway: e.target.value })}
                  placeholder="Ex : Les EPI sont obligatoires dès le franchissement de la ligne de sécurité..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* INSPECTOR TAB 3: CHARACTER & POSE */}
          {activeInspectorTab === 'character' && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              <div className="sm:col-span-12 space-y-2">
                <label className="text-xs font-bold text-slate-700">Sélection du Tuteur Virtuel Acteur :</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ANIMAKER_CHARACTERS.map((char) => (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => {
                        updateActiveScene({
                          characterId: char.id,
                          characterName: char.name,
                          characterAvatar: char.avatar,
                        });
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        activeScene.characterId === char.id
                          ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <img src={char.avatar} alt={char.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs truncate">{char.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{char.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-6 space-y-2">
                <label className="text-xs font-bold text-slate-700">Posture & Expression Labiale :</label>
                <select
                  value={activeScene.pose}
                  onChange={(e: any) => updateActiveScene({ pose: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="alert_danger">⚠️ Alerte & Danger Vital</option>
                  <option value="warning">🛑 Avertissement & Prévention</option>
                  <option value="explaining">🎓 Explication Pédagogique</option>
                  <option value="pointing">👉 Pointer le Tableau</option>
                  <option value="waving">👋 Salutations</option>
                  <option value="celebrating">🎉 Célébration & Succès</option>
                  <option value="coding">💻 Démonstration Code / Machine</option>
                </select>
              </div>

              <div className="sm:col-span-6 space-y-2">
                <label className="text-xs font-bold text-slate-700">Position sur le Plateau :</label>
                <select
                  value={activeScene.characterLayout || 'left'}
                  onChange={(e: any) => updateActiveScene({ characterLayout: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="left">Gauche (Standard)</option>
                  <option value="center">Centre</option>
                  <option value="right">Droite</option>
                  <option value="pip">Incrustation (PiP)</option>
                </select>
              </div>
            </div>
          )}

          {/* INSPECTOR TAB 4: BOARD GRAPHICS & VISUALS */}
          {activeInspectorTab === 'board' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-6 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Type de Graphique / Tableau Motion :</label>
                  <select
                    value={activeScene.boardContent?.type || 'three_cards'}
                    onChange={(e: any) => {
                      const newType = e.target.value;
                      const current = activeScene.boardContent || { title: 'Points Clés' };
                      updateActiveScene({
                        boardContent: {
                          ...current,
                          type: newType,
                        },
                      });
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="four_grid">Grille 4 Éléments (EPI / Modules)</option>
                    <option value="correct_incorrect">Comparaison Conforme vs Non-Conforme</option>
                    <option value="numbered_steps">Étapes Numérotées (LOTO / Procédure)</option>
                    <option value="danger_alert">Bannière Alerte Danger & Consignes</option>
                    <option value="three_cards">3 Cartes Synthèse</option>
                    <option value="bullet_points">Liste à Puces Animée</option>
                    <option value="code">Extrait de Code / Formule</option>
                  </select>
                </div>

                <div className="sm:col-span-6 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Titre du Tableau :</label>
                  <input
                    type="text"
                    value={activeScene.boardContent?.title || ''}
                    onChange={(e) => {
                      const current = activeScene.boardContent || { type: 'three_cards', title: '' };
                      updateActiveScene({
                        boardContent: { ...current, title: e.target.value },
                      });
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Texte d'Accroche / Norme en bas du tableau :</label>
                <input
                  type="text"
                  value={activeScene.boardContent?.highlightText || ''}
                  onChange={(e) => {
                    const current = activeScene.boardContent || { type: 'three_cards', title: '' };
                    updateActiveScene({
                      boardContent: { ...current, highlightText: e.target.value },
                    });
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* INSPECTOR TAB 5: QUIZ & VALIDATION */}
          {activeInspectorTab === 'quiz' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Question de Validation Interactive :</label>
                {!activeScene.miniQuiz ? (
                  <button
                    type="button"
                    onClick={() => {
                      updateActiveScene({
                        miniQuiz: {
                          question: 'Quelle est la règle de sécurité à respecter impérativement ?',
                          options: [
                            'Porter les EPI et respecter les consignes',
                            'Ignorer les alarmes',
                            'Ne jamais vérifier l’équipement',
                          ],
                          correctIndex: 0,
                          explanation: 'La rigueur et le port des protections individuelles sauvent des vies.',
                        },
                      });
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold"
                  >
                    + Ajouter un mini-quiz à cette scène
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateActiveScene({ miniQuiz: undefined })}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Supprimer le quiz
                  </button>
                )}
              </div>

              {activeScene.miniQuiz && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <input
                    type="text"
                    value={activeScene.miniQuiz.question}
                    onChange={(e) => {
                      if (activeScene.miniQuiz) {
                        updateActiveScene({
                          miniQuiz: { ...activeScene.miniQuiz, question: e.target.value },
                        });
                      }
                    }}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-bold"
                    placeholder="Intitulé de la question..."
                  />

                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500">Options de réponses (sélectionnez la bonne réponse) :</span>
                    {activeScene.miniQuiz.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctQuizOption"
                          checked={activeScene.miniQuiz?.correctIndex === idx}
                          onChange={() => {
                            if (activeScene.miniQuiz) {
                              updateActiveScene({
                                miniQuiz: { ...activeScene.miniQuiz, correctIndex: idx },
                              });
                            }
                          }}
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            if (activeScene.miniQuiz) {
                              const updatedOpts = [...activeScene.miniQuiz.options];
                              updatedOpts[idx] = e.target.value;
                              updateActiveScene({
                                miniQuiz: { ...activeScene.miniQuiz, options: updatedOpts },
                              });
                            }
                          }}
                          className="flex-1 p-2 rounded-lg bg-white border border-slate-200 text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500">Explication pédagogique :</span>
                    <input
                      type="text"
                      value={activeScene.miniQuiz.explanation || ''}
                      onChange={(e) => {
                        if (activeScene.miniQuiz) {
                          updateActiveScene({
                            miniQuiz: { ...activeScene.miniQuiz, explanation: e.target.value },
                          });
                        }
                      }}
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
