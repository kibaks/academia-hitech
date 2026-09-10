import {
  CourseVideoProject,
  TimelineTrack,
  TimelineClip,
  AnimakerLesson,
} from '../types';

export interface MediaStockItem {
  id: string;
  name: string;
  category: 'b_roll' | 'avatar' | 'title' | 'code' | 'audio' | 'sfx';
  durationSeconds: number;
  previewUrl: string;
  thumbnail: string;
  badge?: string;
  meta?: any;
}

export const STOCK_B_ROLL_ITEMS: MediaStockItem[] = [
  {
    id: 'broll-ai-lab',
    name: 'Laboratoire IA & Clusters GPU',
    category: 'b_roll',
    durationSeconds: 15,
    previewUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&auto=format&fit=crop&q=80',
    badge: '1080p 60fps',
  },
  {
    id: 'broll-factory',
    name: 'Atelier Industriel 4.0 & Lignes Robotisées',
    category: 'b_roll',
    durationSeconds: 20,
    previewUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&auto=format&fit=crop&q=80',
    badge: 'Sécurité Usine',
  },
  {
    id: 'broll-cloud-datacenter',
    name: 'Datacenter Haute Disponibilité & Baies Serveurs',
    category: 'b_roll',
    durationSeconds: 18,
    previewUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop&q=80',
    badge: 'Cloud & DevOps',
  },
  {
    id: 'broll-cyber-terminal',
    name: 'Salle des Opérations Cybersécurité (SOC)',
    category: 'b_roll',
    durationSeconds: 15,
    previewUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=300&auto=format&fit=crop&q=80',
    badge: 'Sécurité SOC',
  },
  {
    id: 'broll-modern-classroom',
    name: 'Auditorium Virtuel & Salle Tech Interactive',
    category: 'b_roll',
    durationSeconds: 25,
    previewUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=80',
    badge: 'Pédagogie',
  },
];

export const STOCK_MUSIC_ITEMS = [
  {
    id: 'audio-bg-lofi-focus',
    name: 'Lo-Fi Focus & Deep Learning (BGM)',
    durationSeconds: 120,
    genre: 'Ambiance Pédagogique',
    volume: 35,
  },
  {
    id: 'audio-bg-tech-synth',
    name: 'Synthwave Innovation & Future Tech',
    durationSeconds: 90,
    genre: 'Électro Calme',
    volume: 30,
  },
  {
    id: 'audio-bg-corporate-inspire',
    name: 'Corporate Inspiration & Executive Summit',
    durationSeconds: 150,
    genre: 'Professionnel',
    volume: 40,
  },
];

export const STOCK_SFX_ITEMS = [
  { id: 'sfx-swoosh', name: 'Swoosh Transition Pro', durationSeconds: 1.5, type: 'Transition' },
  { id: 'sfx-ding', name: 'Ding Succès / Réponse Quiz', durationSeconds: 1.0, type: 'Quiz' },
  { id: 'sfx-keyboard', name: 'Frappe Clavier Mécanique Code', durationSeconds: 3.0, type: 'Code' },
  { id: 'sfx-alert', name: 'Bip Attention / Alerte Sécurité', durationSeconds: 1.2, type: 'Alerte' },
];

export const DEFAULT_TIMELINE_TRACKS: TimelineTrack[] = [
  {
    id: 'track-text',
    name: 'Titres & Sous-titres',
    type: 'overlay_text',
    label: 'T1 - Titres & Lower Thirds',
    color: '#f59e0b', // amber
    isMuted: false,
    isLocked: false,
    isHidden: false,
    height: 48,
  },
  {
    id: 'track-avatar',
    name: 'Avatar Formateur PiP',
    type: 'avatar',
    label: 'V2 - Formateur Incrusté (PiP)',
    color: '#8b5cf6', // purple
    isMuted: false,
    isLocked: false,
    isHidden: false,
    height: 52,
  },
  {
    id: 'track-video',
    name: 'Vidéo Principale / B-Roll',
    type: 'video',
    label: 'V1 - Piste Vidéo Master',
    color: '#0284c7', // sky
    isMuted: false,
    isLocked: false,
    isHidden: false,
    height: 60,
  },
  {
    id: 'track-voiceover',
    name: 'Voix-off IA',
    type: 'voiceover',
    label: 'A1 - Voix-off Studio & TTS',
    color: '#10b981', // emerald
    isMuted: false,
    isLocked: false,
    isHidden: false,
    height: 44,
  },
  {
    id: 'track-audio',
    name: 'Musique & SFX',
    type: 'audio',
    label: 'A2 - Musique de Fond (BGM)',
    color: '#06b6d4', // cyan
    isMuted: false,
    isLocked: false,
    isHidden: false,
    height: 40,
  },
  {
    id: 'track-quiz',
    name: 'Points d’Arrêt & Quiz',
    type: 'interactive',
    label: 'M1 - Quiz Interactifs',
    color: '#ec4899', // pink
    isMuted: false,
    isLocked: false,
    isHidden: false,
    height: 38,
  },
];

