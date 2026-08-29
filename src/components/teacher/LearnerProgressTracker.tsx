import React, { useState } from 'react';
import { Course, LearnerCourseProgress } from '../../types';
import { INITIAL_LEARNER_PROGRESS } from '../../data/templatesData';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  BookOpen,
  Send,
  MessageSquare,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface LearnerProgressTrackerProps {
  courses: Course[];
}

export const LearnerProgressTracker: React.FC<LearnerProgressTrackerProps> = ({ courses }) => {
  const [progressList, setProgressList] = useState<LearnerCourseProgress[]>(INITIAL_LEARNER_PROGRESS);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ahead' | 'on_track' | 'needs_help'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLearner, setSelectedLearner] = useState<LearnerCourseProgress | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sentAlert, setSentAlert] = useState(false);

  // Filtered list
  const filtered = progressList.filter((item) => {
    const matchesCourse = selectedCourseId === 'all' || item.courseId === selectedCourseId;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch =
      item.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.learnerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesStatus && matchesSearch;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSentAlert(true);
    setMessageText('');
    setTimeout(() => {
      setSentAlert(false);
      setSelectedLearner(null);
    }, 2000);
  };

  const stats = {
    totalStudents: progressList.length,
    aheadCount: progressList.filter((p) => p.status === 'ahead').length,
    onTrackCount: progressList.filter((p) => p.status === 'on_track').length,
    needsHelpCount: progressList.filter((p) => p.status === 'needs_help').length,
    averageCompletion: Math.round(
      progressList.reduce((acc, p) => acc + p.progressPercentage, 0) / (progressList.length || 1)
    ),
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Overall Stats */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Suivi Pédagogique en Temps Réel
              </span>
              <span className="text-xs text-slate-500">• Évolution des Apprenants</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Tableau de Suivi Pédagogique par Cours
            </h2>
          </div>

          <button
            onClick={() => alert('Rapport exporté avec succès au format CSV/Excel.')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exporter Rapport (CSV)</span>
          </button>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 block mb-1">Total Apprenants Suivis</span>
            <div className="text-2xl font-black text-slate-900">{stats.totalStudents}</div>
            <span className="text-[11px] text-indigo-600 font-semibold">Taux moyen : {stats.averageCompletion}%</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-bold text-emerald-700 block mb-1">En Avance / Excellents</span>
            <div className="text-2xl font-black text-emerald-800">{stats.aheadCount}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">Moyenne &gt; 90%</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <span className="text-xs font-bold text-blue-700 block mb-1">Dans les Temps</span>
            <div className="text-2xl font-black text-blue-800">{stats.onTrackCount}</div>
            <span className="text-[11px] text-blue-600 font-semibold">Progression régulière</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-xs font-bold text-rose-700 block mb-1">Besoin d'Aide / Ralentissement</span>
            <div className="text-2xl font-black text-rose-800">{stats.needsHelpCount}</div>
            <span className="text-[11px] text-rose-600 font-semibold">Relance recommandée</span>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Filter by course */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none"
            >
              <option value="all">Tous les Cours</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by status */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none"
            >
              <option value="all">Tous les Statuts</option>
              <option value="ahead">En Avance</option>
              <option value="on_track">Dans les Temps</option>
              <option value="needs_help">En Difficulté</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un apprenant..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 3. Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Apprenant</th>
                <th className="py-3.5 px-4">Cours Suivi</th>
                <th className="py-3.5 px-4">Complétion</th>
                <th className="py-3.5 px-4">Score Quiz</th>
                <th className="py-3.5 px-4">Temps Passé</th>
                <th className="py-3.5 px-4">Dernière Activité</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.learnerId} className="hover:bg-slate-50/70 transition-colors">
                  {/* Learner info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.learnerAvatar}
                        alt={item.learnerName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.learnerName}</div>
                        <div className="text-[11px] text-slate-500">{item.learnerEmail}</div>
                      </div>
                    </div>
                  </td>

                  {/* Course */}
                  <td className="py-4 px-4 font-semibold text-slate-800 max-w-[200px] truncate">
                    {item.courseTitle}
                  </td>

                  {/* Progress Bar */}
                  <td className="py-4 px-4">
                    <div className="w-32 space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-700">
                        <span>{item.progressPercentage}%</span>
                        <span className="text-slate-400">
                          {item.completedLessonsCount}/{item.totalLessonsCount}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.progressPercentage >= 80
                              ? 'bg-emerald-500'
                              : item.progressPercentage >= 40
                              ? 'bg-indigo-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Quiz score */}
                  <td className="py-4 px-4 font-bold text-slate-900">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-xs ${
                        item.quizAveragePercentage >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.quizAveragePercentage >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.quizAveragePercentage}%
                    </span>
                  </td>

                  {/* Time */}
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {Math.floor(item.timeSpentMinutes / 60)}h {item.timeSpentMinutes % 60}m
                  </td>

                  {/* Last Active */}
                  <td className="py-4 px-4 text-slate-500 text-xs">{item.lastActive}</td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'ahead'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'on_track'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.status === 'ahead'
                        ? 'En avance'
                        : item.status === 'on_track'
                        ? 'Dans les temps'
                        : 'En difficulté'}
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedLearner(item)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 ml-auto transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Encourager / Aider</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {selectedLearner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={selectedLearner.learnerAvatar}
                  alt={selectedLearner.learnerName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Message à {selectedLearner.learnerName}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedLearner.courseTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLearner(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Fermer
              </button>
            </div>

            {sentAlert ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Message & conseils pédagogiques transmis avec succès !</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Note / Conseil Pédagogique ou Relance
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    rows={4}
                    placeholder={`Bonjour ${selectedLearner.learnerName.split(' ')[0]}, félicitations pour ton avancée ! J'ai vu que tu travaillais sur le module...`}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLearner(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Envoyer via l'Académie & WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
