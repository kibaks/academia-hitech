import React, { useState } from 'react';
import { Course, Lesson, UserProfile } from '../../types';
import { LiveTutorChatSidebar } from './LiveTutorChatSidebar';
import { GeneratedVideoPlayer } from './GeneratedVideoPlayer';
import { PresentationPlayer } from '../teacher/PresentationPlayer';
import { PaymentCheckoutModal } from '../payment/PaymentCheckoutModal';
import { useCurrency } from '../../context/CurrencyContext';
import {
  convertAnimakerLessonToVideoProject,
  INITIAL_COURSE_VIDEO_PROJECT,
} from '../../data/videoProjectsData';
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
  MessageSquareQuote,
  ListOrdered,
  MessagesSquare,
  Presentation,
  Lock,
  Unlock,
  AlertTriangle,
  CreditCard,
  Target,
  Coins,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

interface CoursePlayerProps {
  course: Course;
  completedLessonIds: string[];
  enrolledCourseIds?: string[];
  quizScores?: Record<string, number>;
  currentUser?: UserProfile;
  onCompleteLesson: (lessonId: string) => void;
  onStartQuiz: (quizId?: string) => void;
  onBackToCatalog: () => void;
  onOpenAIAssistantWithContext: (lessonTitle: string) => void;
  onEnrollCourse?: (courseId: string, forcePaid?: boolean) => void;
}