export const INITIAL_COURSE_VIDEO_PROJECT: CourseVideoProject = {
  id: 'project-deep-learning-masterclass',
  title: 'Montage Vidéo : Architecture des Transformers & Attention Mécanisme',
  topic: 'Intelligence Artificielle & Deep Learning',
  description: 'Projet de montage complet avec plans B-Roll, voix-off IA de Fatou Sow, incrustation PiP, sous-titres animés et quiz interactif.',
  targetAudience: 'Ingénieurs IA, Développeurs Python & Chercheurs',
  aspectRatio: '16:9',
  resolution: '1080p',
  fps: 30,
  totalDurationSeconds: 90,
  leadCharacterName: 'Fatou Sow',
  leadCharacterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  tracks: DEFAULT_TIMELINE_TRACKS,
  markers: [
    { id: 'm-1', timeSeconds: 0, label: 'Intro & Contexte', color: '#0284c7' },
    { id: 'm-2', timeSeconds: 22, label: 'Mécanisme d’Attention', color: '#8b5cf6' },
    { id: 'm-3', timeSeconds: 52, label: 'Implémentation Code PyTorch', color: '#f59e0b' },
    { id: 'm-4', timeSeconds: 78, label: 'Quiz Interactif & Synthèse', color: '#ec4899' },
  ],
  clips: [
    // 1. Video Track (V1)
    {
      id: 'clip-v1-intro',
      trackId: 'track-video',
      title: 'Lab IA - Clusters GPU & Serveurs',
      type: 'b_roll',
      startSeconds: 0,
      durationSeconds: 22,
      sourceUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      color: '#0284c7',
      transform: { x: 0, y: 0, scale: 1, opacity: 1 },
      transition: { type: 'crossfade', durationSeconds: 1 },
    },
    {
      id: 'clip-v1-diagram',
      trackId: 'track-video',
      title: 'Schéma Animé : Multi-Head Attention',
      type: 'screen_recording',
      startSeconds: 22,
      durationSeconds: 30,
      sourceUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      color: '#0284c7',
      transform: { x: 0, y: 0, scale: 1, opacity: 1 },
      transition: { type: 'slide-left', durationSeconds: 0.8 },
    },
    {
      id: 'clip-v1-code',
      trackId: 'track-video',
      title: 'Session Terminal & Code IDE',
      type: 'video',
      startSeconds: 52,
      durationSeconds: 26,
      sourceUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
      color: '#0284c7',
      transform: { x: 0, y: 0, scale: 1, opacity: 1 },
      transition: { type: 'crossfade', durationSeconds: 0.8 },
    },
    {
      id: 'clip-v1-outro',
      trackId: 'track-video',
      title: 'Auditorium Virtuel ITECH',
      type: 'b_roll',
      startSeconds: 78,
      durationSeconds: 12,
      sourceUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
      color: '#0284c7',
      transform: { x: 0, y: 0, scale: 1, opacity: 1 },
      transition: { type: 'fade-to-black', durationSeconds: 1 },
    },

    // 2. Avatar Track (V2) - PiP
    {
      id: 'clip-v2-fatou-intro',
      trackId: 'track-avatar',
      title: 'Fatou Sow - Incrustation Caméra',
      type: 'avatar',
      startSeconds: 2,
      durationSeconds: 18,
      color: '#8b5cf6',
      sourceUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      transform: {
        x: 34,
        y: 28,
        scale: 0.85,
        opacity: 1,
        pipPosition: 'bottom-right',
        chromaKey: true,
      },
      voiceoverData: {
        characterId: 'fatou-sow',
        characterName: 'Fatou Sow',
        characterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        speechText: 'Bonjour à tous ! Aujourd’hui, nous décodons le secret des LLM modernes : la formule magique du Scaled Dot-Product Attention.',
      },
    },
    {
      id: 'clip-v2-fatou-explanation',
      trackId: 'track-avatar',
      title: 'Fatou Sow - Explication Technique',
      type: 'avatar',
      startSeconds: 24,
      durationSeconds: 24,
      color: '#8b5cf6',
      sourceUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      transform: {
        x: -34,
        y: 28,
        scale: 0.8,
        opacity: 1,
        pipPosition: 'bottom-left',
        chromaKey: true,
      },
      voiceoverData: {
        characterId: 'fatou-sow',
        characterName: 'Fatou Sow',
        characterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        speechText: 'Notez bien : le facteur racine carrée de d_k évite la saturation du softmax quand les dimensions explosent.',
      },
    },

    // 3. Text & Titles Track (T1)
    {
      id: 'clip-t1-title',
      trackId: 'track-text',
      title: 'Titre Principal : Masterclass Transformers',
      type: 'title_text',
      startSeconds: 1,
      durationSeconds: 9,
      color: '#f59e0b',
      textContent: 'TRANSFORMERS & ATTENTION',
      textSubtitle: 'Module 04 • Ingénierie des Modèles Fondamentaux',
      textStyle: {
        fontSize: 'title',
        textColor: '#ffffff',
        bgColor: 'rgba(15, 23, 42, 0.85)',
        animation: 'slide-up',
        position: 'center-title',
      },
    },
    {
      id: 'clip-t1-lower-third-1',
      trackId: 'track-text',
      title: 'Bandeau Nom : Fatou Sow',
      type: 'lower_third',
      startSeconds: 4,
      durationSeconds: 8,
      color: '#f59e0b',
      textContent: 'Fatou Sow',
      textSubtitle: 'Lead Data & IA Générative • Academia ITECH',
      textStyle: {
        fontSize: 'medium',
        textColor: '#ffffff',
        bgColor: 'rgba(79, 70, 229, 0.9)',
        animation: 'fade',
        position: 'lower-third',
      },
    },
    {
      id: 'clip-t1-formula',
      trackId: 'track-text',
      title: 'Callout : Formule Attention(Q, K, V)',
      type: 'title_text',
      startSeconds: 23,
      durationSeconds: 15,
      color: '#f59e0b',
      textContent: 'Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k) · V',
      textSubtitle: 'Complexité O(N²) calculée en parallèle sur GPU',
      textStyle: {
        fontSize: 'large',
        textColor: '#38bdf8',
        bgColor: 'rgba(15, 23, 42, 0.95)',
        animation: 'pop',
        position: 'top-banner',
      },
    },
    {
      id: 'clip-t1-code',
      trackId: 'track-text',
      title: 'Bloc Code : PyTorch Attention Layer',
      type: 'code_snippet',
      startSeconds: 52,
      durationSeconds: 25,
      color: '#f59e0b',
      codeContent: {
        language: 'python',
        code: `import torch\nimport torch.nn.functional as F\n\ndef scaled_dot_product_attention(Q, K, V, mask=None):\n    d_k = Q.size(-1)\n    scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(d_k)\n    if mask is not None:\n        scores = scores.masked_fill(mask == 0, -1e9)\n    attn_weights = F.softmax(scores, dim=-1)\n    return torch.matmul(attn_weights, V), attn_weights`,
        highlightLines: [4, 7, 8],
      },
    },

    // 4. Voiceover Track (A1)
    {
      id: 'clip-a1-voice-1',
      trackId: 'track-voiceover',
      title: 'Voix-off Studio (Fatou Sow) - Intro',
      type: 'voiceover',
      startSeconds: 2,
      durationSeconds: 18,
      color: '#10b981',
      volume: 100,
      fadeIn: 0.5,
      fadeOut: 0.5,
      voiceoverData: {
        characterId: 'fatou-sow',
        characterName: 'Fatou Sow',
        characterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        speechText: 'Bonjour à tous ! Aujourd’hui, nous décodons le secret des LLM modernes : la formule magique du Scaled Dot-Product Attention.',
      },
    },
    {
      id: 'clip-a1-voice-2',
      trackId: 'track-voiceover',
      title: 'Voix-off Studio - Explication Math & Code',
      type: 'voiceover',
      startSeconds: 24,
      durationSeconds: 26,
      color: '#10b981',
      volume: 100,
      fadeIn: 0.5,
      fadeOut: 0.5,
      voiceoverData: {
        characterId: 'fatou-sow',
        characterName: 'Fatou Sow',
        characterAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        speechText: 'Observons comment les matrices Query et Key interagissent pour produire une distribution de probabilité pondérée.',
      },
    },

    // 5. Audio Music Track (A2)
    {
      id: 'clip-a2-bgm',
      trackId: 'track-audio',
      title: 'Lo-Fi Focus & Learning (Fond sonore)',
      type: 'music',
      startSeconds: 0,
      durationSeconds: 90,
      color: '#06b6d4',
      volume: 25,
      fadeIn: 2,
      fadeOut: 3,
    },
    {
      id: 'clip-a2-sfx-pop',
      trackId: 'track-audio',
      title: 'SFX Swoosh Transition',
      type: 'sound_effect',
      startSeconds: 22,
      durationSeconds: 1.5,
      color: '#06b6d4',
      volume: 70,
    },

    // 6. Interactive Quiz Track (M1)
    {
      id: 'clip-m1-quiz',
      trackId: 'track-quiz',
      title: 'Arrêt Interactif : Quiz Scaled Dot-Product',
      type: 'interactive_quiz',
      startSeconds: 78,
      durationSeconds: 12,
      color: '#ec4899',
      quizData: {
        question: 'Pourquoi divise-t-on le produit scalaire Q·Kᵀ par la racine carrée de d_k ?',
        options: [
          'Pour accélérer la bande passante mémoire',
          'Pour éviter que les valeurs soient trop grandes et saturent le gradient du Softmax',
          'Pour forcer les poids d\'attention à être binaires (0 ou 1)',
          'Pour réduire le nombre de têtes d\'attention',
        ],
        correctIndex: 1,
        explanation: 'Quand la dimension d_k est grande, les produits scalaires grandissent en magnitude, poussant la fonction softmax vers des zones à gradient extrêmement faible. La division par √d_k stabilise les gradients.',
      },
    },
  ],
};

