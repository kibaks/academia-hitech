import React, { useState, useEffect, useRef } from 'react';
import {
  UserProfile,
  Course,
  CourseChatMessage,
  UserRole,
  NetworkConnection,
} from '../../types';
import {
  MessageSquare,
  Send,
  Code2,
  Paperclip,
  CheckCircle2,
  Sparkles,
  UserCheck,
  ShieldCheck,
  BookOpen,
  ThumbsUp,
  Pin,
  Bot,
  HelpCircle,
  Clock,
  Building2,
  ArrowRight,
  Filter,
  Users,
  Smile,
  X,
  FileCode,
  Download,
} from 'lucide-react';
import {
  SEED_COURSE_CHAT_MESSAGES,
  COURSE_NETWORK_DATA,
} from '../../data/courseNetworkData';
import {
  saveCourseChatMessageToFirestore,
  subscribeToCourseChat,
  getLocalCourseChatMessages,
} from '../../lib/firebase';

interface CourseLiveChatTabProps {
  currentUser: UserProfile;
  courses: Course[];
  initialCourseId?: string;
  initialTeacherId?: string;
  onNavigateToCourse?: (courseId: string) => void;
}

export const CourseLiveChatTab: React.FC<CourseLiveChatTabProps> = ({
  currentUser,
  courses,
  initialCourseId,
  initialTeacherId,
  onNavigateToCourse,
}) => {
  // Determine available courses for the user
  const userEnrolledIds = currentUser.enrolledCourseIds || ['course-ia-llm', 'course-fullstack-cloud'];
  
  const relevantCourses = courses.filter((c) => {
    if (currentUser.role === 'trainer') {
      return (
        c.trainerName?.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]) ||
        c.instructor?.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0]) ||
        true // allow trainers to inspect all course rooms
      );
    }
    // For learner or others: enrolled courses or all if empty
    return userEnrolledIds.length > 0 ? userEnrolledIds.includes(c.id) : true;
  });

  const activeCoursesList = relevantCourses.length > 0 ? relevantCourses : courses.slice(0, 3);

  // Selected course state
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || (activeCoursesList[0]?.id || 'course-ia-llm')
  );

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || activeCoursesList[0] || courses[0];

  // Channel mode: direct 1:1 chat with teacher vs general course forum
  const [chatMode, setChatMode] = useState<'direct' | 'forum'>('direct');

  // Direct chat conversation target (if trainer, pick which student; if learner, target is the teacher)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('user-amara-k');

  // Messages state
  const [messages, setMessages] = useState<CourseChatMessage[]>(() => {
    const local = getLocalCourseChatMessages(selectedCourseId);
    if (local && local.length > 0) return local;
    return SEED_COURSE_CHAT_MESSAGES[selectedCourseId] || SEED_COURSE_CHAT_MESSAGES['course-ia-llm'] || [];
  });

  // Message input state
  const [inputText, setInputText] = useState('');
  const [inputCodeSnippet, setInputCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [isTypingReply, setIsTypingReply] = useState(false);
  const [typingPartnerName, setTypingPartnerName] = useState('');

  // Scroll to bottom of messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Find instructor details for the active course
  const courseInstructorContact = COURSE_NETWORK_DATA.find(
    (c) => c.courseId === activeCourse?.id && c.relationshipType === 'teacher'
  ) || {
    id: 'trainer-default',
    name: activeCourse?.trainerName || activeCourse?.instructor || 'Formatrice Référente',
    role: 'trainer' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    headline: `Formatrice certifiée • ${activeCourse?.title}`,
    centerName: activeCourse?.category || 'Campus ITECH',
    mutualCount: 12,
    isFriend: true,
    isOnline: true,
  };

  // Subscribe to real-time chat updates from Firestore & sync local seed
  useEffect(() => {
    if (!selectedCourseId) return;

    // Load local seed / cached messages
    const localMsgs = getLocalCourseChatMessages(selectedCourseId);
    if (localMsgs.length > 0) {
      setMessages(localMsgs);
    } else {
      const seeds = SEED_COURSE_CHAT_MESSAGES[selectedCourseId] || [];
      setMessages(seeds);
    }

    // Subscribe to Firestore for real-time multiplayer updates
    const unsubscribe = subscribeToCourseChat(selectedCourseId, (remoteMessages) => {
      if (remoteMessages && remoteMessages.length > 0) {
        setMessages((prev) => {
          // Merge avoiding duplicates by id
          const existingIds = new Set(prev.map((m) => m.id));
          const newOnes = remoteMessages.filter((m) => !existingIds.has(m.id));
          if (newOnes.length === 0) return remoteMessages;
          return [...prev, ...newOnes];
        });
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedCourseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTypingReply, chatMode]);

  // Filter messages according to mode (direct with teacher vs forum)
  const displayedMessages = messages.filter((msg) => {
    if (chatMode === 'direct') {
      return msg.isDirectToTeacher;
    } else {
      return !msg.isDirectToTeacher;
    }
  });

  // Quick suggestion prompts
  const quickPrompts = chatMode === 'direct'
    ? [
        "J'ai une question sur l'exercice pratique",
        "Pouvez-vous m'expliquer ce concept clé ?",
        "Comment optimiser mon code ?",
        "Conseil pour l'examen final ?",
      ]
    : [
        "Quelqu'un a testé le dernier notebook ?",
        "Recommandation de documentation complémentaire",
        "Partage d'astuce de débogage",
      ];

  // Handle message sending
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !inputCodeSnippet.trim() && !attachedFileName) return;

    const newMsg: CourseChatMessage = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      courseId: activeCourse.id,
      courseTitle: activeCourse.title,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      recipientId: chatMode === 'direct' ? courseInstructorContact.id : undefined,
      recipientName: chatMode === 'direct' ? courseInstructorContact.name : undefined,
      message: inputText.trim(),
      timestamp: 'À l\'instant',
      isDirectToTeacher: chatMode === 'direct',
      codeSnippet: inputCodeSnippet.trim() || undefined,
      attachmentName: attachedFileName || undefined,
      likes: 0,
      isLiked: false,
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setInputText('');
    setInputCodeSnippet('');
    setShowCodeInput(false);
    setAttachedFileName(null);

    // Persist to local storage and Firestore
    await saveCourseChatMessageToFirestore(newMsg);

    // If student sent message to teacher, simulate an intelligent pedagogical instructor response!
    if (chatMode === 'direct' && currentUser.role !== 'trainer') {
      setIsTypingReply(true);
      setTypingPartnerName(courseInstructorContact.name);

      setTimeout(async () => {
        const teacherResponses = [
          `Merci pour votre question ${currentUser.name.split(' ')[0]} ! C'est un point central de ce module. Avez-vous vérifié la normalisation des tenseurs avant l'application de la fonction Softmax ? Regardez les logs dans la console.`,
          `Très bon travail sur cette formation. Pour résoudre cela, assurez-vous d'importer la bibliothèque avec la version requise indiquée dans le fichier requirements.txt du TP. Je reste disponible si besoin !`,
          `Excellente initiative ! Votre code est bien structuré. Je vous conseille d'ajouter un bloc try/catch pour gérer les déconnexions réseau temporaires, cela rend votre application beaucoup plus résiliente.`,
          `Bonjour ${currentUser.name.split(' ')[0]}, bien reçu votre message ! N'hésitez pas à jeter un œil à la diapositive n°8 du cours qui récapitule exactement la méthode d'implémentation recommandée. Bravo pour votre progression !`,
        ];
        const randomResp = teacherResponses[Math.floor(Math.random() * teacherResponses.length)];

        const replyMsg: CourseChatMessage = {
          id: `reply-${Date.now()}`,
          courseId: activeCourse.id,
          courseTitle: activeCourse.title,
          senderId: courseInstructorContact.id,
          senderName: courseInstructorContact.name,
          senderAvatar: courseInstructorContact.avatar,
          senderRole: 'trainer',
          recipientId: currentUser.id,
          recipientName: currentUser.name,
          message: randomResp,
          timestamp: 'À l\'instant',
          isDirectToTeacher: true,
          likes: 1,
        };

        setIsTypingReply(false);
        setMessages((prev) => [...prev, replyMsg]);
        await saveCourseChatMessageToFirestore(replyMsg);
      }, 1600);
    }
  };

  const handleToggleMessageLike = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId) {
          const isLiked = !m.isLiked;
          return {
            ...m,
            isLiked,
            likes: (m.likes || 0) + (isLiked ? 1 : -1),
          };
        }
        return m;
      })
    );
  };

  return (
    <div id="course-live-chat-view" className="space-y-6">
      {/* 1. COURSE TABS & SELECTOR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-sky-100 text-sky-700">
                <BookOpen className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Espace d'Échange par Formation
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentUser.role === 'trainer'
                ? 'Gérez vos interactions avec vos apprenants et animez le forum de vos cours'
                : 'Communiquez en direct avec votre formateur ou discutez avec la communauté du cours'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct Actif</span>
            </span>
          </div>
        </div>

        {/* Course Selection Carousel / Chips */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {activeCoursesList.map((c) => {
            const isSelected = c.id === selectedCourseId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-500/20 shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <img
                  src={c.thumbnail}
                  alt={c.title}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 max-w-[200px] sm:max-w-[260px]">
                  <h4 className={`text-xs font-black truncate ${isSelected ? 'text-sky-950' : 'text-slate-800'}`}>
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                    <UserCheck className="w-3 h-3 text-sky-600 shrink-0" />
                    <span>{c.trainerName || c.instructor || 'Formateur Référent'}</span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CHAT / FORUM DUAL MODE HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
        {/* Top Channel Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Mode Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-200/70 border border-slate-300/60 shrink-0">
            <button
              onClick={() => setChatMode('direct')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                chatMode === 'direct'
                  ? 'bg-white text-sky-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-sky-600" />
              <span>Chat Direct avec l'Enseignant</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800 font-bold">1:1</span>
            </button>
            <button
              onClick={() => setChatMode('forum')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                chatMode === 'forum'
                  ? 'bg-white text-sky-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-sky-600" />
              <span>Forum Général du Cours</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">Promo</span>
            </button>
          </div>

          {/* Target Info Banner */}
          {chatMode === 'direct' ? (
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={courseInstructorContact.avatar}
                  alt={courseInstructorContact.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs ring-2 ring-sky-300"
                />
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-slate-950">
                    {courseInstructorContact.name}
                  </h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 fill-sky-100" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    Enseignante du cours
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {courseInstructorContact.headline}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 font-bold border border-sky-200">
                {activeCourse.title}
              </span>
              <span className="text-slate-400">• Tous les apprenants inscrits</span>
            </div>
          )}
        </div>

        {/* 3. MESSAGES SCROLL AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-50/30 to-white">
          {/* Welcome Card Banner */}
          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/90 text-sky-950 flex items-start gap-3.5 shadow-2xs">
            <span className="p-2 rounded-xl bg-sky-500 text-white shrink-0 mt-0.5">
              {chatMode === 'direct' ? <UserCheck className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            </span>
            <div className="text-xs space-y-1">
              <p className="font-extrabold text-sky-950">
                {chatMode === 'direct'
                  ? `Canal Privé Direct avec ${courseInstructorContact.name}`
                  : `Forum Collaboratif de la formation "${activeCourse.title}"`}
              </p>
              <p className="text-sky-800/90 leading-relaxed">
                {chatMode === 'direct'
                  ? "Posez vos questions techniques, demandez des précisions sur les modules ou soumettez des extraits de code. Votre formateur vous répond directement."
                  : "Échangez avec les apprenants de votre promotion, partagez des ressources et collaborez sur les exercices pratiques."}
              </p>
            </div>
          </div>

          {/* Message List */}
          {displayedMessages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold">Aucun message pour le moment dans ce canal.</p>
              <p className="text-[11px]">Soyez le premier à poser une question ou saluer l'enseignant !</p>
            </div>
          ) : (
            displayedMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              const isInstructor = msg.senderRole === 'trainer';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1 group`}
                >
                  {/* Sender Identity Info */}
                  <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-500 font-bold">
                    <span>{isMe ? 'Vous' : msg.senderName}</span>
                    {isInstructor && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-sky-600 text-white shadow-2xs">
                        Formateur
                      </span>
                    )}
                    {msg.isPinned && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-white flex items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5" /> Épinglé
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-normal">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Bubble + Avatar */}
                  <div className={`flex items-end gap-2.5 max-w-[90%] sm:max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />

                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs transition-all ${
                        isMe
                          ? 'bg-sky-600 text-white rounded-br-xs'
                          : isInstructor
                          ? 'bg-slate-900 text-white rounded-bl-xs border border-slate-800'
                          : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.message}</p>

                      {/* Code Snippet Box */}
                      {msg.codeSnippet && (
                        <div className="mt-2.5 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 text-slate-100">
                          <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-sky-400 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Code2 className="w-3 h-3 text-sky-400" /> Code partagé
                            </span>
                            <span className="text-slate-400 text-[9px]">Python / TS</span>
                          </div>
                          <pre className="p-3 text-[11px] font-mono overflow-x-auto text-sky-200">
                            <code>{msg.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      {/* Attachment Box */}
                      {msg.attachmentName && (
                        <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-black/15 text-[11px] font-bold">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span className="truncate">{msg.attachmentName}</span>
                          <span className="text-[10px] opacity-75">(Document joint)</span>
                        </div>
                      )}

                      {/* Message Actions (Like / Upvote) */}
                      <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-white/10 text-[10px]">
                        <button
                          onClick={() => handleToggleMessageLike(msg.id)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                            msg.isLiked
                              ? 'bg-white/25 text-amber-300 font-black'
                              : 'hover:bg-white/10 opacity-80'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{msg.likes || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isTypingReply && (
            <div className="flex items-center gap-2 text-xs text-sky-700 font-bold animate-pulse pt-2">
              <img
                src={courseInstructorContact.avatar}
                alt={typingPartnerName}
                className="w-6 h-6 rounded-full object-cover border border-sky-300"
              />
              <span className="italic">{typingPartnerName} est en train d'écrire une réponse...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce delay-200" />
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. QUICK PROMPT CHIPS */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-extrabold text-slate-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-600" /> Suggestions :
          </span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(prompt)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 shrink-0 transition-colors shadow-2xs cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Code Snippet Drawer */}
        {showCodeInput && (
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-white space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-sky-400">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-4 h-4" /> Insérer un extrait de code source
              </span>
              <button
                onClick={() => setShowCodeInput(false)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={3}
              value={inputCodeSnippet}
              onChange={(e) => setInputCodeSnippet(e.target.value)}
              placeholder="Collez votre code Python, TypeScript, SQL ou Dockerfile ici..."
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-sky-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        )}

        {/* Attached File Preview */}
        {attachedFileName && (
          <div className="px-4 py-1.5 bg-sky-50 border-t border-sky-100 flex items-center justify-between text-xs text-sky-900 font-bold">
            <div className="flex items-center gap-2">
              <Paperclip className="w-3.5 h-3.5 text-sky-600" />
              <span>Pièce jointe prête : {attachedFileName}</span>
            </div>
            <button
              onClick={() => setAttachedFileName(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 5. MESSAGE COMPOSER INPUT */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          {/* Toggle Code Snippet Button */}
          <button
            type="button"
            onClick={() => setShowCodeInput(!showCodeInput)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              showCodeInput
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Ajouter un snippet de code"
          >
            <Code2 className="w-4 h-4" />
          </button>

          {/* Quick File Attach Button */}
          <button
            type="button"
            onClick={() => {
              const sampleFiles = ['tp-attention-llm.py', 'docker-compose.yml', 'devoir-module-1.pdf'];
              const chosen = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
              setAttachedFileName(chosen);
            }}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              attachedFileName
                ? 'bg-sky-100 text-sky-800 border-sky-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Joindre un devoir ou code source"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              chatMode === 'direct'
                ? `Écrire un message direct à ${courseInstructorContact.name}...`
                : `Publier une question dans le forum "${activeCourse.title}"...`
            }
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs sm:text-sm text-slate-900"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() && !inputCodeSnippet.trim() && !attachedFileName}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
};