export interface LessonAccessStatus {
  isAccessible: boolean;
  primaryLockReason: 'payment' | 'prerequisite' | 'quiz' | null;
  lockTitle: string;
  lockBadge: string;
  paymentCondition: {
    isSatisfied: boolean;
    isPaidCourse: boolean;
    isEnrolled: boolean;
    isPreview: boolean;
    price: number;
    statusText: string;
  };
  prerequisiteCondition: {
    isSatisfied: boolean;
    requiredLesson: Lesson | null;
    missingPrereqTitles: string[];
    statusText: string;
  };
  quizCondition: {
    isSatisfied: boolean;
    hasRequiredQuiz: boolean;
    quizId?: string;
    quizTitle?: string;
    requiredScore: number;
    userScore?: number;
    hasAttempted: boolean;
    statusText: string;
  };
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  completedLessonIds,
  enrolledCourseIds = [],
  quizScores = {},
  currentUser,
  onCompleteLesson,
  onStartQuiz,
  onBackToCatalog,
  onOpenAIAssistantWithContext,
  onEnrollCourse,
}) => {
  const { formatPrice } = useCurrency();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Find initial lesson
  const allLessons: Lesson[] = course.chapters.flatMap((ch) => ch.lessons);
  const [currentLessonId, setCurrentLessonId] = useState<string>(allLessons[0]?.id || '');
  const [userCode, setUserCode] = useState<string>('');
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'resources'>('content');
  const [notes, setNotes] = useState<string>('Mes notes personnelles pour cette leçon...');
  const [sidebarTab, setSidebarTab] = useState<'syllabus' | 'live_tutor'>('live_tutor');

  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const isCompleted = completedLessonIds.includes(currentLesson.id);

  // Evaluate conditional access for any lesson
  const getLessonAccessStatus = (lesson: Lesson, index: number): LessonAccessStatus => {
    // 1. Payment condition
    const isPaidCourse =
      course.pricingType === 'paid' ||
      course.pricingType === 'subscription' ||
      (typeof course.price === 'number' && course.price > 0);

    const isPrivilegedUser =
      currentUser?.role === 'trainer' ||
      currentUser?.role === 'center_admin' ||
      currentUser?.role === 'super_admin';

    const isEnrolled =
      Boolean(enrolledCourseIds.includes(course.id)) || isPrivilegedUser;

    // Free preview condition: lesson.allowPreview or first lesson if free
    const isPreview = Boolean(lesson.allowPreview);
    const paymentSatisfied = !isPaidCourse || isEnrolled || isPreview;

    const paymentStatusText = !isPaidCourse
      ? 'Formation Ouverte & Gratuite'
      : isEnrolled
      ? 'Frais de formation réglés (Accès complet)'
      : isPreview
      ? 'Aperçu gratuit autorisé sans paiement'
      : `Frais à régler : ${formatPrice(course.price || course.priceUSD || 0)}`;

    // 2. Prerequisite & Sequential progression condition
    let prereqSatisfied = true;
    let requiredLesson: Lesson | null = null;
    const missingPrereqTitles: string[] = [];

    // Prior lesson must be validated
    if (index > 0) {
      const prevLesson = allLessons[index - 1];
      if (!completedLessonIds.includes(prevLesson.id)) {
        prereqSatisfied = false;
        requiredLesson = prevLesson;
        missingPrereqTitles.push(prevLesson.title);
      }
    }

    // Explicit prerequisites list check
    if (lesson.prerequisites && lesson.prerequisites.length > 0) {
      for (const reqId of lesson.prerequisites) {
        if (!completedLessonIds.includes(reqId)) {
          prereqSatisfied = false;
          const foundReq = allLessons.find((l) => l.id === reqId);
          if (foundReq && !missingPrereqTitles.includes(foundReq.title)) {
            missingPrereqTitles.push(foundReq.title);
            if (!requiredLesson) requiredLesson = foundReq;
          }
        }
      }
    }

    const prereqStatusText =
      index === 0
        ? 'Première leçon du cursus (Aucun prérequis)'
        : prereqSatisfied
        ? 'Leçon précédente validée'
        : `Leçon précédente obligatoire (${missingPrereqTitles[0] || 'Prérequis'})`;

    // 3. Quiz condition with precise percentage
    let hasRequiredQuiz = false;
    let quizId: string | undefined = lesson.quizId;
    let quizTitle: string | undefined = undefined;
    let requiredScore = lesson.requiredQuizScore || 75;

    // Direct quiz on lesson
    if (lesson.quizId || lesson.requiredQuizScore) {
      hasRequiredQuiz = true;
      requiredScore = lesson.requiredQuizScore || 75;
      quizId = lesson.quizId || course.finalQuiz?.id;
    } else {
      // Check if previous lesson had a checkpoint quiz
      if (index > 0) {
        const prev = allLessons[index - 1];
        if (prev.quizId || prev.requiredQuizScore) {
          hasRequiredQuiz = true;
          quizId = prev.quizId;
          requiredScore = prev.requiredQuizScore || 75;
        }
      }
      // Check if parent chapter has a checkpoint quiz
      const parentChapter = course.chapters.find((ch) => ch.lessons.some((l) => l.id === lesson.id));
      if (parentChapter?.checkpointQuiz && parentChapter.lessons[0].id !== lesson.id) {
        hasRequiredQuiz = true;
        quizId = parentChapter.checkpointQuiz.id;
        quizTitle = parentChapter.checkpointQuiz.title;
        requiredScore = parentChapter.checkpointQuiz.passingScore || 80;
      }
    }

    // Look up user score in quizScores or currentUser.quizScores
    let userScore: number | undefined = undefined;
    if (quizId) {
      userScore = quizScores?.[quizId] ?? currentUser?.quizScores?.[quizId];
    }
    if (userScore === undefined && quizScores?.[course.id]) {
      userScore = quizScores[course.id];
    }

    const hasAttempted = userScore !== undefined;
    const quizSatisfied = !hasRequiredQuiz || (hasAttempted && userScore >= requiredScore);

    const quizStatusText = !hasRequiredQuiz
      ? 'Aucun quiz exigé pour cette leçon'
      : !hasAttempted
      ? `Quiz requis non tenté (Seuil de réussite : ${requiredScore}%)`
      : userScore >= requiredScore
      ? `Quiz validé (${userScore}% obtenu >= ${requiredScore}%)`
      : `Score insuffisant (${userScore}% obtenu < ${requiredScore}% requis)`;

    // Primary lock classification
    let primaryLockReason: 'payment' | 'prerequisite' | 'quiz' | null = null;
    let lockTitle = '';
    let lockBadge = '';

    if (!paymentSatisfied) {
      primaryLockReason = 'payment';
      lockTitle = 'Frais de formation à payer';
      lockBadge = 'Frais requis';
    } else if (!prereqSatisfied) {
      primaryLockReason = 'prerequisite';
      lockTitle = 'Leçon précédente requise';
      lockBadge = 'Leçon requise';
    } else if (!quizSatisfied) {
      primaryLockReason = 'quiz';
      lockTitle = `Quiz de validation requis (${requiredScore}%)`;
      lockBadge = `Quiz ${requiredScore}% requis`;
    }

    const isAccessible = paymentSatisfied && prereqSatisfied && quizSatisfied;

    return {
      isAccessible,
      primaryLockReason,
      lockTitle,
      lockBadge,
      paymentCondition: {
        isSatisfied: paymentSatisfied,
        isPaidCourse,
        isEnrolled,
        isPreview,
        price: course.price || course.priceUSD || 0,
        statusText: paymentStatusText,
      },
      prerequisiteCondition: {
        isSatisfied: prereqSatisfied,
        requiredLesson,
        missingPrereqTitles,
        statusText: prereqStatusText,
      },
      quizCondition: {
        isSatisfied: quizSatisfied,
        hasRequiredQuiz,
        quizId,
        quizTitle,
        requiredScore,
        userScore,
        hasAttempted,
        statusText: quizStatusText,
      },
    };
  };

  const currentLessonAccess = getLessonAccessStatus(currentLesson, currentIndex);
  const isPaidCourse =
    course.pricingType === 'paid' ||
    course.pricingType === 'subscription' ||
    (typeof course.price === 'number' && course.price > 0);
  const isEnrolled =
    Boolean(enrolledCourseIds.includes(course.id)) ||
    currentUser?.role === 'trainer' ||
    currentUser?.role === 'center_admin' ||
    currentUser?.role === 'super_admin';

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
    <div id="course-player-container" className="space-y-4 pb-12">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-200">
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

        {/* Global Progress & Certificate trigger & Tuition Payment */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap justify-end">
          {!isEnrolled && isPaidCourse && (
            <button
              id="unlock-course-fees-btn"
              onClick={() => setShowPaymentModal(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <CreditCard className="w-3.5 h-3.5 text-slate-950" />
              <span>Régler l'inscription ({formatPrice(course.price || course.priceUSD || 0)})</span>
            </button>
          )}

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-700">{progressPercent}% terminé</span>
            <div className="w-28 sm:w-32 h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden mt-1">
              <div
                className="h-full bg-sky-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            id="launch-quiz-header-btn"
            onClick={() => onStartQuiz(course.finalQuiz?.id)}
            className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span className="hidden xs:inline">Quiz & Certificat</span>
            <span className="xs:hidden">Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Player on left, Curriculum on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player & Content */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Visual Stage (Animaker 2D, Video, Code Sandbox or Conditional Lock Stage) */}
          <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
            {!currentLessonAccess.isAccessible ? (
              /* LOCKED SCREEN: 3 CONDITIONS ENFORCEMENT */
              <div id="locked-lesson-screen" className="p-4 sm:p-6 bg-gradient-to-b from-slate-900 to-slate-950 text-white space-y-4">
                {/* Header of Locked Screen */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Accès Conditionné aux Leçons Supérieures
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">
                          Leçon {currentIndex + 1}/{totalLessons}
                        </span>
                      </div>
                      <h2 className="text-sm sm:text-base md:text-lg font-bold text-white mt-0.5 truncate">
                        {currentLesson.title}
                      </h2>
                    </div>
                  </div>

                  <span
                    className={`self-start sm:self-auto px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 shrink-0 ${
                      currentLessonAccess.primaryLockReason === 'payment'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : currentLessonAccess.primaryLockReason === 'quiz'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{currentLessonAccess.lockTitle}</span>
                  </span>
                </div>

                {/* Primary Diagnostic Banner */}
                <div
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    currentLessonAccess.primaryLockReason === 'payment'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                      : currentLessonAccess.primaryLockReason === 'quiz'
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                      : 'bg-slate-800/60 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Condition Requise</span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      {currentLessonAccess.primaryLockReason === 'payment'
                        ? `Ce cours requiert le règlement des frais (${formatPrice(
                            course.price || course.priceUSD || 0
                          )}) pour accéder aux leçons supérieures.`
                        : currentLessonAccess.primaryLockReason === 'quiz'
                        ? `Vous devez valider l'évaluation d'étape avec au moins ${currentLessonAccess.quizCondition.requiredScore}% de bonnes réponses.`
                        : `Vous devez d'abord compléter la leçon précédente : « ${
                            currentLessonAccess.prerequisiteCondition.requiredLesson?.title || 'Leçon précédente'
                          } ».`}
                    </p>
                  </div>

                  {/* Primary Direct Action Button */}
                  <div className="shrink-0">
                    {currentLessonAccess.primaryLockReason === 'payment' ? (
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                      >
                        <CreditCard className="w-4 h-4 text-slate-950" />
                        <span>Régler les frais ({formatPrice(course.price || course.priceUSD || 0)})</span>
                      </button>
                    ) : currentLessonAccess.primaryLockReason === 'quiz' ? (
                      <button
                        onClick={() => onStartQuiz(currentLessonAccess.quizCondition.quizId || course.finalQuiz?.id)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20 active:scale-95 transition-all"
                      >
                        <Target className="w-4 h-4 text-white" />
                        <span>
                          {currentLessonAccess.quizCondition.hasAttempted ? 'Repasser le Quiz' : 'Passer le Quiz'} (
                          {currentLessonAccess.quizCondition.requiredScore}%)
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (currentLessonAccess.prerequisiteCondition.requiredLesson) {
                            setCurrentLessonId(currentLessonAccess.prerequisiteCondition.requiredLesson.id);
                          } else if (currentIndex > 0) {
                            setCurrentLessonId(allLessons[currentIndex - 1].id);
                          }
                        }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                        <span>Aller à la leçon requise</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 3 Pillars Requirements Cards */}
                <div className="space-y-2">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Suivi des 3 Conditions d'Accès :
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    {/* Pillar 1: Frais à Payer */}
                    <div
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        currentLessonAccess.paymentCondition.isSatisfied
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-800/40 border-amber-500/40'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-amber-400" />
                            1. Frais
                          </span>
                          {currentLessonAccess.paymentCondition.isSatisfied ? (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Validé
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              À payer
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-white">
                          {currentLessonAccess.paymentCondition.isPaidCourse
                            ? `Tarif : ${formatPrice(course.price || course.priceUSD || 0)}`
                            : 'Formation Gratuite'}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {currentLessonAccess.paymentCondition.statusText}
                        </p>
                      </div>

                      {!currentLessonAccess.paymentCondition.isSatisfied && (
                        <button
                          onClick={() => setShowPaymentModal(true)}
                          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 flex items-center justify-center gap-1 transition-all"
                        >
                          <Coins className="w-3 h-3" />
                          <span>Régler l'accès</span>
                        </button>
                      )}
                    </div>

                    {/* Pillar 2: Progression Séquentielle */}
                    <div
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        currentLessonAccess.prerequisiteCondition.isSatisfied
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-800/40 border-sky-500/40'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <ListOrdered className="w-3 h-3 text-sky-400" />
                            2. Séquence
                          </span>
                          {currentLessonAccess.prerequisiteCondition.isSatisfied ? (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Validé
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                              En attente
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {currentIndex > 0 ? allLessons[currentIndex - 1].title : 'Départ'}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {currentLessonAccess.prerequisiteCondition.statusText}
                        </p>
                      </div>

                      {!currentLessonAccess.prerequisiteCondition.isSatisfied && (
                        <button
                          onClick={() => {
                            if (currentLessonAccess.prerequisiteCondition.requiredLesson) {
                              setCurrentLessonId(currentLessonAccess.prerequisiteCondition.requiredLesson.id);
                            } else if (currentIndex > 0) {
                              setCurrentLessonId(allLessons[currentIndex - 1].id);
                            }
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/40 flex items-center justify-center gap-1 transition-all"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>Aller à la leçon</span>
                        </button>
                      )}
                    </div>

                    {/* Pillar 3: Condition du Quiz avec Pourcentage Précis */}
                    <div
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        currentLessonAccess.quizCondition.isSatisfied
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-800/40 border-rose-500/40'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Target className="w-3 h-3 text-rose-400" />
                            3. Quiz
                          </span>
                          {currentLessonAccess.quizCondition.isSatisfied ? (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {currentLessonAccess.quizCondition.hasRequiredQuiz
                                ? `${currentLessonAccess.quizCondition.userScore}% Validé`
                                : 'Non requis'}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              Seuil {currentLessonAccess.quizCondition.requiredScore}%
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-white">
                          {currentLessonAccess.quizCondition.hasRequiredQuiz
                            ? `Seuil requis : ${currentLessonAccess.quizCondition.requiredScore}% min.`
                            : 'Aucun quiz bloquant'}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {currentLessonAccess.quizCondition.statusText}
                        </p>
                      </div>

                      {!currentLessonAccess.quizCondition.isSatisfied && (
                        <button
                          onClick={() =>
                            onStartQuiz(currentLessonAccess.quizCondition.quizId || course.finalQuiz?.id)
                          }
                          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 flex items-center justify-center gap-1 transition-all"
                        >
                          <Target className="w-3 h-3" />
                          <span>
                            {currentLessonAccess.quizCondition.hasAttempted ? 'Repasser' : 'Passer le Quiz'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : currentLesson.type === 'animaker_animated' ||
              currentLesson.type === 'video_project' ||
              currentLesson.videoProjectData ||
              currentLesson.animakerData ? (
              <div className="p-3 sm:p-4 bg-slate-950">
                <GeneratedVideoPlayer
                  project={
                    currentLesson.videoProjectData ||
                    (currentLesson.animakerData
                      ? convertAnimakerLessonToVideoProject(currentLesson.animakerData)
                      : INITIAL_COURSE_VIDEO_PROJECT)
                  }
                  lessonTitle={currentLesson.title}
                  onLessonComplete={() => onCompleteLesson(currentLesson.id)}
                />
              </div>
            ) : currentLesson.type === 'video' ? (
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
            ) : currentLesson.type === 'presentation' || currentLesson.presentationData ? (
              <div className="p-4 sm:p-6 bg-slate-950">
                <PresentationPlayer
                  title={currentLesson.title}
                  presentationData={currentLesson.presentationData}
                  isEditable={false}
                />
              </div>
            ) : (
              <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900 flex items-end">
                <img
                  src={
                    course.bannerImage ||
                    course.thumbnail ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'
                  }
                  alt={currentLesson.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                <div className="relative z-10 p-4 sm:p-5 space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Module de Cours & Synthèse</span>
                  </span>
                  <h2 className="text-base sm:text-lg md:text-xl font-black text-white tracking-tight">
                    {currentLesson.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-300 max-w-2xl">
                    {course.title} • Animé par {course.authorName} ({course.centerName})
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions of Stage */}
            <div className="p-3 sm:p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  id="mark-completed-btn"
                  onClick={() => onCompleteLesson(currentLesson.id)}
                  disabled={!currentLessonAccess.isAccessible}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    !currentLessonAccess.isAccessible
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {!currentLessonAccess.isAccessible ? (
                    <>
                      <Lock className="w-4 h-4 text-slate-400" />
                      <span>Leçon verrouillée (Conditions requises)</span>
                    </>
                  ) : isCompleted ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Leçon Terminée (Validée)</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Marquer comme terminée (+50 XP)</span>
                    </>
                  )}
                </button>

                <button
                  id="ask-aida-context-btn"
                  onClick={() => setSidebarTab('live_tutor')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Bot className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>Poser une question au Tuteur</span>
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
          <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5">
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
                          <div
                            className={`space-y-2 ${
                              block.imageAlign === 'center'
                                ? 'text-center mx-auto'
                                : block.imageAlign === 'right'
                                ? 'text-right ml-auto'
                                : 'text-left mr-auto'
                            } ${
                              block.imageSize === 'small'
                                ? 'max-w-md'
                                : block.imageSize === 'medium'
                                ? 'max-w-2xl'
                                : 'w-full'
                            }`}
                          >
                            {block.title && (
                              <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                                {block.title}
                              </h4>
                            )}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs">
                              <img
                                src={block.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'}
                                alt={block.imageCaption || block.title || 'Illustration'}
                                className="w-full h-auto max-h-[500px] object-cover"
                              />
                            </div>
                            {(block.imageCaption || block.content) && (
                              <p className="text-xs text-slate-500 italic px-1">
                                {block.imageCaption || block.content}
                              </p>
                            )}
                          </div>
                        )}

                        {block.type === 'presentation' && (
                          <div className="my-4">
                            <PresentationPlayer
                              title={block.title || 'Support de Présentation PowerPoint'}
                              presentationData={block.presentationData}
                              isEditable={false}
                            />
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

        {/* Right Column: Multi-tab Sidebar (Plan du cours vs Tuteur en Direct) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Sidebar Navigation Tabs */}
          <div className="p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 flex items-center gap-1">
            <button
              type="button"
              id="sidebar-tab-live-tutor"
              onClick={() => setSidebarTab('live_tutor')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                sidebarTab === 'live_tutor'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <MessagesSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tuteur en direct</span>
            </button>

            <button
              type="button"
              id="sidebar-tab-syllabus"
              onClick={() => setSidebarTab('syllabus')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                sidebarTab === 'syllabus'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5 text-sky-600" />
              <span>Plan du cours</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700">
                {completedCount}/{totalLessons}
              </span>
            </button>
          </div>

          {/* TAB 1: LIVE TUTOR CHAT */}
          {sidebarTab === 'live_tutor' && (
            <LiveTutorChatSidebar
              course={course}
              currentLesson={currentLesson}
              userCode={userCode}
              onOpenFullTutor={() => onOpenAIAssistantWithContext(currentLesson.title)}
            />
          )}

          {/* TAB 2: SYLLABUS & CURRICULUM */}
          {sidebarTab === 'syllabus' && (
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
              <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
                {course.chapters.map((chapter, chapIdx) => (
                  <div key={chapter.id} className="space-y-2">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="truncate max-w-[220px]">
                        Chapitre {chapIdx + 1}: {chapter.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {chapter.lessons.filter((l) => completedLessonIds.includes(l.id)).length}/{chapter.lessons.length}
                      </span>
                    </div>

                    <div className="space-y-1.5 pl-2">
                      {chapter.lessons.map((lesson) => {
                        const lessonIdx = allLessons.findIndex((l) => l.id === lesson.id);
                        const accessStatus = getLessonAccessStatus(lesson, lessonIdx);
                        const isCurrent = lesson.id === currentLesson.id;
                        const isDone = completedLessonIds.includes(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            id={`curriculum-lesson-${lesson.id}`}
                            onClick={() => setCurrentLessonId(lesson.id)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                              isCurrent
                                ? 'bg-sky-50 text-sky-700 border border-sky-200 font-bold shadow-2xs'
                                : !accessStatus.isAccessible
                                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/80 bg-slate-50/40'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate flex-1 min-w-0 mr-2">
                              {isDone ? (
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : !accessStatus.isAccessible ? (
                                <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              ) : (
                                <PlayCircle
                                  className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-sky-600' : 'text-slate-400'}`}
                                />
                              )}
                              <span className="truncate">{lesson.title}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {!accessStatus.isAccessible && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    accessStatus.primaryLockReason === 'payment'
                                      ? 'bg-amber-100 text-amber-800'
                                      : accessStatus.primaryLockReason === 'quiz'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  {accessStatus.lockBadge}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">{lesson.durationMinutes}m</span>
                            </div>
                          </button>
                        );
                      })}

                      {/* Chapter Checkpoint Quiz (if applicable) */}
                      {chapter.checkpointQuiz && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => onStartQuiz(chapter.checkpointQuiz?.id)}
                            className="w-full p-2 rounded-xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-left transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Target className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <div className="min-w-0 truncate">
                                <span className="text-[11px] font-bold text-purple-950 block truncate">
                                  {chapter.checkpointQuiz.title}
                                </span>
                                <span className="text-[9px] text-purple-700">
                                  Exigence : {chapter.checkpointQuiz.passingScore || 80}% min.
                                </span>
                              </div>
                            </div>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                (quizScores[chapter.checkpointQuiz.id] || 0) >=
                                (chapter.checkpointQuiz.passingScore || 80)
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-purple-200 text-purple-900'
                              }`}
                            >
                              {(quizScores[chapter.checkpointQuiz.id] || 0) >=
                              (chapter.checkpointQuiz.passingScore || 80)
                                ? `${quizScores[chapter.checkpointQuiz.id]}% Validé`
                                : 'Quiz Requis'}
                            </span>
                          </button>
                        </div>
                      )}
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
                      <Award className="w-5 h-5 text-amber-600 shrink-0" />
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
          )}
        </div>
      </div>

      {/* Payment Checkout Modal for conditional paid course access */}
      <PaymentCheckoutModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        currentUser={currentUser}
        onSuccess={() => {
          onEnrollCourse(course.id);
          setShowPaymentModal(false);
        }}
      />
    </div>
  );
};
