import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TutorPersona, TutorConfig, CallLogItem } from '../../types';
import { TUTOR_LANGUAGES, getGreetingForLanguage } from './personaData';
import { playTutorSpeech } from './speechUtils';
import { RealisticAvatar } from './RealisticAvatar';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  MessageSquare,
  Sparkles,
  Send,
  Zap,
  CheckCircle2,
  Settings,
  HelpCircle,
  Clock,
  Radio,
  User,
  Brain,
  Globe2,
  Languages
} from 'lucide-react';

interface TutorCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: TutorPersona;
  config: TutorConfig;
  contextCourseTitle?: string;
  currentLessonTitle?: string;
  onOpenSettings?: () => void;
  onUpdateLanguage?: (langCode: string) => void;
}

export const TutorCallModal: React.FC<TutorCallModalProps> = ({
  isOpen,
  onClose,
  persona,
  config,
  contextCourseTitle = 'Masterclass IA & Ingénierie ITECH',
  currentLessonTitle = 'Session Active',
  onOpenSettings,
  onUpdateLanguage,
}) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(config.enableCallVideo);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentLangCode, setCurrentLangCode] = useState(config.audioLanguage || 'fr-FR');
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  // Avatar state in call
  const [avatarState, setAvatarState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');

  const activeLanguage = TUTOR_LANGUAGES.find((l) => l.code === currentLangCode) || TUTOR_LANGUAGES[0];
  
  // Transcripts
  const [liveUserSpeech, setLiveUserSpeech] = useState('');
  const [transcriptLogs, setTranscriptLogs] = useState<CallLogItem[]>([
    {
      id: 'log-0',
      speaker: 'tutor',
      text: getGreetingForLanguage(persona, currentLangCode).replace(/[*_#`]/g, ''),
      timestamp: '00:00',
    },
  ]);
  const [manualInput, setManualInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Play Dial / Ring Sound synthesized with Web Audio API
  const playRingtone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Speak helper for call with strict accent enforcement
  const speakInCall = (textToSpeak: string, forcedLang?: string) => {
    if (!isSpeakerOn) {
      setAvatarState('idle');
      return;
    }

    const langToUse = forcedLang || currentLangCode;

    playTutorSpeech({
      text: textToSpeak,
      langCode: langToUse,
      gender: config.voiceGender || persona.gender || 'female',
      pitch: config.voicePitch || persona.defaultPitch,
      rate: config.voiceRate || persona.defaultRate,
      onStart: () => {
        setAvatarState('speaking');
      },
      onEnd: () => {
        setAvatarState('idle');
      },
      onError: () => {
        setAvatarState('idle');
      },
    });
  };

  // Setup user webcam
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240 },
          audio: false,
        });
        mediaStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.warn('Webcam non accessible ou refusée :', err);
      setIsVideoOn(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // Setup Speech Recognition
  const initSpeechRecognition = (langCode: string) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      const targetLang = TUTOR_LANGUAGES.find((l) => l.code === langCode);
      recognition.lang = targetLang?.speechRecognitionLang || langCode || 'fr-FR';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setLiveUserSpeech(currentTranscript);
        setAvatarState('listening');
      };

      recognition.onerror = (e: any) => {
        console.log('Speech recognition event:', e.error);
      };

      recognition.onend = () => {
        // Auto-restart if call is still active and not muted
        if (callStatus === 'connected' && !isMuted) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Erreur initialisation reconnaissance vocale:', e);
    }
  };

  // Handle call initiation
  useEffect(() => {
    if (!isOpen) return;

    setCallStatus('connecting');
    setCallDuration(0);
    playRingtone();

    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
      // Speak tutor welcome in configured language
      const greeting = getGreetingForLanguage(persona, currentLangCode);
      speakInCall(greeting, currentLangCode);

      // Start duration counter
      timerIntervalRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Init Camera & Mic
      if (isVideoOn) {
        startCamera();
      }
      if (config.enableSpeechRecognition) {
        initSpeechRecognition(currentLangCode);
      }
    }, 1800);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(timerIntervalRef.current);
      stopCamera();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, persona.id]);

  // Language switch handler
  const handleSwitchLanguage = (newLangCode: string) => {
    setCurrentLangCode(newLangCode);
    setShowLangMenu(false);
    if (onUpdateLanguage) {
      onUpdateLanguage(newLangCode);
    }

    // Switch speech recognition
    if (config.enableSpeechRecognition && callStatus === 'connected') {
      initSpeechRecognition(newLangCode);
    }

    const langInfo = TUTOR_LANGUAGES.find((l) => l.code === newLangCode) || TUTOR_LANGUAGES[0];
    const switchNotice = `🌐 Langue basculée en ${langInfo.name} (${langInfo.flag}).`;
    const noticeLog: CallLogItem = {
      id: `sys-${Date.now()}`,
      speaker: 'tutor',
      text: switchNotice,
      timestamp: formatTimer(callDuration),
    };
    setTranscriptLogs((prev) => [...prev, noticeLog]);
  };

  // Scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptLogs, showTranscript]);

  const handleEndCall = () => {
    setCallStatus('ended');
    clearInterval(timerIntervalRef.current);
    stopCamera();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setTimeout(() => {
      onClose();
    }, 900);
  };

  // Send user message through call
  const handleSendVoiceOrText = async (textToSend?: string) => {
    const query = textToSend || liveUserSpeech || manualInput;
    if (!query.trim() || isProcessing) return;

    const formattedTime = formatTimer(callDuration);
    const userLog: CallLogItem = {
      id: `u-${Date.now()}`,
      speaker: 'user',
      text: query,
      timestamp: formattedTime,
    };

    setTranscriptLogs((prev) => [...prev, userLog]);
    setLiveUserSpeech('');
    setManualInput('');
    setIsProcessing(true);
    setAvatarState('thinking');

    try {
      const response = await fetch('/api/gemini/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          contextCourse: contextCourseTitle,
          currentLessonTitle: currentLessonTitle,
          isCallMode: true,
          speedMode: config.speedMode || 'flash',
          personaName: persona.name,
          personaGender: persona.gender,
          teachingStyle: config.teachingStyle,
          audioLanguage: currentLangCode,
          language: currentLangCode,
        }),
      });

      const data = await response.json();
      const reply = data.reply || (currentLangCode.startsWith('ln') ? 'Nayoki malamu, loba kaka !' : currentLangCode.startsWith('en') ? 'I hear you clearly, please continue!' : 'Je vous écoute, continuez !');

      const tutorLog: CallLogItem = {
        id: `t-${Date.now()}`,
        speaker: 'tutor',
        text: reply,
        timestamp: formatTimer(callDuration),
      };

      setTranscriptLogs((prev) => [...prev, tutorLog]);
      speakInCall(reply, currentLangCode);
    } catch (err) {
      console.error(err);
      setAvatarState('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && recognitionRef.current) {
      recognitionRef.current.stop();
    } else if (isMuted && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {}
    }
  };

  const toggleVideo = () => {
    if (isVideoOn) {
      stopCamera();
      setIsVideoOn(false);
    } else {
      setIsVideoOn(true);
      startCamera();
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="relative w-full max-w-5xl h-[92vh] max-h-[820px] rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-white"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-ping absolute inset-0 opacity-75" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block relative" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
                    Appel Live Interactif • {persona.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                    HD Voice {config.speedMode === 'flash' ? '• Flash IA' : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  {contextCourseTitle} • {currentLessonTitle}
                </p>
              </div>
            </div>

            {/* Timer & Controls & Language Switcher */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Language Dropdown in Call */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-xs"
                >
                  <span className="text-sm">{activeLanguage.flag}</span>
                  <span className="hidden sm:inline">{activeLanguage.name}</span>
                  <Languages className="w-3 h-3 text-emerald-400" />
                </button>

                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">Changer de langue :</p>
                    {TUTOR_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleSwitchLanguage(l.code)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors ${
                          currentLangCode === l.code
                            ? 'bg-emerald-950/80 text-emerald-300 font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{l.flag}</span>
                          <span>{l.name}</span>
                        </span>
                        {currentLangCode === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Timer */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-cyan-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{callStatus === 'connecting' ? 'Connexion...' : formatTimer(callDuration)}</span>
              </div>

              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  title="Paramètres de l'avatar et de la voix"
                  className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Main Stage Grid */}
          <div className="relative flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
            {/* Left/Center: Avatar Stage */}
            <div
              className={`relative flex flex-col items-center justify-center p-6 sm:p-8 transition-all duration-300 ${
                showTranscript ? 'lg:col-span-8' : 'lg:col-span-12'
              }`}
            >
              {/* Connecting Wave Animation */}
              {callStatus === 'connecting' ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="absolute -inset-8 rounded-full bg-cyan-500/20 blur-xl"
                    />
                    <img
                      src={persona.avatarUrl}
                      alt={persona.name}
                      referrerPolicy="no-referrer"
                      className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500/80 shadow-2xl"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-white">Établissement de la connexion sécurisée...</h4>
                    <p className="text-xs text-slate-400 mt-1">Activation du modèle vocal ({activeLanguage.name} {activeLanguage.flag}) et de l'avatar {persona.name}</p>
                  </div>
                </div>
              ) : (
                <div className="relative flex flex-col items-center justify-center w-full max-w-lg">
                  {/* Large Realistic Avatar */}
                  <RealisticAvatar
                    persona={persona}
                    state={avatarState}
                    size="fullscreen"
                    isCalling={true}
                    speedMode={config.speedMode}
                  />

                  {/* Real-time Subtitles / Live Transcript Bubble */}
                  <div className="mt-4 w-full px-4">
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800/80 text-center shadow-lg min-h-[58px] flex items-center justify-center">
                      {liveUserSpeech ? (
                        <p className="text-sm text-emerald-300 animate-pulse font-medium">
                          🎙️ Vous : "{liveUserSpeech}"
                        </p>
                      ) : isProcessing ? (
                        <p className="text-sm text-amber-300 font-medium flex items-center gap-2">
                          <Brain className="w-4 h-4 animate-spin" /> {persona.name} formule sa réponse ({activeLanguage.name})...
                        </p>
                      ) : (
                        <p className="text-xs sm:text-sm text-slate-300">
                          {transcriptLogs[transcriptLogs.length - 1]?.text || 'Parlez naturellement ou posez votre question.'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Speech Topic Chips (Adaptive to language) */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 max-w-md">
                    <button
                      onClick={() => handleSendVoiceOrText(currentLangCode.startsWith('ln') ? 'Limbolela ngai mateya ya ntina ya lecon oyo' : currentLangCode.startsWith('en') ? 'Explain key concepts of this module' : 'Explique-moi les concepts fondamentaux de cette leçon')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 border border-slate-700/60 text-[11px] text-slate-300 hover:text-white transition-colors"
                    >
                      💡 {currentLangCode.startsWith('ln') ? 'Résumé na Lingála' : currentLangCode.startsWith('en') ? 'Express summary' : 'Résumé express'}
                    </button>
                    <button
                      onClick={() => handleSendVoiceOrText(currentLangCode.startsWith('ln') ? 'Tuna ngai motuna ya quiz mpo na komeka ngai' : currentLangCode.startsWith('en') ? 'Give me a challenging oral quiz question' : 'Pose-moi une question de quiz oral pour me tester')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 border border-slate-700/60 text-[11px] text-slate-300 hover:text-white transition-colors"
                    >
                      🎯 {currentLangCode.startsWith('ln') ? 'Komeka mayele (Quiz)' : currentLangCode.startsWith('en') ? 'Oral Quiz Challenge' : 'Teste-moi oralement'}
                    </button>
                    <button
                      onClick={() => handleSendVoiceOrText(currentLangCode.startsWith('ln') ? 'Pesa ngai ndakisa ya code ya solo' : currentLangCode.startsWith('en') ? 'Show me a practical code snippet' : 'Donne-moi un exemple concret de code')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 border border-slate-700/60 text-[11px] text-slate-300 hover:text-white transition-colors"
                    >
                      💻 {currentLangCode.startsWith('ln') ? 'Ndakisa ya Code' : currentLangCode.startsWith('en') ? 'Code snippet' : 'Exemple de code'}
                    </button>
                  </div>
                </div>
              )}

              {/* User Webcam Picture-in-Picture (PiP) */}
              <div className="absolute top-4 right-4 z-20">
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-xl flex items-center justify-center">
                  {isVideoOn ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-1 p-2 text-center">
                      <User className="w-7 h-7 text-slate-500" />
                      <span className="text-[10px] text-slate-400">Caméra désactivée</span>
                    </div>
                  )}
                  <div className="absolute bottom-1 left-2 flex items-center gap-1 text-[9px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded">
                    <span>Moi</span>
                    {isMuted && <MicOff className="w-2.5 h-2.5 text-rose-400" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Transcript & Chat Sidebar (Collapsible) */}
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-4 border-l border-slate-800 bg-slate-950/80 flex flex-col h-full overflow-hidden"
              >
                <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-slate-200">Transcription ({activeLanguage.name})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{transcriptLogs.length} répliques</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {transcriptLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex flex-col ${log.speaker === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                        <span>{log.speaker === 'user' ? 'Vous' : persona.name}</span>
                        <span>•</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <div
                        className={`p-2.5 rounded-xl text-xs max-w-[90%] leading-relaxed ${
                          log.speaker === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                        }`}
                      >
                        {log.text}
                      </div>
                    </div>
                  ))}
                  <div ref={transcriptEndRef} />
                </div>

                {/* Inline Manual Message Input */}
                <div className="p-3 border-t border-slate-800 bg-slate-900/60">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendVoiceOrText();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder={`Écrire en ${activeLanguage.name}...`}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      disabled={!manualInput.trim() || isProcessing}
                      className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="p-4 sm:p-5 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-xl flex flex-wrap items-center justify-center sm:justify-between gap-4">
            {/* Left: Input Speech Prompt & Push to talk */}
            <div className="flex items-center gap-2">
              {liveUserSpeech && (
                <button
                  onClick={() => handleSendVoiceOrText()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg animate-pulse"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer ma voix</span>
                </button>
              )}
            </div>

            {/* Center: Call Hardware Buttons */}
            <div className="flex items-center gap-3">
              {/* Mic Toggle */}
              <button
                onClick={toggleMute}
                title={isMuted ? 'Activer le micro' : 'Couper le micro'}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  isMuted
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-400" />}
              </button>

              {/* Camera Toggle */}
              <button
                onClick={toggleVideo}
                title={isVideoOn ? 'Désactiver la caméra' : 'Activer la caméra'}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  !isVideoOn
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-slate-800 text-cyan-400 border-cyan-500/50 hover:bg-slate-700 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              {/* Speaker Toggle */}
              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                title={isSpeakerOn ? 'Haut-parleur actif' : 'Haut-parleur muet'}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  !isSpeakerOn
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-slate-800 text-indigo-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Transcript Drawer Toggle */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                title="Afficher les notes et transcriptions"
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  showTranscript
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
              </button>

              {/* Hang Up (Red Call End Button) */}
              <button
                onClick={handleEndCall}
                title="Raccrocher l'appel"
                className="px-6 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold flex items-center gap-2 shadow-xl shadow-rose-900/40 transition-all hover:scale-105 active:scale-95"
              >
                <PhoneOff className="w-5 h-5" />
                <span className="text-sm font-semibold">Raccrocher</span>
              </button>
            </div>

            {/* Right: Language Flag & Mode Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="text-sm">{activeLanguage.flag}</span>
              <span>{activeLanguage.name}</span>
              <span>•</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gemini 3.7</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
