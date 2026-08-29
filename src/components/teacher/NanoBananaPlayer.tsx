import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NanoBananaLesson, NanoBananaScene } from '../../types';
import { playTutorSpeech } from '../tutor/speechUtils';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Code2,
  Cpu,
  Shield,
  Layers,
  ArrowRight,
  Maximize2,
  Check
} from 'lucide-react';

interface NanoBananaPlayerProps {
  lesson: NanoBananaLesson;
  onComplete?: () => void;
  onClose?: () => void;
}

export const NanoBananaPlayer: React.FC<NanoBananaPlayerProps> = ({
  lesson,
  onComplete,
  onClose,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [autoVoice, setAutoVoice] = useState(true);

  // Quiz state for current scene
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedScenes, setCompletedScenes] = useState<number[]>([]);

  const currentScene: NanoBananaScene = lesson.scenes[currentSceneIndex] || lesson.scenes[0];
  const isLastScene = currentSceneIndex === lesson.scenes.length - 1;

  // Speak narrator text automatically when switching scene
  useEffect(() => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);

    if (autoVoice && currentScene?.narratorText) {
      speakCurrentScene();
    }
  }, [currentSceneIndex]);

  const speakCurrentScene = () => {
    if (!currentScene?.narratorText) return;
    setIsPlayingVoice(true);

    playTutorSpeech({
      text: currentScene.narratorText,
      langCode: 'fr-FR',
      gender: 'female',
      pitch: 1.05,
      rate: 1.0,
      onStart: () => setIsPlayingVoice(true),
      onEnd: () => setIsPlayingVoice(false),
      onError: () => setIsPlayingVoice(false),
    });
  };

  const handleNextScene = () => {
    if (!completedScenes.includes(currentSceneIndex)) {
      setCompletedScenes([...completedScenes, currentSceneIndex]);
    }

    if (isLastScene) {
      if (onComplete) onComplete();
    } else {
      setCurrentSceneIndex((prev) => prev + 1);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
    }
  };

  const handleAnswerQuiz = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(idx);
    setQuizSubmitted(true);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col min-h-[560px]">
      {/* 1. Header with Nano Banana Branding & Progress */}
      <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
            🍌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
                Nano Banana • Cours Animé
              </span>
              <span className="text-xs text-slate-400">Étape {currentSceneIndex + 1} sur {lesson.scenes.length}</span>
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-white mt-0.5">{lesson.title}</h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isPlayingVoice) {
                window.speechSynthesis?.cancel();
                setIsPlayingVoice(false);
              } else {
                speakCurrentScene();
              }
            }}
            className={`p-2 rounded-xl transition-all ${
              isPlayingVoice
                ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Narration vocale"
          >
            {isPlayingVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              Fermer
            </button>
          )}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 px-6 pt-3 bg-slate-950/40">
        {lesson.scenes.map((sc, idx) => (
          <div
            key={sc.id}
            onClick={() => setCurrentSceneIndex(idx)}
            className="h-1.5 rounded-full cursor-pointer overflow-hidden bg-slate-800 transition-all"
          >
            <div
              className={`h-full transition-all duration-500 ${
                idx === currentSceneIndex
                  ? 'bg-amber-400 w-full'
                  : idx < currentSceneIndex
                  ? 'bg-emerald-400 w-full'
                  : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* 2. Interactive Scene Content Canvas */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Scene Title & Speaker Tag */}
            <div className="flex items-center gap-3">
              <img
                src={lesson.characterAvatar}
                alt={lesson.characterName}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
              <div>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {lesson.characterName}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white">{currentScene.title}</h2>
              </div>
            </div>

            {/* Narrator Dialogue Box */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-sm sm:text-base text-slate-100 font-medium leading-relaxed flex items-start gap-3 shadow-inner">
              <span className="text-2xl mt-0.5">💬</span>
              <p className="flex-1">{currentScene.narratorText}</p>
            </div>

            {/* ANIMATED VISUAL CANVAS ACCORDING TO TYPE */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  {currentScene.visualElement.title}
                </span>
                <span className="text-[11px] text-slate-400">{currentScene.visualElement.description}</span>
              </div>

              {/* Visual Diagram Details */}
              {currentScene.visualElement.details && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  {currentScene.visualElement.details.map((det, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 flex items-start gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{det}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Code comparison step */}
              {currentScene.visualElement.codeBefore && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Avant</span>
                    <pre className="whitespace-pre-wrap">{currentScene.visualElement.codeBefore}</pre>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Optimisé / Après</span>
                    <pre className="whitespace-pre-wrap">{currentScene.visualElement.codeAfter}</pre>
                  </div>
                </div>
              )}

              {/* Key Takeaway Banner */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 flex items-center gap-2.5">
                <span className="text-base">💡</span>
                <span>
                  <strong>À retenir :</strong> {currentScene.keyTakeaway}
                </span>
              </div>
            </div>

            {/* Interactive Mini-Quiz if available */}
            {currentScene.miniQuiz && (
              <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-bold text-xs sm:text-sm text-white">
                    Mini-Défi Interactif : {currentScene.miniQuiz.question}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentScene.miniQuiz.options.map((opt, oIdx) => {
                    const isCorrect = oIdx === currentScene.miniQuiz!.correctIndex;
                    const isChosen = selectedAnswer === oIdx;

                    let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-400';
                    if (quizSubmitted) {
                      if (isCorrect) btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                      else if (isChosen) btnStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswerQuiz(oIdx)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                        {quizSubmitted && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <p className="text-xs text-indigo-200 mt-2 italic bg-indigo-900/30 p-2.5 rounded-lg">
                    {currentScene.miniQuiz.explanation}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 3. Navigation Controls Bottom Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
          <button
            onClick={handlePrevScene}
            disabled={currentSceneIndex === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          <div className="text-xs text-slate-400 font-semibold">
            {currentSceneIndex + 1} / {lesson.scenes.length}
          </div>

          <button
            onClick={handleNextScene}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>{isLastScene ? 'Terminer la Leçon' : 'Étape Suivante'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