// PRESET 2 : SÉCURITÉ INDUSTRIELLE & HSE (ALEX CHEN)
export const HSE_COURSE_VIDEO_PROJECT: CourseVideoProject = {
  id: 'project-hse-safety-master',
  title: 'Montage Vidéo : Sécurité Usine, Consignation LOTO & Risques Électriques',
  topic: 'Sécurité Industrielle, HSE & Prévention des Risques',
  description: 'Vidéo pédagogique scénarisée sur les règles d’or en usine, équipements EPI et procédure de consignation LOTO.',
  targetAudience: 'Opérateurs, Techniciens & Ingénieurs HSE',
  aspectRatio: '16:9',
  resolution: '1080p',
  fps: 30,
  totalDurationSeconds: 75,
  leadCharacterName: 'Alex Chen',
  leadCharacterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  tracks: DEFAULT_TIMELINE_TRACKS,
  markers: [
    { id: 'm-hse-1', timeSeconds: 0, label: 'Consignes Générales EPI', color: '#0284c7' },
    { id: 'm-hse-2', timeSeconds: 25, label: 'Procédure LOTO 5 Étapes', color: '#f59e0b' },
    { id: 'm-hse-3', timeSeconds: 55, label: 'Quiz Validation Habilitation', color: '#ec4899' },
  ],
  clips: [
    {
      id: 'clip-hse-v1-1',
      trackId: 'track-video',
      title: 'Ligne de Production & Usine 4.0',
      type: 'b_roll',
      startSeconds: 0,
      durationSeconds: 25,
      sourceUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
      color: '#0284c7',
      transform: { x: 0, y: 0, scale: 1, opacity: 1 },
      transition: { type: 'crossfade', durationSeconds: 1 },
    },
    {
      id: 'clip-hse-v1-2',
      trackId: 'track-video',
      title: 'Armoire Électrique & Cadenassage LOTO',
      type: 'video',
      startSeconds: 25,
      durationSeconds: 30,
      sourceUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
      color: '#0284c7',
      transform: { x: 0, y: 0, scale: 1, opacity: 1 },
      transition: { type: 'slide-left', durationSeconds: 0.8 },
    },
    {
      id: 'clip-hse-v1-3',
      trackId: 'track-video',
      title: 'Poste de Contrôle & Supervision',
      type: 'b_roll',
      startSeconds: 55,
      durationSeconds: 20,
      sourceUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80',
      color: '#0284c7',
      transform: { x: 0, y: 0, scale: 1, opacity: 1 },
      transition: { type: 'fade-to-black', durationSeconds: 1 },
    },
    // Avatar
    {
      id: 'clip-hse-v2-alex',
      trackId: 'track-avatar',
      title: 'Alex Chen - Spécialiste HSE',
      type: 'avatar',
      startSeconds: 1,
      durationSeconds: 22,
      color: '#8b5cf6',
      sourceUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      transform: {
        x: 34,
        y: 28,
        scale: 0.85,
        opacity: 1,
        pipPosition: 'bottom-right',
        chromaKey: true,
      },
      voiceoverData: {
        characterId: 'alex-chen',
        characterName: 'Alex Chen',
        characterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        speechText: 'Attention : Toute intervention sur machine tournante requiert la coupure d’énergie et la vérification d’absence de tension (VAT).',
      },
    },
    // Titles
    {
      id: 'clip-hse-t1-title',
      trackId: 'track-text',
      title: 'Titre : Règles Vitales Usine',
      type: 'title_text',
      startSeconds: 1,
      durationSeconds: 8,
      color: '#f59e0b',
      textContent: 'SÉCURITÉ INDUSTRIELLE & LOTO',
      textSubtitle: 'Module Certifiant Zéro Accident • Academia ITECH',
      textStyle: {
        fontSize: 'title',
        textColor: '#ffffff',
        bgColor: 'rgba(185, 28, 28, 0.9)',
        animation: 'pop',
        position: 'center-title',
      },
    },
    // Voiceover
    {
      id: 'clip-hse-a1-voice',
      trackId: 'track-voiceover',
      title: 'Voix-off Alex Chen',
      type: 'voiceover',
      startSeconds: 1,
      durationSeconds: 22,
      color: '#10b981',
      volume: 100,
      voiceoverData: {
        characterId: 'alex-chen',
        characterName: 'Alex Chen',
        characterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        speechText: 'Attention : Toute intervention sur machine tournante requiert la coupure d’énergie et la vérification d’absence de tension (VAT).',
      },
    },
    // Music
    {
      id: 'clip-hse-a2-music',
      trackId: 'track-audio',
      title: 'BGM Corporate Dynamic',
      type: 'music',
      startSeconds: 0,
      durationSeconds: 75,
      color: '#06b6d4',
      volume: 20,
    },
    // Interactive Quiz
    {
      id: 'clip-hse-m1-quiz',
      trackId: 'track-quiz',
      title: 'Quiz : Les 5 Étapes de la Consignation',
      type: 'interactive_quiz',
      startSeconds: 55,
      durationSeconds: 20,
      color: '#ec4899',
      quizData: {
        question: 'Quelle est la première étape obligatoire avant d’intervenir sur une armoire électrique ?',
        options: [
          'Poser son cadenas individuel sur le sectionneur',
          'Séparation physique de l’installation de toute source d’énergie',
          'Informer la direction par e-mail',
          'Mettre des gants de manutention simples',
        ],
        correctIndex: 1,
        explanation: 'La première étape de la consignation électrique selon la norme NF C 18-510 est la séparation (coupure omnipolaire de l’alimentation).',
      },
    },
  ],
};

