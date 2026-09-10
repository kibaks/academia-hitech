import React, { useState, useRef, useEffect } from 'react';
import { Course, Lesson, TutorPersona } from '../../types';
import { TUTOR_PERSONAS } from '../tutor/personaData';
import { AndroidStyleCharacter } from '../tutor/AndroidStyleCharacter';
import { playTutorSpeech } from '../tutor/speechUtils';
import {
  Send,
  Bot,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  Code2,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface LiveTutorChatSidebarProps {
  course: Course;
  currentLesson: Lesson;
  userCode?: string;
  onOpenFullTutor?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'user';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export const LiveTutorChatSidebar: React.FC<LiveTutorChatSidebarProps> = ({
  course,
  currentLesson,
  userCode = '',
  onOpenFullTutor,
}) => {
  // Tutor Persona selection
  const [activePersona, setActivePersona] = useState<TutorPersona>(TUTOR_PERSONAS[0]);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'tutor',
      text: `Bonjour ! Je suis **${TUTOR_PERSONAS[0].name}**, votre tutrice en direct sur ce cours 🎓.\n\nJe suis là pour répondre à vos questions en temps réel sur la leçon **"${currentLesson.title}"** ou vous aider sur votre code. Comment puis-je vous aider ?`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mic speech recognition
  const [isListeningMic, setIsListeningMic] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Update tutor greeting when lesson changes
  const prevLessonIdRef = useRef(currentLesson.id);
  useEffect(() => {
    if (prevLessonIdRef.current !== currentLesson.id) {
      prevLessonIdRef.current = currentLesson.id;
      setMessages((prev) => [
        ...prev,
        {
          id: `lesson-switch-${Date.now()}`,
          sender: 'tutor',
          text: `💡 *Vous êtes maintenant sur la leçon* : **${currentLesson.title}**\nN'hésitez pas si un concept n'est pas clair ou si vous voulez un exemple pratique !`,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [currentLesson.id, currentLesson.title]);

  // Voice speech synthesis
  const speakMessage = (text: string, msgId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (currentlySpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setCurrentlySpeakingId(msgId);

    playTutorSpeech({
      text,
      langCode: 'fr-FR',
      gender: activePersona.gender,
      pitch: activePersona.defaultPitch || 1.05,
      rate: activePersona.defaultRate || 1.0,
      onStart: () => setCurrentlySpeakingId(msgId),
      onEnd: () => setCurrentlySpeakingId(null),
      onError: () => setCurrentlySpeakingId(null),
    });
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (isListeningMic) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListeningMic(false);
    } else {
      try {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
          alert('La reconnaissance vocale n’est pas supportée par ce navigateur.');
          return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'fr-FR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListeningMic(false);
        };

        recognition.onerror = () => setIsListeningMic(false);
        recognition.onend = () => setIsListeningMic(false);

        recognitionRef.current = recognition;
        recognition.start();
        setIsListeningMic(true);
      } catch (err) {
        console.warn('Speech recognition error:', err);
        setIsListeningMic(false);
      }
    }
  };

  // Send message to backend Gemini tutor stream
  const handleSendMessage = async (textOverride?: string) => {
    const query = (textOverride || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    const tempBotId = `t-${Date.now()}`;
    const botMsg: ChatMessage = {
      id: tempBotId,
      sender: 'tutor',
      text: '',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const payload = {
        message: query,
        contextCourse: `${course.title} (Module : ${currentLesson.title})`,
        currentLessonTitle: currentLesson.title,
        conversationHistory: messages.slice(-6).map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
        personaName: activePersona.name,
        personaGender: activePersona.gender,
        codeContext: userCode ? `Code actuel de l'apprenant dans l'éditeur :\n\`\`\`\n${userCode.slice(0, 800)}\n\`\`\`` : '',
        teachingStyle: 'interactive',
        speedMode: 'fast',
        audioLanguage: 'fr-FR',
        language: 'fr-FR',
      };

      const response = await fetch('/api/gemini/tutor-chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.slice(6).trim();
            if (!jsonStr) continue;
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.type === 'chunk' && parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === tempBotId ? { ...m, text: accumulatedText, isStreaming: true } : m
                  )
                );
              }
            } catch (e) {
              console.warn(e);
            }
          }
        }
      }

      // Finalize message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempBotId
            ? { ...m, text: accumulatedText || "Je suis à votre disposition pour continuer !", isStreaming: false }
            : m
        )
      );

      if (audioEnabled && accumulatedText) {
        speakMessage(accumulatedText, tempBotId);
      }
    } catch (err: any) {
      console.warn('Tutor Chat fallback:', err);
      const fallbackReply = `C'est une excellente question sur **${currentLesson.title}** ! Pour bien assimiler ce concept, concentrez-vous sur la pratique et l'exécution du code dans le bac à sable. N'hésitez pas à tester chaque commande pas à pas.`;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempBotId ? { ...m, text: fallbackReply, isStreaming: false } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick prompt presets tailored to current lesson & code
  const quickPrompts = [
    {
      label: '💡 Explique simplement',
      text: `Peux-tu m'expliquer le concept clé de la leçon "${currentLesson.title}" avec une analogie simple ?`,
    },
    {
      label: '💻 Exemple concret',
      text: `Donne-moi un exemple concret de code illustrant la leçon "${currentLesson.title}".`,
    },
    {
      label: '🐛 Vérifier mon code',
      text: userCode
        ? `Peux-tu analyser mon code actuel dans l'éditeur et me dire s'il y a des erreurs ou optimisations ?\n\`\`\`\n${userCode.slice(0, 500)}\n\`\`\``
        : `Comment puis-je tester et valider le code pour cette leçon ?`,
    },
    {
      label: '🎯 Question quiz',
      text: `Pose-moi une question rapide pour tester ma compréhension de cette leçon !`,
    },
  ];

  return (
    <div
      id="live-tutor-chat-sidebar"
      className="flex flex-col h-[640px] max-h-[75vh] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Header with Tutor Persona & Live Status */}
      <div className="p-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700 shrink-0">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity"
            title="Changer de tuteur IA"
          >
            <div className="relative shrink-0">
              <img
                src={activePersona.avatarUrl}
                alt={activePersona.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white truncate max-w-[130px]">
                  {activePersona.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>En direct • Tuteur IA</span>
              </div>
            </div>
          </button>

          {/* Persona Switcher Dropdown */}
          {showPersonaMenu && (
            <div className="absolute left-0 top-12 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in">
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Choisir votre tuteur en direct :
              </div>
              {TUTOR_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePersona(p);
                    setShowPersonaMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
                    activePersona.id === p.id
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'hover:bg-slate-800 text-slate-200'
                  }`}
                >
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{p.specialty}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              audioEnabled ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={audioEnabled ? 'Lecture vocale automatique activée' : 'Activer la lecture vocale'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  id: `reset-${Date.now()}`,
                  sender: 'tutor',
                  text: `Chat réinitialisé. Posez toutes vos questions sur **${currentLesson.title}** !`,
                  timestamp: new Date().toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                },
              ])
            }
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Effacer la discussion"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Lesson Context Banner */}
      <div className="px-3.5 py-1.5 bg-sky-50 border-b border-sky-100 flex items-center justify-between text-[11px] text-sky-900 shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span className="truncate">
            Leçon : <strong>{currentLesson.title}</strong>
          </span>
        </div>
        {userCode && (
          <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-200/70 text-sky-800 flex items-center gap-1">
            <Code2 className="w-2.5 h-2.5" /> Code lié
          </span>
        )}
      </div>

      {/* Live Animated Avatar Card with Real-time Lip Movement & Blinking */}
      <div className="p-3 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 text-white shrink-0">
        <div className="relative flex items-center gap-3">
          <div className="relative shrink-0">
            <AndroidStyleCharacter
              persona={activePersona}
              state={currentlySpeakingId || messages.some((m) => m.isStreaming) ? 'speaking' : isLoading ? 'thinking' : isListeningMic ? 'listening' : 'idle'}
              size="sm"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>{activePersona.name}</span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                {currentlySpeakingId || messages.some((m) => m.isStreaming) ? '🗣️ En train de parler' : isLoading ? '🧠 Analyse...' : isListeningMic ? '🎙️ Écoute...' : '✨ En veille'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate mt-0.5">{activePersona.specialty}</p>
          </div>
        </div>

        {onOpenFullTutor && (
          <button
            type="button"
            onClick={onOpenFullTutor}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-bold border border-indigo-400/40 shadow-xs flex items-center gap-1 shrink-0 transition-colors"
            title="Ouvrir le tuteur IA grand écran"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden xs:inline">Grand écran</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/60">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              <div
                className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed transition-all ${
                  isUser
                    ? 'bg-sky-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.isStreaming && (
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-emerald-500 animate-pulse align-middle" />
                )}
              </div>

              {/* Message metadata & actions */}
              <div
                className={`flex items-center gap-1.5 mt-1 px-1 text-[10px] text-slate-400 ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <span>{msg.timestamp}</span>

                {!isUser && msg.text && (
                  <>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => speakMessage(msg.text, msg.id)}
                      className="hover:text-emerald-600 flex items-center gap-0.5 transition-colors"
                      title="Écouter la réponse"
                    >
                      <Volume2
                        className={`w-3 h-3 ${
                          currentlySpeakingId === msg.id ? 'text-emerald-600 animate-pulse' : ''
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="hover:text-slate-600 flex items-center gap-0.5 transition-colors"
                      title="Copier le message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && !messages[messages.length - 1]?.isStreaming && (
          <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl max-w-[80%] shadow-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] text-slate-500 italic">
              {activePersona.name} réfléchit...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(qp.text)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 text-slate-700 border border-slate-200 transition-all whitespace-nowrap font-medium disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-xl border transition-all ${
              isListeningMic
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
            }`}
            title={isListeningMic ? 'Arrêter l’enregistrement vocal' : 'Parler au micro'}
          >
            {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Poser une question à ${activePersona.name}...`}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white text-slate-800 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs transition-colors flex items-center justify-center"
            title="Envoyer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {onOpenFullTutor && (
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Besoin d'un appel audio/visio complet ?</span>
            <button
              type="button"
              onClick={onOpenFullTutor}
              className="text-sky-600 font-bold hover:underline flex items-center gap-1"
            >
              <span>Ouvrir Studio AIDA</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
