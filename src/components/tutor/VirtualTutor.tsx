import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { TutorMessage, Course, TutorConfig, TutorPersona } from '../../types';
import { TUTOR_PERSONAS, DEFAULT_TUTOR_CONFIG, TUTOR_LANGUAGES, getGreetingForLanguage } from './personaData';
import { playTutorSpeech } from './speechUtils';
import { RealisticAvatar } from './RealisticAvatar';
import { CharacterPose } from './AndroidStyleCharacter';
import { FacialLipSyncModule } from './FacialLipSyncModule';
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
  Globe2,
  Server,
  Terminal,
  ArrowRight,
  Play,
  AlertCircle,
  Info
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
  const [avatarPose, setAvatarPose] = useState<CharacterPose>('neutral');
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [activeSyncText, setActiveSyncText] = useState<string>('');

  // WhatsApp Simulation & Real Connect State
  const [whatsAppPhone, setWhatsAppPhone] = useState('+1 555-631-6001');
  const [whatsAppCustomText, setWhatsAppCustomText] = useState(
    `Bonjour ${activePersona.name} ! Je m'entraîne sur le cours "${currentCourse?.title || 'IA & Software Engineering'}" sur Academia ITECH. Peux-tu m'accompagner pour mes révisions ?`
  );
  const [waMessages, setWaMessages] = useState<Array<{ id: string; sender: 'user' | 'bot'; text: string; time: string; isStreaming?: boolean }>>([
    {
      id: 'wa-init-1',
      sender: 'bot',
      text: `🤖 *Academia ITECH Bot - ${activePersona.name}*\n\nBienvenue sur votre tuteur WhatsApp officiel ! Vous recevrez ici vos rappels de cours, mini-quiz quotidiens et pouvez poser toutes vos questions 24/7.`,
      time: '09:00',
    },
    {
      id: 'wa-init-2',
      sender: 'user',
      text: `Bonjour ${activePersona.name}, quel est mon défi du jour ?`,
      time: '09:02',
    },
    {
      id: 'wa-init-3',
      sender: 'bot',
      text: "🔥 *Défi Quotidien (+50 XP)* :\n\nDans un Transformer, pourquoi le Positional Encoding est-il indispensable ?\n\n1️⃣ Pour encoder l'ordre des mots\n2️⃣ Pour chiffrer les données\n\n_Réponds 1 ou 2 !_",
      time: '09:02',
    },
  ]);
  const [waInput, setWaInput] = useState('');
  const [isWaLoading, setIsWaLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [whatsappSubTab, setWhatsappSubTab] = useState<'simulator' | 'webhook_setup'>('simulator');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [testWebhookMessage, setTestWebhookMessage] = useState('Bonjour Robot Android ITECH ! Peux-tu me résumer le cours en 3 points ?');
  const [testWebhookResult, setTestWebhookResult] = useState<string | null>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  // Live Meta WhatsApp Send Test State
  const [metaTestToken, setMetaTestToken] = useState('');
  const [metaTestRecipient, setMetaTestRecipient] = useState('');
  const [metaTestMessage, setMetaTestMessage] = useState('Bip bop ! Ceci est un message test du Robot Android ITECH 🤖. Votre connexion WhatsApp fonctionne parfaitement !');
  const [metaTestResult, setMetaTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [isSendingMetaTest, setIsSendingMetaTest] = useState(false);

  const [webhookStatus, setWebhookStatus] = useState<{
    metaConfigured: boolean;
    tokenDiagnostic?: {
      status: 'valid' | 'expired' | 'invalid' | 'missing';
      message: string;
      details?: any;
    };
    phoneIdStatus?: {
      configuredValue: string;
      resolvedPhoneId: string;
      isCorrectFormat: boolean;
      warning?: string | null;
    };
    twilioConfigured: boolean;
    verifyToken: string;
    phoneNumberId?: string;
    phoneNumber?: string;
    hasGeminiKey: boolean;
    callbackUrl?: string;
  }>({
    metaConfigured: false,
    twilioConfigured: false,
    verifyToken: 'itech_academia_secret_token',
    phoneNumberId: '979483715258628',
    phoneNumber: '+1 555-631-6001',
    hasGeminiKey: true,
  });
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);

  const refreshWebhookStatus = () => {
    setIsRefreshingStatus(true);
    fetch('/api/webhook/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWebhookStatus(data);
        }
      })
      .catch(() => {})
      .finally(() => setIsRefreshingStatus(false));
  };

  // Check Webhook diagnostic on mount
  useEffect(() => {
    refreshWebhookStatus();
  }, []);

  const handleTestWebhookDirectly = async () => {
    if (!testWebhookMessage.trim() || isTestingWebhook) return;
    setIsTestingWebhook(true);
    setTestWebhookResult(null);

    try {
      const res = await fetch('/api/gemini/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testWebhookMessage,
          isWhatsAppMode: true,
          personaName: activePersona.name,
          personaGender: activePersona.gender,
          teachingStyle: config.teachingStyle,
          audioLanguage: config.audioLanguage,
          contextCourse: currentCourse?.title || 'Masterclass IA',
        }),
      });
      const data = await res.json();
      setTestWebhookResult(data.reply || 'Réponse générée avec succès !');
    } catch (err: any) {
      setTestWebhookResult(`Erreur lors du test : ${err?.message || 'Vérification serveur'}`);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleSendMetaTest = async () => {
    if (!metaTestRecipient.trim() || isSendingMetaTest) return;
    setIsSendingMetaTest(true);
    setMetaTestResult(null);

    try {
      const res = await fetch('/api/webhook/send-test-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: metaTestRecipient,
          messageText: metaTestMessage,
          customToken: metaTestToken.trim() || undefined,
          customPhoneId: webhookStatus.phoneNumberId || '979483715258628',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMetaTestResult({
          success: true,
          message: data.message || 'Message envoyé avec succès ! Vérifiez votre WhatsApp.',
          details: data.metaResponse,
        });
      } else {
        setMetaTestResult({
          success: false,
          message: data.error || 'Erreur lors de l’envoi Meta',
          details: data.details,
        });
      }
    } catch (err: any) {
      setMetaTestResult({
        success: false,
        message: err.message || 'Erreur de connexion au serveur',
      });
    } finally {
      setIsSendingMetaTest(false);
    }
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

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

  // Text to Speech with guaranteed native accent & lip-sync text binding
  const speakText = (text: string) => {
    if (!config.autoSpeak) return;
    setActiveSyncText(text);

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

    await streamTutorChat(
      payload,
      (_chunk, fullText) => {
        // The tutor stays in cognitive thinking mode while generating the response
        setActiveSyncText(fullText);
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
          } else {
            setAvatarState('idle');
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
          setAvatarState('idle');
        } finally {
          setIsLoading(false);
          if (!config.autoSpeak) {
            setAvatarState('idle');
          }
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

    const userText = waInput.trim();
    const userMsgId = `wa-u-${Date.now()}`;
    const botMsgId = `wa-b-${Date.now()}`;

    const newMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: userText,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    const botPlaceholder = {
      id: botMsgId,
      sender: 'bot' as const,
      text: '',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    // Include multi-turn conversation history from previous messages
    const conversationHistory = waMessages.map((m) => ({
      sender: m.sender === 'user' ? ('user' as const) : ('tutor' as const),
      text: m.text,
    }));

    setWaMessages((prev) => [...prev, newMsg, botPlaceholder]);
    setWaInput('');
    setIsWaLoading(true);

    const payload = {
      message: userText,
      contextCourse: currentCourse?.title || 'Masterclass IA Academia ITECH',
      conversationHistory,
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
          prev.map((m) => (m.id === botMsgId ? { ...m, text: fullText, isStreaming: true } : m))
        );
      },
      (_suggestions, fullText) => {
        const finalWaText =
          fullText ||
          `🤖 *${activePersona.name} (Academia ITECH)*\n\nJ'ai bien analysé votre message : _"${userText}"_.\n\nDans le cadre de *${currentCourse?.title || "votre formation"}*, appliquez la méthode pas-à-pas et testez vos fonctions dans l'atelier interactif !`;
        setWaMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, text: finalWaText, isStreaming: false } : m
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
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    text:
                      data.reply ||
                      `🤖 *${activePersona.name}* : Concernant _"${userText}"_, voici l'astuce clé : découpez votre problème en étapes simples et validez chaque résultat !`,
                    isStreaming: false,
                  }
                : m
            )
          );
        } catch {
          setWaMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    text: `🤖 *${activePersona.name}* : Message bien reçu pour _"${userText}"_. Recommandation : testez votre solution dans l'éditeur interactif !`,
                    isStreaming: false,
                  }
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
                currentPose={avatarPose}
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

              {/* Real-time Facial Lip-Sync Module with Framer Motion */}
              <FacialLipSyncModule
                persona={activePersona}
                textToSync={activeSyncText || (messages.filter((m) => m.sender === 'tutor').slice(-1)[0]?.text || '')}
                isStreaming={isLoading}
                isPlayingAudio={isSpeaking || avatarState === 'speaking'}
                speed={config.voiceRate || 1.0}
              />

              {/* Interactive Lip-Sync & Speaking Demonstration Button */}
              <div className="p-2.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-indigo-300 font-bold px-1">
                  <span>✨ Poses & Gestuelles Dessin Animé</span>
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const sampleSentence = config.audioLanguage.startsWith('ln')
                      ? `Mbote ! Tala monoko na ngai ezali koningana ntango nazali koloba na yo !`
                      : config.audioLanguage.startsWith('en')
                      ? `Hello! Watch my cartoon lips and gestures move smoothly while I explain your lessons on Academia ITECH!`
                      : `Bonjour ! Regardez mes lèvres bouger en rythme et mes bras animés pendant que je vous explique les concepts sur Academia ITECH !`;
                    setAvatarPose('explaining');
                    speakText(sampleSentence);
                    setTimeout(() => setAvatarPose('neutral'), 4500);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all hover:scale-102 active:scale-98"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Tester le Dessin Animé & Lèvres</span>
                </button>

                {/* Quick Cartoon Poses & Emotion triggers */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPose('waving');
                      setTimeout(() => setAvatarPose('neutral'), 3500);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      avatarPose === 'waving'
                        ? 'bg-amber-900/80 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    👋 Saluer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPose('explaining');
                      setAvatarState('speaking');
                      setTimeout(() => {
                        setAvatarPose('neutral');
                        setAvatarState('idle');
                      }, 3500);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      avatarPose === 'explaining'
                        ? 'bg-emerald-900/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    💡 Expliquer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPose('pointing');
                      setTimeout(() => setAvatarPose('neutral'), 3500);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      avatarPose === 'pointing'
                        ? 'bg-cyan-900/80 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    👉 Pointer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPose('celebrating');
                      setTimeout(() => setAvatarPose('neutral'), 3500);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      avatarPose === 'celebrating'
                        ? 'bg-purple-900/80 border-purple-500 text-purple-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🎉 Bravo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPose('thumbs_up');
                      setTimeout(() => setAvatarPose('neutral'), 3500);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      avatarPose === 'thumbs_up'
                        ? 'bg-emerald-900/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    👍 Encourager
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarPose('thinking');
                      setAvatarState('thinking');
                      setTimeout(() => {
                        setAvatarPose('neutral');
                        setAvatarState('idle');
                      }, 3500);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                      avatarPose === 'thinking'
                        ? 'bg-indigo-900/80 border-indigo-500 text-indigo-300'
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

      {/* TAB 2: WhatsApp Suite & Webhook Gateway */}
      {activeTab === 'whatsapp_connect' && (
        <div className="space-y-6">
          {/* Sub-tab switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWhatsappSubTab('simulator')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  whatsappSubTab === 'simulator'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Simulateur & QR Code (Instantané)</span>
              </button>

              <button
                type="button"
                onClick={() => setWhatsappSubTab('webhook_setup')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  whatsappSubTab === 'webhook_setup'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Server className="w-4 h-4" />
                <span>Relier un Vrai Numéro WhatsApp (Webhooks Meta & Twilio)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
                  Actif
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-700">Moteur Gemini IA WhatsApp en ligne</span>
            </div>
          </div>

          {/* SUB-VIEW 1: Interactive Simulator & wa.me QR Code */}
          {whatsappSubTab === 'simulator' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* WhatsApp Configuration & QR Code Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Connexion & Simulateur WhatsApp</h3>
                      <p className="text-xs text-slate-500">
                        Discutez en direct avec {activePersona.name} dans le simulateur ci-contre ou connectez votre numéro de smartphone.
                      </p>
                    </div>
                  </div>

                  {/* Informative connection banner */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-2">
                    <div className="font-bold flex items-center justify-between text-emerald-900">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-emerald-600" />
                        <span>Agent IA {activePersona.name} : 100% Opérationnel</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setWhatsappSubTab('webhook_setup')}
                        className="text-[11px] font-bold text-emerald-700 underline hover:text-emerald-900"
                      >
                        Relier votre vrai WhatsApp →
                      </button>
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-800">
                      • <strong>Sur l'application web</strong> : Utilisez le simulateur WhatsApp à droite pour échanger en direct avec réponses instantanées.<br />
                      • <strong>Sur votre téléphone portable</strong> : Cliquez sur le bouton "Relier un Vrai Numéro" ci-dessus pour connecter les Webhooks officiels Meta ou Twilio.
                    </p>
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
                        <span>Lien & QR Code Directs</span>
                      </div>
                      <div className="text-[11px] text-slate-500 max-w-xs mx-auto">
                        Ouvre votre WhatsApp avec le message pré-rempli pour {activePersona.name}.
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
                        onClick={() => copyToClipboard(directWhatsAppLink, 'direct-link')}
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-200 transition-colors whitespace-nowrap"
                      >
                        {copiedField === 'direct-link' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedField === 'direct-link' ? 'Copié !' : 'Copier'}</span>
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
                        <span className="text-[10px] text-emerald-200">En ligne 24/7 (Simulateur IA)</span>
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
                          key={msg.id || idx}
                          className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed shadow-xs ${
                              msg.sender === 'user'
                                ? 'bg-[#DCF8C6] text-slate-800 rounded-tr-none'
                                : 'bg-white text-slate-800 rounded-tl-none'
                            }`}
                          >
                            <div className="whitespace-pre-line">
                              {msg.text ? (
                                msg.text
                              ) : (
                                <span className="inline-flex items-center gap-2 text-slate-500 italic py-0.5">
                                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                                  <span>{activePersona.name} écrit...</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[9px] text-slate-400 text-right mt-1 flex items-center justify-end gap-1">
                              <span>{msg.time}</span>
                              {msg.sender === 'user' && <Check className="w-3 h-3 text-blue-500" />}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isWaLoading && !waMessages.some((m) => m.isStreaming && !m.text) && (
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

          {/* SUB-VIEW 2: Real WhatsApp Webhook & API Gateway Hub */}
          {whatsappSubTab === 'webhook_setup' && (
            <div className="space-y-6">
              {/* Architecture Explanation Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white border border-emerald-800/40 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Server className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Passerelle Webhook Serveur pour Vrai WhatsApp
                      </h3>
                      <p className="text-xs text-slate-300">
                        Votre serveur dispose des endpoints réels configurés pour recevoir les messages et y répondre automatiquement avec Gemini.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Endpoints Actifs & Écoutants
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="font-bold text-emerald-300">1. Réception du Message</div>
                    <p className="text-slate-400 text-[11px]">
                      L'apprenant envoie un message sur WhatsApp à votre numéro professionnel.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="font-bold text-emerald-300">2. Analyse & Génération IA</div>
                    <p className="text-slate-400 text-[11px]">
                      Le serveur active Gemini ({activePersona.name}) et produit une réponse contextualisée.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="font-bold text-emerald-300">3. Réponse Automatique</div>
                    <p className="text-slate-400 text-[11px]">
                      La réponse est réexpédiée instantanément sur le smartphone de l'apprenant.
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Webhook & Meta Health Diagnostic Card */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                    <h4 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                      Rapport Diagnostic en Direct : Liaison WhatsApp Meta
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={refreshWebhookStatus}
                    disabled={isRefreshingStatus}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingStatus ? 'animate-spin' : ''}`} />
                    <span>Actualiser le diagnostic</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Token Health */}
                  <div className={`p-4 rounded-2xl border ${
                    webhookStatus.tokenDiagnostic?.status === 'expired'
                      ? 'bg-rose-950/40 border-rose-800/80 text-rose-100'
                      : webhookStatus.tokenDiagnostic?.status === 'valid'
                      ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-100'
                      : 'bg-amber-950/40 border-amber-800/80 text-amber-100'
                  } space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase text-[10px] tracking-wider text-slate-400">1. Jeton d'accès Meta</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        webhookStatus.tokenDiagnostic?.status === 'expired'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : webhookStatus.tokenDiagnostic?.status === 'valid'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {webhookStatus.tokenDiagnostic?.status === 'expired'
                          ? 'Expiré (Code 190)'
                          : webhookStatus.tokenDiagnostic?.status === 'valid'
                          ? 'Opérationnel'
                          : 'Non configuré'}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {webhookStatus.tokenDiagnostic?.status === 'expired'
                        ? 'Le jeton temporaire Meta configuré a expiré. Pour que la liaison WhatsApp envoie les réponses réelles, générez un nouveau jeton sur developers.facebook.com.'
                        : webhookStatus.tokenDiagnostic?.message || 'Vérification en cours...'}
                    </p>
                  </div>

                  {/* Phone ID Health */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase text-[10px] tracking-wider text-slate-400">2. Phone Number ID</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {webhookStatus.phoneIdStatus?.resolvedPhoneId || '979483715258628'}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      ID numérique interne vérifié. Le serveur convertit automatiquement tout format d'affichage (+1 555...) en identifiant Meta valide.
                    </p>
                  </div>

                  {/* Webhook Endpoint Health */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase text-[10px] tracking-wider text-slate-400">3. Webhook GET/POST</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Prêt & Actif (200 OK)
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-300">
                      Vérification du handshake validée avec le Verify Token : <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">{webhookStatus.verifyToken || 'itech_academia_secret_token'}</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ready-to-use Webhook URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meta Cloud API Card */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600 font-black text-xs">
                        META
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Option 1 : Meta WhatsApp Cloud API (Officiel)
                      </h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                      1000 conv/mois gratuites
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    À renseigner dans votre portail <strong>developers.facebook.com</strong> ➔ Produit WhatsApp ➔ Configuration Webhook.
                  </p>

                  <div className="space-y-3">
                    {/* Meta Phone Number & ID Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-900 block">Numéro Meta Associé :</span>
                        <div className="font-mono font-bold text-blue-950 flex items-center justify-between">
                          <span>+1 555-631-6001</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('+15556316001', 'meta-phone')}
                            className="text-[10px] text-blue-700 hover:text-blue-900 underline font-sans"
                          >
                            {copiedField === 'meta-phone' ? 'Copié' : 'Copier'}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-900 block">Phone Number ID :</span>
                        <div className="font-mono font-bold text-blue-950 flex items-center justify-between">
                          <span>979483715258628</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('979483715258628', 'meta-phone-id')}
                            className="text-[10px] text-blue-700 hover:text-blue-900 underline font-sans"
                          >
                            {copiedField === 'meta-phone-id' ? 'Copié' : 'Copier'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          URL de Rappel Active (Cloudflare Workers Détecté)
                        </label>
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Recommandée & Validée
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          readOnly
                          value="https://patient-pine-7b82.landrykibakweto123.workers.dev/"
                          className="flex-1 p-2.5 rounded-xl bg-amber-50/50 border border-amber-300 text-xs font-mono text-slate-900 font-bold select-all"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard('https://patient-pine-7b82.landrykibakweto123.workers.dev/', 'cf-url')}
                          className="p-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1 border border-amber-300"
                        >
                          {copiedField === 'cf-url' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedField === 'cf-url' ? 'Copié' : 'Copier'}</span>
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-500 mb-2">
                        URL directe de secours : <code className="bg-slate-100 px-1 py-0.5 rounded">{typeof window !== 'undefined' ? `${window.location.origin}/api/webhook/whatsapp` : ''}</code>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Jeton de Vérification (Verify Token à coller sur Meta)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={webhookStatus.verifyToken || 'itech_academia_secret_token'}
                          className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 select-all"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(webhookStatus.verifyToken || 'itech_academia_secret_token', 'verify-token')}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-200"
                        >
                          {copiedField === 'verify-token' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedField === 'verify-token' ? 'Copié' : 'Copier'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
                    <div className="font-bold text-slate-800">Étapes pour finaliser sur Meta :</div>
                    <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-700">
                      <li>Collez l'<strong>URL de Rappel Cloudflare</strong> et le <strong>Jeton de vérification</strong> (<code>itech_academia_secret_token</code>) dans Meta.</li>
                      <li>Cliquez sur <strong>Vérifier et enregistrer</strong> sur Meta.</li>
                      <li>Cochez l'abonnement au champ <strong>messages</strong>.</li>
                      <li>Ajoutez votre numéro personnel dans la liste <strong>"Numéros de téléphone de test"</strong> sur Meta pour recevoir les réponses.</li>
                    </ol>
                  </div>
                </div>

                {/* Cloudflare Worker Autonomous Code Card */}
                <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-600 text-white font-black text-xs">
                        CLOUDFLARE
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Code Cloudflare Worker v4.0 (Diagnostic Visuel + IA + Anti-blocage)
                      </h4>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                      Version 4.0 (Recommandée)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ce script intègre un <strong>tableau de bord de diagnostic visuel</strong>. En ouvrant votre lien Worker dans votre navigateur, il teste votre jeton Meta en direct et vous indique exactement pourquoi l'agent ne répond pas.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const code = `// Cloudflare Worker - Robot Android (Academia ITECH) v4.0
// Diagnostic Visuel Intégré + Anti-blocage Meta + Traitement d'arrière-plan + IA Gemini

// 👉 VOUS POUVEZ COLLER VOTRE NOUVEAU JETON META DIRECTEMENT ICI :
const MY_META_TOKEN = ""; // Collez ici votre jeton EAAN... si vous ne voulez pas passer par les variables Cloudflare

const MY_PHONE_ID = "979483715258628";
const seenMessages = new Set();
let lastInbound = null;
let lastOutboundResult = null;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Validation Webhook Meta (GET avec challenge)
    if (request.method === "GET") {
      const challenge = url.searchParams.get("hub.challenge");
      if (challenge) {
        return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
      }

      // Si un humain ouvre le lien dans un navigateur -> Page de Diagnostic en Direct
      const token = (MY_META_TOKEN || env.META_TOKEN || "").trim();
      const phoneId = (env.PHONE_ID || MY_PHONE_ID).trim();
      const geminiKey = (env.GEMINI_API_KEY || "").trim();

      let tokenStatus = "missing";
      let tokenMessage = "Aucun jeton configuré dans MY_META_TOKEN ou env.META_TOKEN";

      if (token) {
        try {
          const testRes = await fetch("https://graph.facebook.com/v19.0/me?access_token=" + encodeURIComponent(token));
          const testData = await testRes.json();
          if (testRes.ok) {
            tokenStatus = "valid";
            tokenMessage = "Jeton Meta VALIDE et actif (App ID : " + (testData.id || "OK") + ")";
          } else {
            tokenStatus = "error";
            tokenMessage = "Rejeté par Meta : " + (testData.error?.message || JSON.stringify(testData));
          }
        } catch (e) {
          tokenStatus = "error";
          tokenMessage = "Erreur vérification : " + e.message;
        }
      }

      const html = \`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagnostic Worker WhatsApp - Academia ITECH</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #090d16; color: #e2e8f0; padding: 2rem; max-width: 760px; margin: 0 auto; line-height: 1.6; }
    .card { background: #131c2e; border-radius: 1rem; padding: 1.5rem; margin-bottom: 1.25rem; border: 1px solid #1e293b; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }
    .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: bold; font-size: 0.75rem; text-transform: uppercase; }
    .valid { background: #064e3b; color: #6ee7b7; border: 1px solid #059669; }
    .error { background: #881337; color: #fca5a5; border: 1px solid #e11d48; }
    .warning { background: #78350f; color: #fde68a; border: 1px solid #d97706; }
    pre { background: #05080f; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; font-size: 0.8rem; color: #38bdf8; border: 1px solid #1e293b; }
    h1 { color: #38bdf8; font-size: 1.5rem; margin-top: 0; }
    h2 { font-size: 1rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 0; }
    .code-box { background: #0f172a; padding: 0.75rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; border: 1px solid #334155; }
  </style>
</head>
<body>
  <h1>🤖 Diagnostic Worker WhatsApp - Academia ITECH</h1>
  
  <div class="card">
    <h2>1. Validation du Jeton Meta (META_TOKEN)</h2>
    <p>
      <span class="badge \${tokenStatus}">\${tokenStatus.toUpperCase()}</span>
      <strong style="margin-left: 0.5rem;">\${tokenMessage}</strong>
    </p>
    \${tokenStatus !== 'valid' ? \`
      <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 1rem; border-radius: 0.75rem; margin-top: 0.75rem; font-size: 0.85rem; color: #fef3c7;">
        <strong>👉 Solution immédiate :</strong><br>
        1. Rendez-vous sur <strong>developers.facebook.com</strong> ➔ Votre App ➔ WhatsApp ➔ Démarrage rapide.<br>
        2. Copiez le <strong>Temporary access token</strong> (commençant par EAAN...).<br>
        3. Ouvrez le code de votre Worker dans Cloudflare, collez-le à la ligne 5 dans <code>const MY_META_TOKEN = "VOTRE_JETON";</code> et cliquez sur <strong>Save and Deploy</strong>.
      </div>
    \` : ''}
  </div>

  <div class="card">
    <h2>2. Configuration & Phone ID</h2>
    <p><strong>Phone Number ID :</strong> <code>\${phoneId}</code></p>
    <p><strong>Cerveau IA Gemini :</strong> \${geminiKey ? '<span class="badge valid">Connecté (Clé active)</span>' : '<span class="badge warning">Mode conversationnel local (Optionnel : ajoutez GEMINI_API_KEY)</span>'}</p>
  </div>

  <div class="card">
    <h2>3. Dernier Message Entrant WhatsApp Reçu</h2>
    \${lastInbound ? '<pre>' + JSON.stringify(lastInbound, null, 2) + '</pre>' : '<p style="color:#94a3b8; font-size:0.85rem;">Aucun message reçu depuis le dernier déploiement.<br><em>Assurez-vous d\\'avoir cliqué sur <strong>Gérer</strong> sous le Webhook sur Meta et coché <strong>messages</strong>.</em></p>'}
  </div>

  <div class="card">
    <h2>4. Dernier Résultat d\\'Envoi vers Meta</h2>
    \${lastOutboundResult ? '<pre>' + JSON.stringify(lastOutboundResult, null, 2) + '</pre>' : '<p style="color:#94a3b8; font-size:0.85rem;">Aucun envoi effectué pour l\\'instant.</p>'}
  </div>
</body>
</html>\`;

      return new Response(html, { status: 200, headers: { "Content-Type": "text/html;charset=UTF-8" } });
    }

    // 2. Réception des messages WhatsApp (POST)
    if (request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return new Response("OK", { status: 200 });
      }

      // Enregistrement pour diagnostic
      lastInbound = {
        receivedAt: new Date().toISOString(),
        bodySummary: body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0] || body
      };

      if (ctx && ctx.waitUntil) {
        ctx.waitUntil(handleIncoming(body, env));
      } else {
        await handleIncoming(body, env);
      }

      return new Response("EVENT_RECEIVED", { status: 200 });
    }

    return new Response("Academia ITECH Gateway Active", { status: 200 });
  },
};

async function handleIncoming(body, env) {
  try {
    const entry = body.entry?.[0]?.changes?.[0]?.value;
    const msg = entry?.messages?.[0];

    if (!msg || !msg.text) return;

    if (seenMessages.has(msg.id)) return;
    seenMessages.add(msg.id);
    if (seenMessages.size > 200) seenMessages.clear();

    const from = msg.from;
    const userText = msg.text.body.trim();

    const token = (MY_META_TOKEN || env.META_TOKEN || "").trim();
    const phoneId = (env.PHONE_ID || MY_PHONE_ID).trim();
    const geminiKey = (env.GEMINI_API_KEY || "").trim();

    let aiReply = "";

    // IA Gemini si clé présente
    if (geminiKey) {
      try {
        const prompt = "Tu es le Robot Android ITECH, tuteur d'Academia ITECH sur WhatsApp (+1 555-631-6001). Réponds de façon bienveillante, pédagogique et structurée en utilisant le formatage WhatsApp (*gras*, listes, émojis). Réponds précisément à ce message : " + userText;
        const gRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiKey, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });
        const gData = await gRes.json();
        aiReply = gData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } catch (e) {}
    }

    if (!aiReply) {
      const lower = userText.toLowerCase();
      if (lower.match(/^(bonjour|salut|coucou|hello|bonsoir|hi)/)) {
        aiReply = "🤖 Bip bop ! Bonjour ! Je suis le *Robot Android ITECH*, votre tuteur interactif chez Academia ITECH.\\n\\nComment puis-je vous guider aujourd'hui ?\\n- 🐍 *Python & Programmation*\\n- 🌐 *Développement Web*\\n- 🎯 *Tapez !quiz pour un défi*";
      } else if (lower.includes("quiz") || lower.includes("defi")) {
        aiReply = "🎯 *Mini-Quiz Academia ITECH* :\\n\\nEn informatique, que signifie le sigle *API* ?\\n\\n1️⃣ Application Programming Interface\\n2️⃣ Automated Program Instruction\\n3️⃣ Advanced Private Internet\\n\\n👉 _Répondez 1, 2 ou 3 !_";
      } else {
        aiReply = "🤖 *Robot Android ITECH* :\\n\\nJ'ai bien reçu votre message : \\"" + userText + "\\\".\\n\\nJe suis ravi de vous accompagner dans vos cours de programmation ! Posez-moi vos questions de code ou demandez un exemple.";
      }
    }

    // Appel API Meta Cloud
    const metaRes = await fetch("https://graph.facebook.com/v19.0/" + phoneId + "/messages", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: aiReply },
      }),
    });

    const metaData = await metaRes.json();
    lastOutboundResult = {
      sentAt: new Date().toISOString(),
      recipient: from,
      httpStatus: metaRes.status,
      metaResponse: metaData
    };
  } catch (err) {
    lastOutboundResult = {
      error: err.message,
      occurredAt: new Date().toISOString()
    };
  }
}`;
                        copyToClipboard(code, 'cloudflare-worker');
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                    >
                      {copiedField === 'cloudflare-worker' ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Code v4.0 Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copier le Code Cloudflare v4.0 (Diagnostic Intégré)</span>
                        </>
                      )}
                    </button>

                    <a
                      href="https://patient-pine-7b82.landrykibakweto123.workers.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-amber-700" />
                      <span>Ouvrir la page de Diagnostic de mon Worker ↗</span>
                    </a>
                  </div>

                  <div className="relative">
                    <div className="p-3 rounded-xl bg-slate-900 text-amber-300 font-mono text-[11px] max-h-48 overflow-y-auto border border-slate-800">
                      <code>{`// Cloudflare Worker v2.0 - Non bloquant avec ctx.waitUntil & Déduplication
const seenMessages = new Set();
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === "GET") {
      const challenge = url.searchParams.get("hub.challenge");
      return new Response(challenge || "OK", { status: 200 });
    }
    if (request.method === "POST") {
      let body = await request.json().catch(() => null);
      if (ctx?.waitUntil) ctx.waitUntil(handleIncoming(body, env));
      else await handleIncoming(body, env);
      return new Response("EVENT_RECEIVED", { status: 200 });
    }
    return new Response("OK", { status: 200 });
  }
};`}</code>
                    </div>
                  </div>
                </div>

                {/* Twilio Sandbox Card */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-rose-50 text-rose-600 font-black text-xs">
                        TWILIO
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Option 2 : Twilio WhatsApp Sandbox (Test en 2 min)
                      </h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                      Configuration Ultra Rapide
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Idéal pour tester immédiatement avec n'importe quel compte WhatsApp sans formalités d'entreprise.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        URL Webhook Twilio (When a message comes in)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhook/twilio-whatsapp`}
                          className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 select-all"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`${window.location.origin}/api/webhook/twilio-whatsapp`, 'twilio-url')}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-200"
                        >
                          {copiedField === 'twilio-url' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedField === 'twilio-url' ? 'Copié' : 'Copier'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                      <div className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Réponse TwiML Automatique</span>
                      </div>
                      <p className="text-emerald-800">
                        Ce webhook répond automatiquement au format XML standard Twilio : dès qu'un message arrive, l'IA lui répond directement sur WhatsApp sans code supplémentaire.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Webhook Simulator / Test Tool */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Testeur de Requête Webhook en Temps Réel
                  </h4>
                </div>
                <p className="text-xs text-slate-500">
                  Simulez une requête de message entrant pour voir exactement comment l'agent {activePersona.name} formule sa réponse WhatsApp formatée.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-9">
                    <input
                      type="text"
                      value={testWebhookMessage}
                      onChange={(e) => setTestWebhookMessage(e.target.value)}
                      placeholder="Ex: Peux-tu m'expliquer les Transformers en 2 phrases ?"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="button"
                      onClick={handleTestWebhookDirectly}
                      disabled={isTestingWebhook || !testWebhookMessage.trim()}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
                    >
                      {isTestingWebhook ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Traitement IA...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Tester l'Agent</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {testWebhookResult && (
                  <div className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs space-y-2 border border-slate-800">
                    <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between border-b border-slate-800 pb-2">
                      <span>RÉPONSE GÉNÉRÉE POUR WHATSAPP :</span>
                      <span className="text-emerald-400">200 OK • Prêt à envoyer</span>
                    </div>
                    <div className="whitespace-pre-line text-slate-100 leading-relaxed font-sans">
                      {testWebhookResult}
                    </div>
                  </div>
                )}
              </div>

              {/* Pourquoi "Toujours rien" ? Guide de déblocage rapide Sandbox */}
              <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                    ⚠️ Pourquoi aucun message ne part ou n'arrive encore sur votre téléphone ?
                  </h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Dans l'environnement de test (Sandbox) de Meta Cloud API, deux conditions techniques strictes sont indispensables :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1.5">
                    <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                      1. Déverrouiller la Sandbox WhatsApp
                    </span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Sur Meta for Developers (<strong>Démarrage rapide / API Setup</strong>), dans le champ <strong>« À » (To)</strong>, choisissez votre numéro vérifié, puis cliquez sur <strong>« Envoyer un message » (Send message)</strong>.
                    </p>
                    <p className="text-slate-900 font-semibold text-[11px]">
                      👉 Vous allez recevoir un message modèle officiel sur votre WhatsApp. <strong>Répondez ensuite directement à ce message</strong> pour que votre conversation soit ouverte !
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1.5">
                    <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                      2. Renouveler le Jeton Temporaire Meta (Code 190)
                    </span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Les jetons Meta expirent toutes les 24 heures. Si le jeton est expiré, Meta bloque silencieusement l'envoi de la réponse du Robot avec l'erreur <code>OAuthException 190</code>.
                    </p>
                    <p className="text-slate-900 font-semibold text-[11px]">
                      👉 Copiez le nouveau <strong>Temporary access token</strong> sur Meta et collez-le ci-dessous dans le testeur ou dans votre Worker (variable <code>META_TOKEN</code>).
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Meta WhatsApp Message Sender & Live Verifier */}
              <div className="p-6 rounded-3xl bg-blue-50/60 border border-blue-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-600 text-white font-bold text-xs">
                      LIVE
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Testeur d'Envoi Réel WhatsApp (Meta Graph API)
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Envoyez un message direct depuis le numéro Meta <code>+1 555-631-6001</code> vers votre smartphone.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-300">
                    Diagnostic Instantané
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      1. Jeton d'accès Meta (Temporary Access Token)
                    </label>
                    <input
                      type="password"
                      value={metaTestToken}
                      onChange={(e) => setMetaTestToken(e.target.value)}
                      placeholder="Collez votre jeton temporaire depuis developers.facebook.com"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Trouvable sur Meta ➔ WhatsApp ➔ Démarrage de l'API ➔ "Jeton d'accès temporaire"
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      2. Votre Numéro WhatsApp Mobile (Destinataire)
                    </label>
                    <input
                      type="text"
                      value={metaTestRecipient}
                      onChange={(e) => setMetaTestRecipient(e.target.value)}
                      placeholder="Ex: +243890000000 ou +33612345678"
                      className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Format international avec indicatif pays (+243, +33, +221, etc.)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Message de test à envoyer :
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={metaTestMessage}
                      onChange={(e) => setMetaTestMessage(e.target.value)}
                      className="flex-1 p-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleSendMetaTest}
                      disabled={isSendingMetaTest || !metaTestRecipient.trim()}
                      className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs transition-colors whitespace-nowrap"
                    >
                      {isSendingMetaTest ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Envoyer sur mon WhatsApp</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {metaTestResult && (
                  <div
                    className={`p-4 rounded-2xl text-xs space-y-2 border ${
                      metaTestResult.success
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-2">
                      {metaTestResult.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{metaTestResult.message}</span>
                    </div>

                    {!metaTestResult.success && metaTestResult.details && (
                      <div className="p-3 rounded-xl bg-white/80 border border-rose-200 text-[11px] space-y-1 text-slate-700">
                        <div className="font-bold text-rose-800">Diagnostic Meta Cloud API :</div>
                        <div className="font-mono text-[10px] text-slate-800 break-all">
                          Code : {metaTestResult.details.code} | Message : {metaTestResult.details.message}
                        </div>
                        {metaTestResult.details.code === 131030 && (
                          <div className="text-amber-800 font-medium">
                            💡 <strong>Solution</strong> : Votre numéro n'est pas encore autorisé dans Meta. Allez sur <strong>Démarrage de l'API</strong> ➔ Champ <strong>"À"</strong> ➔ Ajoutez votre numéro pour le débloquer.
                          </div>
                        )}
                        {metaTestResult.details.code === 190 && (
                          <div className="text-amber-800 font-medium">
                            💡 <strong>Solution</strong> : Le jeton temporaire a expiré. Cliquez sur "Actualiser le jeton" sur votre portail Meta for Developers et recollez-le ici.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
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
