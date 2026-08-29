import React, { useState, useEffect } from 'react';
import { Quiz, EarnedCertificate, UserProfile } from '../../types';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Download
} from 'lucide-react';

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

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedOption(idx);
  };

  const handleValidateAnswer = () => {
    if (selectedOption === null) return;
    setHasSubmittedAnswer(true);
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

  // Score Screen
  if (isFinished) {
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const hasPassed = scorePercentage >= quiz.passingScore;

    return (
      <div id="quiz-results-screen" className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-10 space-y-6 text-center animate-in zoom-in-95 duration-200">
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 shadow-xs">
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
              : `Votre score est de ${scorePercentage}% (seuil requis : ${quiz.passingScore}%). Vous pouvez réviser les leçons et repasser l'évaluation.`}
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
            onClick={() => {
              setIsFinished(false);
              setCurrentQuestionIndex(0);
              setSelectedOption(null);
              setHasSubmittedAnswer(false);
              setUserAnswers([]);
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
    );
  }

  // Active Question Screen
  return (
    <div id="quiz-player-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>{quiz.title}</span>
            </div>
            <div className="text-xs text-slate-500">
              Question {currentQuestionIndex + 1} sur {totalQuestions}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-indigo-600 font-semibold">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
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
            className="h-full bg-indigo-600 transition-all duration-300"
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
                optionClasses = 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-1 ring-indigo-600';
              }
              if (hasSubmittedAnswer) {
                if (isCorrect) {
                  optionClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500';
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
                    <span className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold font-mono">
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

        {/* Explanation Card after validation */}
        {hasSubmittedAnswer && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 animate-in fade-in">
            <div className="font-bold text-indigo-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explication Pédagogique Academia ITECH :</span>
            </div>
            <p className="text-slate-600 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}

        {/* Quiz Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Points pour cette question : <strong className="text-slate-900">+{currentQ.points} XP</strong>
          </span>

          {!hasSubmittedAnswer ? (
            <button
              id="validate-answer-btn"
              onClick={handleValidateAnswer}
              disabled={selectedOption === null}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
            >
              Valider ma réponse
            </button>
          ) : (
            <button
              id="next-question-btn"
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-xs transition-all"
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
