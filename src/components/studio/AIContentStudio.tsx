import React, { useState } from 'react';
import { Course, Quiz, Center, AnimakerLesson, CourseVideoProject } from '../../types';
import { VideoEditingStudio } from './VideoEditingStudio';
import {
  INITIAL_COURSE_VIDEO_PROJECT,
  HSE_COURSE_VIDEO_PROJECT,
  ANIMAKER_PRESET_TEMPLATES,
} from '../../data/videoProjectsData';
import {
  Wand2,
  Sparkles,
  BookOpen,
  HelpCircle,
  Video,
  FileCode,
  CheckCircle2,
  Plus,
  Play,
  Save,
  ArrowRight,
  RefreshCw,
  Copy,
  Layers,
  Award,
  Film,
  Sliders,
  Maximize2,
  Tv,
} from 'lucide-react';

interface AIContentStudioProps {
  centers: Center[];
  activeCenter: Center;
  onPublishCourse: (newCourse: Course) => void;
  onOpenCourse: (course: Course) => void;
}

export const AIContentStudio: React.FC<AIContentStudioProps> = ({
  centers,
  activeCenter,
  onPublishCourse,
  onOpenCourse,
}) => {
  const [activeTab, setActiveTab] = useState<'video_editor' | 'course_gen' | 'quiz_gen' | 'script_gen' | 'manual_editor'>('video_editor');

  // Course Generator Form State
  const [courseTopic, setCourseTopic] = useState('Intelligence Artificielle pour la Finance & Détection de Fraude');
  const [targetAudience, setTargetAudience] = useState('Data Analysts, Développeurs Python et Gestionnaires de Risque');
  const [level, setLevel] = useState<'Débutant' | 'Intermédiaire' | 'Avancé'>('Intermédiaire');
  const [category, setCategory] = useState<Course['category']>('ia_data');
  const [durationHours, setDurationHours] = useState(12);
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<Course | null>(null);

  // Quiz Generator Form State
  const [quizTopic, setQuizTopic] = useState('Cybersécurité des API REST & Authentification OAuth2 / JWT');
  const [questionCount, setQuestionCount] = useState(4);
  const [quizDifficulty, setQuizDifficulty] = useState('Intermédiaire');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);

  // Script Generator Form State
  const [scriptLessonTitle, setScriptLessonTitle] = useState('Comprendre le RAG (Retrieval Augmented Generation) en 5 minutes');
  const [scriptCourseTitle, setScriptCourseTitle] = useState('Masterclass IA Générative Academia ITECH');
  const [scriptDuration, setScriptDuration] = useState(5);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  // Video Studio State
  const [isStudioModalOpen, setIsStudioModalOpen] = useState(false);
  const [selectedVideoTemplate, setSelectedVideoTemplate] = useState<CourseVideoProject>(INITIAL_COURSE_VIDEO_PROJECT);
  const [videoPublishSuccess, setVideoPublishSuccess] = useState<string | null>(null);

  // Manual Editor State
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualCategory, setManualCategory] = useState<Course['category']>('development');

  // Handlers
  const handleGenerateCourse = async () => {
    setIsGeneratingCourse(true);
    try {
      const response = await fetch('/api/gemini/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: courseTopic,
          audience: targetAudience,
          level,
          category,
          durationHours,
          centerName: activeCenter.name,
        }),
      });
      const data = await response.json();
      if (data.course) {
        const fullCourse: Course = {
          id: `course-ai-${Date.now()}`,
          title: data.course.title || courseTopic,
          slug: (data.course.title || courseTopic).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          shortDescription: data.course.shortDescription || `Cours généré par l'IA Academia ITECH sur ${courseTopic}`,
          description: data.course.description || `Programme complet conçu pour maîtriser ${courseTopic}.`,
          category: category,
          level: level,
          durationHours: durationHours,
          thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
          bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
          authorId: 'trainer-ai-studio',
          authorName: 'Studio IA & Formateurs ITECH',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          authorRole: 'IA Pédagogique & Collège Académique',
          centerId: activeCenter.id,
          centerName: activeCenter.name,
          rating: 5.0,
          reviewCount: 1,
          studentCount: 1,
          price: 0,
          isFeatured: true,
          isNew: true,
          hasCertificate: true,
          tags: data.course.tags || ['IA', 'Academia ITECH', 'Certifié'],
          skillsGained: data.course.skillsGained || ['Architecture moderne', 'Pratique concrète'],
          chapters: data.course.chapters || [],
          finalQuiz: data.course.finalQuiz,
        };
        setGeneratedCourse(fullCourse);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCourse(false);
    }
  };

  const handlePublishGeneratedCourse = () => {
    if (generatedCourse) {
      onPublishCourse(generatedCourse);
      alert(`🎉 Félicitations ! Le cours "${generatedCourse.title}" est maintenant publié sur le catalogue officiel du centre ${activeCenter.name}.`);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const response = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizTopic,
          questionCount,
          difficulty: quizDifficulty,
        }),
      });
      const data = await response.json();
      if (data.quiz) {
        setGeneratedQuiz({
          id: `quiz-gen-${Date.now()}`,
          title: data.quiz.title || `Quiz : ${quizTopic}`,
          description: data.quiz.description || 'Testez vos connaissances en temps réel.',
          courseId: 'custom',
          passingScore: data.quiz.passingScore || 75,
          timeLimitMinutes: data.quiz.timeLimitMinutes || 10,
          xpReward: data.quiz.xpReward || 250,
          questions: data.quiz.questions || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    try {
      const response = await fetch('/api/gemini/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle: scriptLessonTitle,
          courseTitle: scriptCourseTitle,
          durationTarget: scriptDuration,
        }),
      });
      const data = await response.json();
      if (data.script) {
        setGeneratedScript(data.script);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  return (
    <div id="ai-content-studio-view" className="space-y-8 pb-16">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Studio IA de Création & Ingénierie Pédagogique
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Générez des cours, modules interactifs, quiz d'évaluation et scripts de tournage en quelques secondes grâce à Gemini 3.7.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Moteur Gemini 3.7 Flash Actif</span>
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          id="studio-tab-video-editor"
          onClick={() => setActiveTab('video_editor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'video_editor'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Film className="w-4 h-4 text-amber-300" />
          <span>Logiciel de Montage Vidéo (NLE Studio)</span>
        </button>

        <button
          id="studio-tab-course-gen"
          onClick={() => setActiveTab('course_gen')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'course_gen'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Générateur de Cours IA</span>
        </button>

        <button
          id="studio-tab-quiz-gen"
          onClick={() => setActiveTab('quiz_gen')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'quiz_gen'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Générateur de Quiz & Examens IA</span>
        </button>

        <button
          id="studio-tab-script-gen"
          onClick={() => setActiveTab('script_gen')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'script_gen'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Scripts Vidéo & Synthèses IA</span>
        </button>
      </div>

      {/* TAB 0: VIDEO EDITING STUDIO (LOGICIEL DE MONTAGE NLE) */}
      {activeTab === 'video_editor' && (
        <div className="space-y-6">
          {videoPublishSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{videoPublishSuccess}</span>
              </div>
              <button
                type="button"
                onClick={() => setVideoPublishSuccess(null)}
                className="text-xs text-emerald-400 hover:underline"
              >
                Fermer
              </button>
            </div>
          )}

          {/* Hero Banner with Workflow clarification */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black">
                  <Film className="w-3.5 h-3.5" />
                  <span>LOGICIEL DE MONTAGE NLE PROFESSIONNEL</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight">
                  Créez vos leçons vidéo multi-pistes & publiez la vidéo générée
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Le studio de montage permet d'agencer plans B-roll, formateur PiP, bande-son, animations de code et quiz interactifs.{' '}
                  <strong className="text-amber-300 font-semibold">Les apprenants ne voient pas le logiciel de montage</strong>, mais visualisent directement la vidéo finale générée dans leur lecteur de cours.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <button
                  type="button"
                  id="open-grand-modal-studio"
                  onClick={() => setIsStudioModalOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-sm shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2.5"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Ouvrir le Grand Modal du Studio</span>
                </button>
              </div>
            </div>

            {/* Template presets */}
            <div className="pt-4 border-t border-indigo-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modèles Prédéfinis au Style Animaker ({ANIMAKER_PRESET_TEMPLATES.length}) :</span>
                </p>
                <span className="text-[11px] text-slate-400">Cliquez pour charger et personnaliser dans le Grand Modal</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {ANIMAKER_PRESET_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedVideoTemplate.id === tmpl.id;
                  const quizCount = tmpl.clips.filter((c) => c.type === 'interactive_quiz').length;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => {
                        setSelectedVideoTemplate(tmpl);
                        setIsStudioModalOpen(true);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between hover:scale-[1.01] ${
                        isSelected
                          ? 'bg-indigo-900/50 border-amber-400/80 shadow-lg shadow-indigo-950/50 ring-1 ring-amber-400/40'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {tmpl.leadCharacterAvatar && (
                              <img
                                src={tmpl.leadCharacterAvatar}
                                alt={tmpl.leadCharacterName || 'Avatar'}
                                className="w-8 h-8 rounded-full object-cover border border-indigo-500/40 shrink-0"
                              />
                            )}
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                                {tmpl.title}
                              </h4>
                              <p className="text-[11px] text-amber-300/90 font-semibold truncate max-w-[180px]">
                                {tmpl.topic}
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold shrink-0">
                            {tmpl.totalDurationSeconds}s
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                          {tmpl.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <span>🎬 {tmpl.clips.length} clips</span>
                          {quizCount > 0 && (
                            <span className="text-pink-300 font-bold">❓ {quizCount} Quiz</span>
                          )}
                        </div>
                        <span className="text-amber-400 font-bold hover:underline flex items-center gap-1">
                          Ouvrir ➜
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grand Modal Rendering when open */}
          {isStudioModalOpen && (
            <VideoEditingStudio
              isModal={true}
              initialVideoProject={selectedVideoTemplate}
              courseTitle={selectedVideoTemplate.title}
              onClose={() => setIsStudioModalOpen(false)}
              onPublishToCourse={(animakerLesson, videoProject) => {
                const newCourse: Course = {
                  id: `course-video-${Date.now()}`,
                  title: videoProject?.title || animakerLesson.title,
                  slug: (videoProject?.title || animakerLesson.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  shortDescription: `Capsule vidéo montée en multi-pistes avec B-Roll, formateur PiP et quiz interactif sur ${videoProject?.topic || animakerLesson.topic}`,
                  description: `Cette formation vidéo a été réalisée avec le logiciel de montage NLE Academia ITECH : timeline multi-piste, incrustation d'experts, code en direct et points d'arrêt interactifs.`,
                  category: 'ia_data',
                  level: 'Intermédiaire',
                  durationHours: Math.max(1, Math.round((videoProject?.totalDurationSeconds || animakerLesson.totalDurationSeconds) / 60)),
                  thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
                  bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
                  authorId: 'trainer-video-studio',
                  authorName: videoProject?.leadCharacterName || animakerLesson.leadCharacterName || 'Robot Android ITECH',
                  authorAvatar: videoProject?.leadCharacterAvatar || animakerLesson.leadCharacterAvatar || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150&auto=format&fit=crop&q=80',
                  authorRole: 'Tuteur Robot Android Officiel',
                  centerId: activeCenter.id,
                  centerName: activeCenter.name,
                  rating: 5.0,
                  reviewCount: 3,
                  studentCount: 1,
                  price: 0,
                  isFeatured: true,
                  isNew: true,
                  hasCertificate: true,
                  tags: ['Montage Vidéo', 'NLE Timeline', 'Cours Vidéo', 'IA'],
                  skillsGained: ['Compréhension vidéo multi-pistes', 'Concepts fondamentaux', 'Pratique interactive'],
                  chapters: [
                    {
                      id: `ch-video-1`,
                      title: `Module Vidéo : ${videoProject?.title || animakerLesson.title}`,
                      lessons: [
                        {
                          id: `les-video-${Date.now()}`,
                          title: videoProject?.title || animakerLesson.title,
                          durationMinutes: Math.max(3, Math.round((videoProject?.totalDurationSeconds || animakerLesson.totalDurationSeconds) / 60)),
                          type: 'video_project',
                          videoProjectData: videoProject,
                          animakerData: animakerLesson,
                          content: `# ${videoProject?.title || animakerLesson.title}\n\nCette leçon est dispensée sous format vidéo monté en multi-pistes avec plans B-roll, formateur PiP et arrêts quiz interactifs.`,
                        },
                      ],
                    },
                  ],
                };
                onPublishCourse(newCourse);
                setIsStudioModalOpen(false);
                setVideoPublishSuccess(`🎬 La vidéo générée "${newCourse.title}" a été publiée avec succès dans le catalogue de formations !`);
              }}
            />
          )}
        </div>
      )}

      {/* TAB 1: Course Generator */}
      {activeTab === 'course_gen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Configuration Form */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Paramètres de Génération IA</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Sujet ou Titre de la Formation :
                </label>
                <input
                  id="studio-course-topic"
                  type="text"
                  value={courseTopic}
                  onChange={(e) => setCourseTopic(e.target.value)}
                  placeholder="Ex : Agentic RAG, Cybersécurité des API, Flutter Mobile..."
                  className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Public Cible & Prérequis :
                </label>
                <input
                  id="studio-course-audience"
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Ex : Développeurs juniors, Ingénieurs Big Data..."
                  className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Niveau :</label>
                  <select
                    value={level}
                    onChange={(e: any) => setLevel(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Durée Cible :</label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value={5}>5 Heures (Express)</option>
                    <option value={12}>12 Heures (Standard)</option>
                    <option value={25}>25 Heures (Masterclass)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Filière / Catégorie :</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="ia_data">IA & Data Science</option>
                  <option value="cybersecurity">Cybersécurité</option>
                  <option value="development">Développement Fullstack & Mobile</option>
                  <option value="cloud_devops">Cloud Architecture & DevOps</option>
                  <option value="business">Business & Marketing Digital</option>
                  <option value="design">Design & UX/UI Pro</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  id="studio-generate-course-btn"
                  onClick={handleGenerateCourse}
                  disabled={isGeneratingCourse || !courseTopic}
                  className="w-full py-3.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  {isGeneratingCourse ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Ingénierie Pédagogique IA en cours...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Générer le Programme Complet par IA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Generated Preview & Publishing Column */}
          <div className="lg:col-span-7 space-y-4">
            {generatedCourse ? (
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Génération Réussie
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">{generatedCourse.title}</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="publish-course-to-catalog-btn"
                      onClick={handlePublishGeneratedCourse}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Publier au Catalogue</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {generatedCourse.description}
                </p>

                {/* Skills Acquired */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Compétences validées :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedCourse.skillsGained.map((sk, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Syllabus Accordion Preview */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Modules & Leçons Générés ({generatedCourse.chapters.length} Modules) :
                  </span>
                  <div className="space-y-3">
                    {generatedCourse.chapters.map((ch) => (
                      <div key={ch.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <span>{ch.title}</span>
                          <span className="text-slate-500 font-normal">{ch.lessons.length} leçons</span>
                        </div>
                        <div className="space-y-1 pl-2 border-l border-slate-300">
                          {ch.lessons.map((les) => (
                            <div key={les.id} className="flex items-center justify-between text-xs text-slate-700 py-1">
                              <span className="flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                                {les.title}
                              </span>
                              <span className="text-slate-500 text-[11px]">{les.durationMinutes} min</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Quiz Preview */}
                {generatedCourse.finalQuiz && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Award className="w-5 h-5 text-amber-600" />
                      <div>
                        <span className="font-bold text-amber-900 block">
                          {generatedCourse.finalQuiz.title}
                        </span>
                        <span className="text-amber-700">
                          {generatedCourse.finalQuiz.questions.length} questions • Récompense : +{generatedCourse.finalQuiz.xpReward} XP
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-3 shadow-xs">
                <Wand2 className="w-12 h-12 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">
                  Prêt à concevoir votre prochain cursus d'excellence
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Remplissez les critères à gauche et lancez l'ingénierie IA pour obtenir un programme certifiant complet avec quiz et exercices de code.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Quiz Generator */}
      {activeTab === 'quiz_gen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Générateur de Quiz Automatisé</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Thème du Quiz :</label>
                <input
                  id="studio-quiz-topic"
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  placeholder="Ex : Docker & Kubernetes, Prompt Engineering..."
                  className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Nb de Questions :</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={8}>8 Questions</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Difficulté :</label>
                  <select
                    value={quizDifficulty}
                    onChange={(e) => setQuizDifficulty(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200"
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé (Expert)">Avancé (Expert)</option>
                  </select>
                </div>
              </div>

              <button
                id="studio-generate-quiz-btn"
                onClick={handleGenerateQuiz}
                disabled={isGeneratingQuiz}
                className="w-full py-3.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                {isGeneratingQuiz ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Générer les Questions & Explications</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {generatedQuiz ? (
              <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900">{generatedQuiz.title}</h3>
                  <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">+{generatedQuiz.xpReward} XP</span>
                </div>

                <div className="space-y-4">
                  {generatedQuiz.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-xs font-bold text-indigo-700 block">Question {idx + 1} :</span>
                      <p className="text-xs text-slate-900 font-medium">{q.question}</p>
                      <div className="space-y-1 pt-1">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                              oIdx === q.correctIndex
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold'
                                : 'bg-white text-slate-700 border border-slate-200'
                            }`}
                          >
                            <span className="font-mono text-[10px] text-slate-400">{String.fromCharCode(65 + oIdx)}.</span>
                            <span>{opt}</span>
                            {oIdx === q.correctIndex && <span className="ml-auto text-[10px] text-emerald-700 font-bold">✓ Bonne réponse</span>}
                          </div>
                        ))}
                      </div>
                      <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg mt-2 border border-slate-200">
                        💡 <strong>Explication :</strong> {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-200 text-center text-slate-500 text-xs shadow-xs">
                Aucun quiz généré pour le moment.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Video Scripts & Summaries */}
      {activeTab === 'script_gen' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Script Vidéo pour Formateur</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Titre de la Leçon :</label>
                <input
                  id="studio-script-lesson"
                  type="text"
                  value={scriptLessonTitle}
                  onChange={(e) => setScriptLessonTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Nom du Cours :</label>
                <input
                  id="studio-script-course"
                  type="text"
                  value={scriptCourseTitle}
                  onChange={(e) => setScriptCourseTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Durée Vidéo Estimée :</label>
                <select
                  value={scriptDuration}
                  onChange={(e) => setScriptDuration(Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200"
                >
                  <option value={3}>3 Minutes (Format Court / TikTok / Reel)</option>
                  <option value={5}>5 Minutes (Format Capsule Vidéo)</option>
                  <option value={10}>10 Minutes (Démonstration Détaillée)</option>
                </select>
              </div>

              <button
                id="studio-generate-script-btn"
                onClick={handleGenerateScript}
                disabled={isGeneratingScript}
                className="w-full py-3.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                {isGeneratingScript ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                <span>Rédiger le Script Mot-à-Mot</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {generatedScript ? (
              <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Script de Tournage Téléchargeable</h3>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedScript);
                      alert('Script copié dans le presse-papier !');
                    }}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier</span>
                  </button>
                </div>

                <div className="whitespace-pre-line text-xs font-sans text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {generatedScript}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-200 text-center text-slate-500 text-xs shadow-xs">
                Configurez la leçon à gauche pour obtenir le script de tournage.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
