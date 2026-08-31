import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TutorPersona, TutorConfig } from '../../types';
import { TUTOR_PERSONAS, TUTOR_LANGUAGES } from './personaData';
import { playTutorSpeech } from './speechUtils';
import {
  X,
  Sliders,
  Volume2,
  Zap,
  Sparkles,
  ShieldCheck,
  User,
  Mic,
  Video,
  CheckCircle2,
  Play,
  RotateCcw,
  BookOpen,
  Brain,
  MessageSquare,
  Globe2,
  Languages
} from 'lucide-react';

interface TutorSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TutorConfig;
  onSaveConfig: (newConfig: TutorConfig) => void;
}

export const TutorSettingsModal: React.FC<TutorSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [localConfig, setLocalConfig] = useState<TutorConfig>({ ...config });
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [customLangInput, setCustomLangInput] = useState('');
  const [showCustomLang, setShowCustomLang] = useState(false);

  if (!isOpen) return null;

  const currentPersona = TUTOR_PERSONAS.find((p) => p.id === localConfig.personaId) || TUTOR_PERSONAS[0];
  const currentLanguage = TUTOR_LANGUAGES.find((l) => l.code === localConfig.audioLanguage) || TUTOR_LANGUAGES[0];

  const handleSelectPersona = (persona: TutorPersona) => {
    setLocalConfig((prev) => ({
      ...prev,
      personaId: persona.id,
      voiceGender: persona.gender,
      voicePitch: persona.defaultPitch,
      voiceRate: persona.defaultRate,
    }));
  };

  const handleSelectLanguage = (langCode: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      audioLanguage: langCode,
    }));
  };

  const handleTestVoice = () => {
    let sampleText = '';
    const isMale = localConfig.voiceGender === 'male';
    const langCode = localConfig.audioLanguage || 'fr-FR';

    if (langCode.startsWith('ln')) {
      sampleText = isMale
        ? `Mbote ! Nazali tuteur na yo ya mobali na Academia ITECH. Naza pene mpo na kotala mateya na yo ya mayele ya masini na Lingála !`
        : `Mbote na yo ! Nazali tutrice na yo AIDA na Academia ITECH. Tokoloba na Lingála mpo na kokolisa mayele na yo !`;
    } else if (langCode.startsWith('en')) {
      sampleText = isMale
        ? `Hello! I am your male AI engineering tutor at Academia ITECH. Ready to elevate your coding skills with speed and precision!`
        : `Hello! I am your AI tutor at Academia ITECH. I'm excited to help you master AI, Cloud, and Software Engineering in English!`;
    } else if (langCode.startsWith('sw')) {
      sampleText = `Habari yako! Mimi ni mkufunzi wako wa AI katika Academia ITECH. Tuko tayari kujifunza programu na teknolojia kwa Kiswahili!`;
    } else if (langCode.startsWith('es')) {
      sampleText = `¡Hola! Soy tu tutor de IA en Academia ITECH. ¡Estoy listo para acompañarte en tu aprendizaje en español!`;
    } else if (langCode.startsWith('pt')) {
      sampleText = `Olá! Sou o seu tutor de IA na Academia ITECH. Vamos dominar programação e IA juntos!`;
    } else {
      sampleText = isMale
        ? `Bonjour ! Je suis votre tuteur IA masculin. Ma voix française est fluide, naturelle et calibrée sans accent étranger. Prêt pour votre session !`
        : `Bonjour ! Je suis votre tutrice IA féminine. Ma voix française est optimisée pour une élocution claire, dynamique et naturelle. Comment puis-je vous accompagner aujourd'hui ?`;
    }

    setIsPlayingSample(true);
    playTutorSpeech({
      text: sampleText,
      langCode,
      gender: localConfig.voiceGender || 'female',
      pitch: localConfig.voicePitch,
      rate: localConfig.voiceRate,
      onStart: () => setIsPlayingSample(true),
      onEnd: () => setIsPlayingSample(false),
      onError: () => setIsPlayingSample(false),
    });
  };

  const handleSave = () => {
    onSaveConfig(localConfig);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl max-h-[92vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                  <span>Configuration du Tuteur IA</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700">
                    Multilingue & Voix Réelle
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Langue (Français, Lingála, Anglais...), Avatar (Homme/Femme) et synthèse vocale
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Section 1: Choix de la Langue (Français, Lingala, Anglais, etc.) */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-emerald-400" />
                  1. Langue d'Apprentissage & d'Élocution (Pré-configurée)
                </label>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5" />
                  Actif : {currentLanguage.name} {currentLanguage.flag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Le tuteur adapte ses réponses écrites, orales, transcriptions d'appels et quiz dans la langue sélectionnée.
              </p>

              {/* Languages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {TUTOR_LANGUAGES.map((lang) => {
                  const isSelected = localConfig.audioLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-lg">{lang.flag}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white truncate">{lang.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{lang.nativeName}</div>
                      </div>
                      <div className="text-[9px] text-emerald-400/80 mt-1 font-mono truncate">{lang.region}</div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Other Language Accordion */}
              <div className="pt-2 border-t border-slate-800/80">
                {!showCustomLang ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomLang(true)}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <span>+ Configurer une autre langue personnalisée</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={customLangInput}
                      onChange={(e) => setCustomLangInput(e.target.value)}
                      placeholder="Ex: Wolof, Allemand, Arabe, Chinois..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customLangInput.trim()) {
                          handleSelectLanguage(customLangInput.trim().toLowerCase());
                          setShowCustomLang(false);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
                    >
                      Appliquer
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomLang(false)}
                      className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Choix de l'Avatar & Genre (Homme / Femme) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  2. Choix du Tuteur Animé (Style Application de Langues Android)
                </label>
                <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Lèvres Réactives & Visèmes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TUTOR_PERSONAS.map((p) => {
                  const isSelected = localConfig.personaId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPersona(p)}
                      className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400'
                          : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold text-white ${
                            p.gender === 'female' ? 'bg-pink-600' : 'bg-blue-600'
                          }`}
                        >
                          {p.gender === 'female' ? 'Femme' : 'Homme'}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-indigo-300 font-medium truncate">{p.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{p.specialty}</p>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.traits.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-slate-900/80 text-[9px] text-slate-300 border border-slate-700/50"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Vitesse de Réponse & Intelligence */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                3. Vitesse de Réponse de l'IA (Résolution de la latence)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setLocalConfig((prev) => ({ ...prev, speedMode: 'flash' }))}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    localConfig.speedMode === 'flash'
                      ? 'bg-amber-950/50 border-amber-500 shadow-md ring-1 ring-amber-400/50'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                  }`}
                >
                  <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Mode Éclair (Ultra-Rapide &lt;0.8s)</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Recommandé
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Réponses concises, directes et immédiates. Idéal pour la fluidité des appels vocaux et du chat sans attente.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setLocalConfig((prev) => ({ ...prev, speedMode: 'pro' }))}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    localConfig.speedMode === 'pro'
                      ? 'bg-indigo-950/50 border-indigo-500 shadow-md ring-1 ring-indigo-400/50'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                  }`}
                >
                  <Brain className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-white">Mode Approfondi & Analyse</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Raisonnement détaillé avec blocs de code complets et démonstrations architecturales.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Calibrage de la Voix Réelle & Audio */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  4. Calibrage de la Voix Réelle ({currentLanguage.name})
                </label>
                <button
                  onClick={handleTestVoice}
                  disabled={isPlayingSample}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-all disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isPlayingSample ? 'Écoute en cours...' : `Tester la voix (${currentLanguage.flag})`}</span>
                </button>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Vitesse d'élocution</span>
                    <span className="font-mono text-cyan-400">{localConfig.voiceRate}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.4"
                    step="0.05"
                    value={localConfig.voiceRate}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({ ...prev, voiceRate: parseFloat(e.target.value) }))
                    }
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Calme (0.8x)</span>
                    <span>Naturel (1.05x)</span>
                    <span>Rapide (1.4x)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Tonalité & Timbre (Pitch)</span>
                    <span className="font-mono text-cyan-400">{localConfig.voicePitch}</span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.3"
                    step="0.05"
                    value={localConfig.voicePitch}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({ ...prev, voicePitch: parseFloat(e.target.value) }))
                    }
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Grave (0.7)</span>
                    <span>Équilibré (1.0)</span>
                    <span>Aigu (1.3)</span>
                  </div>
                </div>
              </div>

              {/* Auto-Speak Checkbox */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoSpeakCheck"
                    checked={localConfig.autoSpeak}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({ ...prev, autoSpeak: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="autoSpeakCheck" className="text-xs text-slate-300 cursor-pointer">
                    Lecture vocale automatique des réponses dans le chat
                  </label>
                </div>
              </div>
            </div>

            {/* Section 5: Style Pédagogique */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                5. Personnalité & Style d'Enseignement
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'supportive', label: 'Bienveillant', desc: 'Pédagogie douce et encouragements' },
                  { id: 'expert', label: 'Expert Senior', desc: 'Rigueur technique et code optimisé' },
                  { id: 'coach', label: 'Coach Énergique', desc: 'Défis stimulants et gains XP' },
                  { id: 'socratic', label: 'Méthode Socratique', desc: 'Questions de guidage vers la solution' },
                ].map((style) => {
                  const isSelected = localConfig.teachingStyle === style.id;
                  return (
                    <div
                      key={style.id}
                      onClick={() =>
                        setLocalConfig((prev) => ({ ...prev, teachingStyle: style.id as any }))
                      }
                      className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                        isSelected
                          ? 'bg-indigo-900/60 border-indigo-500 text-white font-semibold'
                          : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="text-xs">{style.label}</p>
                      <p className="text-[10px] text-slate-400 mt-1 leading-tight">{style.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 6: Paramètres des Appels Vidéo/Audio */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Options d'Appel Vidéo Interactif</h4>
                  <p className="text-[11px] text-slate-400">Activer la caméra apprenant et la reconnaissance vocale continue</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.enableCallVideo}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({ ...prev, enableCallVideo: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-cyan-600 bg-slate-800 border-slate-700"
                  />
                  <span>Webcam activée</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.enableSpeechRecognition}
                    onChange={(e) =>
                      setLocalConfig((prev) => ({ ...prev, enableSpeechRecognition: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-cyan-600 bg-slate-800 border-slate-700"
                  />
                  <span>Microphone auto</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
            <button
              onClick={() => {
                const defaultP = TUTOR_PERSONAS[0];
                setLocalConfig({
                  personaId: defaultP.id,
                  speedMode: 'flash',
                  teachingStyle: 'supportive',
                  voiceGender: 'female',
                  voiceName: '',
                  voicePitch: defaultP.defaultPitch,
                  voiceRate: defaultP.defaultRate,
                  autoSpeak: true,
                  enableCallVideo: true,
                  enableSpeechRecognition: true,
                  audioLanguage: 'fr-FR',
                });
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser par défaut</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-900/40 transition-all hover:scale-105"
              >
                Enregistrer & Appliquer
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