export const COURSE_VIDEO_PROJECT_TEMPLATES: CourseVideoProject[] = [
  INITIAL_COURSE_VIDEO_PROJECT,
  HSE_COURSE_VIDEO_PROJECT,
];

// -------------------------------------------------------------
// ADAPTER / CONVERTER : AnimakerLesson <-> CourseVideoProject
// -------------------------------------------------------------
export function convertAnimakerLessonToVideoProject(lesson: AnimakerLesson): CourseVideoProject {
  const tracks: TimelineTrack[] = DEFAULT_TIMELINE_TRACKS;
  const clips: TimelineClip[] = [];
  const markers: { id: string; timeSeconds: number; label: string; color?: string }[] = [];

  let currentTime = 0;

  lesson.scenes?.forEach((scene, index) => {
    const sceneDuration = Math.max(5, scene.durationSeconds || 15);
    const sceneStartTime = currentTime;

    // Marker
    markers.push({
      id: `m-scene-${index}`,
      timeSeconds: sceneStartTime,
      label: scene.title || `Plan ${index + 1}`,
      color: index % 2 === 0 ? '#0284c7' : '#8b5cf6',
    });

    // 1. Background / B-Roll Video Clip on V1
    const bgImageMap: Record<string, string> = {
      factory_floor: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
      warehouse: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
      construction_site: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format&fit=crop&q=80',
      industrial_lab: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
      tech_classroom: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
      ai_lab: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      cloud_datacenter: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
      modern_office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
      hacker_terminal: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
      startup_hub: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
      whiteboard_studio: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    };

    clips.push({
      id: `clip-v1-${scene.id || index}`,
      trackId: 'track-video',
      title: `Plan ${index + 1} : ${scene.title || 'Décor & Médias'}`,
      type: 'b_roll',
      startSeconds: sceneStartTime,
      durationSeconds: sceneDuration,
      sourceUrl: bgImageMap[scene.background] || bgImageMap.ai_lab,
      color: '#0284c7',
      transform: { x: 0, y: 0, scale: 1, opacity: 1 },
      transition: { type: index === 0 ? 'cut' : 'crossfade', durationSeconds: 0.8 },
    });

    // 2. Avatar PiP Clip on V2
    if (scene.characterName || lesson.leadCharacterName) {
      clips.push({
        id: `clip-v2-${scene.id || index}`,
        trackId: 'track-avatar',
        title: `${scene.characterName || lesson.leadCharacterName} (Incrustation PiP)`,
        type: 'avatar',
        startSeconds: sceneStartTime,
        durationSeconds: sceneDuration,
        color: '#8b5cf6',
        sourceUrl: scene.characterAvatar || lesson.leadCharacterAvatar,
        transform: {
          x: 34,
          y: 28,
          scale: 0.85,
          opacity: 1,
          pipPosition: 'bottom-right',
          chromaKey: true,
        },
        voiceoverData: {
          characterId: scene.characterId || 'trainer',
          characterName: scene.characterName || lesson.leadCharacterName,
          characterAvatar: scene.characterAvatar || lesson.leadCharacterAvatar,
          speechText: scene.dialogueText,
        },
      });
    }

    // 3. Lower Third / Title / Board Content on T1
    if (scene.boardContent) {
      clips.push({
        id: `clip-t1-${scene.id || index}`,
        trackId: 'track-text',
        title: scene.boardContent.title || `Titre Plan ${index + 1}`,
        type: scene.boardContent.codeSnippet ? 'code_snippet' : 'title_text',
        startSeconds: sceneStartTime + 1,
        durationSeconds: Math.max(3, sceneDuration - 1.5),
        color: '#f59e0b',
        textContent: scene.boardContent.title,
        textSubtitle: scene.keyTakeaway || scene.dialogueText.slice(0, 80) + '...',
        textStyle: {
          fontSize: 'large',
          textColor: '#ffffff',
          bgColor: 'rgba(15, 23, 42, 0.9)',
          animation: 'slide-up',
          position: 'center-title',
        },
        codeContent: scene.boardContent.codeSnippet
          ? {
              language: scene.boardContent.codeLanguage || 'python',
              code: scene.boardContent.codeSnippet,
            }
          : undefined,
      });
    }

    // 4. Voiceover Audio on A1
    if (scene.dialogueText) {
      clips.push({
        id: `clip-a1-${scene.id || index}`,
        trackId: 'track-voiceover',
        title: `Voix-off : ${scene.characterName || 'Formateur'}`,
        type: 'voiceover',
        startSeconds: sceneStartTime,
        durationSeconds: sceneDuration,
        color: '#10b981',
        volume: 100,
        voiceoverData: {
          characterId: scene.characterId || 'trainer',
          characterName: scene.characterName || lesson.leadCharacterName,
          characterAvatar: scene.characterAvatar || lesson.leadCharacterAvatar,
          speechText: scene.dialogueText,
        },
      });
    }

    // 5. Interactive Quiz on M1 (if any)
    if (scene.miniQuiz) {
      clips.push({
        id: `clip-m1-${scene.id || index}`,
        trackId: 'track-quiz',
        title: `Quiz : ${scene.miniQuiz.question.slice(0, 30)}...`,
        type: 'interactive_quiz',
        startSeconds: sceneStartTime + sceneDuration - 5,
        durationSeconds: 5,
        color: '#ec4899',
        quizData: scene.miniQuiz,
      });
    }

    currentTime += sceneDuration;
  });

  // Background Music along entire timeline
  clips.push({
    id: 'clip-a2-bgm-global',
    trackId: 'track-audio',
    title: 'Musique de Fond Lo-Fi Focus',
    type: 'music',
    startSeconds: 0,
    durationSeconds: Math.max(30, currentTime),
    color: '#06b6d4',
    volume: 25,
    fadeIn: 1.5,
    fadeOut: 2,
  });

  return {
    id: `project-${lesson.id || Date.now()}`,
    title: lesson.title || 'Projet Vidéo Pédagogique',
    topic: lesson.topic || 'Formation Academia ITECH',
    targetAudience: lesson.targetAudience,
    aspectRatio: '16:9',
    resolution: '1080p',
    fps: 30,
    totalDurationSeconds: Math.max(30, currentTime),
    tracks,
    clips,
    markers,
    leadCharacterName: lesson.leadCharacterName,
    leadCharacterAvatar: lesson.leadCharacterAvatar,
  };
}

