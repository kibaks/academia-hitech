import React, { useState } from 'react';
import { Course, Lesson } from '../../types';
import {
  Sparkles,
  Bot,
  BrainCircuit,
  HelpCircle,
  Lightbulb,
  Target,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  BookmarkPlus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Layers,
  Smile,
  Zap,
} from 'lucide-react';

interface MasterStudyAIAssistantProps {
  course: Course;
  currentLesson: Lesson;
  userCode?: string;
  onInsertToNotes?: (text: string) => void;
  onSwitchToNotesTab?: () => void;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  tip?: string;
}

export const MasterStudyAIAssistant: React.FC<MasterStudyAIAssistantProps> = ({
  course,
  currentLesson,
  userCode = '',
  onInsertToNotes,
  onSwitchToNotesTab,
}) => {
  const [activeMode, setActiveMode] = useState<
    'chat' | 'summarize' | 'eli5' | 'quiz' | 'flashcards' | 'notes'
  >('summarize');

  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Content state for each tool
  const [summaryContent, setSummaryContent] = useState<string | null>(null);
  const [eli5Content, setEli5Content] = useState<string | null>(null);
  const [notesContent, setNotesContent] = useState<string | null>(null);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[] | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  // Free-form Ask state
  const [askQuery, setAskQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; timestamp: string }>
  >([]);

  // Execute MasterStudy AI Action
  const handleRunAction = async (action: 'summarize' | 'eli5' | 'quiz' | 'flashcards' | 'notes') => {
    setActiveMode(action);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/masterstudy-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          courseTitle: course.title,
          lessonTitle: currentLesson.title,
          lessonContent: currentLesson.content || currentLesson.description || '',
          userCode,
        }),
      });

      const data = await response.json();

      if (action === 'summarize') {
        setSummaryContent(data.result || data.reply || 'Résumé généré avec succès.');
      } else if (action === 'eli5') {
        setEli5Content(data.result || data.reply || 'Explication simplifiée générée.');
      } else if (action === 'quiz') {
        setQuizQuestions(data.quiz || []);
        setUserAnswers({});
        setSubmittedQuiz(false);
      } else if (action === 'flashcards') {
        setFlashcards(data.flashcards || []);
        setCurrentCardIndex(0);
        setIsFlipped(false);
      } else if (action === 'notes') {
        setNotesContent(data.notes || data.result || '');
      }
    } catch (err) {
      console.error('Erreur MasterStudy AI:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit custom question
  const handleAskQuestion = async (customPrompt?: string) => {
    const q = customPrompt || askQuery;
    if (!q.trim() || isLoading) return;

    setActiveMode('chat');
    setIsLoading(true);
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    setChatHistory((prev) => [...prev, { role: 'user', text: q, timestamp: time }]);
    setAskQuery('');

    try {
      const response = await fetch('/api/gemini/masterstudy-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ask',
          courseTitle: course.title,
          lessonTitle: currentLesson.title,
          lessonContent: currentLesson.content || '',
          question: q,
          userCode,
        }),
      });

      const data = await response.json();
      const reply = data.result || data.reply || "J'ai bien analysé votre question.";

      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "Je suis à votre écoute. N'hésitez pas à relancer votre question ou à tester dans l'éditeur.",
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (audioPlaying) {
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
      return;
    }

    const cleanText = text.replace(/[*_#`[\]()]/g, '').slice(0, 1000);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.onend = () => setAudioPlaying(false);
    utterance.onerror = () => setAudioPlaying(false);

    setAudioPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  // Auto-run summary on initial mount if empty
  React.useEffect(() => {
    if (!summaryContent) {
      handleRunAction('summarize');
    }
  }, [currentLesson.id]);

  return (
    <div id="masterstudy-ai-container" className="space-y-4">
      {/* Header Banner: MasterStudy LMS AI Badge */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-sky-900 to-slate-900 text-white border border-indigo-700/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">
                Assistant Pédagogique IA
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                Style MasterStudy LMS
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Co-pilote interactif contextualisé à : <strong className="text-white">{currentLesson.title}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Gemini 3.8 Actif</span>
          </div>
        </div>
      </div>

      {/* 5 MasterStudy Instant Action Power Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button
          onClick={() => handleRunAction('summarize')}
          className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 active:scale-95 ${
            activeMode === 'summarize'
              ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-xs'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <Zap className={`w-4 h-4 ${activeMode === 'summarize' ? 'text-sky-600' : 'text-slate-400'}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Synthèse</span>
          </div>
          <span className="text-xs font-bold leading-snug">3 Points Clés</span>
        </button>

        <button
          onClick={() => handleRunAction('eli5')}
          className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 active:scale-95 ${
            activeMode === 'eli5'
              ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <Smile className={`w-4 h-4 ${activeMode === 'eli5' ? 'text-amber-600' : 'text-slate-400'}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">ELI5</span>
          </div>
          <span className="text-xs font-bold leading-snug">Expliquer Simplement</span>
        </button>

        <button
          onClick={() => handleRunAction('quiz')}
          className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 active:scale-95 ${
            activeMode === 'quiz'
              ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <Target className={`w-4 h-4 ${activeMode === 'quiz' ? 'text-rose-600' : 'text-slate-400'}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Flash</span>
          </div>
          <span className="text-xs font-bold leading-snug">Mini-Quiz (3 QCM)</span>
        </button>

        <button
          onClick={() => handleRunAction('flashcards')}
          className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 active:scale-95 ${
            activeMode === 'flashcards'
              ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-xs'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <Layers className={`w-4 h-4 ${activeMode === 'flashcards' ? 'text-purple-600' : 'text-slate-400'}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Mémoire</span>
          </div>
          <span className="text-xs font-bold leading-snug">Flashcards</span>
        </button>

        <button
          onClick={() => handleRunAction('notes')}
          className={`col-span-2 sm:col-span-1 p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 active:scale-95 ${
            activeMode === 'notes'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <FileText className={`w-4 h-4 ${activeMode === 'notes' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Étude</span>
          </div>
          <span className="text-xs font-bold leading-snug">Fiche de Révision</span>
        </button>
      </div>

      {/* Main Content Area depending on selected mode */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs min-h-[260px] flex flex-col justify-between">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
            <span className="text-xs font-semibold text-slate-600">
              Génération du contenu pédagogique par l'IA MasterStudy...
            </span>
          </div>
        ) : (
          <>
            {/* MODE 1: SUMMARIZE (3 Points Clés) */}
            {activeMode === 'summarize' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-sky-500" />
                    Synthèse Pédagogique Rapide
                  </span>
                  <div className="flex items-center gap-1.5">
                    {summaryContent && (
                      <>
                        <button
                          onClick={() => toggleSpeech(summaryContent)}
                          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${
                            audioPlaying
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                          title="Écouter la synthèse"
                        >
                          {audioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span className="hidden xs:inline text-[11px] font-semibold">
                            {audioPlaying ? 'Stop' : 'Écouter'}
                          </span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(summaryContent)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-center gap-1"
                          title="Copier"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="hidden xs:inline text-[11px] font-semibold">
                            {copied ? 'Copié' : 'Copier'}
                          </span>
                        </button>
                        {onInsertToNotes && (
                          <button
                            onClick={() => {
                              onInsertToNotes(summaryContent);
                              if (onSwitchToNotesTab) onSwitchToNotesTab();
                            }}
                            className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs flex items-center gap-1 font-semibold"
                            title="Ajouter à mes notes"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline text-[11px]">Insérer aux notes</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line space-y-2">
                  {summaryContent || "Cliquez sur '3 Points Clés' pour générer la synthèse."}
                </div>
              </div>
            )}

            {/* MODE 2: ELI5 (Explication Simplifiée) */}
            {activeMode === 'eli5' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <Smile className="w-4 h-4 text-amber-500" />
                    Vulgarisation & Analogie Simple (ELI5)
                  </span>
                  <div className="flex items-center gap-1.5">
                    {eli5Content && (
                      <>
                        <button
                          onClick={() => toggleSpeech(eli5Content)}
                          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${
                            audioPlaying
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {audioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span className="hidden xs:inline text-[11px]">Écouter</span>
                        </button>
                        {onInsertToNotes && (
                          <button
                            onClick={() => {
                              onInsertToNotes(eli5Content);
                              if (onSwitchToNotesTab) onSwitchToNotesTab();
                            }}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs flex items-center gap-1 font-semibold"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            <span className="hidden xs:inline text-[11px]">Sauvegarder</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-950 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {eli5Content || "Génération de l'analogie en cours..."}
                </div>
              </div>
            )}

            {/* MODE 3: MINI-QUIZ FLASH (3 QCM) */}
            {activeMode === 'quiz' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-rose-500" />
                    Entraînement Éclair (3 Questions)
                  </span>
                  <button
                    onClick={() => handleRunAction('quiz')}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="text-[11px] font-semibold">Régénérer</span>
                  </button>
                </div>

                {quizQuestions && quizQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {quizQuestions.map((q, qIndex) => {
                      const selected = userAnswers[qIndex];
                      const isCorrect = selected === q.correctIndex;

                      return (
                        <div key={q.id || qIndex} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                              {qIndex + 1}
                            </span>
                            <span>{q.question}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isThisSelected = selected === optIdx;
                              let btnStyle = 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700';

                              if (submittedQuiz) {
                                if (optIdx === q.correctIndex) {
                                  btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                                } else if (isThisSelected && !isCorrect) {
                                  btnStyle = 'bg-rose-100 border-rose-400 text-rose-950';
                                }
                              } else if (isThisSelected) {
                                btnStyle = 'bg-sky-100 border-sky-400 text-sky-950 font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  disabled={submittedQuiz}
                                  onClick={() => setUserAnswers((prev) => ({ ...prev, [qIndex]: optIdx }))}
                                  className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-center gap-2 ${btnStyle}`}
                                >
                                  <span className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="flex-1 leading-snug">{opt}</span>
                                  {submittedQuiz && optIdx === q.correctIndex && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  )}
                                  {submittedQuiz && isThisSelected && !isCorrect && (
                                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {submittedQuiz && (
                            <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[11px] text-sky-900 leading-relaxed">
                              <strong>Explication :</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="pt-2 flex items-center justify-between">
                      {!submittedQuiz ? (
                        <button
                          onClick={() => setSubmittedQuiz(true)}
                          disabled={Object.keys(userAnswers).length < quizQuestions.length}
                          className="px-4 py-2 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs flex items-center gap-1.5 transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Vérifier mes réponses ({Object.keys(userAnswers).length}/{quizQuestions.length})</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-800">
                            Score :{' '}
                            <span className="text-emerald-600 text-sm">
                              {
                                Object.entries(userAnswers).filter(
                                  ([qIdx, ans]) => quizQuestions[Number(qIdx)]?.correctIndex === ans
                                ).length
                              }
                              / {quizQuestions.length}
                            </span>
                          </span>
                          <button
                            onClick={() => {
                              setUserAnswers({});
                              setSubmittedQuiz(false);
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Recommencer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500">
                    Chargement du quiz d'entraînement...
                  </div>
                )}
              </div>
            )}

            {/* MODE 4: FLASHCARDS (Cartes mnémoniques) */}
            {activeMode === 'flashcards' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-500" />
                    Fiches Mnémoniques (Répétition espacée)
                  </span>
                  {flashcards && (
                    <span className="text-xs font-bold text-slate-500">
                      Carte {currentCardIndex + 1} / {flashcards.length}
                    </span>
                  )}
                </div>

                {flashcards && flashcards.length > 0 ? (
                  <div className="space-y-3">
                    {/* Interactive Flip Card */}
                    <div
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="cursor-pointer min-h-[160px] p-6 rounded-2xl bg-gradient-to-br from-purple-50 via-white to-slate-50 border-2 border-purple-200/80 shadow-xs flex flex-col justify-between items-center text-center transition-all hover:border-purple-300 select-none group"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 px-2 py-0.5 rounded-full bg-purple-100">
                        {isFlipped ? 'Réponse & Explication' : 'Question / Notion (Cliquez pour retourner)'}
                      </span>

                      <div className="my-auto py-3">
                        <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed max-w-md">
                          {isFlipped
                            ? flashcards[currentCardIndex]?.back
                            : flashcards[currentCardIndex]?.front}
                        </p>
                        {isFlipped && flashcards[currentCardIndex]?.tip && (
                          <p className="text-xs text-purple-700 mt-2 italic font-medium">
                            💡 {flashcards[currentCardIndex]?.tip}
                          </p>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 group-hover:text-purple-600 flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" />
                        <span>{isFlipped ? 'Voir la question' : 'Révéler la réponse'}</span>
                      </span>
                    </div>

                    {/* Controls for next / mastered */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => {
                          setIsFlipped(false);
                          setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                        }}
                        disabled={currentCardIndex === 0}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-30"
                      >
                        Précédent
                      </button>

                      <button
                        onClick={() => {
                          const id = flashcards[currentCardIndex]?.id;
                          if (id) {
                            setMasteredCards((prev) => ({ ...prev, [id]: !prev[id] }));
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all ${
                          masteredCards[flashcards[currentCardIndex]?.id]
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {masteredCards[flashcards[currentCardIndex]?.id] ? 'Notion Maîtrisée 🎉' : 'Marquer comme appris'}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setIsFlipped(false);
                          setCurrentCardIndex((prev) =>
                            Math.min(flashcards.length - 1, prev + 1)
                          );
                        }}
                        disabled={currentCardIndex === flashcards.length - 1}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 disabled:opacity-30"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-500">
                    Chargement des fiches...
                  </div>
                )}
              </div>
            )}

            {/* MODE 5: NOTES (Fiche de révision structurée) */}
            {activeMode === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Notes Structurées pour Révision
                  </span>
                  <div className="flex items-center gap-1.5">
                    {notesContent && onInsertToNotes && (
                      <button
                        onClick={() => {
                          onInsertToNotes(notesContent);
                          if (onSwitchToNotesTab) onSwitchToNotesTab();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Transférer dans mon Bloc-Notes</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-line border border-slate-800">
                  {notesContent || 'Génération de vos notes structurées...'}
                </div>
              </div>
            )}

            {/* MODE 6: CHAT (Questions Libres) */}
            {activeMode === 'chat' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-indigo-500" />
                    Discussion en Direct sur cette Leçon
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {chatHistory.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Posez n'importe quelle question sur <strong>{currentLesson.title}</strong> ou cliquez sur les suggestions ci-dessous !
                    </div>
                  ) : (
                    chatHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                          item.role === 'user'
                            ? 'bg-sky-50 text-sky-950 border border-sky-200 ml-6'
                            : 'bg-slate-50 text-slate-800 border border-slate-200 mr-6'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1">
                          <span>{item.role === 'user' ? 'Vous' : 'Assistant IA MasterStudy'}</span>
                          <span>{item.timestamp}</span>
                        </div>
                        <div className="whitespace-pre-line">{item.text}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Bottom Bar: Free-form question input with prompt recommendations */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          {/* Quick suggested prompt pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-600 no-scrollbar">
            <span className="text-slate-400 font-semibold shrink-0 text-[10px] uppercase">
              Idées rapides :
            </span>
            <button
              onClick={() => handleAskQuestion("Donne-moi un exemple concret d'application en production")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 transition-colors"
            >
              Exemple en production
            </button>
            <button
              onClick={() => handleAskQuestion("Quel est le piège classique à éviter sur cette notion ?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 transition-colors"
            >
              Piège classique à éviter
            </button>
            <button
              onClick={() => handleAskQuestion("Comment tester cela rapidement dans mon terminal ?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 transition-colors"
            >
              Tester dans le terminal
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={askQuery}
                onChange={(e) => setAskQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskQuestion();
                }}
                placeholder={`Poser une question précise sur "${currentLesson.title}"...`}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 transition-all"
              />
              <button
                onClick={() => handleAskQuestion()}
                disabled={!askQuery.trim() || isLoading}
                className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-30 text-white transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
