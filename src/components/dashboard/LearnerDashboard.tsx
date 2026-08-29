import React from 'react';
import { UserProfile, Course, EarnedCertificate } from '../../types';
import {
  GraduationCap,
  Award,
  Zap,
  Flame,
  PlayCircle,
  Clock,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface LearnerDashboardProps {
  currentUser: UserProfile;
  enrolledCourses: Course[];
  completedLessonIds: string[];
  onSelectCourse: (course: Course) => void;
  onOpenCertificateModal: (cert: EarnedCertificate) => void;
  onNavigateToCatalog: () => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({
  currentUser,
  enrolledCourses,
  completedLessonIds,
  onSelectCourse,
  onOpenCertificateModal,
  onNavigateToCatalog,
}) => {
  const activeCourse = enrolledCourses[0];

  return (
    <div id="learner-dashboard-view" className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Tableau de Bord Apprenant</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bonjour <strong className="text-indigo-600">{currentUser.name}</strong>, suivez votre assiduité et vos certifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>Série active : {currentUser.streakDays} jours</span>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-600">
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Formations</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{enrolledCourses.length}</div>
          <span className="text-[11px] text-slate-500">Inscriptions actives</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Leçons</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{completedLessonIds.length}</div>
          <span className="text-[11px] text-slate-500">Modules complétés</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <Award className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Titres</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{currentUser.earnedCertificates.length}</div>
          <span className="text-[11px] text-slate-500">Certificats obtenus</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <Zap className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span className="text-[10px] uppercase font-bold text-slate-400">Total XP</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{currentUser.xp}</div>
          <span className="text-[11px] text-slate-500">Niveau {currentUser.level}</span>
        </div>
      </div>

      {/* In-Progress Course Spotlight */}
      {activeCourse && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-indigo-700 flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              <PlayCircle className="w-4 h-4 text-indigo-600" />
              <span>Formation en cours</span>
            </span>
            <span className="text-xs text-slate-500">{activeCourse.durationHours} heures au total</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {activeCourse.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {activeCourse.shortDescription}
              </p>

              {/* Progress bar */}
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>Progression globale</span>
                  <span className="text-indigo-600 font-bold">
                    {Math.round(
                      (completedLessonIds.filter((id) =>
                        activeCourse.chapters.some((ch) => ch.lessons.some((l) => l.id === id))
                      ).length /
                        Math.max(1, activeCourse.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0))) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (completedLessonIds.filter((id) =>
                          activeCourse.chapters.some((ch) => ch.lessons.some((l) => l.id === id))
                        ).length /
                          Math.max(1, activeCourse.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0))) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex items-center justify-end">
              <button
                id="resume-learning-btn"
                onClick={() => onSelectCourse(activeCourse)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Reprendre ma leçon</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled Courses & My Certificates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: My Registered Courses */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <span>Mes Formations en cours</span>
            </h3>
            <button
              onClick={onNavigateToCatalog}
              className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Explorer le catalogue</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {enrolledCourses.map((course) => {
              const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
              const doneCount = completedLessonIds.filter((id) =>
                course.chapters.some((ch) => ch.lessons.some((l) => l.id === id))
              ).length;
              const percent = Math.round((doneCount / Math.max(1, totalLessons)) * 100);

              return (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course)}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs cursor-pointer transition-all flex items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-slate-200"
                    />
                    <div className="truncate">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{course.title}</h4>
                      <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                        {doneCount} / {totalLessons} leçons ({percent}%)
                      </span>
                    </div>
                  </div>

                  <button className="p-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex-shrink-0 transition-colors">
                    <PlayCircle className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Certificates Earned */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Mes Certificats Officiels ({currentUser.earnedCertificates.length})</span>
          </h3>

          <div className="space-y-3">
            {currentUser.earnedCertificates.length > 0 ? (
              currentUser.earnedCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-2xl bg-white border border-amber-200/80 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {cert.certificateNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      {cert.distinction}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{cert.courseTitle}</h4>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Délivré le {cert.issueDate}</span>
                  </div>

                  <button
                    onClick={() => onOpenCertificateModal(cert)}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Afficher le Diplôme PDF</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-xs text-slate-500 space-y-2">
                <Award className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-semibold text-slate-700">Aucun certificat pour le moment.</p>
                <p className="text-[11px] text-slate-400">Terminez un cours et réussissez le quiz à 75% pour débloquer votre titre officiel.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