export function convertVideoProjectToAnimakerLesson(project: CourseVideoProject): AnimakerLesson {
  // Extract plans from project markers or video clips
  const videoClips = project.clips
    .filter((c) => c.trackId === 'track-video')
    .sort((a, b) => a.startSeconds - b.startSeconds);

  const scenes = videoClips.map((vClip, idx) => {
    // find overlapping avatar clip
    const avatarClip = project.clips.find(
      (c) => c.trackId === 'track-avatar' && c.startSeconds >= vClip.startSeconds && c.startSeconds < vClip.startSeconds + vClip.durationSeconds
    );
    // find overlapping text clip
    const textClip = project.clips.find(
      (c) => c.trackId === 'track-text' && c.startSeconds >= vClip.startSeconds && c.startSeconds < vClip.startSeconds + vClip.durationSeconds
    );
    // find overlapping quiz
    const quizClip = project.clips.find(
      (c) => c.trackId === 'track-quiz' && c.startSeconds >= vClip.startSeconds && c.startSeconds < vClip.startSeconds + vClip.durationSeconds
    );

    return {
      id: `sc-gen-${idx + 1}`,
      title: vClip.title || `Séquence ${idx + 1}`,
      characterId: avatarClip?.voiceoverData?.characterId || 'trainer',
      characterName: avatarClip?.voiceoverData?.characterName || project.leadCharacterName || 'Fatou Sow',
      characterAvatar: avatarClip?.voiceoverData?.characterAvatar || project.leadCharacterAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      pose: 'presenting' as const,
      dialogueText: avatarClip?.voiceoverData?.speechText || textClip?.textContent || `Séquence vidéo consacrée à : ${project.topic}`,
      background: 'ai_lab' as const,
      durationSeconds: Math.round(vClip.durationSeconds),
      boardContent: textClip
        ? {
            type: (textClip.codeContent ? 'code' : 'bullet_points') as 'code' | 'bullet_points',
            title: textClip.textContent || 'Points Clés',
            items: [textClip.textSubtitle || 'Explication vidéo en direct'],
            codeSnippet: textClip.codeContent?.code,
            codeLanguage: textClip.codeContent?.language,
          }
        : undefined,
      miniQuiz: quizClip?.quizData,
    };
  });

  return {
    id: project.id,
    title: project.title,
    topic: project.topic,
    targetAudience: project.targetAudience,
    leadCharacterName: project.leadCharacterName || 'Fatou Sow',
    leadCharacterAvatar: project.leadCharacterAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    totalDurationSeconds: project.totalDurationSeconds,
    scenes: scenes.length > 0 ? scenes : [
      {
        id: 'sc-default-1',
        title: project.title,
        characterId: 'trainer',
        characterName: project.leadCharacterName || 'Fatou Sow',
        characterAvatar: project.leadCharacterAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        pose: 'presenting',
        dialogueText: `Bienvenue dans la vidéo de cours : ${project.title}.`,
        background: 'ai_lab',
        durationSeconds: project.totalDurationSeconds || 60,
      }
    ],
  };
}

