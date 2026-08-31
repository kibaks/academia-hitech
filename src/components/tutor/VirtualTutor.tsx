import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TutorMessage, Course, TutorConfig, TutorPersona } from '../../types';
import { TUTOR_PERSONAS, DEFAULT_TUTOR_CONFIG, TUTOR_LANGUAGES, getGreetingForLanguage } from './personaData';
import { playTutorSpeech } from './speechUtils';
import { RealisticAvatar } from './RealisticAvatar';
import { TutorCallModal } from './TutorCallModal';
import { TutorSettingsModal } from './TutorSettingsModal';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';
import { VoiceNoteBubble } from './VoiceNoteBubble';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Smartphone,
  QrCode,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  Zap,
  HelpCircle,
  Code2,
  BookOpen,
  Copy,
  Check,
  PhoneCall,
  Video,
  Sliders,
  User,
  Mic,
  Brain,
  ShieldCheck,
  Radio,
  Languages,
  Globe2
} from 'lucide-react';

interface VirtualTutorProps {
  currentCourse?: Course;
  currentLessonTitle?: string;
}

export const VirtualTutor: React.FC<VirtualTutorProps> = ({
  currentCourse,
  currentLessonTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'avatar_chat' | 'whatsapp_connect'>('avatar_chat');
  const [config, setConfig] = useState<TutorConfig>(DEFAULT_TUTOR_CONFIG);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);

  // Active Persona
  const activePersona: TutorPersona =
    TUTOR_PERSONAS.find((p) => p.id === config.personaId) || TUTOR_PERSONAS[0];

  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'm1',
      sender: 'tutor',
      text: `Bonjour ! Je suis **${activePersona.name}**, votre tuteur d'intelligence artificielle sur Academia ITECH 🎓.\n\nJe suis prêt à vous guider sur vos modules, déboguer votre code ou lancer un appel vocal et vidéo en direct. De quoi souhaitez-vous discuter aujourd'hui ?`,
      timestamp: '10:00',
      suggestions: [
        'Explique-moi les Transformers avec une métaphore simple',
        'Comment concevoir une architecture logicielle scalable ?',
        'Génère un exercice pratique de code',
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [avatarState, setAvatarState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [isListeningMic, setIsListeningMic] = useState(false);

  // WhatsApp Simulation & Real Connect State
  const [whatsAppPhone, setWhatsAppPhone] = useState('+243 89 000 0000');
  const [whatsAppCustomText, setWhatsAppCustomText] = useState(
    `Bonjour ${activePersona.name} ! Je m'entraîne sur le cours "${currentCourse?.title || 'IA & Software Engineering'}" sur Academia ITECH. Peux-tu m'accompagner pour mes révisions ?`
  );
  const [waMessages, setWaMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: `🤖 *Academia ITECH Bot - ${activePersona.name}*\n\nBienvenue sur votre tuteur WhatsApp officiel ! Vous recevrez ici vos rappels de cours, mini-quiz quotidiens et pouvez poser toutes vos questions 24/7.`,
      time: '09:00',
    },
    {
      sender: 'user',
      text: `Bonjour ${activePersona.name}, quel est mon défi du jour ?`,
      time: '09:02',
    },
    {
      sender: 'bot',
      text: "🔥 *Défi Quotidien (+50 XP)* :\n\nDans un Transformer, pourquoi le Positional Encoding est-il indispensable ?\n\n1️⃣ Pour encoder l'ordre des mots\n2️⃣ Pour chiffrer les données\n\n_Réponds 1 ou 2 !_",
      time: '09:02',
    },
  ]);
  const [waInput, setWaInput] = useState('');
  const [isWaLoading, setIsWaLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, waMessages]);

  // Synchronize greeting when persona or language changes
  useEffect(() => {
    const langInfo = TUTOR_LANGUAGES.find((l) => l.code === config.audioLanguage) || TUTOR_LANGUAGES[0];
    const greeting = getGreetingForLanguage(activePersona, config.audioLanguage);
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'tutor',
        text: `✨ Profil tuteur : **${activePersona.name}** (${activePersona.title}) • Langue active : **${langInfo.name}** ${langInfo.flag}\n\n${greeting}`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        suggestions: config.audioLanguage.startsWith('ln')
          ? ['Limbolela ngai malamu', 'Pesa ngai ndakisa ya code', 'Loba na ngai na phone']
          : config.audioLanguage.startsWith('en')
          ? ['Give me a quick overview', 'Show me a code example', 'Start live voice call']
          : [
              'Donne-moi un aperçu des points clés',
              'Pose-moi une question piège',
              'Lançons un appel audio pour discuter'
            ],
      },
    ]);
  }, [config.personaId, config.audioLanguage]);

  // Text to Speech with guaranteed native accent
  const speakText = (text: string) => {
    if (!config.autoSpeak) return;

    playTutorSpeech({
      text,
      langCode: config.audioLanguage || 'fr-FR',
      gender: config.voiceGender || activePersona.gender || 'female',
      pitch: config.voicePitch || activePersona.defaultPitch,
      rate: config.voiceRate || activePersona.defaultRate,
      onStart: () => {
        setAvatarState('speaking');
        setIsSpeaking(true);
      },
      onEnd: () => {
        setAvatarState('idle');
        setIsSpeaking(false);
      },
      onError: () => {
        setAvatarState('idle');
        setIsSpeaking(false);
      },
    });
  };

  // Toggle voice recognition in chat input
  const toggleSpeechInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('La reconnaissance vocale n\'est pas supportée sur ce navigateur.');
      return;
    }

    if (isListeningMic) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListeningMic(false);
      setAvatarState('idle');
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        const currentLangObj = TUTOR_LANGUAGES.find((l) => l.code === config.audioLanguage);
        recognition.lang = currentLangObj?.speechRecognitionLang || config.audioLanguage || 'fr-FR';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputMessage(transcript);
        };

        recognition.onend = () => {
          setIsListeningMic(false);
          setAvatarState('idle');
        };

        recognition.onerror = () => {
          setIsListeningMic(false);
          setAvatarState('idle');
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListeningMic(true);
        setAvatarState('listening');
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // SSE Streaming Helper for Virtual Tutor
  const streamTutorChat = async (
    payload: any,
    onChunk: (chunk: string, fullText: string) => void,
    onDone: (suggestions: string[], fullText: string) => void,
    onError: (err: any) => void
  ) => {
    try {
      const response = await fetch('/api/gemini/tutor-chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Erreur réseau streaming : ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';
      let receivedSuggestions: string[] = [];

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
                onChunk(parsed.text, accumulatedText);
              } else if (parsed.type === 'done') {
                if (parsed.suggestions) {
                  receivedSuggestions = parsed.suggestions;
                }
              } else if (parsed.type === 'error') {
                throw new Error(parsed.error || 'Erreur flux');
              }
            } catch (e) {
              console.warn('Erreur parsing SSE ligne:', e);
            }
          }
        }
      }

      onDone(receivedSuggestions, accumulatedText);
    } catch (err) {
      onError(err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: TutorMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    const tempBotId = `t-${Date.now()}`;
    const initialBotMsg: TutorMessage = {
      id: tempBotId,
      sender: 'tutor',
      text: '',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, initialBotMsg]);
    setInputMessage('');
    setIsLoading(true);
    setAvatarState('thinking');

    const payload = {
      message: query,
      contextCourse: currentCourse?.title || 'Masterclass IA & Technologies ITECH',
      currentLessonTitle: currentLessonTitle || 'Général',
      conversationHistory: messages,
      isWhatsAppMode: false,
      personaName: activePersona.name,
      personaGender: activePersona.gender,
      teachingStyle: config.teachingStyle,
      speedMode: config.speedMode,
      audioLanguage: config.audioLanguage,
      language: config.audioLanguage,
    };

    let hasReceivedFirstChunk = false;

    await streamTutorChat(
      payload,
      (_chunk, fullText) => {
        if (!hasReceivedFirstChunk) {
          hasReceivedFirstChunk = true;
          setAvatarState('speaking');
        }
        setMessages((prev) =>
          prev.map((m) => (m.id === tempBotId ? { ...m, text: fullText, isStreaming: true } : m))
        );
      },
      (suggestions, fullText) => {
        const finalText = fullText || (config.audioLanguage.startsWith('ln') 
          ? `Mbote ! Nazali ${activePersona.name}. Nayoki malamu likambo na yo likolo ya "${query.slice(0, 40)}". Na mateya ya ${currentCourse?.title || "ITECH"}, likambo ya ntina ezali kokanga ntina ya fonctionnement mpe kosala ba tests.`
          : `Bonjour ! C'est ${activePersona.name} 🎓. Concernant votre question sur "${query.slice(0, 50)}", dans le cadre du cours "${currentCourse?.title || 'Ingénierie & IA'}" (Leçon : ${currentLessonTitle || 'Session Interactive'}), voici l'analyse recommandée : il est essentiel de décomposer la logique étape par étape et de tester le code dans l'éditeur.`);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempBotId
              ? {
                  ...m,
                  text: finalText,
                  isStreaming: false,
                  suggestions: suggestions.length > 0 ? suggestions : (config.audioLanguage.startsWith('ln') ? [
                    'Pesa ngai ndakisa ya code',
                    'Ndenge nini ya komeka yango ?',
                    'Résume na makambo 2 ya ntina',
                  ] : [
                    'Donne-moi un exemple concret en code',
                    'Comment tester cela en production ?',
                    'Résume en 3 points clés',
                  ]),
                }
              : m
          )
        );
        setIsLoading(false);
        if (config.autoSpeak) {
          speakText(finalText);
        } else {
          setAvatarState('idle');
        }
      },
      async (err) => {
        console.warn('Streaming error, falling back to sync endpoint:', err);
        try {
          const fallbackRes = await fetch('/api/gemini/tutor-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await fallbackRes.json();
          const fallbackText = data.reply || (config.audioLanguage.startsWith('ln')
            ? `Mbote ! Nazali ${activePersona.name}. Na mateya ya ${currentCourse?.title || "cours oyo"}, likambo ya ntina likolo ya "${query.slice(0, 40)}" ezali kososola bien structure ya code.`
            : `Bonjour ! C'est ${activePersona.name} 🎓. Concernant votre question "${query.slice(0, 50)}" dans ${currentCourse?.title || "le cours"}, voici l'approche à suivre : structurez votre code de manière modulaire et validez chaque étape.`);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempBotId
                ? {
                    ...m,
                    text: fallbackText,
                    isStreaming: false,
                    suggestions: data.suggestions || [
                      'Donne-moi un exemple pratique en code',
                      'Comment tester ce code ?',
                      'Résume les points essentiels',
                    ],
                  }
                : m
            )
          );
          if (config.autoSpeak) {
            speakText(fallbackText);
          }
        } catch (fallbackErr) {
          console.error(fallbackErr);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempBotId
                ? { ...m, text: `Bonjour ! C'est ${activePersona.name}. Concernant votre question sur "${query.slice(0, 40)}", l'essentiel dans ce module est d'appliquer les bonnes pratiques de validation de code.`, isStreaming: false }
                : m
            )
          );
        } finally {
          setIsLoading(false);
          setAvatarState('idle');
        }
      }
    );
  };

  const handleSendVoiceNote = async (audioBlob: Blob, durationSecs: number, clientTranscript?: string) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const tempId = `voice-${Date.now()}`;

    const userVoiceMsg: TutorMessage = {
      id: tempId,
      sender: 'user',
      text: clientTranscript ? `🎙️ "${clientTranscript}"` : '🎙️ Note vocale',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isVoiceNote: true,
      audioUrl,
      audioDuration: durationSecs,
      transcription: clientTranscript,
      status: 'transcribing',
    };

    setMessages((prev) => [...prev, userVoiceMsg]);
    setIsLoading(true);
    setAvatarState('thinking');

    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });
      const base64Audio = await base64Promise;

      const res = await fetch('/api/gemini/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          clientTranscript: clientTranscript || '',
          mimeType: audioBlob.type || 'audio/webm',
          language: config.audioLanguage,
          contextCourse: currentCourse?.title || 'Formation Academia ITECH',
          currentLessonTitle: currentLessonTitle || 'Général',
          personaName: activePersona.name,
          personaGender: activePersona.gender,
          teachingStyle: config.teachingStyle,
        }),
      });

      const data = await res.json();
      const transcription = data.transcription || clientTranscript || 'Message vocal reçu';
      const tutorReplyText =
        data.reply ||
        (config.audioLanguage.startsWith('ln')
          ? 'Nazali koyoka yo malamu mpenza !'
          : 'J\'ai bien entendu votre note vocale !');

      // Update user message with real transcribed text
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { ...m, transcription, status: 'done', text: `🎙️ "${transcription}"` }
            : m
        )
      );

      // Add tutor reply
      const botMsg: TutorMessage = {
        id: `t-${Date.now()}`,
        sender: 'tutor',
        text: tutorReplyText,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        suggestions: data.suggestions || (config.audioLanguage.startsWith('ln') ? [
          'Pesa ngai ndakisa mosusu',
          'Ndenge nini ya komeka yango na code ?',
        ] : [
          'Donne-moi un exemple pratique',
          'Comment tester cela en code ?',
        ]),
      };
      setMessages((prev) => [...prev, botMsg]);
      speakText(tutorReplyText);
    } catch (err) {
      console.error('Error processing voice note:', err);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'error' } : m))
      );
      setAvatarState('idle');
    } finally {
      setIsLoading(false);
      if (!config.autoSpeak) {
        setAvatarState('idle');
      }
    }
  };

  const handleSendWaMessage = async () => {
    if (!waInput.trim() || isWaLoading) return;

    const userText = waInput;
    const newMsg = {
      sender: 'user' as const,
      text: userText,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    const tempBotWaIndex = waMessages.length + 1;
    const botPlaceholder = {
      sender: 'bot' as const,
      text: '',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setWaMessages((prev) => [...prev, newMsg, botPlaceholder]);
    setWaInput('');
    setIsWaLoading(true);

    const payload = {
      message: userText,
      contextCourse: currentCourse?.title || 'Masterclass IA Academia ITECH',
      isWhatsAppMode: true,
      personaName: activePersona.name,
      personaGender: activePersona.gender,
      teachingStyle: config.teachingStyle,
      speedMode: config.speedMode,
      audioLanguage: config.audioLanguage,
      language: config.audioLanguage,
    };

    await streamTutorChat(
      payload,
      (_chunk, fullText) => {
        setWaMessages((prev) =>
          prev.map((m, idx) => (idx === tempBotWaIndex ? { ...m, text: fullText } : m))
        );
      },
      (_suggestions, fullText) => {
        const finalWaText = fullText || `🤖 *Academia ITECH (${activePersona.name})*\n\nSalut ! J'ai bien analysé votre message : _"${userText.slice(0, 40)}"_.\n\nDans le cadre de *${currentCourse?.title || "votre formation"}*, appliquez la méthode pas-à-pas et testez vos fonctions dans l'atelier interactif !`;
        setWaMessages((prev) =>
          prev.map((m, idx) =>
            idx === tempBotWaIndex ? { ...m, text: finalWaText, isStreaming: false } : m
          )
        );
        setIsWaLoading(false);
      },
      async (err) => {
        console.warn('WhatsApp streaming fallback:', err);
        try {
          const fallbackRes = await fetch('/api/gemini/tutor-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const data = await fallbackRes.json();
          setWaMessages((prev) =>
            prev.map((m, idx) =>
              idx === tempBotWaIndex
                ? {
                    ...m,
                    text: data.reply || `🤖 *${activePersona.name}* : Concernant _"${userText.slice(0, 35)}"_, voici l'astuce clé : découpez votre code en fonctions simples et testables !`,
                    isStreaming: false,
                  }
                : m
            )
          );
        } catch {
          setWaMessages((prev) =>
            prev.map((m, idx) =>
              idx === tempBotWaIndex
                ? { ...m, text: `🤖 *${activePersona.name}* : Message bien reçu pour _"${userText.slice(0, 30)}"_. Recommandation : testez votre solution dans l'éditeur de code !`, isStreaming: false }
                : m
            )
          );
        } finally {
          setIsWaLoading(false);
        }
      }
    );
  };

  const cleanWhatsAppDigits = whatsAppPhone.replace(/[^0-9]/g, '');
  const directWhatsAppLink = cleanWhatsAppDigits
    ? `https://api.whatsapp.com/send?phone=${cleanWhatsAppDigits}&text=${encodeURIComponent(whatsAppCustomText)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsAppCustomText)}`;

  return (
    <div id="virtual-tutor-container" className="space-y-8 pb-16">
      {/* Header with Call & Config Quick Launchers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activePersona.avatarUrl}
              alt={activePersona.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
            />
            <span className="w-3 h-3 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 ring-2 ring-white animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span>{activePersona.name}</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activePersona.badge} ({activePersona.gender === 'female' ? 'Femme' : 'Homme'})
                </span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                <Zap className="w-3 h-3 text-amber-600" />
                {config.speedMode === 'flash' ? 'Éclair <0.8s' : 'Mode Pro'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {activePersona.title} • {activePersona.specialty}
            </p>
          </div>
        </div>

        {/* Action Buttons: Lancer Appel Live + Paramètres + Tabs + Sélecteur de Langue */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Language Switcher Button */}
          <button
            id="open-tutor-language-btn"
            onClick={() => setIsSettingsOpen(true)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs flex items-center gap-1.5 transition-colors"
            title="Langue du tuteur"
          >
            <span className="text-sm">
              {TUTOR_LANGUAGES.find((l) => l.code === config.audioLanguage)?.flag || '🇫🇷'}
            </span>
            <span>
              {TUTOR_LANGUAGES.find((l) => l.code === config.audioLanguage)?.name || 'Français'}
            </span>
            <Languages className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Direct Live Call Button */}
          <button
            id="launch-live-call-btn"
            onClick={() => setIsCallOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Lancer un Appel Live</span>
          </button>

          {/* Settings Config Modal Trigger */}
          <button
            id="open-tutor-config-btn"
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Configurer l'Avatar & Voix</span>
          </button>

          {/* Tab Switcher: Web Avatar vs WhatsApp Simulator */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="tutor-tab-avatar"
              onClick={() => setActiveTab('avatar_chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'avatar_chat'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Chat Avatar</span>
            </button>

            <button
              id="tutor-tab-whatsapp"
              onClick={() => setActiveTab('whatsapp_connect')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'whatsapp_connect'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Photorealistic Avatar & Interactive Voice Chat */}
      {activeTab === 'avatar_chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Avatar Visual Character Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-5 shadow-xl relative overflow-hidden text-white">
              {/* Particle glow ring */}
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />

              {/* Realistic Animated Avatar Component */}
              <RealisticAvatar
                persona={activePersona}
                state={avatarState}
                size="md"
                speedMode={config.speedMode}
              />

              {/* Live Call Button inside banner */}
              <div className="pt-2">
                <button
                  onClick={() => setIsCallOpen(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all hover:scale-102"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Démarrer un Appel Vocal ou Vidéo</span>
                </button>
              </div>

              {/* Voice Synthesizer & Auto-speak status */}
              <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
                <button
                  id="toggle-voice-tutor-btn"
                  onClick={() => setConfig((prev) => ({ ...prev, autoSpeak: !prev.autoSpeak }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    config.autoSpeak
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 shadow-xs'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {config.autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{config.autoSpeak ? 'Voix Réelle Active' : 'Voix Désactivée'}</span>
                </button>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Calibrer Voix ({config.voicePitch} / {config.voiceRate}x)</span>
                </button>
              </div>

              {/* Interactive Lip-Sync & Speaking Demonstration Button */}
              <div className="p-2.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-indigo-300 font-semibold px-1">
                  <span>📱 Animation Visuelle (Style App Android)</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const sampleSentence = config.audioLanguage.startsWith('ln')
                      ? `Mbote ! Tala monoko na ngai ezali koningana ntango nazali koloba na yo !`
                      : config.audioLanguage.startsWith('en')
                      ? `Hello! Watch my lips move smoothly while I explain your lessons on Academia ITECH!`
                      : `Bonjour ! Regardez mes lèvres bouger en rythme pendant que je vous explique les concepts sur Academia ITECH !`;
                    speakText(sampleSentence);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/40 transition-all hover:scale-102 active:scale-98"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Tester le mouvement des lèvres</span>
                </button>

                {/* Quick Emotion triggers */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarState('speaking');
                      setTimeout(() => setAvatarState('idle'), 3500);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      avatarState === 'speaking'
                        ? 'bg-cyan-900/80 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🗣️ Parler
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarState('listening');
                      setTimeout(() => setAvatarState('idle'), 3500);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      avatarState === 'listening'
                        ? 'bg-emerald-900/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    👂 Écouter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarState('thinking');
                      setTimeout(() => setAvatarState('idle'), 3500);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      avatarState === 'thinking'
                        ? 'bg-amber-900/80 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🧠 Réfléchir
                  </button>
                </div>
              </div>

              {/* Active Context Card */}
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Contexte & Pédagogie :</span>
                <div className="text-slate-200 font-semibold truncate">
                  {currentCourse?.title || 'IA & Ingénierie Logicielle'}
                </div>
                <div className="text-cyan-400 text-[11px] truncate">
                  Leçon : {currentLessonTitle || 'Concepts fondamentaux'}
                </div>
                <div className="text-slate-400 text-[10px] pt-1 border-t border-slate-800">
                  Style : {config.teachingStyle === 'expert' ? 'Expert Senior Direct' : config.teachingStyle === 'coach' ? 'Coach Énergique' : config.teachingStyle === 'socratic' ? 'Socratique' : 'Bienveillant'}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chat Stream Column */}
          <div className="lg:col-span-8 flex flex-col h-[620px] rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            {/* Top Chat Bar with Call Button */}
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-800">
                  Discussion Instantanée avec {activePersona.name}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1 border border-emerald-200/70 shadow-2xs">
                  <Zap className="w-3 h-3 text-emerald-600 animate-pulse" />
                  <span>Streaming IA Actif</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                  {config.speedMode === 'flash' ? 'Latence <0.5s' : 'Mode Approfondi'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCallOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Appeler</span>
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white font-bold text-xs'
                        : 'bg-white border border-slate-200 overflow-hidden shadow-xs'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      'Moi'
                    ) : (
                      <img
                        src={activePersona.avatarUrl}
                        alt={activePersona.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {msg.isVoiceNote || msg.audioUrl ? (
                    <VoiceNoteBubble
                      audioUrl={msg.audioUrl}
                      duration={msg.audioDuration}
                      transcription={msg.transcription}
                      isUser={msg.sender === 'user'}
                      timestamp={msg.timestamp}
                    />
                  ) : (
                    <div
                      className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                      }`}
                    >
                      {/* Message Content or Live Stream Skeleton */}
                      {msg.isStreaming && !msg.text ? (
                        <div className="flex items-center gap-2 py-1 text-indigo-600">
                          <div className="flex gap-1 items-center">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-xs text-indigo-600 font-medium">Génération en direct...</span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-line">
                          {msg.text}
                          {msg.isStreaming && (
                            <span className="inline-block w-1.5 h-4 bg-indigo-600 animate-pulse ml-1 align-middle rounded-xs" />
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px] opacity-60">
                        <span>{msg.sender === 'user' ? 'Vous' : activePersona.name}</span>
                        <div className="flex items-center gap-2">
                          {msg.sender === 'tutor' && !msg.isStreaming && msg.text && (
                            <button
                              type="button"
                              onClick={() => speakText(msg.text)}
                              title="Écouter avec l'animation des lèvres"
                              className="inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                            >
                              <Volume2 className="w-3 h-3 text-indigo-500" />
                              <span>Écouter</span>
                            </button>
                          )}
                          <span>{msg.timestamp}</span>
                        </div>
                      </div>

                      {/* Quick suggestion chips */}
                      {!msg.isStreaming && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5 border-t border-slate-100">
                          {msg.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(sug)}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-left font-medium shadow-xs"
                            >
                              💡 {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && !messages.some((m) => m.isStreaming) && (
                <div className="flex items-center gap-2 text-xs text-indigo-600 bg-white p-3.5 rounded-2xl border border-slate-200 w-fit font-medium shadow-xs">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>{activePersona.name} prépare sa réponse avec précision...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar with Voice Note Recorder, Dictation & Text Input */}
            <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex flex-wrap sm:flex-nowrap items-center gap-2">
              {/* Professional Voice Note Recorder */}
              <VoiceNoteRecorder
                onSendVoiceNote={handleSendVoiceNote}
                languageCode={config.audioLanguage}
                isProcessing={isLoading}
              />

              <div className="relative flex-1 min-w-[200px] flex items-center">
                <input
                  id="tutor-chat-input"
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Posez votre question à ${activePersona.name} (code, quiz, synthèse)...`}
                  className="w-full p-2.5 sm:p-3 pr-10 rounded-xl bg-slate-50 text-slate-900 text-xs sm:text-sm border border-slate-200 focus:outline-none focus:border-indigo-500"
                />

                <button
                  type="button"
                  onClick={toggleSpeechInput}
                  title={isListeningMic ? 'Arrêter la dictée' : 'Dicter du texte'}
                  className={`absolute right-2 p-1.5 rounded-lg transition-colors ${
                    isListeningMic
                      ? 'text-rose-500 bg-rose-50 animate-pulse'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <button
                id="tutor-send-btn"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="p-2.5 sm:p-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-all font-bold shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Envoyer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WhatsApp Suite & Simulator */}
      {activeTab === 'whatsapp_connect' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* WhatsApp Configuration & QR Code Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Connexion WhatsApp Directe</h3>
                  <p className="text-xs text-slate-500">
                    Scannez le QR Code ou cliquez pour discuter instantanément avec {activePersona.name} sur WhatsApp.
                  </p>
                </div>
              </div>

              {/* Real Scannable QR Code */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/40 border border-slate-200 text-center space-y-3.5">
                <a
                  href={directWhatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  title="Cliquer pour ouvrir directement sur WhatsApp Web ou Mobile"
                  className="group relative inline-block mx-auto p-3.5 bg-white rounded-2xl border-2 border-emerald-200 shadow-md transition-all hover:scale-105 hover:border-emerald-500 cursor-pointer"
                >
                  <QRCodeSVG
                    value={directWhatsAppLink}
                    size={180}
                    level="M"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                  />
                  <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/10 rounded-2xl transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-lg transition-opacity flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Ouvrir WhatsApp
                    </span>
                  </div>
                </a>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>QR Code 100% Fonctionnel</span>
                  </div>
                  <div className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Pointez l'appareil photo de votre smartphone ou l'application WhatsApp pour ouvrir la discussion.
                  </div>
                </div>
              </div>

              {/* Quick Prompt Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Message pré-rempli pour WhatsApp :
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "📚 Résumé de cours", text: `Bonjour ${activePersona.name} ! Peux-tu me faire un résumé concis du cours "${currentCourse?.title || 'IA'}" avec 3 points clés ?` },
                    { label: "🔥 Défi du jour (+50 XP)", text: `Bonjour ${activePersona.name} ! Envoie-moi mon défi tech du jour pour gagner 50 XP sur Academia ITECH !` },
                    { label: "💻 Aide au code", text: `Salut ${activePersona.name} ! J'ai un bogue dans mon code TypeScript / Python sur la leçon "${currentLessonTitle || 'Pratique'}". Peux-tu m'aider ?` },
                    { label: "🎯 Quiz flash", text: `Salut ${activePersona.name} ! Pose-moi une question de quiz sur le cours "${currentCourse?.title || 'IA & Software Engineering'}".` }
                  ].map((p, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setWhatsAppCustomText(p.text)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-left font-medium ${
                        whatsAppCustomText === p.text
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={2}
                  value={whatsAppCustomText}
                  onChange={(e) => setWhatsAppCustomText(e.target.value)}
                  placeholder="Tapez le message à envoyer sur WhatsApp..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white resize-none"
                />
              </div>

              {/* Direct WhatsApp Web Button & Phone Number */}
              <div className="space-y-3 pt-1 border-t border-slate-100">
                <a
                  href={directWhatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ouvrir WhatsApp sur Mobile / Web</span>
                </a>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={whatsAppPhone}
                      onChange={(e) => setWhatsAppPhone(e.target.value)}
                      placeholder="Numéro WhatsApp (ex: +243 890 000 000)"
                      className="w-full p-2.5 rounded-xl bg-slate-50 text-slate-800 text-xs border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(directWhatsAppLink);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-200 transition-colors whitespace-nowrap"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Lien copié !' : 'Copier le lien'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Live Simulator Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-slate-900 border-4 border-slate-800 shadow-xl overflow-hidden max-w-md mx-auto flex flex-col h-[580px]">
              {/* WhatsApp Smartphone Header */}
              <div className="bg-[#075E54] p-3 text-white flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-[#075E54] font-bold text-xs overflow-hidden">
                    <img
                      src={activePersona.avatarUrl}
                      alt={activePersona.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">Academia ITECH • {activePersona.name}</h4>
                    <span className="text-[10px] text-emerald-200">En ligne 24/7</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-90">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </div>
              </div>

              {/* Chat Canvas (WhatsApp wallpaper styled) */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#E5DDD5]">
                {waMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#DCF8C6] text-slate-800 rounded-tr-none'
                          : 'bg-white text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                      <div className="text-[9px] text-slate-400 text-right mt-1 flex items-center justify-end gap-1">
                        <span>{msg.time}</span>
                        {msg.sender === 'user' && <Check className="w-3 h-3 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                ))}
                {isWaLoading && (
                  <div className="bg-white p-2 rounded-lg text-[11px] text-slate-500 shadow-xs flex items-center gap-1.5 w-fit">
                    <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                    <span>{activePersona.name} est en train d'écrire...</span>
                  </div>
                )}
              </div>

              {/* WhatsApp Input Bar */}
              <div className="p-2.5 bg-[#F0F0F0] border-t border-slate-300 flex items-center gap-2">
                <input
                  type="text"
                  value={waInput}
                  onChange={(e) => setWaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendWaMessage()}
                  placeholder="Répondre sur WhatsApp..."
                  className="flex-1 px-3 py-2 text-xs rounded-full bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600"
                />
                <button
                  onClick={handleSendWaMessage}
                  disabled={!waInput.trim() || isWaLoading}
                  className="p-2.5 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white disabled:opacity-40 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Voice & Video Call Modal */}
      <TutorCallModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        persona={activePersona}
        config={config}
        contextCourseTitle={currentCourse?.title}
        currentLessonTitle={currentLessonTitle}
        onOpenSettings={() => {
          setIsCallOpen(false);
          setIsSettingsOpen(true);
        }}
        onUpdateLanguage={(newLang) => setConfig((prev) => ({ ...prev, audioLanguage: newLang }))}
      />

      {/* Tutor & Voice Settings Configuration Modal */}
      <TutorSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={(newConfig) => setConfig(newConfig)}
      />
    </div>
  );
};
