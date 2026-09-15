import React, { useState } from 'react';
import { Course, Lesson, UserProfile } from '../../types';
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  HelpCircle,
  Send,
  Sparkles,
  Bot,
  User,
  Search,
  Filter,
  Check,
} from 'lucide-react';

interface QAItem {
  id: string;
  authorName: string;
  authorRole?: string;
  authorAvatar?: string;
  title: string;
  content: string;
  timestamp: string;
  upvotes: number;
  hasUpvoted?: boolean;
  isResolved: boolean;
  replies: Array<{
    id: string;
    authorName: string;
    authorRole: string;
    content: string;
    timestamp: string;
    isInstructor?: boolean;
    isAI?: boolean;
  }>;
}

interface LessonDiscussionQAProps {
  course: Course;
  currentLesson: Lesson;
  currentUser?: UserProfile;
}

export const LessonDiscussionQA: React.FC<LessonDiscussionQAProps> = ({
  course,
  currentLesson,
  currentUser,
}) => {
  const [filter, setFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskForm, setShowAskForm] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Seed friendly realistic questions
  const [questions, setQuestions] = useState<QAItem[]>(() => [
    {
      id: 'qa-1',
      authorName: 'Jean-Marc M.',
      authorRole: 'Étudiant Développeur',
      title: 'Quelle est la différence entre cette approche et la méthode classique ?',
      content: `Dans la vidéo et les blocs de code de "${currentLesson.title}", nous utilisons cette syntaxe. Y a-t-il un impact direct sur la consommation mémoire ou le temps de build ?`,
      timestamp: 'Il y a 2 jours',
      upvotes: 6,
      hasUpvoted: false,
      isResolved: true,
      replies: [
        {
          id: 'rep-1',
          authorName: course.instructor?.name || 'Formateur Academia ITECH',
          authorRole: 'Instructeur Certifié',
          content: `Excellente question Jean-Marc ! En isolant la logique par composant et en limitant les re-rendus, nous réduisons l'empreinte mémoire d'environ 35% sur les applications à forte charge. C'est le standard appliqué chez les grands éditeurs.`,
          timestamp: 'Il y a 1 jour',
          isInstructor: true,
        },
        {
          id: 'rep-2',
          authorName: 'Assistant IA MasterStudy',
          authorRole: 'IA Pédagogique',
          content: `💡 Complément technique : En utilisant les hooks mémoïsés et la séparation claire des responsabilités, vous bénéficiez également d'un meilleur tree-shaking lors de la compilation finale.`,
          timestamp: 'Il y a 1 jour',
          isAI: true,
        },
      ],
    },
    {
      id: 'qa-2',
      authorName: 'Sarah K.',
      authorRole: 'Apprenante',
      title: `Est-ce que cet atelier fonctionne sur les anciennes versions de Node ?`,
      content: `J'ai testé en local avec une version antérieure et j'ai eu une alerte sur les imports. Doit-on obligatoirement utiliser la version LTS recommandée ?`,
      timestamp: 'Hier à 15:30',
      upvotes: 3,
      hasUpvoted: false,
      isResolved: false,
      replies: [
        {
          id: 'rep-3',
          authorName: course.instructor?.name || 'Formateur Academia ITECH',
          authorRole: 'Instructeur Certifié',
          content: `Oui Sarah, nous recommandons vivement Node.js 18 ou 20 LTS car les fonctionnalités ESM et les API de streams utilisées dans nos laboratoires interactifs nécessitent ce runtime moderne.`,
          timestamp: 'Hier à 17:00',
          isInstructor: true,
        },
      ],
    },
  ]);

  const handleUpvote = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const hasUpvoted = !q.hasUpvoted;
          return {
            ...q,
            hasUpvoted,
            upvotes: hasUpvoted ? q.upvotes + 1 : q.upvotes - 1,
          };
        }
        return q;
      })
    );
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newQA: QAItem = {
      id: `qa-${Date.now()}`,
      authorName: currentUser?.displayName || currentUser?.name || 'Moi (Apprenant)',
      authorRole: 'Apprenant actif',
      title: newTitle,
      content: newContent,
      timestamp: "À l'instant",
      upvotes: 1,
      hasUpvoted: true,
      isResolved: false,
      replies: [
        {
          id: `rep-ai-${Date.now()}`,
          authorName: 'Assistant IA MasterStudy',
          authorRole: 'IA Pédagogique Immédiate',
          content: `Merci pour votre question sur "${currentLesson.title}" ! Le formateur en a été notifié. En attendant son retour détaillé, assurez-vous de tester vos hypothèses dans le sandbox interactif de la leçon.`,
          timestamp: "À l'instant",
          isAI: true,
        },
      ],
    };

    setQuestions((prev) => [newQA, ...prev]);
    setNewTitle('');
    setNewContent('');
    setShowAskForm(false);
  };

  const handleAddReply = (questionId: string) => {
    const text = replyInputs[questionId];
    if (!text || !text.trim()) return;

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            replies: [
              ...q.replies,
              {
                id: `rep-${Date.now()}`,
                authorName: currentUser?.displayName || currentUser?.name || 'Apprenant',
                authorRole: 'Apprenant',
                content: text.trim(),
                timestamp: "À l'instant",
              },
            ],
          };
        }
        return q;
      })
    );

    setReplyInputs((prev) => ({ ...prev, [questionId]: '' }));
  };

  const filteredQuestions = questions.filter((q) => {
    if (filter === 'resolved' && !q.isResolved) return false;
    if (filter === 'unresolved' && q.isResolved) return false;
    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(s) ||
        q.content.toLowerCase().includes(s) ||
        q.authorName.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une question ou un sujet..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-200/60 text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes ({questions.length})
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filter === 'resolved' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Résolues
            </button>
          </div>

          <button
            onClick={() => setShowAskForm(!showAskForm)}
            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Poser une question</span>
          </button>
        </div>
      </div>

      {/* Ask Question Form Modal/Drawer */}
      {showAskForm && (
        <form
          onSubmit={handlePostQuestion}
          className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-sky-950 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-sky-600" />
              <span>Poser une question sur : "{currentLesson.title}"</span>
            </h4>
            <button
              type="button"
              onClick={() => setShowAskForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Annuler
            </button>
          </div>

          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Titre clair et précis (ex: Comment gérer l'erreur de connexion ?)"
            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-sky-500"
          />

          <textarea
            required
            rows={4}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Décrivez votre question, ce que vous avez essayé ou le résultat obtenu..."
            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-sky-500"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              L'instructeur et l'Assistant IA MasterStudy vous répondront en priorité.
            </span>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publier la question</span>
            </button>
          </div>
        </form>
      )}

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-xs font-semibold">Aucune question ne correspond à vos critères.</p>
            <p className="text-[11px] text-slate-400 mt-1">Soyez le premier à poser une question pour cette leçon !</p>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 hover:border-slate-300 transition-colors"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center border border-sky-200">
                    {q.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{q.authorName}</span>
                      <span className="text-[10px] text-slate-400">• {q.timestamp}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{q.authorRole}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {q.isResolved ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Résolu</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                      En attente
                    </span>
                  )}

                  <button
                    onClick={() => handleUpvote(q.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all ${
                      q.hasUpvoted
                        ? 'bg-sky-50 border-sky-300 text-sky-700'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${q.hasUpvoted ? 'text-sky-600 fill-sky-600' : ''}`} />
                    <span>{q.upvotes}</span>
                  </button>
                </div>
              </div>

              {/* Question Content */}
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{q.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{q.content}</p>
              </div>

              {/* Replies Thread */}
              {q.replies && q.replies.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {q.replies.map((rep) => (
                    <div
                      key={rep.id}
                      className={`p-3 rounded-xl text-xs leading-relaxed space-y-1 ${
                        rep.isInstructor
                          ? 'bg-amber-50/80 border border-amber-200 text-amber-950'
                          : rep.isAI
                          ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-950'
                          : 'bg-slate-50 border border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <div className="flex items-center gap-1.5">
                          {rep.isAI ? (
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-amber-600" />
                          )}
                          <span>{rep.authorName}</span>
                          <span className="text-[10px] opacity-75 font-normal">({rep.authorRole})</span>
                        </div>
                        <span className="text-[10px] opacity-60 font-normal">{rep.timestamp}</span>
                      </div>
                      <p className="text-xs whitespace-pre-line">{rep.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Reply Box */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={replyInputs[q.id] || ''}
                  onChange={(e) =>
                    setReplyInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddReply(q.id);
                  }}
                  placeholder="Apporter une réponse ou un commentaire..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500"
                />
                <button
                  onClick={() => handleAddReply(q.id)}
                  disabled={!replyInputs[q.id]?.trim()}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold shadow-2xs"
                >
                  Répondre
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
