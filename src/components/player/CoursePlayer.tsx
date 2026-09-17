import React, { useState } from 'react';
import { Course, Lesson, UserProfile, CourseVideoProject } from '../../types';
import { LiveTutorChatSidebar } from './LiveTutorChatSidebar';
import { GeneratedVideoPlayer } from './GeneratedVideoPlayer';
import { VideoLessonPlayer } from './VideoLessonPlayer';
import { VideoEditingStudio } from '../studio/VideoEditingStudio';
import { PresentationPlayer } from '../teacher/PresentationPlayer';
import { PaymentCheckoutModal } from '../payment/PaymentCheckoutModal';
import { useCurrency } from '../../context/CurrencyContext';
import { MasterStudyAIAssistant } from './MasterStudyAIAssistant';
import { LessonStudentNotes } from './LessonStudentNotes';
import { LessonDiscussionQA } from './LessonDiscussionQA';
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
  Clock,
  Crown,
  LogIn,
  UserCheck,
  Zap,
  Maximize2,
  Minimize2,
  Flame,
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
  onEnrollCourse?: (courseId: string, forcePaid?: boolean, unlockedLessonId?: string) => void;
  onRequireAuth?: () => void;
  onSubscribePlan?: (planId?: string) => void;
}

export interface LessonAccessStatus {
  isAccessible: boolean;
  primaryLockReason:
    | 'auth'
    | 'course_quiz'
    | 'subscription'
    | 'lesson_payment'
    | 'payment'
    | 'prerequisite'
    | 'quiz'
    | null;
  lockTitle: string;
  lockBadge: string;
  authCondition: {
    isSatisfied: boolean;
    requiresLogin: boolean;
    statusText: string;
  };
  courseQuizCondition: {
    isSatisfied: boolean;
    hasCourseAdmissionQuiz: boolean;
    quizId?: string;
    quizTitle?: string;
    requiredScore: number;
    userScore?: number;
    hasAttempted: boolean;
    statusText: string;
  };
  subscriptionCondition: {
    isSatisfied: boolean;
    requiresSubscription: boolean;
    hasActiveSubscription: boolean;
    statusText: string;
  };
  paymentCondition: {
    isSatisfied: boolean;
    isPaidCourse: boolean;
    isEnrolled: boolean;
    isPreview: boolean;
    isLessonSpecificallyLocked: boolean;
    lessonPrice: number;
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
  onRequireAuth,
  onSubscribePlan,
}) => {
  const { formatPrice } = useCurrency();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [targetLessonForPayment, setTargetLessonForPayment] = useState<Lesson | undefined>(undefined);

  // Find initial lesson
  const allLessons: Lesson[] = course.chapters.flatMap((ch) => ch.lessons);
  const [currentLessonId, setCurrentLessonId] = useState<string>(allLessons[0]?.id || '');
  const [userCode, setUserCode] = useState<string>('');
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'content' | 'ai_assistant' | 'notes' | 'qa' | 'resources'
  >('content');
  const [notes, setNotes] = useState<string>('Mes notes personnelles pour cette leçon...');
  const [sidebarTab, setSidebarTab] = useState<'syllabus' | 'live_tutor'>('live_tutor');
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Video playback mode (mounted studio project vs raw video stream)
  const [videoModeByLesson, setVideoModeByLesson] = useState<Record<string, 'mounted' | 'raw'>>({});
  const [editingVideoModalOpen, setEditingVideoModalOpen] = useState<boolean>(false);
  const [activeVideoProject, setActiveVideoProject] = useState<CourseVideoProject | null>(null);

  // Permissions: Only trainers/admins can edit or realize video montages. Learners cannot create or edit montages.
  const isTeacherOrAdmin = Boolean(
    currentUser &&
      (currentUser.role === 'trainer' ||
        currentUser.role === 'center_admin' ||
        currentUser.role === 'super_admin')
  );

  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  const isCompleted = completedLessonIds.includes(currentLesson.id);

  // Keyboard navigation shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'f' || e.key === 'F') {
        setIsFocusMode((prev) => !prev);
      } else if (e.key === 'n' || e.key === 'N') {
        if (currentIndex < allLessons.length - 1) {
          setCurrentLessonId(allLessons[currentIndex + 1].id);
        }
      } else if (e.key === 'p' || e.key === 'P') {
        if (currentIndex > 0) {
          setCurrentLessonId(allLessons[currentIndex - 1].id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allLessons.length]);

  // Evaluate conditional access for any lesson with comprehensive multi-criteria logic
  const getLessonAccessStatus = (lesson: Lesson, index: number): LessonAccessStatus => {
    const isPrivilegedUser =
      currentUser?.role === 'trainer' ||
      currentUser?.role === 'center_admin' ||
      currentUser?.role === 'super_admin';

    const isAuthenticatedUser =
      Boolean(currentUser && currentUser.role !== 'visitor');

    const isPaidCourse =
      course.pricingType === 'paid' ||
      course.pricingType === 'subscription' ||
      (typeof course.price === 'number' && course.price > 0);

    // 0. Login Requirement Condition (for paid courses, subscription courses, or requiresLogin)
    const requiresLogin = Boolean(course.requiresLogin || isPaidCourse || course.pricingType === 'subscription');
    const authSatisfied = isPrivilegedUser || !requiresLogin || isAuthenticatedUser;
    const authStatusText = authSatisfied
      ? 'Authentification validée'
      : 'Connexion obligatoire requise pour ce cours certifiant ou payant';

    // 1. Course Admission Quiz Condition (e.g. 80% passing score to enter course)
    const hasCourseAdmissionQuiz = Boolean(course.prerequisiteQuizId || course.prerequisiteQuiz);
    const courseQuizId = course.prerequisiteQuizId || course.prerequisiteQuiz?.id;
    const courseQuizTitle = course.prerequisiteQuizTitle || course.prerequisiteQuiz?.title || 'Épreuve d\'Admission Obligatoire';
    const courseQuizRequiredScore = course.prerequisiteQuizMinScore || course.prerequisiteQuiz?.passingScore || 80;

    let admissionUserScore: number | undefined = undefined;
    if (courseQuizId) {
      admissionUserScore = quizScores?.[courseQuizId] ?? currentUser?.quizScores?.[courseQuizId];
    }
    const hasAttemptedAdmission = admissionUserScore !== undefined;
    const courseQuizSatisfied =
      isPrivilegedUser ||
      !hasCourseAdmissionQuiz ||
      (hasAttemptedAdmission && admissionUserScore >= courseQuizRequiredScore);

    const courseQuizStatusText = !hasCourseAdmissionQuiz
      ? 'Aucune épreuve d\'admission requise pour ce cours'
      : !hasAttemptedAdmission
      ? `Épreuve d'admission non tentée (Seuil requis : ${courseQuizRequiredScore}%)`
      : admissionUserScore >= courseQuizRequiredScore
      ? `Admission validée (${admissionUserScore}% >= ${courseQuizRequiredScore}%)`
      : `Admission refusée (${admissionUserScore}% < ${courseQuizRequiredScore}% requis)`;

    // 2. Subscription Condition
    const courseRequiresSub = course.pricingType === 'subscription';
    const lessonRequiresSub = Boolean(lesson.requiresSubscription);
    const requiresSub = courseRequiresSub || lessonRequiresSub;
    const hasActiveSubscription =
      Boolean(currentUser?.subscription?.status === 'active' || currentUser?.subscriptionPlan);
    const subscriptionSatisfied = isPrivilegedUser || !requiresSub || hasActiveSubscription;
    const subscriptionStatusText = !requiresSub
      ? 'Non soumis à l\'abonnement Pass'
      : hasActiveSubscription
      ? 'Pass Pro Actif (Accès illimité débloqué)'
      : 'Abonnement Pass Pro requis pour déverrouiller ce programme';

    // 3. Payment & Enrollment Condition
    const isEnrolledInCourse =
      Boolean(enrolledCourseIds.includes(course.id)) ||
      Boolean(currentUser?.paidCourseIds?.includes(course.id)) ||
      (courseRequiresSub && hasActiveSubscription) ||
      isPrivilegedUser;

    const isLessonSpecificallyLocked = Boolean(lesson.isPremiumLocked || lesson.requiresPayment);
    const isLessonPaid =
      Boolean(currentUser?.paidLessonIds?.includes(lesson.id)) ||
      (isEnrolledInCourse && isPaidCourse) ||
      hasActiveSubscription ||
      isPrivilegedUser;

    const isPreview = Boolean(lesson.allowPreview);

    // Course payment satisfied if enrolled, or free course, or preview allowed (and lesson not specifically locked)
    const generalPaymentSatisfied =
      isPrivilegedUser ||
      !isPaidCourse ||
      isEnrolledInCourse ||
      (isPreview && !isLessonSpecificallyLocked);

    // Lesson specific payment satisfied
    const lessonPaymentSatisfied = !isLessonSpecificallyLocked || isLessonPaid;

    const overallPaymentSatisfied = generalPaymentSatisfied && lessonPaymentSatisfied;

    let paymentStatusText = '';
    if (!isPaidCourse && !isLessonSpecificallyLocked) {
      paymentStatusText = 'Formation Ouverte & Gratuite';
    } else if (isLessonSpecificallyLocked && !isLessonPaid) {
      paymentStatusText = `Leçon Premium verrouillée : ${formatPrice(lesson.lessonPrice || 5)} pour débloquer`;
    } else if (isEnrolledInCourse || isLessonPaid) {
      paymentStatusText = 'Frais réglés (Accès complet débloqué)';
    } else if (isPreview) {
      paymentStatusText = 'Aperçu gratuit autorisé sans paiement';
    } else {
      paymentStatusText = `Frais à régler : ${formatPrice(course.price || course.priceUSD || 0)}`;
    }

    // 4. Sequential Prerequisite Condition
    let prereqSatisfied = true;
    let requiredLesson: Lesson | null = null;
    const missingPrereqTitles: string[] = [];

    if (index > 0) {
      const prevLesson = allLessons[index - 1];
      if (!completedLessonIds.includes(prevLesson.id)) {
        prereqSatisfied = false;
        requiredLesson = prevLesson;
        missingPrereqTitles.push(prevLesson.title);
      }
    }

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

    // 5. Lesson Checkpoint Quiz Condition (with precise passing score)
    let hasRequiredQuiz = false;
    let quizId: string | undefined = lesson.prerequisiteQuizId || lesson.quizId;
    let quizTitle: string | undefined = lesson.prerequisiteQuizTitle;
    let requiredScore = lesson.requiredQuizScore || 80;

    if (lesson.prerequisiteQuizId || lesson.quizId || lesson.requiredQuizScore) {
      hasRequiredQuiz = true;
      requiredScore = lesson.requiredQuizScore || 80;
      quizId = lesson.prerequisiteQuizId || lesson.quizId || course.finalQuiz?.id;
    } else {
      if (index > 0) {
        const prev = allLessons[index - 1];
        if (prev.quizId || prev.requiredQuizScore) {
          hasRequiredQuiz = true;
          quizId = prev.quizId;
          requiredScore = prev.requiredQuizScore || 80;
          quizTitle = prev.title;
        }
      }
      const parentChapter = course.chapters.find((ch) => ch.lessons.some((l) => l.id === lesson.id));
      if (parentChapter?.checkpointQuiz && parentChapter.lessons[0].id !== lesson.id) {
        hasRequiredQuiz = true;
        quizId = parentChapter.checkpointQuiz.id;
        quizTitle = parentChapter.checkpointQuiz.title;
        requiredScore = parentChapter.checkpointQuiz.passingScore || 80;
      }
    }

    let userScore: number | undefined = undefined;
    if (quizId) {
      userScore = quizScores?.[quizId] ?? currentUser?.quizScores?.[quizId];
    }
    if (userScore === undefined && quizScores?.[course.id]) {
      userScore = quizScores[course.id];
    }

    const hasAttempted = userScore !== undefined;
    const quizSatisfied =
      isPrivilegedUser || !hasRequiredQuiz || (hasAttempted && userScore >= requiredScore);

    const quizStatusText = !hasRequiredQuiz
      ? 'Aucun quiz exigé pour cette leçon'
      : !hasAttempted
      ? `Quiz requis non tenté (Seuil de réussite : ${requiredScore}%)`
      : userScore >= requiredScore
      ? `Quiz validé (${userScore}% obtenu >= ${requiredScore}%)`
      : `Score insuffisant (${userScore}% obtenu < ${requiredScore}% requis)`;

    // Determine Primary Lock Reason in strict hierarchical priority:
    let primaryLockReason: LessonAccessStatus['primaryLockReason'] = null;
    let lockTitle = '';
    let lockBadge = '';

    if (!authSatisfied) {
      primaryLockReason = 'auth';
      lockTitle = 'Connexion Obligatoire';
      lockBadge = 'Connexion requise';
    } else if (!courseQuizSatisfied) {
      primaryLockReason = 'course_quiz';
      lockTitle = `Épreuve d'Admission (${courseQuizRequiredScore}%)`;
      lockBadge = `Admission ${courseQuizRequiredScore}%`;
    } else if (!subscriptionSatisfied) {
      primaryLockReason = 'subscription';
      lockTitle = 'Pass Pro Requis';
      lockBadge = 'Pass Pro';
    } else if (isLessonSpecificallyLocked && !isLessonPaid) {
      primaryLockReason = 'lesson_payment';
      lockTitle = `Leçon Verrouillée (${formatPrice(lesson.lessonPrice || 5)})`;
      lockBadge = `Payant (${lesson.lessonPrice || 5} $)`;
    } else if (!generalPaymentSatisfied) {
      primaryLockReason = 'payment';
      lockTitle = 'Frais de formation à régler';
      lockBadge = 'Frais requis';
    } else if (!quizSatisfied) {
      primaryLockReason = 'quiz';
      lockTitle = `Quiz d'étape requis (${requiredScore}%)`;
      lockBadge = `Quiz ${requiredScore}% requis`;
    } else if (!prereqSatisfied) {
      primaryLockReason = 'prerequisite';
      lockTitle = 'Leçon précédente requise';
      lockBadge = 'Leçon requise';
    }

    const isAccessible =
      authSatisfied &&
      courseQuizSatisfied &&
      subscriptionSatisfied &&
      overallPaymentSatisfied &&
      quizSatisfied &&
      prereqSatisfied;

    return {
      isAccessible,
      primaryLockReason,
      lockTitle,
      lockBadge,
      authCondition: {
        isSatisfied: authSatisfied,
        requiresLogin,
        statusText: authStatusText,
      },
      courseQuizCondition: {
        isSatisfied: courseQuizSatisfied,
        hasCourseAdmissionQuiz,
        quizId: courseQuizId,
        quizTitle: courseQuizTitle,
        requiredScore: courseQuizRequiredScore,
        userScore: admissionUserScore,
        hasAttempted: hasAttemptedAdmission,
        statusText: courseQuizStatusText,
      },
      subscriptionCondition: {
        isSatisfied: subscriptionSatisfied,
        requiresSubscription: requiresSub,
        hasActiveSubscription,
        statusText: subscriptionStatusText,
      },
      paymentCondition: {
        isSatisfied: overallPaymentSatisfied,
        isPaidCourse,
        isEnrolled: isEnrolledInCourse,
        isPreview,
        isLessonSpecificallyLocked,
        lessonPrice: lesson.lessonPrice || 5,
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
    <div
      id="course-player-container"
      className={`space-y-4 pb-12 transition-all ${
        isFocusMode
          ? 'fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-xl overflow-y-auto p-3 sm:p-6 text-slate-100 max-w-none'
          : ''
      }`}
    >
      {/* Top Header & Breadcrumbs */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b ${
        isFocusMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            id="back-to-catalog-btn"
            onClick={onBackToCatalog}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-xs shrink-0 ${
              isFocusMode
                ? 'bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-200'
            }`}
            title="Retour au Catalogue"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span className="hidden xs:inline">Catalogue</span>
          </button>
          
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs text-sky-500 font-semibold truncate flex items-center gap-2">
              <span>{course.title}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-bold border border-sky-500/20">
                MasterStudy LMS
              </span>
            </div>
            <h1 className={`text-sm sm:text-base md:text-lg font-bold truncate mt-0.5 ${
              isFocusMode ? 'text-white' : 'text-slate-900'
            }`}>
              {currentLesson.title}
            </h1>
          </div>
        </div>

        {/* Global Progress & Certificate trigger & Tuition Payment & Focus Mode */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap justify-end">
          {/* Daily Learning Streak Badge */}
          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
            isFocusMode
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>Série : 3 jours</span>
          </div>

          {/* Focus Mode Zen Button */}
          <button
            id="toggle-focus-mode-btn"
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
              isFocusMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                : 'bg-white text-slate-700 hover:text-slate-950 border-slate-200 hover:bg-slate-50'
            }`}
            title="Activer/Désactiver le Mode Étude Immersif (Touche F)"
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-slate-500" />}
            <span className="hidden xs:inline">{isFocusMode ? 'Quitter Focus' : 'Mode Focus'}</span>
          </button>

          {!isEnrolled && isPaidCourse && (
            <button
              id="unlock-course-fees-btn"
              onClick={() => setShowPaymentModal(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <CreditCard className="w-3.5 h-3.5 text-slate-950" />
              <span>Régler ({formatPrice(course.price || course.priceUSD || 0)})</span>
            </button>
          )}

          <div className="text-right hidden sm:block">
            <span className={`text-xs font-bold ${isFocusMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {progressPercent}% validé
            </span>
            <div className="w-24 sm:w-28 h-1.5 rounded-full bg-slate-200/40 overflow-hidden mt-1">
              <div
                className="h-full bg-sky-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            id="launch-quiz-header-btn"
            onClick={() => onStartQuiz(course.finalQuiz?.id)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-white shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Award className="w-4 h-4 text-slate-950" />
            <span className="hidden xs:inline">Quiz & Certificat</span>
            <span className="xs:hidden">Quiz</span>
          </button>
        </div>
      </div>

      {/* Encouraging Celebration Banner */}
      {showCelebration && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <h4 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                <span>Félicitations ! Leçon validée avec succès</span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black">
                  +50 XP
                </span>
              </h4>
              <p className="text-[11px] text-emerald-100">
                Vous progressez vite sur <strong>{course.title}</strong> ! Ancrez vos acquis avec l'IA ou continuez.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('ai_assistant');
                setShowCelebration(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Tester avec l'IA</span>
            </button>
            {currentIndex < allLessons.length - 1 && (
              <button
                onClick={() => {
                  setShowCelebration(false);
                  handleNextLesson();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-xs hover:bg-slate-100 transition-all flex items-center gap-1"
              >
                <span>Leçon Suivante</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Player on left, Curriculum on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player & Content */}
        <div className="lg:col-span-8 space-y-4">
          {/* Main Visual Stage (Animaker 2D, Video, Code Sandbox or Conditional Lock Stage) */}
          <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
            {!currentLessonAccess.isAccessible ? (
              /* LOCKED SCREEN: COMPREHENSIVE CONDITIONAL ACCESS ENFORCEMENT */
              <div id="locked-lesson-screen" className="p-4 sm:p-6 bg-gradient-to-b from-slate-900 to-slate-950 text-white space-y-5 rounded-xl border border-slate-800">
                {/* Header of Locked Screen */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                        currentLessonAccess.primaryLockReason === 'auth'
                          ? 'bg-sky-500/20 border-sky-500/40 text-sky-400'
                          : currentLessonAccess.primaryLockReason === 'course_quiz'
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : currentLessonAccess.primaryLockReason === 'subscription'
                          ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                          : currentLessonAccess.primaryLockReason === 'lesson_payment'
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : currentLessonAccess.primaryLockReason === 'quiz'
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                          : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      }`}
                    >
                      {currentLessonAccess.primaryLockReason === 'auth' ? (
                        <LogIn className="w-5 h-5" />
                      ) : currentLessonAccess.primaryLockReason === 'course_quiz' ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : currentLessonAccess.primaryLockReason === 'subscription' ? (
                        <Crown className="w-5 h-5" />
                      ) : currentLessonAccess.primaryLockReason === 'lesson_payment' ? (
                        <Coins className="w-5 h-5" />
                      ) : currentLessonAccess.primaryLockReason === 'quiz' ? (
                        <Target className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            currentLessonAccess.primaryLockReason === 'auth'
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                              : currentLessonAccess.primaryLockReason === 'course_quiz'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : currentLessonAccess.primaryLockReason === 'subscription'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : currentLessonAccess.primaryLockReason === 'lesson_payment'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : currentLessonAccess.primaryLockReason === 'quiz'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {currentLessonAccess.primaryLockReason === 'auth'
                            ? 'Authentification Requise'
                            : currentLessonAccess.primaryLockReason === 'course_quiz'
                            ? 'Épreuve d\'Admission Conditionnelle'
                            : currentLessonAccess.primaryLockReason === 'subscription'
                            ? 'Réservé Pass Pro'
                            : currentLessonAccess.primaryLockReason === 'lesson_payment'
                            ? 'Atelier Premium Verrouillé'
                            : currentLessonAccess.primaryLockReason === 'quiz'
                            ? 'Quiz d\'Étape Requis'
                            : 'Accès Conditionné'}
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
                      currentLessonAccess.primaryLockReason === 'auth'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                        : currentLessonAccess.primaryLockReason === 'course_quiz'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : currentLessonAccess.primaryLockReason === 'subscription'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : currentLessonAccess.primaryLockReason === 'lesson_payment'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : currentLessonAccess.primaryLockReason === 'quiz'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{currentLessonAccess.lockBadge}</span>
                  </span>
                </div>

                {/* Primary Diagnostic Banner with Dynamic Direct Actions */}
                <div
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    currentLessonAccess.primaryLockReason === 'auth'
                      ? 'bg-sky-950/40 border-sky-500/40 text-sky-100'
                      : currentLessonAccess.primaryLockReason === 'course_quiz'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                      : currentLessonAccess.primaryLockReason === 'subscription'
                      ? 'bg-purple-950/40 border-purple-500/40 text-purple-100'
                      : currentLessonAccess.primaryLockReason === 'lesson_payment'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                      : currentLessonAccess.primaryLockReason === 'payment'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                      : currentLessonAccess.primaryLockReason === 'quiz'
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                      : 'bg-slate-800/60 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Condition d'Accès Prioritaire Requise</span>
                    </div>
                    <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
                      {currentLessonAccess.primaryLockReason === 'auth' ? (
                        <span>
                          Une connexion avec un compte Academia ITECH est obligatoire pour accéder à ce
                          programme certifiant ou payant. Connectez-vous pour synchroniser votre progression et
                          obtenir votre certificat.
                        </span>
                      ) : currentLessonAccess.primaryLockReason === 'course_quiz' ? (
                        <span>
                          L'accès à cette formation est conditionné par la réussite de l'épreuve d'admission : «{' '}
                          <strong>{currentLessonAccess.courseQuizCondition.quizTitle}</strong> ». Vous devez
                          obtenir au minimum{' '}
                          <strong>{currentLessonAccess.courseQuizCondition.requiredScore}%</strong> de score.
                          {currentLessonAccess.courseQuizCondition.hasAttempted && (
                            <span className="block mt-1 text-amber-300 font-semibold">
                              Dernier score obtenu : {currentLessonAccess.courseQuizCondition.userScore}% (Insuffisant)
                            </span>
                          )}
                        </span>
                      ) : currentLessonAccess.primaryLockReason === 'subscription' ? (
                        <span>
                          Ce cours de pointe est réservé aux titulaires du Pass Abonnement Pro. Activez votre pass
                          pour accéder aux clusters Kubernetes et pipelines illimités.
                        </span>
                      ) : currentLessonAccess.primaryLockReason === 'lesson_payment' ? (
                        <span>
                          Cet atelier interactif est verrouillé unitairement pour{' '}
                          <strong>{formatPrice(currentLesson.lessonPrice || 5)}</strong>. Vous pouvez régler
                          cette leçon seule ou souscrire au cours complet.
                        </span>
                      ) : currentLessonAccess.primaryLockReason === 'payment' ? (
                        <span>
                          Ce cours requiert le règlement des frais de formation (
                          {formatPrice(course.price || course.priceUSD || 0)}) pour accéder à la suite du programme.
                        </span>
                      ) : currentLessonAccess.primaryLockReason === 'quiz' ? (
                        <span>
                          Cette leçon supérieure requiert la validation préalable du Quiz d'Étape (
                          {currentLessonAccess.quizCondition.requiredScore}% requis).
                          {currentLessonAccess.quizCondition.hasAttempted && (
                            <span className="block mt-1 text-rose-300 font-semibold">
                              Dernier score obtenu : {currentLessonAccess.quizCondition.userScore}% (Inférieur au seuil)
                            </span>
                          )}
                        </span>
                      ) : (
                        <span>
                          Vous devez d'abord compléter la leçon précédente : «{' '}
                          <strong>
                            {currentLessonAccess.prerequisiteCondition.requiredLesson?.title || 'Leçon précédente'}
                          </strong>{' '}
                          ».
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Primary Direct Action Buttons depending on condition */}
                  <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2">
                    {currentLessonAccess.primaryLockReason === 'auth' ? (
                      <button
                        onClick={() => {
                          if (onRequireAuth) {
                            onRequireAuth();
                          } else {
                            window.dispatchEvent(new CustomEvent('open-auth-modal'));
                          }
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 active:scale-95 transition-all"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Se connecter / Créer un compte</span>
                      </button>
                    ) : currentLessonAccess.primaryLockReason === 'course_quiz' ? (
                      <button
                        onClick={() =>
                          onStartQuiz(
                            currentLessonAccess.courseQuizCondition.quizId || course.finalQuiz?.id
                          )
                        }
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                      >
                        <Target className="w-4 h-4 text-slate-950" />
                        <span>
                          {currentLessonAccess.courseQuizCondition.hasAttempted
                            ? 'Repasser l\'Épreuve d\'Admission'
                            : 'Passer l\'Épreuve d\'Admission'}{' '}
                          ({currentLessonAccess.courseQuizCondition.requiredScore}%)
                        </span>
                      </button>
                    ) : currentLessonAccess.primaryLockReason === 'subscription' ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            if (onSubscribePlan) {
                              onSubscribePlan('pro');
                            } else {
                              setShowPaymentModal(true);
                            }
                          }}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 active:scale-95 transition-all"
                        >
                          <Crown className="w-4 h-4" />
                          <span>Activer le Pass Pro</span>
                        </button>
                        {course.price && course.price > 0 && (
                          <button
                            onClick={() => {
                              setTargetLessonForPayment(undefined);
                              setShowPaymentModal(true);
                            }}
                            className="w-full sm:w-auto px-3.5 py-2 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                          >
                            <span>Acheter à l'unité ({formatPrice(course.price)})</span>
                          </button>
                        )}
                      </div>
                    ) : currentLessonAccess.primaryLockReason === 'lesson_payment' ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setTargetLessonForPayment(currentLesson);
                            setShowPaymentModal(true);
                          }}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                          <Coins className="w-4 h-4 text-slate-950" />
                          <span>Débloquer cette Leçon ({formatPrice(currentLesson.lessonPrice || 5)})</span>
                        </button>
                        <button
                          onClick={() => {
                            setTargetLessonForPayment(undefined);
                            setShowPaymentModal(true);
                          }}
                          className="w-full sm:w-auto px-3.5 py-2 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                        >
                          <span>Cours complet ({formatPrice(course.price || 40)})</span>
                        </button>
                      </div>
                    ) : currentLessonAccess.primaryLockReason === 'payment' ? (
                      <button
                        onClick={() => {
                          setTargetLessonForPayment(undefined);
                          setShowPaymentModal(true);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                      >
                        <CreditCard className="w-4 h-4 text-slate-950" />
                        <span>Régler le cours complet ({formatPrice(course.price || course.priceUSD || 0)})</span>
                      </button>
                    ) : currentLessonAccess.primaryLockReason === 'quiz' ? (
                      <button
                        onClick={() =>
                          onStartQuiz(
                            currentLessonAccess.quizCondition.quizId || course.finalQuiz?.id
                          )
                        }
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 active:scale-95 transition-all"
                      >
                        <Target className="w-4 h-4 text-white" />
                        <span>
                          {currentLessonAccess.quizCondition.hasAttempted
                            ? 'Repasser le Quiz'
                            : 'Passer le Quiz'}{' '}
                          ({currentLessonAccess.quizCondition.requiredScore}%)
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (currentLessonAccess.prerequisiteCondition.requiredLesson) {
                            setCurrentLessonId(
                              currentLessonAccess.prerequisiteCondition.requiredLesson.id
                            );
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

                {/* 4 Multi-criteria Pillars Requirements Cards */}
                <div className="space-y-2">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Suivi des 4 Conditions d'Accès de la Plateforme :
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {/* Pillar 1: Connexion & Authentification */}
                    <div
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        currentLessonAccess.authCondition.isSatisfied
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-800/40 border-sky-500/40'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-sky-400" />
                            1. Connexion
                          </span>
                          {currentLessonAccess.authCondition.isSatisfied ? (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Connecté
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                              Requis
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {currentLessonAccess.authCondition.isSatisfied
                            ? currentUser?.name || 'Utilisateur Identifié'
                            : 'Visiteur non connecté'}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                          {currentLessonAccess.authCondition.statusText}
                        </p>
                      </div>

                      {!currentLessonAccess.authCondition.isSatisfied && (
                        <button
                          onClick={() => {
                            if (onRequireAuth) {
                              onRequireAuth();
                            } else {
                              window.dispatchEvent(new CustomEvent('open-auth-modal'));
                            }
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/40 flex items-center justify-center gap-1 transition-all"
                        >
                          <LogIn className="w-3 h-3" />
                          <span>Se connecter</span>
                        </button>
                      )}
                    </div>

                    {/* Pillar 2: Admission Globale ou Pass Abonnement */}
                    <div
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        (currentLessonAccess.courseQuizCondition.isSatisfied &&
                          currentLessonAccess.subscriptionCondition.isSatisfied)
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-800/40 border-amber-500/40'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Award className="w-3 h-3 text-amber-400" />
                            2. Admission / Pass
                          </span>
                          {currentLessonAccess.courseQuizCondition.isSatisfied &&
                          currentLessonAccess.subscriptionCondition.isSatisfied ? (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Validé
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Conditionné
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {currentLessonAccess.courseQuizCondition.hasCourseAdmissionQuiz
                            ? `Quiz Seuil : ${currentLessonAccess.courseQuizCondition.requiredScore}%`
                            : currentLessonAccess.subscriptionCondition.requiresSubscription
                            ? 'Abonnement Pass Pro'
                            : 'Admission Libre'}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                          {currentLessonAccess.courseQuizCondition.hasCourseAdmissionQuiz
                            ? currentLessonAccess.courseQuizCondition.statusText
                            : currentLessonAccess.subscriptionCondition.statusText}
                        </p>
                      </div>

                      {currentLessonAccess.courseQuizCondition.hasCourseAdmissionQuiz &&
                      !currentLessonAccess.courseQuizCondition.isSatisfied ? (
                        <button
                          onClick={() =>
                            onStartQuiz(
                              currentLessonAccess.courseQuizCondition.quizId || course.finalQuiz?.id
                            )
                          }
                          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 flex items-center justify-center gap-1 transition-all"
                        >
                          <Target className="w-3 h-3" />
                          <span>Épreuve ({currentLessonAccess.courseQuizCondition.requiredScore}%)</span>
                        </button>
                      ) : currentLessonAccess.subscriptionCondition.requiresSubscription &&
                        !currentLessonAccess.subscriptionCondition.isSatisfied ? (
                        <button
                          onClick={() => {
                            if (onSubscribePlan) {
                              onSubscribePlan('pro');
                            } else {
                              setShowPaymentModal(true);
                            }
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/40 flex items-center justify-center gap-1 transition-all"
                        >
                          <Crown className="w-3 h-3" />
                          <span>Prendre le Pass</span>
                        </button>
                      ) : null}
                    </div>

                    {/* Pillar 3: Frais & Paiement (Cours ou Leçon individuelle) */}
                    <div
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        currentLessonAccess.paymentCondition.isSatisfied
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-800/40 border-emerald-500/40'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-emerald-400" />
                            3. Paiement
                          </span>
                          {currentLessonAccess.paymentCondition.isSatisfied ? (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Réglé
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              À débloquer
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {currentLessonAccess.paymentCondition.isLessonSpecificallyLocked
                            ? `Leçon : ${formatPrice(currentLessonAccess.paymentCondition.lessonPrice)}`
                            : currentLessonAccess.paymentCondition.isPaidCourse
                            ? `Cours : ${formatPrice(currentLessonAccess.paymentCondition.price)}`
                            : 'Gratuit'}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                          {currentLessonAccess.paymentCondition.statusText}
                        </p>
                      </div>

                      {!currentLessonAccess.paymentCondition.isSatisfied && (
                        <button
                          onClick={() => {
                            if (currentLessonAccess.paymentCondition.isLessonSpecificallyLocked) {
                              setTargetLessonForPayment(currentLesson);
                            } else {
                              setTargetLessonForPayment(undefined);
                            }
                            setShowPaymentModal(true);
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 flex items-center justify-center gap-1 transition-all"
                        >
                          <Coins className="w-3 h-3" />
                          <span>
                            {currentLessonAccess.paymentCondition.isLessonSpecificallyLocked
                              ? `Débloquer (${formatPrice(currentLessonAccess.paymentCondition.lessonPrice)})`
                              : 'Régler le cours'}
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Pillar 4: Validation par Quiz d'Étape ou Séquence */}
                    <div
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
                        (currentLessonAccess.quizCondition.isSatisfied &&
                          currentLessonAccess.prerequisiteCondition.isSatisfied)
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-slate-800/40 border-rose-500/40'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Target className="w-3 h-3 text-rose-400" />
                            4. Quiz d'Étape
                          </span>
                          {currentLessonAccess.quizCondition.isSatisfied &&
                          currentLessonAccess.prerequisiteCondition.isSatisfied ? (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {currentLessonAccess.quizCondition.hasRequiredQuiz
                                ? `${currentLessonAccess.quizCondition.userScore}% Validé`
                                : 'Validé'}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {currentLessonAccess.quizCondition.hasRequiredQuiz
                                ? `Seuil ${currentLessonAccess.quizCondition.requiredScore}%`
                                : 'Séquence'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-white truncate">
                          {currentLessonAccess.quizCondition.hasRequiredQuiz
                            ? `Seuil requis : ${currentLessonAccess.quizCondition.requiredScore}%`
                            : currentLessonAccess.prerequisiteCondition.requiredLesson?.title || 'Séquence valide'}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                          {!currentLessonAccess.quizCondition.isSatisfied
                            ? currentLessonAccess.quizCondition.statusText
                            : currentLessonAccess.prerequisiteCondition.statusText}
                        </p>
                      </div>

                      {!currentLessonAccess.quizCondition.isSatisfied ? (
                        <button
                          onClick={() =>
                            onStartQuiz(
                              currentLessonAccess.quizCondition.quizId || course.finalQuiz?.id
                            )
                          }
                          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 flex items-center justify-center gap-1 transition-all"
                        >
                          <Target className="w-3 h-3" />
                          <span>
                            {currentLessonAccess.quizCondition.hasAttempted ? 'Repasser le Quiz' : 'Passer le Quiz'}
                          </span>
                        </button>
                      ) : !currentLessonAccess.prerequisiteCondition.isSatisfied ? (
                        <button
                          onClick={() => {
                            if (currentLessonAccess.prerequisiteCondition.requiredLesson) {
                              setCurrentLessonId(
                                currentLessonAccess.prerequisiteCondition.requiredLesson.id
                              );
                            }
                          }}
                          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/40 flex items-center justify-center gap-1 transition-all"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span>Aller à la leçon</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : currentLesson.type === 'animaker_animated' ||
              currentLesson.type === 'video_project' ||
              currentLesson.videoProjectData ||
              currentLesson.animakerData ||
              currentLesson.type === 'video' ? (
              <div className="p-2 sm:p-4 bg-slate-950">
                {(() => {
                  const hasMounted = Boolean(
                    currentLesson.videoProjectData ||
                    currentLesson.animakerData ||
                    currentLesson.type === 'animaker_animated' ||
                    currentLesson.type === 'video_project'
                  );
                  const hasRaw = Boolean(currentLesson.videoUrl);
                  const currentMode =
                    videoModeByLesson[currentLesson.id] || (hasMounted ? 'mounted' : 'raw');

                  if (currentMode === 'mounted' || (!hasRaw && hasMounted)) {
                    const projectToPlay: CourseVideoProject =
                      currentLesson.videoProjectData ||
                      (currentLesson.animakerData
                        ? convertAnimakerLessonToVideoProject(currentLesson.animakerData)
                        : {
                            ...INITIAL_COURSE_VIDEO_PROJECT,
                            title: currentLesson.title,
                            topic: course.title,
                            clips: INITIAL_COURSE_VIDEO_PROJECT.clips.map((c) =>
                              c.trackId === 'track-video' && currentLesson.videoUrl
                                ? { ...c, sourceUrl: currentLesson.videoUrl, type: 'video' }
                                : c
                            ),
                          });

                    return (
                      <GeneratedVideoPlayer
                        project={projectToPlay}
                        lessonTitle={currentLesson.title}
                        courseTitle={course.title}
                        onLessonComplete={() => onCompleteLesson(currentLesson.id)}
                        hasRawVideo={hasRaw && isTeacherOrAdmin}
                        onSwitchToRawVideo={
                          isTeacherOrAdmin
                            ? () => setVideoModeByLesson((prev) => ({ ...prev, [currentLesson.id]: 'raw' }))
                            : undefined
                        }
                        canEdit={isTeacherOrAdmin}
                        onOpenVideoStudio={
                          isTeacherOrAdmin
                            ? () => {
                                setActiveVideoProject(projectToPlay);
                                setEditingVideoModalOpen(true);
                              }
                            : undefined
                        }
                      />
                    );
                  }

                  return (
                    <VideoLessonPlayer
                      videoUrl={currentLesson.videoUrl}
                      lessonTitle={currentLesson.title}
                      courseTitle={course.title}
                      authorName={course.instructor?.name}
                      onLessonComplete={() => onCompleteLesson(currentLesson.id)}
                      hasMountedVideo={true}
                      onSwitchToMountedVideo={
                        isTeacherOrAdmin
                          ? () => setVideoModeByLesson((prev) => ({ ...prev, [currentLesson.id]: 'mounted' }))
                          : undefined
                      }
                      canEdit={isTeacherOrAdmin}
                      onOpenVideoStudio={
                        isTeacherOrAdmin
                          ? () => {
                              const fallbackProject: CourseVideoProject =
                                currentLesson.videoProjectData ||
                                (currentLesson.animakerData
                                  ? convertAnimakerLessonToVideoProject(currentLesson.animakerData)
                                  : {
                                      ...INITIAL_COURSE_VIDEO_PROJECT,
                                      title: currentLesson.title,
                                      topic: course.title,
                                      clips: INITIAL_COURSE_VIDEO_PROJECT.clips.map((c) =>
                                        c.trackId === 'track-video' && currentLesson.videoUrl
                                          ? { ...c, sourceUrl: currentLesson.videoUrl, type: 'video' }
                                          : c
                                      ),
                                    });
                              setActiveVideoProject(fallbackProject);
                              setEditingVideoModalOpen(true);
                            }
                          : undefined
                      }
                    />
                  );
                })()}
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
                  onClick={() => {
                    onCompleteLesson(currentLesson.id);
                    setShowCelebration(true);
                  }}
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
                  onClick={() => setActiveTab('ai_assistant')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                  <span>Assistant IA MasterStudy</span>
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
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2.5 overflow-x-auto no-scrollbar">
              <button
                id="tab-lesson-content"
                onClick={() => setActiveTab('content')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'content'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Contenu</span>
              </button>

              <button
                id="tab-masterstudy-ai"
                onClick={() => setActiveTab('ai_assistant')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'ai_assistant'
                    ? 'bg-gradient-to-r from-indigo-50 to-sky-50 text-indigo-800 border border-indigo-300 shadow-2xs'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Assistant IA MasterStudy</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800">
                  Co-Pilote
                </span>
              </button>

              <button
                id="tab-student-notes"
                onClick={() => setActiveTab('notes')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'notes'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Mes Notes</span>
              </button>

              <button
                id="tab-lesson-qa"
                onClick={() => setActiveTab('qa')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'qa'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <MessagesSquare className="w-3.5 h-3.5" />
                <span>Questions & Réponses (Q&A)</span>
              </button>

              <button
                id="tab-lesson-resources"
                onClick={() => setActiveTab('resources')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'resources'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ressources ({currentLesson.resources?.length || 1})</span>
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

            {/* Tab 2: MasterStudy AI Assistant */}
            {activeTab === 'ai_assistant' && (
              <MasterStudyAIAssistant
                course={course}
                currentLesson={currentLesson}
                userCode={userCode}
                onInsertToNotes={(text) => {
                  setNotes((prev) => prev + '\n\n' + text);
                  setActiveTab('notes');
                }}
                onSwitchToNotesTab={() => setActiveTab('notes')}
              />
            )}

            {/* Tab 3: Notes */}
            {activeTab === 'notes' && (
              <LessonStudentNotes
                course={course}
                currentLesson={currentLesson}
                initialContent={notes}
                onAutoGeneratedNotesRequested={() => setActiveTab('ai_assistant')}
              />
            )}

            {/* Tab 4: Q&A Forum */}
            {activeTab === 'qa' && (
              <LessonDiscussionQA
                course={course}
                currentLesson={currentLesson}
                currentUser={currentUser}
              />
            )}

            {/* Tab 5: Resources */}
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

      {/* Payment Checkout Modal for conditional paid course access or unit lesson unlocking */}
      <PaymentCheckoutModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setTargetLessonForPayment(undefined);
        }}
        course={course}
        targetLesson={targetLessonForPayment}
        currentUser={currentUser}
        onSuccess={(_order, unlockedLessonId) => {
          if (onEnrollCourse) {
            onEnrollCourse(course.id, true, unlockedLessonId);
          }
          setShowPaymentModal(false);
          setTargetLessonForPayment(undefined);
        }}
      />

      {/* Video Editing Studio Modal for Teachers/Instructors Only (Strictly forbidden for learners) */}
      {editingVideoModalOpen && activeVideoProject && isTeacherOrAdmin && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-white">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Studio de Montage Vidéo • Leçon : {currentLesson.title}</span>
            </div>
            <button
              type="button"
              onClick={() => setEditingVideoModalOpen(false)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
            >
              Fermer le Studio
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <VideoEditingStudio
              initialVideoProject={activeVideoProject}
              courseTitle={course.title}
              chapterTitle={
                course.chapters.find((ch) => ch.lessons.some((l) => l.id === currentLesson.id))
                  ?.title
              }
              onSaveVideoProject={(savedProject) => {
                currentLesson.videoProjectData = savedProject;
                currentLesson.type = 'video_project';
                setActiveVideoProject(savedProject);
                setVideoModeByLesson((prev) => ({ ...prev, [currentLesson.id]: 'mounted' }));
              }}
              onPublishToCourse={(animakerLesson, savedProject) => {
                if (savedProject) {
                  currentLesson.videoProjectData = savedProject;
                  currentLesson.type = 'video_project';
                  setActiveVideoProject(savedProject);
                }
                if (animakerLesson) {
                  currentLesson.animakerData = animakerLesson;
                }
                setVideoModeByLesson((prev) => ({ ...prev, [currentLesson.id]: 'mounted' }));
                setEditingVideoModalOpen(false);
              }}
              onClose={() => setEditingVideoModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