export const ANIMAKER_CHARACTERS = [
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
    id: 'fatou-sow',
    name: 'Fatou Sow',
    role: 'Lead Data & IA Générative',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    gender: 'female' as const,
    color: '#0284c7',
    specialty: 'Transformers, Embeddings & RAG',
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
    role: 'Ingénieur Systèmes Embarqués & IoT',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    gender: 'male' as const,
    color: '#f97316',
    specialty: 'Capteurs Industriels, Modbus & Edge Computing',
  },
];

// PREDEFINED ANIMAKER-STYLE VIDEO TEMPLATES (Animaker 2D, Whiteboard, Infographic, Tech & Safety)
export const ANIMAKER_PRESET_TEMPLATES: CourseVideoProject[] = [
  INITIAL_COURSE_VIDEO_PROJECT,
  HSE_COURSE_VIDEO_PROJECT,
  {
    id: 'animaker-fintech-gateway-project',
    title: 'Animaker Fintech : Passerelles Mobile Money & Idempotence',
    topic: 'Fintech, Mobile Money & Systèmes Résilients',
    description: 'Modèle de capsule Animaker pour expliquer l\'intégration des APIs Wave, Orange Money et gestion des webhooks.',
    targetAudience: 'Développeurs Backend, Architectes Fintech & Intégrateurs',
    aspectRatio: '16:9',
    resolution: '1080p',
    fps: 30,
    totalDurationSeconds: 75,
    leadCharacterName: 'Amina Diallo',
    leadCharacterAvatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
    tracks: DEFAULT_TIMELINE_TRACKS,
    markers: [
      { id: 'm-ft-1', timeSeconds: 0, label: 'Intro & Enjeu Mobile Money', color: '#059669' },
      { id: 'm-ft-2', timeSeconds: 20, label: 'Clé d\'Idempotence & Double Débit', color: '#0284c7' },
      { id: 'm-ft-3', timeSeconds: 45, label: 'Code API & Webhooks', color: '#f59e0b' },
      { id: 'm-ft-4', timeSeconds: 62, label: 'Quiz de Sécurité Financière', color: '#ec4899' },
    ],
    clips: [
      {
        id: 'clip-ft-broll-1',
        trackId: 'track-video',
        title: 'B-Roll : Transactions Numériques & Terminal',
        type: 'b_roll',
        startSeconds: 0,
        durationSeconds: 20,
        sourceUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
        color: '#059669',
      },
      {
        id: 'clip-ft-broll-2',
        trackId: 'track-video',
        title: 'Schéma Flux Bancaire & USSD',
        type: 'screen_recording',
        startSeconds: 20,
        durationSeconds: 25,
        sourceUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
        color: '#0284c7',
      },
      {
        id: 'clip-ft-broll-3',
        trackId: 'track-video',
        title: 'Code IDE Node.js & Webhook Verify',
        type: 'video',
        startSeconds: 45,
        durationSeconds: 30,
        sourceUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
        color: '#f59e0b',
      },
      {
        id: 'clip-ft-avatar-1',
        trackId: 'track-avatar',
        title: 'Amina Diallo - Présentation',
        type: 'avatar',
        startSeconds: 2,
        durationSeconds: 16,
        sourceUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
        color: '#059669',
        transform: { x: 34, y: 28, scale: 0.85, opacity: 1 },
      },
      {
        id: 'clip-ft-title-1',
        trackId: 'track-text',
        title: 'Titre Animaker : Passerelles Fintech',
        type: 'title_text',
        startSeconds: 1,
        durationSeconds: 14,
        textContent: 'Paiements Mobile Money Résilients',
        textSubtitle: 'Standard ISO 20022 & Idempotence',
        color: '#f59e0b',
      },
      {
        id: 'clip-ft-audio-bg',
        trackId: 'track-audio',
        title: 'Musique : Lo-Fi Fintech & Focus',
        type: 'music',
        startSeconds: 0,
        durationSeconds: 75,
        color: '#06b6d4',
      },
      {
        id: 'clip-ft-quiz-stop',
        trackId: 'track-quiz',
        title: 'Arrêt Quiz : Idempotence',
        type: 'interactive_quiz',
        startSeconds: 62,
        durationSeconds: 12,
        color: '#ec4899',
        quizData: {
          question: 'Pourquoi chaque requête vers Wave ou Orange Money doit comporter une clé d\'idempotence ?',
          options: [
            'Pour chiffrer l\'adresse IP de l\'apprenant',
            'Pour empêcher un double prélèvement si la connexion coupe avant l\'accusé de réception',
            'Pour augmenter le score de conversion marketing',
          ],
          correctIndex: 1,
          explanation: 'La clé d\'idempotence garantit qu\'une requête répétée ne débite pas deux fois le client.',
        },
      },
    ],
  },
  {
    id: 'animaker-whiteboard-cloud-project',
    title: 'Animaker Whiteboard : Architecture Cloud & Microservices',
    topic: 'Cloud Computing, Docker & Kubernetes',
    description: 'Style tableau blanc animé décortiquant les architectures de microservices haute disponibilité.',
    targetAudience: 'Architectes Cloud, Développeurs Fullstack & DevOps',
    aspectRatio: '16:9',
    resolution: '1080p',
    fps: 30,
    totalDurationSeconds: 80,
    leadCharacterName: 'Dr. Landry Bakweto',
    leadCharacterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    tracks: DEFAULT_TIMELINE_TRACKS,
    markers: [
      { id: 'm-cb-1', timeSeconds: 0, label: 'Monolithe vs Microservices', color: '#4f46e5' },
      { id: 'm-cb-2', timeSeconds: 24, label: 'Pattern Circuit Breaker', color: '#0284c7' },
      { id: 'm-cb-3', timeSeconds: 50, label: 'Déploiement Docker & K8s', color: '#10b981' },
      { id: 'm-cb-4', timeSeconds: 68, label: 'Quiz Évaluation Cloud', color: '#ec4899' },
    ],
    clips: [
      {
        id: 'clip-cb-video-1',
        trackId: 'track-video',
        title: 'Datacenter Baies & Câblage Haute Vitesse',
        type: 'b_roll',
        startSeconds: 0,
        durationSeconds: 24,
        sourceUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
        color: '#4f46e5',
      },
      {
        id: 'clip-cb-video-2',
        trackId: 'track-video',
        title: 'Schéma Whiteboard : Découplage Kafka',
        type: 'screen_recording',
        startSeconds: 24,
        durationSeconds: 26,
        sourceUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
        color: '#0284c7',
      },
      {
        id: 'clip-cb-video-3',
        trackId: 'track-video',
        title: 'Cluster Kubernetes Grafana Metrics',
        type: 'video',
        startSeconds: 50,
        durationSeconds: 30,
        sourceUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        color: '#10b981',
      },
      {
        id: 'clip-cb-avatar-1',
        trackId: 'track-avatar',
        title: 'Dr. Landry Bakweto - PiP Whiteboard',
        type: 'avatar',
        startSeconds: 2,
        durationSeconds: 20,
        sourceUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        color: '#8b5cf6',
        transform: { x: 34, y: 28, scale: 0.85, opacity: 1 },
      },
      {
        id: 'clip-cb-text-1',
        trackId: 'track-text',
        title: 'Titre Animaker Whiteboard',
        type: 'title_text',
        startSeconds: 1,
        durationSeconds: 18,
        textContent: 'Résilience Distribuée Cloud',
        textSubtitle: 'Tolérance aux pannes et SLA 99.99%',
        color: '#f59e0b',
      },
      {
        id: 'clip-cb-audio-1',
        trackId: 'track-audio',
        title: 'Synthwave Innovation BGM',
        type: 'music',
        startSeconds: 0,
        durationSeconds: 80,
        color: '#06b6d4',
      },
      {
        id: 'clip-cb-quiz-1',
        trackId: 'track-quiz',
        title: 'Arrêt Quiz : Circuit Breaker',
        type: 'interactive_quiz',
        startSeconds: 68,
        durationSeconds: 12,
        color: '#ec4899',
        quizData: {
          question: 'Que fait le pattern Circuit Breaker lorsqu\'un microservice distant commence à échouer en boucle ?',
          options: [
            'Il formate la base de données',
            'Il ouvre le circuit et renvoie un fallback immédiat sans surcharger le service défaillant',
            'Il double le nombre de requêtes pour insister',
          ],
          correctIndex: 1,
          explanation: 'Le Circuit Breaker protège l\'ensemble du système en stoppant immédiatement les appels vers un service saturé.',
        },
      },
    ],
  },
  {
    id: 'animaker-cyber-soc-project',
    title: 'Animaker Cyber : Détection d\'Intrusion & Architecture Zero Trust',
    topic: 'Cybersécurité Offensive, SOC & Blue Team',
    description: 'Modèle Animaker avec ambiance salle des opérations SOC, alertes visuelles et protocoles de défense.',
    targetAudience: 'Analystes SOC, Ingénieurs Sécurité & Administrateurs Systèmes',
    aspectRatio: '16:9',
    resolution: '1080p',
    fps: 30,
    totalDurationSeconds: 70,
    leadCharacterName: 'Malik Konaté',
    leadCharacterAvatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=300&auto=format&fit=crop&q=80',
    tracks: DEFAULT_TIMELINE_TRACKS,
    markers: [
      { id: 'm-cy-1', timeSeconds: 0, label: 'Salle des Opérations SOC', color: '#e11d48' },
      { id: 'm-cy-2', timeSeconds: 18, label: 'Analyse d\'une Injection SQL', color: '#f59e0b' },
      { id: 'm-cy-3', timeSeconds: 42, label: 'Application de la Remédiation', color: '#10b981' },
      { id: 'm-cy-4', timeSeconds: 58, label: 'Défi Interactif Cyber', color: '#ec4899' },
    ],
    clips: [
      {
        id: 'clip-cy-v1',
        trackId: 'track-video',
        title: 'Salle des Opérations Cybersécurité (SOC)',
        type: 'b_roll',
        startSeconds: 0,
        durationSeconds: 22,
        sourceUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
        color: '#e11d48',
      },
      {
        id: 'clip-cy-v2',
        trackId: 'track-video',
        title: 'Terminal de Pentest & Wireshark',
        type: 'screen_recording',
        startSeconds: 22,
        durationSeconds: 24,
        sourceUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
        color: '#f59e0b',
      },
      {
        id: 'clip-cy-v3',
        trackId: 'track-video',
        title: 'Dashboard SIEM & Pare-feu WAF',
        type: 'video',
        startSeconds: 46,
        durationSeconds: 24,
        sourceUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
        color: '#10b981',
      },
      {
        id: 'clip-cy-avatar',
        trackId: 'track-avatar',
        title: 'Malik Konaté - Expert SOC',
        type: 'avatar',
        startSeconds: 2,
        durationSeconds: 18,
        sourceUrl: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=300&auto=format&fit=crop&q=80',
        color: '#e11d48',
        transform: { x: 34, y: 28, scale: 0.85, opacity: 1 },
      },
      {
        id: 'clip-cy-title',
        trackId: 'track-text',
        title: 'Lower Third : Cyber Défense',
        type: 'title_text',
        startSeconds: 1,
        durationSeconds: 16,
        textContent: 'Posture Zero Trust & SOC',
        textSubtitle: 'Ne jamais faire confiance, toujours vérifier',
        color: '#f59e0b',
      },
      {
        id: 'clip-cy-audio',
        trackId: 'track-audio',
        title: 'Tension & Techno Ambiance',
        type: 'music',
        startSeconds: 0,
        durationSeconds: 70,
        color: '#06b6d4',
      },
      {
        id: 'clip-cy-quiz',
        trackId: 'track-quiz',
        title: 'Quiz Alerte SOC',
        type: 'interactive_quiz',
        startSeconds: 58,
        durationSeconds: 12,
        color: '#ec4899',
        quizData: {
          question: 'Quelle est la contre-mesure la plus efficace contre les injections SQL ?',
          options: [
            'Chiffrer les requêtes en Base64',
            'Utiliser des requêtes préparées avec paramètres typés (Prepared Statements)',
            'Bloquer tous les utilisateurs ayant des noms contenant des apostrophes',
          ],
          correctIndex: 1,
          explanation: 'Les Prepared Statements garantissent la stricte séparation entre le code SQL et les données fournies par l\'utilisateur.',
        },
      },
    ],
  },
  {
    id: 'animaker-micro-learning-project',
    title: 'Animaker Micro-Learning : Prompt Engineering & RAG en 60s',
    topic: 'Intelligence Artificielle Générative & Productivité',
    description: 'Format court et dynamique de micro-formation adapté aux écrans mobiles et révisions rapides.',
    targetAudience: 'Tous profils, Étudiants & Professionnels',
    aspectRatio: '16:9',
    resolution: '1080p',
    fps: 30,
    totalDurationSeconds: 60,
    leadCharacterName: 'AIDA la Mascotte IA',
    leadCharacterAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    tracks: DEFAULT_TIMELINE_TRACKS,
    markers: [
      { id: 'm-ml-1', timeSeconds: 0, label: 'L\'Anatomie d\'un Prompt Pro', color: '#0284c7' },
      { id: 'm-ml-2', timeSeconds: 22, label: 'Avant vs Après Prompting', color: '#f59e0b' },
      { id: 'm-ml-3', timeSeconds: 46, label: 'Mini-Défi Flash', color: '#ec4899' },
    ],
    clips: [
      {
        id: 'clip-ml-v1',
        trackId: 'track-video',
        title: 'Studio IA & Visualisation Énergétique',
        type: 'b_roll',
        startSeconds: 0,
        durationSeconds: 22,
        sourceUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
        color: '#0284c7',
      },
      {
        id: 'clip-ml-v2',
        trackId: 'track-video',
        title: 'Comparaison Prompting CoT / Few-Shot',
        type: 'screen_recording',
        startSeconds: 22,
        durationSeconds: 24,
        sourceUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80',
        color: '#f59e0b',
      },
      {
        id: 'clip-ml-v3',
        trackId: 'track-video',
        title: 'Succès & Génération Structurée JSON',
        type: 'video',
        startSeconds: 46,
        durationSeconds: 14,
        sourceUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
        color: '#10b981',
      },
      {
        id: 'clip-ml-avatar',
        trackId: 'track-avatar',
        title: 'AIDA Mascotte - PiP Express',
        type: 'avatar',
        startSeconds: 1,
        durationSeconds: 18,
        sourceUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
        color: '#0284c7',
        transform: { x: 34, y: 28, scale: 0.85, opacity: 1 },
      },
      {
        id: 'clip-ml-text',
        trackId: 'track-text',
        title: 'Flash Tip Animaker',
        type: 'title_text',
        startSeconds: 1,
        durationSeconds: 15,
        textContent: 'Anatomie du Prompting : Rôle + Contexte + Format',
        textSubtitle: 'Exigez toujours des sorties JSON strictes',
        color: '#f59e0b',
      },
      {
        id: 'clip-ml-audio',
        trackId: 'track-audio',
        title: 'Beat Dynamique Énergique',
        type: 'music',
        startSeconds: 0,
        durationSeconds: 60,
        color: '#06b6d4',
      },
      {
        id: 'clip-ml-quiz',
        trackId: 'track-quiz',
        title: 'Flash Quiz 10s',
        type: 'interactive_quiz',
        startSeconds: 48,
        durationSeconds: 12,
        color: '#ec4899',
        quizData: {
          question: 'Que signifie la technique de Prompting "Chain of Thought" (CoT) ?',
          options: [
            'Forcer le modèle à réfléchir étape par étape avant d\'énoncer la conclusion',
            'Traduire le prompt en latin',
            'Connecter plusieurs GPU physiquement avec une chaîne',
          ],
          correctIndex: 0,
          explanation: 'La décomposition en étapes de raisonnement explicites réduit drastiquement les erreurs logiques.',
        },
      },
    ],
  },
];


