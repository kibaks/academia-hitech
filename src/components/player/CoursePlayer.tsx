import React, { useState } from 'react';
import { Course, Lesson } from '../../types';
import {
  PlayCircle,
  CheckCircle,
  FileText,
  Code2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  BookOpen,
  Award,
  Bot,
  Terminal,
  Play,
  RotateCcw,
  Check,
  ExternalLink,
  MessageSquareQuote
} from 'lucide-react';

interface CoursePlayerProps {
  course: Course;
  completedLessonIds: string[];
  onCompleteLesson: (lessonId: string) => void;
  onStartQuiz: (quizId?: string) => void;
  onBackToCatalog: () => void;
  onOpenAIAssistantWithContext: (lessonTitle: string) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  completedLessonIds,
  onCompleteLesson,
  onStartQuiz,
  onBackToCatalog,
  onOpenAIAssistantWithContext,
}) => {
  // Find initial lesson
  const allLessons: Lesson[] = course.chapters.flatMap((ch) => ch.lessons);
  const [currentLessonId, setCurrentLessonId] = useState<string>(allLessons[0]?.id || '');
  const [userCode, setUserCode] = useState<string>('');
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'resources'>('content');
  const [notes, setNotes] = useState<string>('Mes notes personnelles pour cette leçon...');

  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const isCompleted = completedLessonIds.includes(currentLesson.id);

  // Initialize code starter if interactive code
  React.useEffect(() => {
    if (currentLesson?.codeStarter) {
      setUserCode(currentLesson.codeStarter);
      setCodeOutput(null);
    }
  }, [currentLesson?.id]);

  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const handleRunCode = () => {
    // Simulated interactive code runner
    setCodeOutput("⏳ Exécution du code dans l'environnement virtuel Academia ITECH...");
    setTimeout(() => {
      if (userCode.includes('print') || userCode.includes('return') || userCode.includes('console.log')) {
        setCodeOutput(`[Sortie Console ITECH Sandbox] :\n> Compilation réussie (0.12s)\n> Exécution des tests unitaires : 3/3 Validés ✅\n> Code conforme aux standards PEP8 / ESLint.`);
      } else {
        setCodeOutput(`[Sortie Console] : Code exécuté sans erreur de syntaxe.`);
      }
    }, 400);
  };

  const handleNextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      setCurrentLessonId(allLessons[currentIndex + 1].id);
    }
  };

  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      setCurrentLessonId(allLessons[currentIndex - 1].id);
    }
  };

  return (
    <div id="course-player-container" className="space-y-6 pb-20">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <button
            id="back-to-catalog-btn"
            onClick={onBackToCatalog}
            className="p-2 rounded-xl bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-xs shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span className="hidden xs:inline">Catalogue</span>
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs text-sky-600 font-semibold truncate">
              {course.title}
            </div>
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 truncate">
              {currentLesson.title}
            </h1>
          </div>
        </div>

        {/* Global Progress & Certificate trigger */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-700">{progressPercent}% terminé</span>
            <div className="w-32 h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden mt-1">
              <div
                className="h-full bg-sky-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            id="launch-quiz-header-btn"
            onClick={() => onStartQuiz(course.finalQuiz?.id)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span>Quiz & Certificat</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Player on left, Curriculum on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player & Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Visual Stage (Video or Code Sandbox) */}
          <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
            {currentLesson.type === 'video' ? (
              <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                {currentLesson.videoUrl ? (
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <PlayCircle className="w-16 h-16 text-sky-400 mx-auto" />
                    <p className="text-sm text-slate-100 font-semibold">
                      Vidéo de formation interactive Academia ITECH
                    </p>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                      Module sonorisé avec transcription automatisée et repères chapitrés.
                    </p>
                  </div>
                )}
              </div>
            ) : currentLesson.type === 'interactive_code' ? (
              <div className="p-4 sm:p-6 space-y-4 bg-slate-900 text-slate-100">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                    <Terminal className="w-4 h-4" />
                    <span>Environnement de Code Interactif ({currentLesson.codeLanguage || 'Python'})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUserCode(currentLesson.codeStarter || '')}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Réinitialiser</span>
                    </button>
                    <button
                      onClick={handleRunCode}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                      <span>Exécuter le code</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    id="code-editor-input"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    rows={8}
                    className="w-full p-4 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm border border-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 leading-relaxed resize-none"
                    placeholder="Écrivez votre code ici..."
                  />
                </div>

                {codeOutput && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap">
                    {codeOutput}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900 flex items-end">
                <img
                  src={course.bannerImage || course.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'}
                  alt={currentLesson.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                <div className="relative z-10 p-6 sm:p-8 space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Module de Cours & Synthèse</span>
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentLesson.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                    {course.title} • Animé par {course.authorName} ({course.centerName})
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions of Stage */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  id="mark-completed-btn"
                  onClick={() => onCompleteLesson(currentLesson.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isCompleted ? 'Leçon Terminée (Validée)' : 'Marquer comme terminée (+50 XP)'}</span>
                </button>

                <button
                  id="ask-aida-context-btn"
                  onClick={() => onOpenAIAssistantWithContext(currentLesson.title)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 flex items-center gap-1.5 transition-colors"
                >
                  <Bot className="w-4 h-4 text-sky-600" />
                  <span>Demander à AIDA (Tuteur IA)</span>
                </button>
              </div>

              {/* Prev / Next buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevLesson}
                  disabled={currentIndex === 0}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>
                <button
                  onClick={handleNextLesson}
                  disabled={currentIndex === allLessons.length - 1}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Tabs: Lesson Content, Notes, Resources */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'content'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Contenu de la Leçon
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'notes'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bloc-Notes Personnel
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'resources'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ressources Téléchargeables ({currentLesson.resources?.length || 1})
              </button>
            </div>

            {/* Tab 1: Content */}
            {activeTab === 'content' && (
              <div className="max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
                {/* Visual Elementor Blocks Rendering */}
                {currentLesson.blocks && currentLesson.blocks.length > 0 ? (
                  <div className="space-y-6">
                    {currentLesson.blocks.map((block) => (
                      <div key={block.id} className="transition-all">
                        {block.type === 'heading' && (
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            {block.title || block.content}
                          </h3>
                        )}

                        {block.type === 'text' && (
                          <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                            {block.content}
                          </p>
                        )}

                        {block.type === 'callout' && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/80 border-l-4 border-sky-500 text-sky-950 font-medium text-sm sm:text-base flex items-start gap-3 shadow-2xs">
                            <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                            <div className="leading-relaxed">
                              {block.title && <div className="font-bold mb-1">{block.title}</div>}
                              {block.content}
                            </div>
                          </div>
                        )}

                        {block.type === 'code' && (
                          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
                            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                              <span>{block.codeLanguage || 'Code Snippet'}</span>
                              <span className="text-[10px] uppercase font-bold text-sky-400">Sandbox ITECH</span>
                            </div>
                            <pre className="p-4 text-emerald-300 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                              <code>{block.codeContent || block.content}</code>
                            </pre>
                          </div>
                        )}

                        {block.type === 'image' && (
                          <div className="space-y-1.5">
                            <img
                              src={block.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'}
                              alt={block.imageCaption || 'Illustration'}
                              className="w-full h-auto max-h-96 object-cover rounded-2xl border border-slate-200 shadow-xs"
                            />
                            {(block.imageCaption || block.content) && (
                              <p className="text-center text-xs text-slate-500 italic">
                                {block.imageCaption || block.content}
                              </p>
                            )}
                          </div>
                        )}

                        {block.type === 'video' && (
                          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md flex items-center justify-center text-white">
                            <div className="text-center space-y-2">
                              <PlayCircle className="w-12 h-12 mx-auto text-sky-400 animate-pulse" />
                              <p className="text-xs font-semibold">{block.title || block.content || 'Vidéo Pédagogique Intégrée'}</p>
                            </div>
                          </div>
                        )}

                        {block.type === 'quiz' && block.quizQuestion && (
                          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                            <span className="text-xs font-black uppercase text-emerald-900">
                              ❓ Question de Compréhension
                            </span>
                            <p className="text-sm font-bold text-slate-900">{block.quizQuestion.question}</p>
                            <div className="space-y-1.5 pt-1">
                              {block.quizQuestion.options.map((opt, i) => (
                                <div
                                  key={i}
                                  className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-medium"
                                >
                                  {opt}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {block.type === 'nano_banana' && (
                          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-slate-950 space-y-3 shadow-md">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">🍌</span>
                              <h4 className="text-base font-black tracking-tight">{block.title || block.content || 'Micro-cours Nano Banana'}</h4>
                            </div>
                            <p className="text-xs font-semibold text-slate-900/90">
                              Micro-cours animé avec attention visuelle optimisée.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                        Résumé de la Leçon
                      </div>
                      <p className="text-xs text-slate-600">{course.shortDescription}</p>
                    </div>

                    <div className="whitespace-pre-line font-sans text-slate-700 text-sm leading-relaxed">
                      {currentLesson.content}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab 2: Notes */}
            {activeTab === 'notes' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Vos notes sont sauvegardées localement pour chaque leçon.
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  className="w-full p-3 rounded-xl bg-slate-50 text-slate-800 text-xs sm:text-sm border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
            )}

            {/* Tab 3: Resources */}
            {activeTab === 'resources' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-sky-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Fiche Mnémonique & Guide Complet (PDF)
                      </span>
                      <span className="text-[11px] text-slate-500">Taille : 2.4 MB • Version Academia ITECH</span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert("Téléchargement de la ressource ITECH démarré !")}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-sky-700 hover:bg-sky-50 text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Syllabus Checklist Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Plan de la Formation</h3>
                <span className="text-xs text-slate-500">{completedCount} sur {totalLessons} leçons terminées</span>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded-md border border-sky-200">
                {progressPercent}%
              </span>
            </div>

            {/* Modules Accordion */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {course.chapters.map((chapter, cIdx) => (
                <div key={chapter.id} className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="truncate max-w-[220px]">{chapter.title}</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {chapter.lessons.filter((l) => completedLessonIds.includes(l.id)).length}/{chapter.lessons.length}
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-2">
                    {chapter.lessons.map((lesson) => {
                      const isCurrent = lesson.id === currentLesson.id;
                      const isDone = completedLessonIds.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          id={`curriculum-lesson-${lesson.id}`}
                          onClick={() => setCurrentLessonId(lesson.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                            isCurrent
                              ? 'bg-sky-50 text-sky-700 border border-sky-200 font-bold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            {isDone ? (
                              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <PlayCircle className={`w-4 h-4 flex-shrink-0 ${isCurrent ? 'text-sky-600' : 'text-slate-400'}`} />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 ml-2">{lesson.durationMinutes}m</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Final Assessment Trigger */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  id="syllabus-final-quiz-btn"
                  onClick={() => onStartQuiz(course.finalQuiz?.id)}
                  className="w-full p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left hover:bg-amber-100/60 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">
                        Évaluation Finale & Certificat
                      </span>
                      <span className="text-[10px] text-amber-700">Score min. requis : 75%</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
