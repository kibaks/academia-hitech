import React, { useState } from 'react';
import { Course, UserProfile, EarnedCertificate, NanoBananaLesson } from '../../types';
import { NANO_BANANA_TEMPLATES } from '../../data/templatesData';
import { NanoBananaPlayer } from '../teacher/NanoBananaPlayer';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
  Layers,
  Zap,
  Target,
  ChevronRight,
  ShieldCheck,
  User,
  Star
} from 'lucide-react';

interface LearnerJourneyViewProps {
  currentUser: UserProfile;
  courses: Course[];
  onNavigateToCourse: (courseId: string) => void;
  onOpenCertificateModal: (cert: EarnedCertificate) => void;
  onOpenFacebookProfile: () => void;
}

export const LearnerJourneyView: React.FC<LearnerJourneyViewProps> = ({
  currentUser,
  courses,
  onNavigateToCourse,
  onOpenCertificateModal,
  onOpenFacebookProfile,
}) => {
  const [activeNanoBanana, setActiveNanoBanana] = useState<NanoBananaLesson | null>(null);

  const enrolledCourses = courses.filter((c) => currentUser.enrolledCourseIds.includes(c.id));
  const completedCount = currentUser.completedLessonIds.length;

  const milestones = [
    { id: 1, title: 'Fondations Web & Algorithmique', desc: 'Maîtrise de TypeScript et React 19', completed: true, xp: 500 },
    { id: 2, title: 'Architecture Modèles LLM & Transformers', desc: 'Auto-attention et Prompting Avancé', completed: true, xp: 850 },
    { id: 3, title: 'Microservices & Sécurité Cloud', desc: 'Zero Trust et Déploiement Conteneurs', completed: false, xp: 1200 },
    { id: 4, title: 'Projet de Fin d\'Études & Soutenance IA', desc: 'Grand Jury et Certification Internationale', completed: false, xp: 2500 },
  ];

  return (
    <div className="space-y-6">
      {/* Nano Banana Modal Player */}
      {activeNanoBanana && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center animate-fadeIn">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <NanoBananaPlayer
              lesson={activeNanoBanana}
              onClose={() => setActiveNanoBanana(null)}
              onComplete={() => setActiveNanoBanana(null)}
            />
          </div>
        </div>
      )}

      {/* 1. Header Profile & Journey Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-400 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
              Nv.{currentUser.level}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                Parcours d'Excellence Apprenant
              </span>
              <span className="text-xs text-slate-400">{currentUser.centerName}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">{currentUser.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{currentUser.headline || 'Étudiant en Ingénierie IA'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenFacebookProfile}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md flex items-center gap-2 transition-all"
          >
            <User className="w-4 h-4" />
            <span>Voir Mon Profil Facebook</span>
          </button>
        </div>
      </div>

      {/* 2. Key Progress Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Formations</span>
            <div className="text-xl font-black text-slate-900">{enrolledCourses.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Leçons Validées</span>
            <div className="text-xl font-black text-slate-900">{completedCount}</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Série Active</span>
            <div className="text-xl font-black text-slate-900">{currentUser.streakDays} Jours</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Diplômes Obtenus</span>
            <div className="text-xl font-black text-slate-900">{currentUser.earnedCertificates.length}</div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Learning Roadmap */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span>Feuille de Route Pédagogique (Roadmap)</span>
            </h2>
            <p className="text-xs text-slate-500">Validez vos jalons étape par étape pour débloquer votre diplôme officiel</p>
          </div>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {milestones.map((m, idx) => (
            <div key={m.id} className="relative flex items-start gap-4">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs absolute -left-6 sm:-left-8 border-4 border-white shadow-xs ${
                  m.completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {m.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <div className="flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{m.title}</h4>
                    {m.completed && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                        Validé ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-bold text-amber-600">+{m.xp} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Nano Banana Animated Micro-Courses Shelf */}
      <div className="bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-slate-50 p-6 sm:p-8 rounded-3xl border border-amber-300/50 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍌</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Nano Banana • Micro-Cours Animés
                </span>
                <span className="text-xs text-amber-800 font-semibold">Explications Visuelles en 3 minutes</span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                Concepts Clés Animés & Interactifs
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {NANO_BANANA_TEMPLATES.map((nano) => (
            <div
              key={nano.id}
              className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {nano.topic}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{nano.totalDurationSeconds}s</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">{nano.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {nano.scenes.length} étapes animées avec narration vocale et quiz interactif.
                </p>
              </div>

              <button
                onClick={() => setActiveNanoBanana(nano)}
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-102"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Lancer le Cours Animé</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
