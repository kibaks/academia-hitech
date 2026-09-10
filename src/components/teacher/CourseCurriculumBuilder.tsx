import React, { useState, useEffect } from 'react';
import { Course, Chapter, Lesson, Quiz, QuizQuestion, NanoBananaLesson, AnimakerLesson, CourseVideoProject } from '../../types';
import { COURSE_TEMPLATES, NANO_BANANA_TEMPLATES, ANIMAKER_MOTION_PRESETS } from '../../data/templatesData';
import { ElementorLessonBuilder } from './ElementorLessonBuilder';
import { NanoBananaPlayer } from './NanoBananaPlayer';
import { InteractiveMindMapCanvas } from './InteractiveMindMapCanvas';
import { VideoEditingStudio } from '../studio/VideoEditingStudio';
import { GeneratedVideoPlayer } from '../player/GeneratedVideoPlayer';
import { ANIMAKER_CHARACTERS, convertVideoProjectToAnimakerLesson, convertAnimakerLessonToVideoProject } from '../../data/videoProjectsData';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Layers,
  BookOpen,
  Video,
  FileText,
  Code2,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Play,
  Wand2,
  Clock,
  DollarSign,
  Tag,
  Check,
  AlertCircle,
  HelpCircle,
  Eye,
  Sliders,
  Settings2,
  FolderDown,
  LayoutGrid,
  Copy,
  ExternalLink,
  ChevronRight,
  Brain,
  Film,
  Zap,
  Cpu,
  Shield,
  ArrowRight,
  Presentation
} from 'lucide-react';

interface CourseCurriculumBuilderProps {
  onSaveCourse: (course: Course) => void;
  existingCourse?: Course | null;
  coursesList?: Course[];
  onSelectCourseToEdit?: (course: Course) => void;
  onCancel?: () => void;
  onPreviewInPlayer?: (course: Course) => void;
}

