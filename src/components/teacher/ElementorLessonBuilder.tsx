import React, { useState } from 'react';
import {
  Lesson,
  ElementorBlock,
  ElementorBlockType,
  NanoBananaLesson,
  LessonResource,
  PresentationSlide
} from '../../types';
import { NANO_BANANA_TEMPLATES } from '../../data/templatesData';
import { NanoBananaPlayer } from './NanoBananaPlayer';
import { PresentationPlayer } from './PresentationPlayer';
import { MediaAssetPickerModal } from './MediaAssetPickerModal';
import {
  Sparkles,
  Heading,
  Type,
  Video,
  Music,
  Code2,
  AlertCircle,
  HelpCircle,
  FolderDown,
  Image as ImageIcon,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Plus,
  Play,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Settings,
  Save,
  ArrowLeft,
  Wand2,
  Terminal,
  FileText,
  Lightbulb,
  Check,
  RotateCcw,
  List,
  Layers,
  Sliders,
  Maximize2,
  Presentation,
  UploadCloud,
  ImagePlus,
  FileUp,
  Download,
  ExternalLink,
  ZoomIn
} from 'lucide-react';

interface ElementorLessonBuilderProps {
  lesson: Lesson;
  chapterTitle?: string;
  courseTitle?: string;
  onSaveLesson: (updatedLesson: Lesson) => void;
  onBack: () => void;
}

