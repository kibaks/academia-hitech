import React, { useState, useEffect } from 'react';
import { Quiz, EarnedCertificate, UserProfile } from '../../types';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Lightbulb,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Loader2,
  GraduationCap,
  ChevronDown,
  Target,
  BrainCircuit,
  HelpCircle,
  Check,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AndroidStyleCharacter } from '../tutor/AndroidStyleCharacter';
import { TUTOR_PERSONAS } from '../tutor/personaData';
import { playTutorSpeech, stopTutorSpeech } from '../tutor/speechUtils';

export interface AdaptiveExplanation {
  isCorrect: boolean;
  missedConcept: string;
  whyIncorrectAnalysis: string;
  correctConceptBreakdown: string;
  keyTakeaway: string;
  recommendedReviewTopic: string;
  encouragement: string;
}

export interface QuizSummaryAnalysis {
  overallDiagnosis: string;
  criticalGaps: string[];
  actionablePlan: string[];
  encouragingClosing: string;
}

interface QuizPlayerProps {
  quiz: Quiz;
  courseTitle: string;
  currentUser: UserProfile;
  onQuizComplete: (scorePercentage: number, xpEarned: number, certificate?: EarnedCertificate) => void;
  onClose: () => void;
  onOpenCertificateModal: (certificate: EarnedCertificate) => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  quiz,
  courseTitle,
  currentUser,
  onQuizComplete,
  onClose,
  onOpenCertificateModal,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitMinutes * 60);
  const [generatedCert, setGeneratedCert] = useState<EarnedCertificate | null>(null);

  // Gemini Adaptive Explanations state
  const [adaptiveExplanations, setAdaptiveExplanations] = useState<Record<number, AdaptiveExplanation>>({});
  const [isLoadingAdaptive, setIsLoadingAdaptive] = useState(false);
  const [adaptiveError, setAdaptiveError] = useState<string | null>(null);
  const [isSpeakingAdaptive, setIsSpeakingAdaptive] = useState(false);

  // Gemini Summary Analysis state for end of quiz
  const [quizSummary, setQuizSummary] = useState<QuizSummaryAnalysis | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const currentQ = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  // Countdown timer
  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, timeLeft]);

  const handleToggleSpeakAdaptive = (adaptive: AdaptiveExplanation) => {
    if (isSpeakingAdaptive) {
      stopTutorSpeech();
      setIsSpeakingAdaptive(false);
      return;
    }

    const textToSpeak = adaptive.isCorrect
      ? `${adaptive.missedConcept}. ${adaptive.whyIncorrectAnalysis} ${adaptive.keyTakeaway}`
      : `Analyse du concept manqué : ${adaptive.missedConcept}. ${adaptive.whyIncorrectAnalysis}. La réponse attendue est : ${adaptive.correctConceptBreakdown}. ${adaptive.keyTakeaway}. ${adaptive.encouragement}`;

    setIsSpeakingAdaptive(true);
    playTutorSpeech({
      text: textToSpeak,
      langCode: 'fr-FR',
      gender: 'female',
      pitch: 1.1,
      rate: 1.0,
      onEnd: () => {
        setIsSpeakingAdaptive(false);
      },
      onError: () => {
        setIsSpeakingAdaptive(false);
      },
    });
  };

  useEffect(() => {
    return () => {
      stopTutorSpeech();
    };
  }, [currentQuestionIndex]);

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedOption(idx);
  };

  const fetchAdaptiveExplanation = async (questionIdx: number, userSelectedIdx: number) => {
    const q = quiz.questions[questionIdx];
    if (!q) return;

    setIsLoadingAdaptive(true);
    setAdaptiveError(null);

    try {
      const response = await fetch('/api/gemini/quiz-adaptive-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle,
          quizTitle: quiz.title,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          selectedIndex: userSelectedIdx,
          standardExplanation: q.explanation,
          learnerName: currentUser.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur du service (${response.status})`);
      }

      const data = await response.json();
      if (data.success && data.adaptiveExplanation) {
        setAdaptiveExplanations((prev) => ({
          ...prev,
          [questionIdx]: data.adaptiveExplanation,
        }));
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (err: any) {
      console.warn('Erreur récupération explication adaptative:', err);
      // Resilient local fallback specifically targeting the missed concept
      const isCorrect = userSelectedIdx === q.correctIndex;
      const selectedText = q.options[userSelectedIdx] || 'Option';
      const correctText = q.options[q.correctIndex] || 'Bonne réponse';

      setAdaptiveExplanations((prev) => ({
        ...prev,
        [questionIdx]: {
          isCorrect,
          missedConcept: isCorrect
            ? 'Notion fondamentale assimilée'
            : `Confusion conceptuelle : focalisation sur « ${selectedText.slice(0, 35)}... »`,
          whyIncorrectAnalysis: isCorrect
            ? `Votre choix (« ${selectedText} ») démontre une excellente application des règles enseignées.`
            : `Vous avez retenu « ${selectedText} ». Ce choix est fréquent lorsqu'on omet la condition directrice de l'énoncé au profit d'un détail périphérique.`,
          correctConceptBreakdown:
            q.explanation ||
            `La solution exacte est « ${correctText} » car elle garantit la robustesse exigée par la spécification.`,
          keyTakeaway: `Règle clé : Pour ce type de problème, priorisez la solution validant le standard de conformité (« ${correctText} »).`,
          recommendedReviewTopic: `Module de référence : ${courseTitle}`,
          encouragement: `L'analyse d'erreur est le meilleur accélérateur de compétences. Vous avez identifié le point clé !`,
        },
      }));
    } finally {
      setIsLoadingAdaptive(false);
    }
  };

  const handleValidateAnswer = async () => {
    if (selectedOption === null) return;
    setHasSubmittedAnswer(true);

    // Call Gemini API to generate the adaptive explanation for this exact response
    await fetchAdaptiveExplanation(currentQuestionIndex, selectedOption);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      const updatedAnswers = [...userAnswers, selectedOption];
      setUserAnswers(updatedAnswers);

      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setHasSubmittedAnswer(false);
      } else {
        finishQuiz(updatedAnswers);
      }
    }
  };

  const fetchQuizSummaryAnalysis = async (finalAnswers: number[]) => {
    const missed = quiz.questions
      .map((q, idx) => ({
        question: q.question,
        userSelected: q.options[finalAnswers[idx]] || 'Non spécifié',
        correctAnswer: q.options[q.correctIndex],
        standardExplanation: q.explanation,
        isMissed: finalAnswers[idx] !== q.correctIndex,
      }))
      .filter((item) => item.isMissed);

    if (missed.length === 0) return;

    setIsLoadingSummary(true);
    try {
      const response = await fetch('/api/gemini/quiz-summary-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle,
          quizTitle: quiz.title,
          totalQuestions,
          scorePercentage: Math.round(((totalQuestions - missed.length) / totalQuestions) * 100),
          missedQuestions: missed,
          learnerName: currentUser.name,
        }),
      });
      const data = await response.json();
      if (data.success && data.summary) {
        setQuizSummary(data.summary);
      }
    } catch (e) {
      console.warn('Erreur analyse de synthèse globale:', e);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const finishQuiz = (finalAnswers = userAnswers) => {
    setIsFinished(true);

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const hasPassed = scorePercentage >= quiz.passingScore;

    // Trigger AI overall diagnostic if there were errors
    fetchQuizSummaryAnalysis(finalAnswers);

    let cert: EarnedCertificate | undefined = undefined;

    if (hasPassed) {
      // Trigger Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'],
        });
      } catch (e) {
        // Safe fallback
      }

      // Generate verified certificate object
      const certId = `cert-${Date.now()}`;
      const certNumber = `ITECH-CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const distinction: EarnedCertificate['distinction'] =
        scorePercentage >= 95
          ? 'Mention Très Bien'
          : scorePercentage >= 85
          ? 'Mention Bien'
          : scorePercentage >= 75
          ? 'Mention Assez Bien'
          : 'Succès';

      cert = {
        id: certId,
        certificateNumber: certNumber,
        courseId: quiz.courseId,
        courseTitle: courseTitle,
        learnerId: currentUser.id,
        learnerName: currentUser.name,
        issueDate: new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        gradePercentage: scorePercentage,
        distinction: distinction,
        qrCodeData: `https://academia-itech.edu/verify/${certNumber}`,
        trainerName: 'Dr. Elena Rostova & Collège ITECH',
        centerName: currentUser.centerName || 'Academia ITECH Global',
      };

      setGeneratedCert(cert);
    }

    const xpEarned = hasPassed ? quiz.xpReward : Math.round(quiz.xpReward * 0.3);
    onQuizComplete(scorePercentage, xpEarned, cert);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentAdaptive = adaptiveExplanations[currentQuestionIndex];

  // Score Screen
  if (isFinished) {
    let correctCount = 0;
    const missedQuestionsList: { qIndex: number; question: string; chosen: string; correct: string; expl: string }[] = [];

    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      } else {
        missedQuestionsList.push({
          qIndex: idx + 1,
          question: q.question,
          chosen: q.options[userAnswers[idx]] || 'Non spécifié',
          correct: q.options[q.correctIndex],
          expl: q.explanation,
        });
      }
    });
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const hasPassed = scorePercentage >= quiz.passingScore;

    return (
      <div id="quiz-results-screen" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-10 space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-sky-50 border border-sky-100 shadow-xs">
            {hasPassed ? (
              <Award className="w-10 h-10 text-amber-500 animate-bounce" />
            ) : (
              <XCircle className="w-10 h-10 text-rose-500" />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                hasPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {hasPassed ? 'Certification Validée ! 🎉' : 'Évaluation non validée'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {hasPassed ? 'Félicitations pour votre Réussite !' : 'Continuez vos efforts'}
            </h2>

            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {hasPassed
                ? `Vous avez démontré votre maîtrise sur "${courseTitle}" avec un score de ${scorePercentage}%. Votre certificat officiel Academia ITECH est prêt.`
                : `Votre score est de ${scorePercentage}% (seuil requis : ${quiz.passingScore}%). Vous pouvez consulter l'analyse des concepts manqués ci-dessous et repasser l'évaluation.`}
            </p>
          </div>

          {/* Score & Rewards Card */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Score Obtenu</span>
              <span className={`text-xl font-bold ${hasPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                {scorePercentage}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Bonnes Réponses</span>
              <span className="text-xl font-bold text-slate-900">
                {correctCount} / {totalQuestions}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">XP Gagnés</span>
              <span className="text-xl font-bold text-amber-600 flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                +{hasPassed ? quiz.xpReward : Math.round(quiz.xpReward * 0.3)}
              </span>
            </div>
          </div>

          {/* Gemini AI Adaptive Summary: Missed Concepts Diagnostic */}
          {missedQuestionsList.length > 0 && (
            <div className="text-left rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-sky-50/40 border border-amber-200/80 p-5 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Bilan Pédagogique IA : Concepts Manqués
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Diagnostic adaptatif généré par Gemini pour votre plan de révision
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/60">
                  {missedQuestionsList.length} notion{missedQuestionsList.length > 1 ? 's' : ''} à revoir
                </span>
              </div>

              {isLoadingSummary ? (
                <div className="p-4 rounded-xl bg-white/80 border border-slate-200/80 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />
                  <span className="text-xs text-slate-600 font-medium">
                    Gemini compile votre synthèse personnalisée des points de vigilance...
                  </span>
                </div>
              ) : quizSummary ? (
                <div className="space-y-3 pt-1 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-slate-700 leading-relaxed shadow-xs">
                    <strong className="text-slate-900 block mb-1">Diagnostic Global :</strong>
                    <p>{quizSummary.overallDiagnosis}</p>
                  </div>

                  {quizSummary.criticalGaps && quizSummary.criticalGaps.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
                      <strong className="text-amber-950 font-bold block flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <Target className="w-3.5 h-3.5 text-amber-700" />
                        Points de blocage identifiés :
                      </strong>
                      <ul className="space-y-1 text-amber-900 pl-4 list-disc text-[11px]">
                        {quizSummary.criticalGaps.map((gap, i) => (
                          <li key={i}>{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {quizSummary.actionablePlan && quizSummary.actionablePlan.length > 0 && (
                    <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200/80 space-y-1.5">
                      <strong className="text-sky-950 font-bold block flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                        Plan de remédiation conseillé :
                      </strong>
                      <ol className="space-y-1 text-sky-900 pl-4 list-decimal text-[11px]">
                        {quizSummary.actionablePlan.map((action, i) => (
                          <li key={i}>{action}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {quizSummary.encouragingClosing && (
                    <p className="text-[11px] italic text-slate-500 pl-1">
                      « {quizSummary.encouragingClosing} »
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600">
                    Voici le récapitulatif des questions où vous avez rencontré une difficulté :
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {missedQuestionsList.map((item, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] space-y-1">
                        <div className="font-semibold text-slate-800">
                          Q{item.qIndex}: {item.question}
                        </div>
                        <div className="text-rose-600">
                          Votre réponse : <span className="line-through">{item.chosen}</span>
                        </div>
                        <div className="text-emerald-700 font-medium">
                          Réponse attendue : {item.correct}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {hasPassed && generatedCert && (
              <button
                id="view-cert-now-btn"
                onClick={() => onOpenCertificateModal(generatedCert)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm flex items-center justify-center gap-2 transform active:scale-95 transition-all"
              >
                <Award className="w-5 h-5 text-slate-950" />
                <span>Afficher & Imprimer mon Certificat</span>
              </button>
            )}

            <button
              id="retry-quiz-btn"
              onClick={() => {
                setIsFinished(false);
                setCurrentQuestionIndex(0);
                setSelectedOption(null);
                setHasSubmittedAnswer(false);
                setUserAnswers([]);
                setAdaptiveExplanations({});
                setQuizSummary(null);
                setTimeLeft(quiz.timeLimitMinutes * 60);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 border border-slate-200 shadow-xs transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repasser le Quiz</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
            >
              Retour au cours
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Question Screen
  return (
    <div id="quiz-player-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-auto">
        {/* Quiz Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>{quiz.title}</span>
            </div>
            <div className="text-xs text-slate-500">
              Question {currentQuestionIndex + 1} sur {totalQuestions}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-sky-600 font-semibold">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question Statement */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options list */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let optionClasses = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/80';
              if (isSelected) {
                optionClasses = 'bg-sky-50 border-sky-500 text-sky-900 ring-1 ring-sky-500';
              }
              if (hasSubmittedAnswer) {
                if (isCorrect) {
                  optionClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500 font-semibold';
                } else if (isSelected && !isCorrect) {
                  optionClasses = 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500';
                }
              }

              return (
                <button
                  key={idx}
                  id={`quiz-option-${idx}`}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${optionClasses}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {hasSubmittedAnswer && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                  {hasSubmittedAnswer && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gemini AI Adaptive Explanation Section after Answer Submission */}
        {hasSubmittedAnswer && (
          <div className="space-y-3 pt-2 animate-in fade-in duration-200">
            {isLoadingAdaptive ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-indigo-50/50 to-slate-50 border border-sky-200/80 shadow-xs flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-white text-sky-600 shadow-xs animate-spin">
                  <Loader2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                    <span>Tuteur IA Gemini : Analyse adaptative de votre réponse...</span>
                  </div>
                  <p className="text-[11px] text-sky-700/90 mt-0.5">
                    Évaluation ciblée de la conception sous-jacente et des points de vigilance.
                  </p>
                </div>
              </div>
            ) : currentAdaptive ? (
              <div
                id="gemini-adaptive-explanation-card"
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  currentAdaptive.isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200/90 shadow-xs'
                    : 'bg-gradient-to-br from-amber-50/50 via-white to-rose-50/30 border-amber-200/90 shadow-xs'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                  <div className="flex items-center gap-3">
                    {/* Synchronized Android Robot Avatar */}
                    <div className="relative shrink-0 w-12 h-14 flex items-center justify-center rounded-xl bg-slate-950 p-1 border border-amber-500/40 shadow-inner">
                      <AndroidStyleCharacter
                        persona={TUTOR_PERSONAS.find((p) => p.id === 'android-bot') || TUTOR_PERSONAS[0]}
                        state={isSpeakingAdaptive ? 'speaking' : 'idle'}
                        size="sm"
                        characterModel="android_robot"
                        currentPose={currentAdaptive.isCorrect ? 'celebrating' : 'explaining'}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 block">
                          {currentAdaptive.isCorrect
                            ? 'Tuteur Android : Renforcement Conceptuel Gemini'
                            : 'Tuteur Android : Analyse du Concept Manqué'}
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {currentAdaptive.isCorrect
                          ? 'Validation approfondie et ancrage de la règle clé'
                          : 'Comprendre précisément le piège conceptuel sous-jacent'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Synchronized Voice Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleSpeakAdaptive(currentAdaptive)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                        isSpeakingAdaptive
                          ? 'bg-amber-500 text-slate-950 border border-amber-400 animate-pulse'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                      }`}
                      title="Écouter l'explication avec la voix vocale synchronisée du Robot Android"
                    >
                      {isSpeakingAdaptive ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-slate-950" />
                          <span>Arrêter la voix</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>Voix Vocale Robot</span>
                        </>
                      )}
                    </button>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        currentAdaptive.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900 border border-amber-300/60'
                      }`}
                    >
                      {currentAdaptive.isCorrect ? '✓ Concept Maîtrisé' : '⚠️ Piège Identifié'}
                    </span>
                    <button
                      onClick={() => fetchAdaptiveExplanation(currentQuestionIndex, selectedOption!)}
                      title="Régénérer l'analyse Gemini"
                      className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 transition-colors text-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Highlighted Concept Chip */}
                <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-2.5">
                  <div
                    className={`mt-0.5 p-1 rounded-md shrink-0 ${
                      currentAdaptive.isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {currentAdaptive.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {currentAdaptive.isCorrect ? 'Compétence validée' : 'Concept ciblé manqué'}
                    </div>
                    <div className="text-xs font-semibold text-slate-900 mt-0.5">
                      {currentAdaptive.missedConcept}
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="mt-3 text-xs space-y-2.5">
                  {/* Analysis of User's choice */}
                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 text-slate-700 leading-relaxed">
                    <strong className="text-slate-900 block mb-1">
                      {currentAdaptive.isCorrect
                        ? 'Analyse de votre choix :'
                        : 'Pourquoi votre réponse a été choisie (et pourquoi elle est incomplète) :'}
                    </strong>
                    <p>{currentAdaptive.whyIncorrectAnalysis}</p>
                  </div>

                  {/* Why correct answer is true */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-slate-700 leading-relaxed shadow-xs">
                    <strong className="text-slate-900 block mb-1">
                      Principe fondamental & Règle appliquée :
                    </strong>
                    <p>{currentAdaptive.correctConceptBreakdown}</p>
                  </div>

                  {/* 2-column Grid: Key Takeaway & Recommended Review */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-slate-800">
                      <div className="flex items-center gap-1.5 text-amber-950 font-bold text-[11px] mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>Règle d'or mnémotechnique :</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-amber-950 font-medium">
                        {currentAdaptive.keyTakeaway}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-sky-50/80 border border-sky-200/80 text-slate-800">
                      <div className="flex items-center gap-1.5 text-sky-950 font-bold text-[11px] mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                        <span>Notion recommandée à réviser :</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-sky-950">
                        {currentAdaptive.recommendedReviewTopic}
                      </p>
                    </div>
                  </div>

                  {/* Encouraging Note */}
                  {currentAdaptive.encouragement && (
                    <div className="pt-1 text-[11px] italic text-slate-500 flex items-center gap-1.5">
                      <span>💬</span>
                      <span>
                        « {currentAdaptive.encouragement} » — <em>Tuteur Pédagogique Academia ITECH</em>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Standard Course Explanation Accordion */}
            <details className="text-xs group rounded-xl border border-slate-200/80 bg-slate-50 p-2.5">
              <summary className="font-semibold text-slate-600 hover:text-slate-900 cursor-pointer list-none flex items-center justify-between select-none">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>Consulter la correction standard du cours</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-2 text-slate-600 leading-relaxed pl-5 border-l-2 border-slate-300">
                {currentQ.explanation}
              </p>
            </details>
          </div>
        )}

        {/* Quiz Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Points pour cette question : <strong className="text-slate-900">+{currentQ.points} XP</strong>
          </span>

          {!hasSubmittedAnswer ? (
            <button
              id="validate-answer-btn"
              onClick={handleValidateAnswer}
              disabled={selectedOption === null}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-xs active:scale-95 shadow-sky-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Valider ma réponse
            </button>
          ) : (
            <button
              id="next-question-btn"
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white flex items-center gap-1.5 shadow-xs active:scale-95 shadow-sky-500/20 transition-all"
            >
              <span>{currentQuestionIndex < totalQuestions - 1 ? 'Question suivante' : 'Voir les résultats finaux'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