export const CourseCurriculumBuilder: React.FC<CourseCurriculumBuilderProps> = ({
  onSaveCourse,
  existingCourse,
  coursesList = [],
  onSelectCourseToEdit,
  onCancel,
  onPreviewInPlayer,
}) => {
  // MASTERSTUDY TABS: 'settings' | 'curriculum' | 'quiz' | 'pricing'
  const [activeTab, setActiveTab] = useState<'settings' | 'curriculum' | 'quiz' | 'pricing'>('curriculum');
  const [curriculumViewMode, setCurriculumViewMode] = useState<'tree' | 'mindmap'>('tree');

  // Course Metadata
  const [courseId, setCourseId] = useState(existingCourse?.id || `course-${Date.now()}`);
  const [title, setTitle] = useState(existingCourse?.title || '');
  const [slug, setSlug] = useState(existingCourse?.slug || '');
  const [category, setCategory] = useState<Course['category']>(existingCourse?.category || 'ia_data');
  const [level, setLevel] = useState<Course['level']>(existingCourse?.level || 'Intermédiaire');
  const [shortDescription, setShortDescription] = useState(existingCourse?.shortDescription || '');
  const [description, setDescription] = useState(existingCourse?.description || '');
  const [price, setPrice] = useState(existingCourse?.price || 0);
  const [durationHours, setDurationHours] = useState(existingCourse?.durationHours || 16);
  const [thumbnail, setThumbnail] = useState(
    existingCourse?.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
  );
  const [bannerImage, setBannerImage] = useState(
    existingCourse?.bannerImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'
  );
  const [skillsGained, setSkillsGained] = useState<string[]>(
    existingCourse?.skillsGained || [
      'Architecture & Modélisation avancée',
      'Déploiement en production',
      'Optimisation des performances'
    ]
  );
  const [newSkillInput, setNewSkillInput] = useState('');
  const [hasCertificate, setHasCertificate] = useState(existingCourse?.hasCertificate ?? true);

  // Curriculum Hierarchy (MasterStudy Modules / Chapters)
  const [chapters, setChapters] = useState<Chapter[]>(
    existingCourse?.chapters || [
      {
        id: 'chap-1',
        title: 'Module 1 : Fondations Théoriques & Architecture',
        description: 'Découverte des concepts clés et modélisation initiale',
        lessons: [
          {
            id: 'les-1',
            title: 'Introduction interactive & Vue d\'ensemble',
            durationMinutes: 15,
            type: 'animated_nano_banana',
            content: 'Leçon animée Nano Banana avec auto-attention et décomposition des concepts.',
            nanoBananaData: NANO_BANANA_TEMPLATES[0],
          },
          {
            id: 'les-2',
            title: 'Atelier de Code Pratique & Déploiement',
            durationMinutes: 45,
            type: 'interactive_code',
            content: 'Implémentez l\'architecture avec les tests automatisés.',
            codeStarter: `function processData(input: string[]) {\n  // Votre implémentation ici\n}`,
            codeSolution: `function processData(input: string[]) {\n  return input.map(item => item.trim().toLowerCase());\n}`,
            codeLanguage: 'typescript',
          }
        ]
      }
    ]
  );

  // Final Quiz Builder (MasterStudy Quiz Model)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(
    existingCourse?.finalQuiz?.questions || [
      {
        id: 'q-1',
        question: 'Quel est l\'avantage principal de l\'architecture modulaire ?',
        options: [
          'Isolation des composants et maintenance simplifiée',
          'Suppression de la mémoire',
          'Exécution synchrone obligatoire',
          'Aucun avantage particulier'
        ],
        correctIndex: 0,
        explanation: 'L\'isolation des modules permet des déploiements indépendants et facilite grandement les tests unitaires.',
        points: 10,
      }
    ]
  );
  const [passingScore, setPassingScore] = useState(existingCourse?.finalQuiz?.passingScore || 75);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(existingCourse?.finalQuiz?.timeLimitMinutes || 20);
  const [xpReward, setXpReward] = useState(existingCourse?.finalQuiz?.xpReward || 250);

  // ACTIVE ELEMENTOR EDITING LESSON
  const [editingLessonInfo, setEditingLessonInfo] = useState<{
    chapterId: string;
    chapterTitle: string;
    lesson: Lesson;
  } | null>(null);

  // ACTIVE ANIMAKER / MOTION STUDIO EDITING LESSON
  const [editingAnimakerInfo, setEditingAnimakerInfo] = useState<{
    chapterId: string;
    chapterTitle: string;
    lesson: Lesson;
  } | null>(null);

  // Previews & UI Modals
  const [previewNanoBanana, setPreviewNanoBanana] = useState<NanoBananaLesson | null>(null);
  const [previewAnimakerLesson, setPreviewAnimakerLesson] = useState<AnimakerLesson | null>(null);
  const [showMotionExplainerModal, setShowMotionExplainerModal] = useState<{
    chapterId: string;
  } | null>(null);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync with existingCourse changes
  useEffect(() => {
    if (existingCourse) {
      setCourseId(existingCourse.id);
      setTitle(existingCourse.title);
      setSlug(existingCourse.slug || existingCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      setCategory(existingCourse.category);
      setLevel(existingCourse.level);
      setShortDescription(existingCourse.shortDescription);
      setDescription(existingCourse.description);
      setPrice(existingCourse.price);
      setDurationHours(existingCourse.durationHours);
      setThumbnail(existingCourse.thumbnail);
      setBannerImage(existingCourse.bannerImage);
      setChapters(existingCourse.chapters);
      setSkillsGained(existingCourse.skillsGained || []);
      setHasCertificate(existingCourse.hasCertificate ?? true);
      if (existingCourse.finalQuiz) {
        setQuizQuestions(existingCourse.finalQuiz.questions || []);
        setPassingScore(existingCourse.finalQuiz.passingScore || 75);
        setTimeLimitMinutes(existingCourse.finalQuiz.timeLimitMinutes || 20);
        setXpReward(existingCourse.finalQuiz.xpReward || 250);
      }
    }
  }, [existingCourse]);

  // CHAPTER (MODULE) OPERATIONS
  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: `chap-${Date.now()}`,
      title: `Module ${chapters.length + 1} : Nouveau Module Pédagogique`,
      description: 'Compétences ciblées et objectifs opérationnels',
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: 'Leçon 1 : Concepts Fondamentaux & Démonstration',
          durationMinutes: 20,
          type: 'article',
          content: 'Contenu détaillé de la leçon avec cas pratique...',
        }
      ]
    };
    setChapters([...chapters, newChapter]);
  };

  const handleDeleteChapter = (chapId: string) => {
    setChapters(chapters.filter((c) => c.id !== chapId));
  };

  const handleUpdateChapterTitle = (chapId: string, newTitle: string) => {
    setChapters(chapters.map((c) => (c.id === chapId ? { ...c, title: newTitle } : c)));
  };

  const handleUpdateChapterDescription = (chapId: string, newDesc: string) => {
    setChapters(chapters.map((c) => (c.id === chapId ? { ...c, description: newDesc } : c)));
  };

  // LESSON OPERATIONS
  const handleAddLesson = (chapId: string, type: Lesson['type']) => {
    const targetChap = chapters.find((c) => c.id === chapId);
    const lessonIndex = (targetChap?.lessons.length || 0) + 1;

    let defaultTitle = `Leçon ${lessonIndex} : `;
    if (type === 'animaker_animated') defaultTitle += 'Animation Motion d\'Explication (Studio 2D)';
    else if (type === 'animated_nano_banana') defaultTitle += 'Micro-Cours Animé Nano Banana';
    else if (type === 'interactive_code') defaultTitle += 'Atelier Pratique de Code';
    else if (type === 'video') defaultTitle += 'Vidéo de Démonstration';
    else if (type === 'presentation') defaultTitle += 'Support de Présentation PowerPoint (PPTX)';
    else defaultTitle += 'Synthèse Pédagogique & Guide';

    const defaultAnimakerData: AnimakerLesson | undefined =
      type === 'animaker_animated'
        ? {
            id: `animaker-${Date.now()}`,
            title: `Animation Motion : ${title || 'Concept Fondamental'}`,
            topic: title || 'Concept Pédagogique Clé',
            targetAudience: 'Étudiants & Ingénieurs Tech',
            leadCharacterName: ANIMAKER_CHARACTERS[0].name,
            leadCharacterAvatar: ANIMAKER_CHARACTERS[0].avatar,
            totalDurationSeconds: 150,
            scenes: [
              {
                id: `sc-${Date.now()}-1`,
                title: '1. Introduction Visuelle & Mise en Contexte',
                characterId: ANIMAKER_CHARACTERS[0].id,
                characterName: ANIMAKER_CHARACTERS[0].name,
                characterAvatar: ANIMAKER_CHARACTERS[0].avatar,
                pose: 'waving',
                dialogueText: `Bienvenue dans cette leçon explicative animée ! Nous allons décortiquer ensemble les principes fondamentaux de cette séquence.`,
                background: 'tech_classroom',
                boardContent: {
                  type: 'bullet_points',
                  title: 'Ce que nous allons explorer :',
                  items: [
                    'Compréhension intuitive des concepts',
                    'Démonstration technique animée',
                    'Bonnes pratiques d\'architecture en entreprise'
                  ],
                  highlightText: 'Académie d\'Excellence ITECH'
                },
                keyTakeaway: 'Une assimilation accélérée grâce aux explications visuelles interactives.',
                durationSeconds: 35
              },
              {
                id: `sc-${Date.now()}-2`,
                title: '2. Démonstration Technique & Schéma Dynamique',
                characterId: ANIMAKER_CHARACTERS[0].id,
                characterName: ANIMAKER_CHARACTERS[0].name,
                characterAvatar: ANIMAKER_CHARACTERS[0].avatar,
                pose: 'explaining',
                dialogueText: `Voici le cœur du mécanisme. Observez attentivement le flux d'exécution et les interactions entre les différents blocs logiques.`,
                background: 'ai_lab',
                boardContent: {
                  type: 'code',
                  title: 'Pipeline d\'Exécution Standard :',
                  codeSnippet: '// Flux de traitement temps réel\nexport async function runPipeline(input) {\n  const sanitized = sanitize(input);\n  return await executeSafely(sanitized);\n}',
                  codeLanguage: 'typescript',
                  highlightText: 'Architecture résiliente et performante'
                },
                keyTakeaway: 'La rigueur dans les contrats d\'interfaces garantit la pérennité du système.',
                miniQuiz: {
                  question: 'Quel est l\'objectif prioritaire de cette architecture ?',
                  options: [
                    'Garantir l\'isolation et la robustesse des flux',
                    'Supprimer les tests automatisés',
                    'Ralentir les traitements'
                  ],
                  correctIndex: 0,
                  explanation: 'Bravo ! La séparation claire des responsabilités permet une maintenance sereine.'
                },
                durationSeconds: 45
              }
            ]
          }
        : undefined;

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: defaultTitle,
      durationMinutes: type === 'animaker_animated' ? 12 : type === 'animated_nano_banana' ? 10 : 25,
      type,
      content: 'Contenu pédagogique enrichi...',
      nanoBananaData: type === 'animated_nano_banana' ? NANO_BANANA_TEMPLATES[0] : undefined,
      animakerData: defaultAnimakerData,
      presentationData:
        type === 'presentation'
          ? {
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
            }
          : undefined,
    };

    setChapters(
      chapters.map((c) => (c.id === chapId ? { ...c, lessons: [...c.lessons, newLesson] } : c))
    );
  };

  const handleAddMotionPresetLesson = (chapId: string, preset: AnimakerLesson) => {
    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      title: preset.title,
      durationMinutes: Math.max(5, Math.ceil(preset.totalDurationSeconds / 60)),
      type: 'animaker_animated',
      content: `Leçon animée avec le Studio Motion : ${preset.topic}`,
      animakerData: JSON.parse(JSON.stringify(preset)),
    };

    setChapters(
      chapters.map((c) => (c.id === chapId ? { ...c, lessons: [...c.lessons, newLesson] } : c))
    );
    setShowMotionExplainerModal(null);
  };

  const handleSaveLessonFromAnimaker = (
    savedAnimakerLesson?: AnimakerLesson,
    savedVideoProject?: CourseVideoProject
  ) => {
    if (!editingAnimakerInfo) return;
    const { chapterId, lesson } = editingAnimakerInfo;

    const updatedLesson: Lesson = {
      ...lesson,
      title: savedVideoProject?.title || savedAnimakerLesson?.title || lesson.title,
      type: 'video_project',
      videoProjectData: savedVideoProject || lesson.videoProjectData,
      animakerData: savedAnimakerLesson || lesson.animakerData,
      durationMinutes: Math.max(
        3,
        Math.ceil(
          ((savedVideoProject?.totalDurationSeconds || savedAnimakerLesson?.totalDurationSeconds || 120) / 60)
        )
      ),
    };

    setChapters(
      chapters.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              lessons: c.lessons.map((l) => (l.id === updatedLesson.id ? updatedLesson : l)),
            }
          : c
      )
    );

    setEditingAnimakerInfo(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleDeleteLesson = (chapId: string, lesId: string) => {
    setChapters(
      chapters.map((c) =>
        c.id === chapId ? { ...c, lessons: c.lessons.filter((l) => l.id !== lesId) } : c
      )
    );
  };

  const handleDuplicateLesson = (chapId: string, lesId: string) => {
    const chap = chapters.find((c) => c.id === chapId);
    if (!chap) return;
    const les = chap.lessons.find((l) => l.id === lesId);
    if (!les) return;

    const clone: Lesson = {
      ...JSON.parse(JSON.stringify(les)),
      id: `les-${Date.now()}`,
      title: `${les.title} (Copie)`,
    };

    setChapters(
      chapters.map((c) => (c.id === chapId ? { ...c, lessons: [...c.lessons, clone] } : c))
    );
  };

  const handleSaveLessonFromElementor = (updatedLesson: Lesson) => {
    if (!editingLessonInfo) return;
    const { chapterId } = editingLessonInfo;

    setChapters(
      chapters.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              lessons: c.lessons.map((l) => (l.id === updatedLesson.id ? updatedLesson : l)),
            }
          : c
      )
    );

    setEditingLessonInfo(null);
  };

  // SKILLS OPERATIONS
  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skillsGained.includes(newSkillInput.trim())) {
      setSkillsGained([...skillsGained, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsGained(skillsGained.filter((s) => s !== skillToRemove));
  };

  // QUIZ OPERATIONS
  const handleAddQuizQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: 'Nouvelle question d\'évaluation certifiante ?',
      options: ['Option A (Correcte)', 'Option B', 'Option C', 'Option D'],
      correctIndex: 0,
      explanation: 'Explication détaillée du principe théorique.',
      points: 10,
    };
    setQuizQuestions([...quizQuestions, newQ]);
  };

  const handleUpdateQuizQuestion = (qId: string, updates: Partial<QuizQuestion>) => {
    setQuizQuestions(quizQuestions.map((q) => (q.id === qId ? { ...q, ...updates } : q)));
  };

  const handleDeleteQuizQuestion = (qId: string) => {
    setQuizQuestions(quizQuestions.filter((q) => q.id !== qId));
  };

  // TEMPLATES
  const handleApplyCourseTemplate = (tpl: typeof COURSE_TEMPLATES[0]) => {
    setTitle(tpl.title);
    setCategory(tpl.category);
    setLevel(tpl.level);
    setShortDescription(tpl.shortDescription);
    setDescription(tpl.sampleCourse.description || tpl.shortDescription);
    setDurationHours(tpl.durationHours);
    setThumbnail(tpl.thumbnail);
    setBannerImage(tpl.bannerImage);

    const tplChapters: Chapter[] = Array.from({ length: tpl.modulesCount }).map((_, idx) => ({
      id: `chap-tpl-${idx + 1}`,
      title: `Module ${idx + 1} : ${tpl.tags[idx] || 'Spécialisation Approfondie'}`,
      description: `Maîtrise opérationnelle et cas pratiques sur ${tpl.tags[idx] || 'le domaine'}`,
      lessons: [
        {
          id: `les-tpl-${idx}-1`,
          title: `Comprendre ${tpl.tags[idx] || 'le sujet'} en 3 minutes (Nano Banana)`,
          durationMinutes: 10,
          type: 'animated_nano_banana',
          content: 'Micro-leçon animée interactive.',
          nanoBananaData: NANO_BANANA_TEMPLATES[idx % NANO_BANANA_TEMPLATES.length],
        },
        {
          id: `les-tpl-${idx}-2`,
          title: `Atelier Pratique & Cas Réel`,
          durationMinutes: 35,
          type: 'interactive_code',
          content: 'Exercice guidé et validation automatique.',
        }
      ]
    }));

    setChapters(tplChapters);
    setShowTemplatesModal(false);
  };

  // FINAL SAVE
  const handleSaveCourse = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      alert('Veuillez renseigner un titre pour la formation.');
      return;
    }

    const finalQuizObj: Quiz = {
      id: `quiz-${courseId}`,
      title: `Quiz de Certification : ${title}`,
      description: `Évaluation officielle des compétences acquises sur le cours ${title}.`,
      courseId,
      passingScore,
      timeLimitMinutes,
      questions: quizQuestions,
      xpReward,
    };

    const completeCourse: Course = {
      id: courseId,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription,
      description,
      category,
      level,
      price: Number(price),
      durationHours: Number(durationHours),
      thumbnail,
      bannerImage,
      authorId: existingCourse?.authorId || 'trainer-current',
      authorName: existingCourse?.authorName || 'Formateur Certifié ITECH',
      authorAvatar:
        existingCourse?.authorAvatar ||
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      authorRole: 'Formateur Expert & Chercheur',
      centerName: existingCourse?.centerName || 'Campus Paris Digital Hub',
      rating: existingCourse?.rating || 4.9,
      reviewCount: existingCourse?.reviewCount || 1,
      studentCount: existingCourse?.studentCount || 0,
      hasCertificate,
      tags: [category, level, 'Certification ITECH'],
      skillsGained,
      chapters,
      finalQuiz: finalQuizObj,
    };

    onSaveCourse(completeCourse);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // IF AN ELEMENTOR LESSON IS OPEN: RENDER ELEMENTOR VISUAL BUILDER
  if (editingLessonInfo) {
    return (
      <ElementorLessonBuilder
        lesson={editingLessonInfo.lesson}
        chapterTitle={editingLessonInfo.chapterTitle}
        courseTitle={title || 'Formation ITECH'}
        onSaveLesson={handleSaveLessonFromElementor}
        onBack={() => setEditingLessonInfo(null)}
      />
    );
  }

  const totalLessonsCount = chapters.reduce((acc, c) => acc + c.lessons.length, 0);

  return (
    <div id="masterstudy-course-builder" className="space-y-6 pb-20">
      {/* GRAND MODAL DU STUDIO DE MONTAGE VIDÉO */}
      {editingAnimakerInfo && (
        <VideoEditingStudio
          isModal={true}
          initialVideoProject={editingAnimakerInfo.lesson.videoProjectData}
          initialLesson={editingAnimakerInfo.lesson.animakerData}
          courseTitle={title || 'Formation ITECH'}
          chapterTitle={editingAnimakerInfo.chapterTitle}
          onSaveVideoProject={(savedProject) => {
            handleSaveLessonFromAnimaker(undefined, savedProject);
          }}
          onSaveLesson={(savedAnimaker) => {
            handleSaveLessonFromAnimaker(savedAnimaker);
          }}
          onPublishToCourse={(savedAnimaker, savedProject) => {
            handleSaveLessonFromAnimaker(savedAnimaker, savedProject);
            setEditingAnimakerInfo(null);
          }}
          onClose={() => setEditingAnimakerInfo(null)}
        />
      )}

      {/* APERÇU DE LA VIDÉO GÉNÉRÉE DANS LE LECTEUR ÉLÈVE */}
      {previewAnimakerLesson && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Film className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-white">Aperçu de la Vidéo Générée (Rendu Apprenant)</h3>
                  <p className="text-xs text-slate-400">{previewAnimakerLesson.title} — Rendu final tel qu'affiché aux élèves</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAnimakerLesson(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
              >
                Fermer l'aperçu
              </button>
            </div>
            <GeneratedVideoPlayer
              lesson={previewAnimakerLesson}
              autoPlay={true}
            />
          </div>
        </div>
      )}

      {/* MOTION EXPLAINER PRESETS SELECTOR MODAL */}
      {showMotionExplainerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-indigo-900/60 shadow-2xl p-6 text-white space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black">
                    Bibliothèque d'Animations Motion d'Explication
                  </h3>
                  <p className="text-xs text-slate-400">
                    Insérez une leçon animée 2D avec synthèse vocale et tableau interactif prête à l'emploi.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMotionExplainerModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700"
              >
                Fermer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
              {ANIMAKER_MOTION_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500 transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={preset.leadCharacterAvatar}
                        alt={preset.leadCharacterName}
                        className="w-8 h-8 rounded-full object-cover border border-indigo-400/50 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors truncate">
                          {preset.title}
                        </h4>
                        <p className="text-[10px] text-indigo-400">
                          Animé par {preset.leadCharacterName} • {preset.scenes.length} scènes
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {preset.scenes[0]?.dialogueText || preset.topic}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-400">
                      ⏱️ {Math.ceil(preset.totalDurationSeconds / 60)} min
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddMotionPresetLesson(showMotionExplainerModal.chapterId, preset)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter au Module</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NANO BANANA PREVIEW MODAL */}
      {previewNanoBanana && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <NanoBananaPlayer
              lesson={previewNanoBanana}
              onClose={() => setPreviewNanoBanana(null)}
              onComplete={() => setPreviewNanoBanana(null)}
            />
          </div>
        </div>
      )}

      {/* MASTERSTUDY TOP HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Modèle MasterStudy LMS & Elementor
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
              {existingCourse ? 'Édition de Formation' : 'Nouvelle Formation'}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 break-words">
            {existingCourse ? `Édition : ${title || existingCourse.title}` : 'Créateur de Cours Certifiant'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Structurez votre programme, créez vos leçons interactives et éditez-les visuellement avec Elementor.
          </p>
        </div>

        {/* Action Buttons & Course Selector */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Quick Select another course to edit */}
          {coursesList.length > 0 && onSelectCourseToEdit && (
            <div className="flex items-center gap-1.5">
              <select
                value={existingCourse?.id || ''}
                onChange={(e) => {
                  const target = coursesList.find((c) => c.id === e.target.value);
                  if (target) onSelectCourseToEdit(target);
                }}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="">-- Choisir une formation à éditer --</option>
                {coursesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (chapters.length > 0) {
                setShowMotionExplainerModal({ chapterId: chapters[0].id });
              } else {
                handleAddChapter();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
          >
            <Film className="w-4 h-4" />
            <span>🎬 Studio Motion Explainer</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTemplatesModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Wand2 className="w-4 h-4 text-amber-600" />
            <span>Modèles Clés en Main</span>
          </button>

          {existingCourse && onPreviewInPlayer && (
            <button
              type="button"
              onClick={() => onPreviewInPlayer(existingCourse)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Aperçu Player</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSaveCourse()}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer & Publier</span>
          </button>
        </div>
      </div>

      {/* SAVE SUCCESS BANNER */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>La formation et l'ensemble des leçons ont été enregistrées avec succès !</span>
        </div>
      )}

      {/* MASTERSTUDY TAB NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'curriculum'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Curriculum & Leçons ({chapters.length} Modules • {totalLessonsCount} Leçons)</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>2. Paramètres & Médias</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'quiz'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>3. Quiz de Certification ({quizQuestions.length} Questions)</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'pricing'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Tarifs & Certificat</span>
        </button>
      </div>

      {/* TAB 1: CURRICULUM (MASTERSTUDY COURSE BUILDER) */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          {/* VIEW SWITCHER: LIST TREE vs INTERACTIVE MIND MAP */}
          <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">Visualisation & Conception Pédagogique</h4>
                <p className="text-xs text-slate-400">
                  Alternez entre la liste arborescente classique et le Canvas Mind Map interactif avec transitions animées.
                </p>
              </div>
            </div>

            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setCurriculumViewMode('tree')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  curriculumViewMode === 'tree'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Vue Arborescence</span>
              </button>
              <button
                type="button"
                onClick={() => setCurriculumViewMode('mindmap')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  curriculumViewMode === 'mindmap'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Mind Map Interactif</span>
              </button>
            </div>
          </div>

          {/* RENDER MIND MAP OR TREE LIST */}
          {curriculumViewMode === 'mindmap' ? (
            <InteractiveMindMapCanvas
              courseTitle={title}
              chapters={chapters}
              onUpdateChapters={setChapters}
              onSelectLessonToEdit={(chapId, lesId) => {
                const chap = chapters.find((c) => c.id === chapId);
                const les = chap?.lessons.find((l) => l.id === lesId);
                if (chap && les) {
                  setEditingLessonInfo({ lesson: les, chapterTitle: chap.title });
                }
              }}
            />
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    <span>Structure du Curriculum MasterStudy</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ajoutez vos modules et utilisez le constructeur visuel <strong>Elementor</strong> pour concevoir chaque leçon.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddChapter}
                  className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Module</span>
                </button>
              </div>

            {/* Modules List */}
            <div className="space-y-6">
              {chapters.map((chap, cIdx) => (
                <div
                  key={chap.id}
                  className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs space-y-4"
                >
                  {/* Module Header Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                          Module {cIdx + 1}
                        </span>
                        <span className="text-[11px] text-slate-500">{chap.lessons.length} leçons</span>
                      </div>
                      <input
                        type="text"
                        value={chap.title}
                        onChange={(e) => handleUpdateChapterTitle(chap.id, e.target.value)}
                        className="w-full font-extrabold text-base text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-indigo-600 focus:outline-none py-0.5"
                        placeholder="Titre du module..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteChapter(chap.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Supprimer ce module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons List in Module */}
                  <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-indigo-200">
                    {chap.lessons.map((les, lIdx) => (
                      <div
                        key={les.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:border-indigo-300 transition-all"
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              les.type === 'animaker_animated'
                                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                : les.type === 'animated_nano_banana'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : les.type === 'interactive_code'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : les.type === 'presentation'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : les.type === 'video'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {les.type === 'animaker_animated' ? (
                              <Film className="w-4 h-4 text-purple-700" />
                            ) : les.type === 'animated_nano_banana' ? (
                              '🍌'
                            ) : les.type === 'interactive_code' ? (
                              <Code2 className="w-4 h-4" />
                            ) : les.type === 'presentation' ? (
                              <Presentation className="w-4 h-4 text-amber-700" />
                            ) : les.type === 'video' ? (
                              <Video className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                {les.title}
                              </h4>
                              {les.type === 'presentation' && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                  <Presentation className="w-3 h-3 text-amber-700" />
                                  <span>PowerPoint / Diaporama</span>
                                </span>
                              )}
                              {les.type === 'animaker_animated' && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                                  <Film className="w-3 h-3 text-purple-700" />
                                  <span>Animation Motion (Studio 2D)</span>
                                </span>
                              )}
                              {les.blocks && les.blocks.length > 0 && (
                                <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                                  {les.blocks.length} Blocs Elementor
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {les.durationMinutes} min • {les.type === 'animaker_animated' ? 'Motion Studio Explainer' : `Type : ${les.type}`}
                            </p>
                          </div>
                        </div>

                        {/* Lesson MasterStudy, Studio & Elementor Actions */}
                        <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                          {/* ANIMAKER STUDIO BUTTON */}
                          {les.type === 'animaker_animated' || les.type === 'video_project' || les.videoProjectData ? (
                            <button
                              type="button"
                              onClick={() =>
                                setEditingAnimakerInfo({
                                  chapterId: chap.id,
                                  chapterTitle: chap.title,
                                  lesson: les,
                                })
                              }
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                            >
                              <Film className="w-3.5 h-3.5" />
                              <span>Ouvrir dans le Logiciel de Montage</span>
                            </button>
                          ) : (
                            /* PRIMARY ELEMENTOR TRIGGER */
                            <button
                              type="button"
                              onClick={() =>
                                setEditingLessonInfo({
                                  chapterId: chap.id,
                                  chapterTitle: chap.title,
                                  lesson: les,
                                })
                              }
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:scale-105"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Éditer avec Elementor</span>
                            </button>
                          )}

                          {(les.type === 'animaker_animated' || les.type === 'video_project') && (les.animakerData || les.videoProjectData) && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewAnimakerLesson(
                                  les.animakerData ||
                                    (les.videoProjectData
                                      ? convertVideoProjectToAnimakerLesson(les.videoProjectData)
                                      : null)
                                )
                              }
                              className="px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300 font-black text-xs flex items-center gap-1"
                              title="Voir la vidéo générée telle que visionnée par les apprenants"
                            >
                              <Play className="w-3 h-3 fill-purple-900" />
                              <span>Aperçu Vidéo Générée</span>
                            </button>
                          )}

                          {les.type === 'animated_nano_banana' && les.nanoBananaData && (
                            <button
                              type="button"
                              onClick={() => setPreviewNanoBanana(les.nanoBananaData || null)}
                              className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1"
                              title="Tester la micro-leçon animée"
                            >
                              <Play className="w-3 h-3 fill-slate-950" />
                              <span>Tester</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDuplicateLesson(chap.id, les.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Dupliquer la leçon"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(chap.id, les.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Supprimer la leçon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Lesson Selector Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleAddLesson(chap.id, 'animaker_animated')}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-2xs transition-all hover:scale-105"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>🎬 + Leçon Studio Animé</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowMotionExplainerModal({ chapterId: chap.id })}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>✨ Explications Motion Prêtes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddLesson(chap.id, 'article')}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>+ Article / Théorie</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddLesson(chap.id, 'presentation')}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <Presentation className="w-3.5 h-3.5 text-amber-600" />
                      <span>+ Support PowerPoint (PPTX)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddLesson(chap.id, 'video')}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                      <span>+ Vidéo Démo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddLesson(chap.id, 'interactive_code')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>+ Atelier de Code</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddLesson(chap.id, 'animated_nano_banana')}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>🍌 + Micro-Cours Nano Banana</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}

      {/* TAB 2: GENERAL SETTINGS & MEDIA (MASTERSTUDY SETTINGS) */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <span>Paramètres Généraux de la Formation</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Titre de la Formation *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="Ex: Masterclass Développement FullStack & IA Générative"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catégorie de Spécialité
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="ia_data">IA & Data Science</option>
                  <option value="development">Développement Web & Mobile</option>
                  <option value="cybersecurity">Cybersécurité & Réseaux</option>
                  <option value="cloud_devops">Cloud & DevOps</option>
                  <option value="business">Business & Entrepreneuriat Tech</option>
                  <option value="design">UI/UX Design & Ergonomie</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Niveau d'Expérience Requis
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="Débutant">Débutant (Sans prérequis)</option>
                  <option value="Intermédiaire">Intermédiaire (Pratique requise)</option>
                  <option value="Avancé">Avancé (Expertise technique)</option>
                  <option value="Tous niveaux">Tous niveaux</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description Courte (Accroche & Résumé)
              </label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={2}
                placeholder="Résumé percutant des acquis de la formation..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-700 leading-relaxed focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description Détaillée du Programme
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Présentation complète, méthodologie, études de cas et livrables finaux..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-700 leading-relaxed focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Skills Gained Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Compétences Acquises par l'Apprenant
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Ajouter une compétence (ex: PyTorch, Docker, CI/CD)..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs"
                >
                  Ajouter
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {skillsGained.map((sk, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    <span>{sk}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(sk)}
                      className="text-slate-400 hover:text-rose-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Media & Thumbnails */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Médias & Visuels</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Image Miniature (Card)
              </label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs mb-2"
              />
              <img
                src={thumbnail}
                alt="Miniature"
                className="w-full h-36 object-cover rounded-2xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Durée Estimée (Heures)
              </label>
              <input
                type="number"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ BUILDER (MASTERSTUDY QUIZ MODEL) */}
      {activeTab === 'quiz' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>Quiz Final & Évaluation Certifiante</span>
              </h3>
              <p className="text-xs text-slate-500">
                Créez le questionnaire officiel requis pour débloquer l'attestation et le certificat officiel.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddQuizQuestion}
              className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une Question</span>
            </button>
          </div>

          {/* Quiz Global Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Score Minimum de Réussite (%)
              </label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Temps Limite (Minutes)
              </label>
              <input
                type="number"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Récompense XP
              </label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-indigo-700"
              />
            </div>
          </div>

          {/* Questions Bank */}
          <div className="space-y-4">
            {quizQuestions.map((q, qIdx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-indigo-700">
                    Question {qIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuizQuestion(q.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Intitulé</label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleUpdateQuizQuestion(q.id, { question: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Options de Réponse (Cocher la bonne réponse)</label>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-q-${q.id}`}
                        checked={q.correctIndex === oIdx}
                        onChange={() => handleUpdateQuizQuestion(q.id, { correctIndex: oIdx })}
                        className="text-indigo-600 focus:ring-0"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const opts = [...q.options];
                          opts[oIdx] = e.target.value;
                          handleUpdateQuizQuestion(q.id, { options: opts });
                        }}
                        className={`flex-1 px-3 py-1.5 rounded-xl border text-xs ${
                          q.correctIndex === oIdx
                            ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                            : 'bg-white border-slate-300 text-slate-800'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Explication Pédagogique (Correction)</label>
                  <textarea
                    rows={2}
                    value={q.explanation}
                    onChange={(e) => handleUpdateQuizQuestion(q.id, { explanation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRICING & CERTIFICATES */}
      {activeTab === 'pricing' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Tarification & Délivrance du Certificat</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Frais d'Inscription (Tarif)</span>
              </h4>
              <p className="text-xs text-slate-500">
                Définissez le tarif en monnaie locale (0 = Accès libre / Gratuit).
              </p>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900"
              />
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Certification Academia ITECH</span>
              </h4>
              <p className="text-xs text-slate-500">
                Génération automatique du certificat officiel avec QR code et numéro d'enregistrement unique.
              </p>
              <label className="flex items-center gap-2.5 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={hasCertificate}
                  onChange={(e) => setHasCertificate(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-0"
                />
                <span className="text-xs font-bold text-slate-800">
                  Délivrer un Certificat Officiel à la réussite du Quiz
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATES MODAL */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-lg text-slate-900">Modèles de Formations Clés en Main</h3>
              </div>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                Fermer
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Sélectionnez un modèle MasterStudy préconfiguré avec l'ensemble des modules, leçons animées Nano Banana et exercices pratiques.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {COURSE_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <img src={tpl.thumbnail} alt={tpl.title} className="w-full h-28 object-cover rounded-xl mb-3" />
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {tpl.level} • {tpl.modulesCount} Modules
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{tpl.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tpl.shortDescription}</p>
                  </div>
                  <button
                    onClick={() => handleApplyCourseTemplate(tpl)}
                    className="w-full mt-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Appliquer ce Modèle</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