export const ElementorLessonBuilder: React.FC<ElementorLessonBuilderProps> = ({
  lesson,
  chapterTitle = 'Module de Formation',
  courseTitle = 'Programme ITECH',
  onSaveLesson,
  onBack,
}) => {
  // Lesson General Info
  const [lessonTitle, setLessonTitle] = useState(lesson.title);
  const [durationMinutes, setDurationMinutes] = useState(lesson.durationMinutes || 15);
  const [lessonType, setLessonType] = useState(lesson.type);

  // Elementor Visual Blocks Hierarchy
  const [blocks, setBlocks] = useState<ElementorBlock[]>(() => {
    if (lesson.blocks && lesson.blocks.length > 0) {
      return lesson.blocks;
    }
    // Default initial blocks if no blocks exist yet
    const initial: ElementorBlock[] = [];

    // Add initial heading
    initial.push({
      id: `blk-head-${Date.now()}`,
      type: 'heading',
      title: lesson.title,
      content: 'Objectifs d\'apprentissage et mise en contexte pratique.',
      headingLevel: 'h1',
    });

    if (lesson.type === 'video' || lesson.videoUrl) {
      initial.push({
        id: `blk-vid-${Date.now() + 1}`,
        type: 'video',
        title: 'Vidéo explicative principale',
        videoUrl: lesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      });
    }

    if (lesson.type === 'animated_nano_banana' || lesson.nanoBananaData) {
      initial.push({
        id: `blk-nb-${Date.now() + 2}`,
        type: 'nano_banana',
        title: 'Micro-Leçon Visuelle Nano Banana',
        nanoBananaData: lesson.nanoBananaData || NANO_BANANA_TEMPLATES[0],
      });
    }

    if (lesson.content) {
      initial.push({
        id: `blk-txt-${Date.now() + 3}`,
        type: 'text',
        content: lesson.content,
      });
    }

    if (lesson.type === 'interactive_code' || lesson.codeStarter) {
      initial.push({
        id: `blk-code-${Date.now() + 4}`,
        type: 'code',
        title: 'Atelier de Code & Implémentation',
        codeLanguage: lesson.codeLanguage || 'typescript',
        codeContent: lesson.codeStarter || `// Écrivez votre solution ici\nfunction solveChallenge() {\n  return true;\n}`,
      });
    }

    if (lesson.type === 'presentation') {
      initial.push({
        id: `blk-pres-${Date.now() + 2}`,
        type: 'presentation',
        title: 'Diaporama & Support de Présentation (PowerPoint)',
        content: 'Support officiel de la séance avec diapositives interactives et téléchargement.',
        presentationData: {
          fileName: 'Support_Presentation_Module.pptx',
          fileSize: '4.8 MB',
          format: 'pptx',
          slideCount: 3,
          slides: [
            {
              title: '1. Objectifs & Cadre Méthodologique',
              content: '• Contextualisation du problème en entreprise\n• Objectifs pédagogiques opérationnels\n• Livrables et critères de succès de la session',
              speakerNotes: 'Bien insister sur l\'importance de la modélisation avant toute phase de code.',
            },
            {
              title: '2. Architecture Technique & Schéma des Flux',
              content: '• Découpage modulaire du système\n• Traitement des requêtes en flux continu\n• Bonnes pratiques de scalabilité et de sécurité',
              speakerNotes: 'Détailler chaque composant en précisant son contrat d\'interface.',
            },
            {
              title: '3. Synthèse des Acquis & Atelier Pratique',
              content: '• Points clés à retenir impérativement\n• Pièges courants rencontrés sur le terrain\n• Passage immédiat à l\'atelier pratique guidé',
              speakerNotes: 'Laisser 5 minutes pour les questions avant de lancer l\'atelier.',
            },
          ],
        },
      });
    }

    // Callout tip
    initial.push({
      id: `blk-call-${Date.now() + 5}`,
      type: 'callout',
      title: 'Point Clé & Méthodologie',
      content: 'Appliquez immédiatement les concepts vus dans cette leçon sur votre projet fil rouge.',
      calloutType: 'tip',
    });

    return initial;
  });

  // Selected Block for Sidebar Inspector
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(blocks[0]?.id || null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'widgets' | 'inspector' | 'ai'>('widgets');

  // Preview device mode: 'desktop' | 'tablet' | 'mobile'
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Nano Banana tester modal
  const [previewNanoBanana, setPreviewNanoBanana] = useState<NanoBananaLesson | null>(null);

  // AI Prompt Modal
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Modal for Media/Presentation upload & presets
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{
    isOpen: boolean;
    blockId: string;
    mode: 'image' | 'presentation';
    title: string;
  } | null>(null);

  // Lightbox Zoom Image Modal
  const [zoomedImage, setZoomedImage] = useState<{ url: string; caption?: string } | null>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // WIDGET PALETTE DEFINITIONS
  const widgetPalette: {
    type: ElementorBlockType;
    label: string;
    description: string;
    icon: any;
    category: 'base' | 'media' | 'pedagogy' | 'interactive';
    badge?: string;
  }[] = [
    {
      type: 'heading',
      label: 'Titre & Sous-titre',
      description: 'Balises H1, H2, H3 avec accroche',
      icon: Heading,
      category: 'base',
    },
    {
      type: 'text',
      label: 'Éditeur de Texte',
      description: 'Paragraphes riches & markdown',
      icon: Type,
      category: 'base',
    },
    {
      type: 'presentation',
      label: 'PowerPoint & Diaporama',
      description: 'Présentations PPTX, PPT, PDF & Slides',
      icon: Presentation,
      category: 'media',
      badge: 'PPTX / PDF',
    },
    {
      type: 'image',
      label: 'Image & Schéma',
      description: 'Diagrammes, captures et infographies',
      icon: ImageIcon,
      category: 'media',
      badge: 'Upload & Galerie',
    },
    {
      type: 'video',
      label: 'Lecteur Vidéo',
      description: 'YouTube, Vimeo ou flux MP4',
      icon: Video,
      category: 'media',
    },
    {
      type: 'audio',
      label: 'Lecteur Audio / Podcast',
      description: 'Explications sonores & transcriptions',
      icon: Music,
      category: 'media',
    },
    {
      type: 'code',
      label: 'Bac à Sable de Code',
      description: 'Éditeur interactif avec console',
      icon: Code2,
      category: 'pedagogy',
      badge: 'Interactif',
    },
    {
      type: 'callout',
      label: 'Boîte d\'Alerte / Callout',
      description: 'Astuces, avertissements, mémos',
      icon: AlertCircle,
      category: 'pedagogy',
    },
    {
      type: 'accordion',
      label: 'Accordéon / FAQ',
      description: 'Blocs déroulants pas-à-pas',
      icon: List,
      category: 'pedagogy',
    },
    {
      type: 'nano_banana',
      label: 'Micro-Leçon Nano Banana',
      description: 'Animation pédagogique ultra-visuelle',
      icon: Sparkles,
      category: 'interactive',
      badge: 'IA 2D',
    },
    {
      type: 'quiz',
      label: 'Mini-Quiz / Flashcard',
      description: 'Question d\'auto-évaluation immédiate',
      icon: HelpCircle,
      category: 'interactive',
    },
    {
      type: 'resources',
      label: 'Téléchargement Fichier',
      description: 'PDF, datasets, slides, fiches',
      icon: FolderDown,
      category: 'interactive',
    },
  ];

  // ADD NEW BLOCK
  const handleAddBlock = (type: ElementorBlockType, insertIndex?: number) => {
    let newBlock: ElementorBlock = {
      id: `blk-${type}-${Date.now()}`,
      type,
    };

    switch (type) {
      case 'heading':
        newBlock.title = 'Nouveau Titre de Section';
        newBlock.content = 'Sous-titre descriptif pour guider l\'apprenant.';
        newBlock.headingLevel = 'h2';
        break;
      case 'text':
        newBlock.content = 'Rédigez ici les explications théoriques, les études de cas et les consignes pédagogiques.';
        break;
      case 'presentation':
        newBlock.title = 'Support de Présentation PowerPoint (PPTX)';
        newBlock.content = 'Diaporama pédagogique officiel du module avec support de cours.';
        newBlock.presentationData = {
          fileName: 'Support_Presentation_Module.pptx',
          fileSize: '4.8 MB',
          format: 'pptx',
          slideCount: 3,
          slides: [
            {
              title: '1. Objectifs & Cadre Méthodologique',
              content: '• Contexte technologique et méthodologique\n• Objectifs de la session d\'apprentissage\n• Prérequis et livrables attendus',
              speakerNotes: 'Bien insister sur l\'alignement entre théorie et cas concret.',
            },
            {
              title: '2. Architecture Conceptuelle & Flux de Données',
              content: '• Découpage modulaire du système\n• Flux de données asynchrones\n• Bonnes pratiques de conception logicielle',
              speakerNotes: 'Présenter chaque composant en détaillant son contrat d\'interface.',
            },
            {
              title: '3. Synthèse, Bonnes Pratiques & Exercice',
              content: '• Étude de cas sur projet de référence\n• Points de vigilance et pièges courants\n• Métriques d\'évaluation de la performance',
              speakerNotes: 'Laisser 5 minutes aux apprenants pour poser des questions avant le TP.',
            },
          ],
        };
        break;
      case 'image':
        newBlock.title = 'Schéma d\'Architecture & Illustration Pédagogique';
        newBlock.imageUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80';
        newBlock.imageCaption = 'Figure 1.1 : Vue d\'ensemble de l\'architecture et du flux logique';
        newBlock.imageSize = 'full';
        newBlock.imageAlign = 'center';
        break;
      case 'video':
        newBlock.title = 'Vidéo de Démonstration';
        newBlock.videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
        break;
      case 'audio':
        newBlock.title = 'Synthèse Audio du Formateur';
        newBlock.audioUrl = 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg';
        break;
      case 'code':
        newBlock.title = 'Exercice de Programmation';
        newBlock.codeLanguage = 'typescript';
        newBlock.codeContent = `// Implémentez la fonction suivante\nfunction processData(items: string[]): string[] {\n  return items.map(x => x.toUpperCase());\n}`;
        break;
      case 'callout':
        newBlock.title = 'Conseil du Formateur';
        newBlock.content = 'Veillez à bien tester les cas limites lors de l\'exécution de cet algorithme.';
        newBlock.calloutType = 'tip';
        break;
      case 'accordion':
        newBlock.title = 'Étapes détaillées de résolution';
        newBlock.accordionItems = [
          { title: 'Étape 1 : Analyse des spécifications', content: 'Identifiez les entrées et les sorties attendues.' },
          { title: 'Étape 2 : Écriture de la logique cœur', content: 'Développez l\'algorithme pas à pas sans sur-optimiser.' },
          { title: 'Étape 3 : Validation et tests automatisés', content: 'Exécutez la suite de tests unitaires pour valider.' }
        ];
        break;
      case 'nano_banana':
        newBlock.title = 'Animation Visuelle Nano Banana';
        newBlock.nanoBananaData = NANO_BANANA_TEMPLATES[0];
        break;
      case 'quiz':
        newBlock.title = 'Auto-Évaluation Immédiate';
        newBlock.quizQuestion = {
          question: 'Quel est l\'avantage principal de cette approche ?',
          options: [
            'Elle réduit la complexité temporelle',
            'Elle supprime le besoin de mémoire',
            'Elle rend le code illisible',
            'Aucune de ces réponses'
          ],
          correctIndex: 0,
          explanation: 'La décomposition modulaire permet d\'atteindre une complexité quasi-linéaire tout en facilitant la maintenance.'
        };
        break;
      case 'resources':
        newBlock.title = 'Fichiers Sources & Datasets';
        newBlock.resources = [
          { id: 'res-1', title: 'Support de cours complet (PDF)', type: 'pdf', url: '#', fileSize: '3.2 MB' },
          { id: 'res-2', title: 'Dépôt GitHub du TP', type: 'github', url: 'https://github.com', fileSize: 'Repo Git' }
        ];
        break;
      default:
        break;
    }

    if (insertIndex !== undefined && insertIndex >= 0) {
      const updated = [...blocks];
      updated.splice(insertIndex + 1, 0, newBlock);
      setBlocks(updated);
    } else {
      setBlocks([...blocks, newBlock]);
    }

    setSelectedBlockId(newBlock.id);
    setActiveSidebarTab('inspector');
  };

  // UPDATE BLOCK IN STATE
  const handleUpdateBlock = (id: string, updates: Partial<ElementorBlock>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  // DELETE BLOCK
  const handleDeleteBlock = (id: string) => {
    const updated = blocks.filter((b) => b.id !== id);
    setBlocks(updated);
    if (selectedBlockId === id) {
      setSelectedBlockId(updated[0]?.id || null);
    }
  };

  // DUPLICATE BLOCK
  const handleDuplicateBlock = (id: string) => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    const target = blocks[index];
    const clone: ElementorBlock = {
      ...JSON.parse(JSON.stringify(target)),
      id: `blk-${target.type}-${Date.now()}`,
      title: target.title ? `${target.title} (Copie)` : undefined,
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, clone);
    setBlocks(updated);
    setSelectedBlockId(clone.id);
  };

  // MOVE BLOCK UP / DOWN
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const updated = [...blocks];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      setBlocks(updated);
    } else if (direction === 'down' && index < blocks.length - 1) {
      const updated = [...blocks];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      setBlocks(updated);
    }
  };

  // AI ASSISTANT CONTENT GENERATOR
  const handleGenerateAIBlocks = () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAI(true);

    setTimeout(() => {
      const topic = aiPrompt.trim();
      const generatedBlocks: ElementorBlock[] = [
        {
          id: `blk-gen-head-${Date.now()}`,
          type: 'heading',
          title: `Maîtrise : ${topic}`,
          content: 'Guide complet généré par l\'IA avec théorie, cas d\'usage et exercice d\'application.',
          headingLevel: 'h1',
        },
        {
          id: `blk-gen-call-${Date.now()}`,
          type: 'callout',
          title: 'Objectif Pédagogique Clé',
          content: `À la fin de cette leçon, vous saurez concevoir, structurer et déployer des solutions basées sur ${topic}.`,
          calloutType: 'info',
        },
        {
          id: `blk-gen-text-${Date.now()}`,
          type: 'text',
          content: `Les principes fondamentaux de **${topic}** reposent sur une architecture éprouvée. En découpant le problème en composants modulaires, on garantit une haute résilience et une évolutivité sans friction.\n\nPrenez le temps d'observer le bloc de code interactif ci-dessous pour appréhender la syntaxe recommandée.`,
        },
        {
          id: `blk-gen-code-${Date.now()}`,
          type: 'code',
          title: `Exemple Pratique : ${topic}`,
          codeLanguage: 'typescript',
          codeContent: `// Démonstration pratique - ${topic}\nexport async function runExample(): Promise<void> {\n  console.log("Initialisation du pipeline : ${topic}");\n  const status = await executePipeline();\n  console.log("Résultat :", status);\n}`,
        },
        {
          id: `blk-gen-nb-${Date.now()}`,
          type: 'nano_banana',
          title: `Comprendre ${topic} en 3 minutes (Nano Banana)`,
          nanoBananaData: NANO_BANANA_TEMPLATES[0],
        },
        {
          id: `blk-gen-quiz-${Date.now()}`,
          type: 'quiz',
          title: `Quiz Flash : Validez vos acquis sur ${topic}`,
          quizQuestion: {
            question: `Quelle est la règle d'or lors de la mise en œuvre de ${topic} ?`,
            options: [
              'Toujours découpler la logique métier de la persistance',
              'Écrire tout le code dans un seul fichier sans typage',
              'Désactiver la journalisation des erreurs',
              'Ignorer les tests de performance'
            ],
            correctIndex: 0,
            explanation: 'Le découplage assure une testabilité maximale et simplifie grandement les évolutions futures.'
          }
        }
      ];

      setBlocks(generatedBlocks);
      setIsGeneratingAI(false);
      setAiPrompt('');
      setActiveSidebarTab('widgets');
      setSelectedBlockId(generatedBlocks[0].id);
    }, 900);
  };

  // SAVE LESSON
  const handleSave = () => {
    // Generate text content representation from blocks for backward compatibility
    const textRepresentation = blocks
      .map((b) => {
        if (b.type === 'heading') return `## ${b.title}\n${b.content || ''}`;
        if (b.type === 'text') return b.content;
        if (b.type === 'callout') return `> [!${b.calloutType || 'TIP'}]\n> **${b.title || 'Note'}**\n> ${b.content}`;
        if (b.type === 'code') return `\`\`\`${b.codeLanguage || 'typescript'}\n${b.codeContent}\n\`\`\``;
        return b.content || '';
      })
      .filter(Boolean)
      .join('\n\n');

    const updated: Lesson = {
      ...lesson,
      title: lessonTitle,
      durationMinutes,
      type: lessonType,
      content: textRepresentation || lesson.content,
      blocks,
      videoUrl: blocks.find((b) => b.type === 'video')?.videoUrl || lesson.videoUrl,
      nanoBananaData: blocks.find((b) => b.type === 'nano_banana')?.nanoBananaData || lesson.nanoBananaData,
    };

    onSaveLesson(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div id="elementor-lesson-builder" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* NANO BANANA PREVIEW MODAL */}
      {previewNanoBanana && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <NanoBananaPlayer
              lesson={previewNanoBanana}
              onClose={() => setPreviewNanoBanana(null)}
              onComplete={() => setPreviewNanoBanana(null)}
            />
          </div>
        </div>
      )}

      {/* MEDIA ASSET PICKER MODAL (IMAGES & POWERPOINT PPTX/PDF) */}
      {mediaPickerConfig && (
        <MediaAssetPickerModal
          isOpen={mediaPickerConfig.isOpen}
          mode={mediaPickerConfig.mode}
          title={mediaPickerConfig.title}
          onClose={() => setMediaPickerConfig(null)}
          onSelectMedia={(media) => {
            const targetBlock = blocks.find((b) => b.id === mediaPickerConfig.blockId);
            if (media.type === 'image') {
              handleUpdateBlock(mediaPickerConfig.blockId, {
                imageUrl: media.url,
                title: targetBlock?.title || media.title || 'Schéma Illustratif',
                imageCaption: media.caption || targetBlock?.imageCaption || media.title,
              });
            } else if (media.type === 'presentation') {
              handleUpdateBlock(mediaPickerConfig.blockId, {
                title: media.title || targetBlock?.title || 'Support PowerPoint',
                content: media.caption || targetBlock?.content,
                presentationData: {
                  fileName: media.fileName || 'Diaporama.pptx',
                  fileSize: media.fileSize || '4.5 MB',
                  format: (media.format as any) || 'pptx',
                  fileUrl: media.url,
                  embedUrl: media.embedUrl,
                  slideCount: media.slides ? media.slides.length : (targetBlock?.presentationData?.slides?.length || 3),
                  slides: media.slides || targetBlock?.presentationData?.slides || [],
                },
              });
            }
            setMediaPickerConfig(null);
          }}
        />
      )}

      {/* LIGHTBOX IMAGE ZOOM MODAL */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-4 flex flex-col items-center gap-3 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="font-bold text-white truncate">{zoomedImage.caption || 'Aperçu Image'}</span>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
              >
                Fermer (✕)
              </button>
            </div>
            <img
              src={zoomedImage.url}
              alt={zoomedImage.caption || 'Zoom'}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
            />
            {zoomedImage.caption && (
              <p className="text-xs text-slate-400 italic text-center px-4">{zoomedImage.caption}</p>
            )}
          </div>
        </div>
      )}

      {/* TOP ELEMENTOR NAV BAR */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 z-30">
        {/* Left: Back & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Retour au plan du cours (MasterStudy)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Curriculum MasterStudy</span>
          </button>

          <div className="hidden md:block h-6 w-px bg-slate-800" />

          <div className="min-w-0">
            <div className="text-[11px] text-indigo-400 font-semibold truncate flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 text-[10px] font-black uppercase">
                Constructeur Elementor
              </span>
              <span className="text-slate-400">• {courseTitle} • {chapterTitle}</span>
            </div>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              className="font-extrabold text-sm sm:text-base text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none w-full max-w-md truncate"
              placeholder="Titre de la leçon..."
            />
          </div>
        </div>

        {/* Center: Device Switcher & Preview Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              deviceMode === 'desktop' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Vue Ordinateur (Plein écran)"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px]">PC</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              deviceMode === 'tablet' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Vue Tablette (768px)"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px]">Tablette</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
              deviceMode === 'mobile' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Vue Mobile (390px)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px]">Mobile</span>
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isPreviewMode ? 'bg-teal-500 text-slate-950' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{isPreviewMode ? 'Mode Éditeur' : 'Aperçu Apprenant'}</span>
          </button>
        </div>

        {/* Right: Save & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-300 hidden sm:flex">
            <span className="text-slate-400">Durée :</span>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-10 bg-transparent text-center font-bold text-indigo-400 focus:outline-none"
            />
            <span className="text-slate-400">min</span>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-indigo-900/40 transition-all hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer la Leçon</span>
          </button>
        </div>
      </header>

      {/* SAVE TOAST NOTIFICATION */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span>Leçon enregistrée et synchronisée avec le cours MasterStudy !</span>
        </div>
      )}

      {/* MAIN BUILDER BODY (Left Sidebar + Center Canvas) */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT ELEMENTOR TOOLBAR & INSPECTOR (Visible only when not in preview mode) */}
        {!isPreviewMode && (
          <aside className="w-80 sm:w-96 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-20 overflow-hidden">
            {/* Sidebar Navigation Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950 p-2 gap-1">
              <button
                onClick={() => setActiveSidebarTab('widgets')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  activeSidebarTab === 'widgets'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Blocs & Widgets</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('inspector')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  activeSidebarTab === 'inspector'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Propriétés</span>
              </button>

              <button
                onClick={() => setActiveSidebarTab('ai')}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                  activeSidebarTab === 'ai'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'text-purple-400 hover:text-purple-300 hover:bg-slate-900'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>IA</span>
              </button>
            </div>

            {/* TAB 1: WIDGET PALETTE */}
            {activeSidebarTab === 'widgets' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Bases & Typographie
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {widgetPalette
                      .filter((w) => w.category === 'base')
                      .map((w) => {
                        const Icon = w.icon;
                        return (
                          <button
                            key={w.type}
                            onClick={() => handleAddBlock(w.type)}
                            className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800/80 transition-all text-left group flex flex-col justify-between h-24"
                          >
                            <div className="flex items-center justify-between">
                              <div className="w-7 h-7 rounded-xl bg-indigo-900/50 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon className="w-4 h-4" />
                              </div>
                              <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200 group-hover:text-white">{w.label}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{w.description}</p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    Médias & Audio
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {widgetPalette
                      .filter((w) => w.category === 'media')
                      .map((w) => {
                        const Icon = w.icon;
                        return (
                          <button
                            key={w.type}
                            onClick={() => handleAddBlock(w.type)}
                            className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-teal-500 hover:bg-slate-800/80 transition-all text-left group flex flex-col justify-between h-24"
                          >
                            <div className="flex items-center justify-between">
                              <div className="w-7 h-7 rounded-xl bg-teal-900/50 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon className="w-4 h-4" />
                              </div>
                              <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200 group-hover:text-white">{w.label}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{w.description}</p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Pédagogie & Code
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {widgetPalette
                      .filter((w) => w.category === 'pedagogy')
                      .map((w) => {
                        const Icon = w.icon;
                        return (
                          <button
                            key={w.type}
                            onClick={() => handleAddBlock(w.type)}
                            className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500 hover:bg-slate-800/80 transition-all text-left group flex flex-col justify-between h-24"
                          >
                            <div className="flex items-center justify-between">
                              <div className="w-7 h-7 rounded-xl bg-emerald-900/50 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon className="w-4 h-4" />
                              </div>
                              {w.badge && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300">
                                  {w.badge}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200 group-hover:text-white">{w.label}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{w.description}</p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Interactif & Nano Banana
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {widgetPalette
                      .filter((w) => w.category === 'interactive')
                      .map((w) => {
                        const Icon = w.icon;
                        return (
                          <button
                            key={w.type}
                            onClick={() => handleAddBlock(w.type)}
                            className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500 hover:bg-slate-800/80 transition-all text-left group flex flex-col justify-between h-24"
                          >
                            <div className="flex items-center justify-between">
                              <div className="w-7 h-7 rounded-xl bg-amber-900/50 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon className="w-4 h-4" />
                              </div>
                              {w.badge && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-300">
                                  {w.badge}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200 group-hover:text-white">{w.label}</p>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{w.description}</p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INSPECTOR (PROPERTIES OF SELECTED BLOCK) */}
            {activeSidebarTab === 'inspector' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedBlock ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-black uppercase text-indigo-400">
                          Élément Sélectionné
                        </span>
                        <h4 className="text-sm font-bold text-white uppercase">{selectedBlock.type}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicateBlock(selectedBlock.id)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                          title="Dupliquer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlock(selectedBlock.id)}
                          className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:text-rose-200"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Inspector Form based on Block Type */}
                    {selectedBlock.type === 'heading' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Titre</label>
                          <input
                            type="text"
                            value={selectedBlock.title || ''}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Sous-Titre / Contexte</label>
                          <input
                            type="text"
                            value={selectedBlock.content || ''}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { content: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Niveau de Balise</label>
                          <select
                            value={selectedBlock.headingLevel || 'h2'}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { headingLevel: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                          >
                            <option value="h1">Titre Principal H1</option>
                            <option value="h2">Section H2</option>
                            <option value="h3">Sous-section H3</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {selectedBlock.type === 'text' && (
                      <div className="space-y-3">
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Contenu Formaté (Markdown / Texte)</label>
                        <textarea
                          rows={8}
                          value={selectedBlock.content || ''}
                          onChange={(e) => handleUpdateBlock(selectedBlock.id, { content: e.target.value })}
                          className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed focus:border-indigo-500 focus:outline-none resize-none font-sans"
                        />
                      </div>
                    )}

                    {selectedBlock.type === 'callout' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Type d'Alerte</label>
                          <select
                            value={selectedBlock.calloutType || 'info'}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { calloutType: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                          >
                            <option value="info">Information (Bleu)</option>
                            <option value="tip">Astuce / Conseil (Ambre)</option>
                            <option value="warning">Avertissement (Rose / Rouge)</option>
                            <option value="success">Validation / Succès (Vert)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Titre de la Boîte</label>
                          <input
                            type="text"
                            value={selectedBlock.title || ''}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Message</label>
                          <textarea
                            rows={4}
                            value={selectedBlock.content || ''}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { content: e.target.value })}
                            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {selectedBlock.type === 'code' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Titre du Défi / Bloc</label>
                          <input
                            type="text"
                            value={selectedBlock.title || ''}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Langage</label>
                          <select
                            value={selectedBlock.codeLanguage || 'typescript'}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { codeLanguage: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                          >
                            <option value="typescript">TypeScript</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="html">HTML / CSS</option>
                            <option value="sql">SQL Database</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Code Initial (Starter)</label>
                          <textarea
                            rows={8}
                            value={selectedBlock.codeContent || ''}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { codeContent: e.target.value })}
                            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 focus:outline-none resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {selectedBlock.type === 'video' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Titre de la Vidéo</label>
                          <input
                            type="text"
                            value={selectedBlock.title || ''}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">URL d'Intégration (YouTube / Vimeo / MP4)</label>
                          <input
                            type="url"
                            value={selectedBlock.videoUrl || ''}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { videoUrl: e.target.value })}
                            placeholder="https://www.youtube.com/embed/..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* INSPECTOR: IMAGE BLOCK */}
                    {selectedBlock.type === 'image' && (
                      <div className="space-y-4">
                        {/* Image Preview & Upload Triggers */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                            Image Actuelle
                          </label>
                          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
                            {selectedBlock.imageUrl ? (
                              <img
                                src={selectedBlock.imageUrl}
                                alt={selectedBlock.imageCaption || 'Aperçu'}
                                className="w-full h-36 object-cover"
                              />
                            ) : (
                              <div className="h-32 flex flex-col items-center justify-center text-slate-500 gap-1.5">
                                <ImageIcon className="w-8 h-8 text-slate-600" />
                                <span className="text-[11px]">Aucune image sélectionnée</span>
                              </div>
                            )}
                            <div className="p-2.5 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setMediaPickerConfig({
                                    isOpen: true,
                                    blockId: selectedBlock.id,
                                    mode: 'image',
                                    title: 'Importer ou Sélectionner une Image',
                                  })
                                }
                                className="flex-1 py-1.5 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                              >
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>Importer / Galerie ITECH</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Quick Direct Upload Input */}
                        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Téléverser depuis votre appareil :
                          </span>
                          <label className="w-full py-2 px-3 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-950/20 hover:bg-indigo-950/40 text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                            <ImagePlus className="w-4 h-4 text-indigo-400" />
                            <span>Choisir un fichier (.png, .jpg, .webp)</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    handleUpdateBlock(selectedBlock.id, {
                                      imageUrl: reader.result as string,
                                      imageCaption: selectedBlock.imageCaption || file.name,
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {/* Image URL Input */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Ou URL de l'Image
                          </label>
                          <input
                            type="url"
                            value={selectedBlock.imageUrl || ''}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { imageUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        {/* Caption & Title */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Titre / Description du Schéma
                          </label>
                          <input
                            type="text"
                            value={selectedBlock.title || ''}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { title: e.target.value })}
                            placeholder="Titre de la figure..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Légende Détaillée (affichée sous l'image)
                          </label>
                          <input
                            type="text"
                            value={selectedBlock.imageCaption || ''}
                            onChange={(e) => handleUpdateBlock(selectedBlock.id, { imageCaption: e.target.value })}
                            placeholder="Figure 1.1 : Schéma d'architecture..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        {/* Image Size & Alignment Controls */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Taille</label>
                            <select
                              value={selectedBlock.imageSize || 'full'}
                              onChange={(e) => handleUpdateBlock(selectedBlock.id, { imageSize: e.target.value as any })}
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                            >
                              <option value="full">Pleine largeur (100%)</option>
                              <option value="medium">Format Moyen (75%)</option>
                              <option value="small">Format Compact (50%)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-400 mb-1">Alignement</label>
                            <select
                              value={selectedBlock.imageAlign || 'center'}
                              onChange={(e) => handleUpdateBlock(selectedBlock.id, { imageAlign: e.target.value as any })}
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                            >
                              <option value="center">Centré</option>
                              <option value="left">Gauche</option>
                              <option value="right">Droite</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* INSPECTOR: PRESENTATION & POWERPOINT BLOCK */}
                    {selectedBlock.type === 'presentation' && (
                      <div className="space-y-4">
                        {/* Summary Header */}
                        <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/60 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                              <Presentation className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">
                                {selectedBlock.presentationData?.fileName || 'Diaporama.pptx'}
                              </span>
                              <span className="text-[10px] text-amber-300">
                                {selectedBlock.presentationData?.fileSize || '4.8 MB'} • {selectedBlock.presentationData?.slides?.length || 3} Diapositives
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            {selectedBlock.presentationData?.format?.toUpperCase() || 'PPTX'}
                          </span>
                        </div>

                        {/* Import / Upload Trigger */}
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() =>
                              setMediaPickerConfig({
                                isOpen: true,
                                blockId: selectedBlock.id,
                                mode: 'presentation',
                                title: 'Importer une Présentation PowerPoint (.pptx) ou PDF',
                              })
                            }
                            className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          >
                            <FileUp className="w-4 h-4 text-slate-950" />
                            <span>Importer Fichier PowerPoint (.pptx, .ppt, .pdf)</span>
                          </button>

                          <label className="w-full py-2 px-3 rounded-xl border border-dashed border-amber-500/40 bg-slate-950 hover:bg-amber-950/20 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                            <UploadCloud className="w-4 h-4 text-amber-400" />
                            <span>Téléverser depuis le disque local</span>
                            <input
                              type="file"
                              accept=".pptx,.ppt,.pdf"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
                                  const ext = file.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'pptx';
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    handleUpdateBlock(selectedBlock.id, {
                                      presentationData: {
                                        ...(selectedBlock.presentationData || {}),
                                        fileName: file.name,
                                        fileSize: `${sizeMb} MB`,
                                        format: ext as any,
                                        fileUrl: reader.result as string,
                                        slides: selectedBlock.presentationData?.slides || [],
                                      },
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {/* Embed URL (Office 365 / OneDrive / Google Slides) */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">
                            Lien d'Intégration Web (Google Slides / Office 365)
                          </label>
                          <input
                            type="url"
                            value={selectedBlock.presentationData?.embedUrl || ''}
                            onChange={(e) =>
                              handleUpdateBlock(selectedBlock.id, {
                                presentationData: {
                                  ...(selectedBlock.presentationData || {}),
                                  embedUrl: e.target.value,
                                },
                              })
                            }
                            placeholder="https://docs.google.com/presentation/d/.../embed"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-500 focus:outline-none"
                          />
                        </div>

                        {/* Slide Deck Content Editor */}
                        <div className="space-y-2.5 pt-2 border-t border-slate-800">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-black text-white uppercase tracking-wider">
                              Diapositives Interactives ({selectedBlock.presentationData?.slides?.length || 0})
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const currentSlides = selectedBlock.presentationData?.slides || [];
                                const newSlideIndex = currentSlides.length + 1;
                                const updated = [
                                  ...currentSlides,
                                  {
                                    title: `${newSlideIndex}. Nouvelle Diapositive`,
                                    content: '• Point clé 1\n• Point clé 2\n• Point clé 3',
                                    speakerNotes: 'Notes d\'animation du formateur...',
                                  },
                                ];
                                handleUpdateBlock(selectedBlock.id, {
                                  presentationData: {
                                    ...(selectedBlock.presentationData || {}),
                                    slides: updated,
                                    slideCount: updated.length,
                                  },
                                });
                              }}
                              className="px-2 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Diapo</span>
                            </button>
                          </div>

                          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                            {(selectedBlock.presentationData?.slides || []).map((slide, sIdx) => (
                              <div
                                key={sIdx}
                                className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-amber-300 text-[11px]">
                                    Diapositive {sIdx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (selectedBlock.presentationData?.slides || []).filter(
                                        (_, idx) => idx !== sIdx
                                      );
                                      handleUpdateBlock(selectedBlock.id, {
                                        presentationData: {
                                          ...(selectedBlock.presentationData || {}),
                                          slides: updated,
                                          slideCount: updated.length,
                                        },
                                      });
                                    }}
                                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                                    title="Supprimer cette diapositive"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                <input
                                  type="text"
                                  value={slide.title}
                                  onChange={(e) => {
                                    const updated = [...(selectedBlock.presentationData?.slides || [])];
                                    updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                                    handleUpdateBlock(selectedBlock.id, {
                                      presentationData: {
                                        ...(selectedBlock.presentationData || {}),
                                        slides: updated,
                                      },
                                    });
                                  }}
                                  placeholder="Titre de la diapositive..."
                                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                                />

                                <textarea
                                  rows={2}
                                  value={slide.content}
                                  onChange={(e) => {
                                    const updated = [...(selectedBlock.presentationData?.slides || [])];
                                    updated[sIdx] = { ...updated[sIdx], content: e.target.value };
                                    handleUpdateBlock(selectedBlock.id, {
                                      presentationData: {
                                        ...(selectedBlock.presentationData || {}),
                                        slides: updated,
                                      },
                                    });
                                  }}
                                  placeholder="Points clés (à puces)..."
                                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                                />

                                <input
                                  type="text"
                                  value={slide.speakerNotes || ''}
                                  onChange={(e) => {
                                    const updated = [...(selectedBlock.presentationData?.slides || [])];
                                    updated[sIdx] = { ...updated[sIdx], speakerNotes: e.target.value };
                                    handleUpdateBlock(selectedBlock.id, {
                                      presentationData: {
                                        ...(selectedBlock.presentationData || {}),
                                        slides: updated,
                                      },
                                    });
                                  }}
                                  placeholder="Notes orales d'explication..."
                                  className="w-full px-2 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-amber-200/80"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedBlock.type === 'quiz' && selectedBlock.quizQuestion && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Question d'Évaluation</label>
                          <input
                            type="text"
                            value={selectedBlock.quizQuestion.question}
                            onChange={(e) =>
                              handleUpdateBlock(selectedBlock.id, {
                                quizQuestion: { ...selectedBlock.quizQuestion!, question: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Choix de Réponses (4 options)</label>
                          <div className="space-y-1.5">
                            {selectedBlock.quizQuestion.options.map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${selectedBlock.id}`}
                                  checked={selectedBlock.quizQuestion?.correctIndex === oIdx}
                                  onChange={() =>
                                    handleUpdateBlock(selectedBlock.id, {
                                      quizQuestion: { ...selectedBlock.quizQuestion!, correctIndex: oIdx },
                                    })
                                  }
                                  className="text-indigo-600 focus:ring-0"
                                />
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const opts = [...selectedBlock.quizQuestion!.options];
                                    opts[oIdx] = e.target.value;
                                    handleUpdateBlock(selectedBlock.id, {
                                      quizQuestion: { ...selectedBlock.quizQuestion!, options: opts },
                                    });
                                  }}
                                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 mb-1">Explication Pédagogique</label>
                          <textarea
                            rows={3}
                            value={selectedBlock.quizQuestion.explanation}
                            onChange={(e) =>
                              handleUpdateBlock(selectedBlock.id, {
                                quizQuestion: { ...selectedBlock.quizQuestion!, explanation: e.target.value },
                              })
                            }
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                    <Sliders className="w-8 h-8 mx-auto text-slate-600" />
                    <p>Cliquez sur n'importe quel bloc dans la zone centrale pour modifier ses propriétés.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: AI LESSON GENERATOR */}
            {activeSidebarTab === 'ai' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/80 to-indigo-950/80 border border-purple-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h4 className="font-extrabold text-xs uppercase tracking-wider">Assistant Pédagogique Gemini</h4>
                  </div>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    Décrivez le sujet de votre leçon. L'IA concevra automatiquement l'enchaînement complet des blocs : Titre, Callout méthodologique, Synthèse textuelle, Atelier de code, Animation Nano Banana et Mini-Quiz.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">Sujet / Prompt de la Leçon</label>
                  <textarea
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ex: Les Attention Heads dans les Transformers avec PyTorch et cas pratique de Tokenization..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAIBlocks}
                  disabled={isGeneratingAI || !aiPrompt.trim()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 transition-all"
                >
                  {isGeneratingAI ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Génération des blocs en cours...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Générer la Leçon Complète</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </aside>
        )}

        {/* CENTER VISUAL CANVAS */}
        <main className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-8 flex justify-center">
          <div
            className={`transition-all duration-300 ${
              deviceMode === 'desktop'
                ? 'w-full max-w-4xl'
                : deviceMode === 'tablet'
                ? 'w-[768px] border-x border-slate-800 shadow-2xl bg-slate-900/40 p-4'
                : 'w-[390px] border-x border-slate-800 shadow-2xl bg-slate-900/40 p-3'
            }`}
          >
            {/* Canvas Header Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800/80 mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Structure de la Leçon ({blocks.length} Blocs Elementor)
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">{lessonTitle}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {durationMinutes} min • Visualisé en mode {deviceMode.toUpperCase()}
                </p>
              </div>

              {!isPreviewMode && (
                <button
                  onClick={() => handleAddBlock('heading')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-800/50 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un bloc</span>
                </button>
              )}
            </div>

            {/* Blocks List */}
            <div className="space-y-4">
              {blocks.map((block, index) => {
                const isSelected = selectedBlockId === block.id;

                return (
                  <div key={block.id} className="relative group">
                    {/* Top Insert Divider */}
                    {!isPreviewMode && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center my-1">
                        <div className="h-px bg-indigo-500/30 flex-1" />
                        <button
                          onClick={() => handleAddBlock('text', index - 1)}
                          className="px-2 py-0.5 rounded-full bg-indigo-900 text-indigo-300 text-[10px] font-bold border border-indigo-700 flex items-center gap-1 shadow-xs hover:bg-indigo-800"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          <span>Insérer ici</span>
                        </button>
                        <div className="h-px bg-indigo-500/30 flex-1" />
                      </div>
                    )}

                    {/* Block Wrapper Card */}
                    <div
                      onClick={() => {
                        if (!isPreviewMode) {
                          setSelectedBlockId(block.id);
                          setActiveSidebarTab('inspector');
                        }
                      }}
                      className={`relative rounded-2xl transition-all ${
                        isPreviewMode
                          ? 'bg-transparent'
                          : isSelected
                          ? 'ring-2 ring-indigo-500 bg-slate-900 shadow-xl'
                          : 'bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      {/* Elementor Hover Toolbar */}
                      {!isPreviewMode && (
                        <div className="absolute -top-3.5 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-700 rounded-xl px-2 py-1 flex items-center gap-1 shadow-lg">
                          <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400 px-1.5">
                            {block.type}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveBlock(index, 'up');
                            }}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                            title="Monter"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveBlock(index, 'down');
                            }}
                            disabled={index === blocks.length - 1}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                            title="Descendre"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateBlock(block.id);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-400"
                            title="Dupliquer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBlock(block.id);
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* RENDER BLOCK CONTENT */}
                      <div className="p-5 sm:p-6">
                        {/* BLOCK TYPE: HEADING */}
                        {block.type === 'heading' && (
                          <div className="space-y-1">
                            {block.headingLevel === 'h1' ? (
                              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                {block.title}
                              </h1>
                            ) : block.headingLevel === 'h3' ? (
                              <h3 className="text-lg font-bold text-white tracking-tight">{block.title}</h3>
                            ) : (
                              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                                {block.title}
                              </h2>
                            )}
                            {block.content && (
                              <p className="text-xs sm:text-sm text-slate-400 font-medium">{block.content}</p>
                            )}
                          </div>
                        )}

                        {/* BLOCK TYPE: TEXT */}
                        {block.type === 'text' && (
                          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-2 font-sans">
                            {block.content}
                          </div>
                        )}

                        {/* BLOCK TYPE: CALLOUT */}
                        {block.type === 'callout' && (
                          <div
                            className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                              block.calloutType === 'tip'
                                ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                                : block.calloutType === 'warning'
                                ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                                : block.calloutType === 'success'
                                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                                : 'bg-indigo-950/30 border-indigo-800/60 text-indigo-200'
                            }`}
                          >
                            <div className="p-2 rounded-xl bg-black/20 shrink-0">
                              {block.calloutType === 'tip' ? (
                                <Lightbulb className="w-5 h-5 text-amber-400" />
                              ) : block.calloutType === 'warning' ? (
                                <AlertCircle className="w-5 h-5 text-rose-400" />
                              ) : block.calloutType === 'success' ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <HelpCircle className="w-5 h-5 text-indigo-400" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-bold text-xs sm:text-sm text-white">{block.title}</h4>
                              <p className="text-xs opacity-90 leading-relaxed">{block.content}</p>
                            </div>
                          </div>
                        )}

                        {/* BLOCK TYPE: IMAGE */}
                        {block.type === 'image' && (
                          <div
                            className={`space-y-2.5 ${
                              block.imageAlign === 'center'
                                ? 'text-center mx-auto'
                                : block.imageAlign === 'right'
                                ? 'text-right ml-auto'
                                : 'text-left mr-auto'
                            } ${
                              block.imageSize === 'small'
                                ? 'max-w-sm'
                                : block.imageSize === 'medium'
                                ? 'max-w-xl'
                                : 'w-full'
                            }`}
                          >
                            {block.title && (
                              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                                {block.title}
                              </h4>
                            )}

                            {block.imageUrl ? (
                              <div className="relative rounded-2xl overflow-hidden border border-slate-800 group/img bg-slate-950 shadow-md inline-block w-full">
                                <img
                                  src={block.imageUrl}
                                  alt={block.imageCaption || block.title || 'Schéma'}
                                  className="w-full h-auto max-h-[500px] object-cover transition-transform duration-300 group-hover/img:scale-[1.01]"
                                />
                                {!isPreviewMode && (
                                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setZoomedImage({
                                          url: block.imageUrl!,
                                          caption: block.imageCaption || block.title,
                                        });
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm"
                                    >
                                      <ZoomIn className="w-4 h-4 text-indigo-400" />
                                      <span>Agrandir</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setMediaPickerConfig({
                                          isOpen: true,
                                          blockId: block.id,
                                          mode: 'image',
                                          title: 'Remplacer l\'image du cours',
                                        });
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
                                    >
                                      <UploadCloud className="w-4 h-4" />
                                      <span>Changer</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : (
                              /* Placeholder with click to upload */
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMediaPickerConfig({
                                    isOpen: true,
                                    blockId: block.id,
                                    mode: 'image',
                                    title: 'Placer une image ou un schéma',
                                  });
                                }}
                                className="border-2 border-dashed border-slate-800 hover:border-indigo-500/70 rounded-2xl p-8 bg-slate-950/50 text-center cursor-pointer transition-all group/drop"
                              >
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-2.5 group-hover/drop:scale-110 transition-transform">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                                <h5 className="text-xs font-bold text-white mb-1">
                                  Cliquez pour placer une image ou un schéma
                                </h5>
                                <p className="text-[11px] text-slate-400">
                                  Téléversez un fichier depuis votre appareil ou sélectionnez dans la galerie ITECH
                                </p>
                              </div>
                            )}

                            {block.imageCaption && (
                              <p className="text-xs text-slate-400 italic px-1 leading-relaxed">
                                {block.imageCaption}
                              </p>
                            )}
                          </div>
                        )}

                        {/* BLOCK TYPE: PRESENTATION (POWERPOINT & SLIDES) */}
                        {block.type === 'presentation' && (
                          <div className="space-y-3">
                            <PresentationPlayer
                              title={block.title || 'Support de Présentation PowerPoint'}
                              presentationData={block.presentationData}
                              isEditable={!isPreviewMode}
                              onEditSlideDeck={() => {
                                setMediaPickerConfig({
                                  isOpen: true,
                                  blockId: block.id,
                                  mode: 'presentation',
                                  title: 'Modifier ou Remplacer la Présentation PowerPoint',
                                });
                              }}
                            />
                          </div>
                        )}

                        {/* BLOCK TYPE: CODE */}
                        {block.type === 'code' && (
                          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold text-slate-200">{block.title}</span>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                {block.codeLanguage}
                              </span>
                            </div>
                            <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                              {block.codeContent}
                            </pre>
                          </div>
                        )}

                        {/* BLOCK TYPE: VIDEO */}
                        {block.type === 'video' && (
                          <div className="space-y-2">
                            {block.title && <h4 className="text-sm font-bold text-white">{block.title}</h4>}
                            <div className="aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative group/vid">
                              {block.videoUrl && block.videoUrl.includes('youtube') ? (
                                <iframe
                                  src={block.videoUrl}
                                  title={block.title || 'Vidéo de formation'}
                                  className="w-full h-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              ) : (
                                <div className="text-center p-6 space-y-2">
                                  <Video className="w-12 h-12 text-indigo-400 mx-auto" />
                                  <p className="text-xs text-slate-300 font-semibold">{block.videoUrl || 'Vidéo interactive'}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* BLOCK TYPE: NANO BANANA ANIMATED */}
                        {block.type === 'nano_banana' && block.nanoBananaData && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-amber-950/40 border border-amber-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                                🍌
                              </div>
                              <div>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                  Micro-Leçon Visuelle Nano Banana
                                </span>
                                <h4 className="text-sm font-extrabold text-white mt-0.5">
                                  {block.nanoBananaData.title}
                                </h4>
                                <p className="text-xs text-slate-400">
                                  {block.nanoBananaData.scenes.length} scènes animées • {block.nanoBananaData.totalDurationSeconds} secondes
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewNanoBanana(block.nanoBananaData || null);
                              }}
                              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-transform hover:scale-105 active:scale-95 self-end sm:self-auto"
                            >
                              <Play className="w-3.5 h-3.5 fill-slate-950" />
                              <span>Tester l'Animation</span>
                            </button>
                          </div>
                        )}

                        {/* BLOCK TYPE: ACCORDION */}
                        {block.type === 'accordion' && block.accordionItems && (
                          <div className="space-y-2">
                            {block.title && <h4 className="text-sm font-bold text-white mb-2">{block.title}</h4>}
                            {block.accordionItems.map((item, iIdx) => (
                              <details
                                key={iIdx}
                                className="group/acc p-3.5 rounded-xl bg-slate-950 border border-slate-800 open:bg-slate-900 transition-colors"
                              >
                                <summary className="font-bold text-xs text-slate-200 cursor-pointer flex items-center justify-between">
                                  <span>{item.title}</span>
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-open/acc:rotate-180 transition-transform" />
                                </summary>
                                <p className="text-xs text-slate-400 mt-2 pl-2 border-l border-indigo-500 leading-relaxed">
                                  {item.content}
                                </p>
                              </details>
                            ))}
                          </div>
                        )}

                        {/* BLOCK TYPE: QUIZ */}
                        {block.type === 'quiz' && block.quizQuestion && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-indigo-900/60 space-y-3">
                            <div className="flex items-center gap-2 text-indigo-400">
                              <HelpCircle className="w-4 h-4" />
                              <span className="text-xs font-bold uppercase tracking-wider">{block.title}</span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-white">{block.quizQuestion.question}</p>
                            <div className="space-y-1.5">
                              {block.quizQuestion.options.map((opt, oIdx) => (
                                <div
                                  key={oIdx}
                                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                                    oIdx === block.quizQuestion?.correctIndex
                                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                                      : 'bg-slate-900 border-slate-800 text-slate-300'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {oIdx === block.quizQuestion?.correctIndex && (
                                    <span className="text-[10px] font-black uppercase text-emerald-400">
                                      Bonne réponse
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                            {block.quizQuestion.explanation && (
                              <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                                💡 <strong>Explication :</strong> {block.quizQuestion.explanation}
                              </p>
                            )}
                          </div>
                        )}

                        {/* BLOCK TYPE: RESOURCES */}
                        {block.type === 'resources' && block.resources && (
                          <div className="space-y-2">
                            {block.title && <h4 className="text-sm font-bold text-white mb-2">{block.title}</h4>}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {block.resources.map((res) => (
                                <div
                                  key={res.id}
                                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <FileText className="w-4 h-4 text-indigo-400" />
                                    <div>
                                      <span className="text-xs font-bold text-white block">{res.title}</span>
                                      <span className="text-[10px] text-slate-400">{res.fileSize || 'Fichier'}</span>
                                    </div>
                                  </div>
                                  <FolderDown className="w-4 h-4 text-slate-400" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Add Block Bar */}
            {!isPreviewMode && (
              <div className="mt-8 p-6 rounded-3xl border-2 border-dashed border-slate-800 hover:border-indigo-500/60 bg-slate-900/30 text-center space-y-3 transition-colors">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ajouter un nouvel élément à la leçon
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleAddBlock('image')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-800/80 text-indigo-200 border border-indigo-500/40 font-bold text-xs flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>+ Image / Schéma</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('presentation')}
                    className="px-3 py-1.5 rounded-xl bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Presentation className="w-3.5 h-3.5 text-amber-400" />
                    <span>+ PowerPoint (PPTX)</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('heading')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Heading className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Titre</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('text')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Type className="w-3.5 h-3.5 text-teal-400" />
                    <span>Texte</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('code')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Code Sandbox</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('nano_banana')}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <span>🍌 Nano Banana</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('callout')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Callout</span>
                  </button>
                  <button
                    onClick={() => handleAddBlock('quiz')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                    <span>Mini-Quiz</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
