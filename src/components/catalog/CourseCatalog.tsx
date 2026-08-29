import React, { useState, useMemo } from 'react';
import { Course, Center, UserProfile } from '../../types';
import { hasPermission } from '../../lib/permissions';
import {
  Sparkles,
  Star,
  Users,
  Clock,
  Award,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  Bot,
  Code2,
  Cloud,
  Briefcase,
  Palette,
  ChevronRight,
  ExternalLink,
  User,
  Layers,
  GraduationCap,
  Building2,
  Trophy,
  Zap,
  Edit2
} from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  enrolledCourseIds: string[];
  activeCenter: Center;
  searchQuery: string;
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (courseId: string) => void;
  onOpenStudio: () => void;
  onEditCourse?: (course: Course) => void;
  onNavigate?: (tabId: string) => void;
  currentUser?: UserProfile;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  enrolledCourseIds,
  activeCenter,
  searchQuery,
  onSelectCourse,
  onEnrollCourse,
  onOpenStudio,
  onEditCourse,
  onNavigate,
  currentUser,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  const userRole = currentUser?.role || 'visitor';
  const canAccessStudio = hasPermission(userRole, 'access_ai_studio');

  const categories = [
    { id: 'all', label: 'Toutes les filières', icon: BookOpen },
    { id: 'ia_data', label: 'IA & Data Science', icon: Bot },
    { id: 'cybersecurity', label: 'Cybersécurité & SOC', icon: ShieldCheck },
    { id: 'development', label: 'Dév Web & Mobile', icon: Code2 },
    { id: 'cloud_devops', label: 'Cloud & DevOps', icon: Cloud },
    { id: 'business', label: 'Business & Digital', icon: Briefcase },
    { id: 'design', label: 'Design & UX/UI', icon: Palette },
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        searchQuery === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
      const matchLevel = selectedLevel === 'all' || c.level === selectedLevel;

      return matchSearch && matchCat && matchLevel;
    });
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  const featuredCourse = courses.find((c) => c.isFeatured) || courses[0];

  // STRICT ROLE-BASED QUICK NAVIGATION SHORTCUTS
  const getRoleShortcuts = () => {
    switch (userRole) {
      case 'learner':
        return [
          {
            id: 'learner-journey',
            title: 'Mon Parcours',
            subtitle: 'Jalons & Micro-Cours',
            icon: GraduationCap,
            color: 'bg-amber-50 text-amber-700',
          },
          {
            id: 'profile',
            title: 'Profil Facebook',
            subtitle: 'Mur & Certificats',
            icon: User,
            color: 'bg-blue-50 text-blue-700',
          },
          {
            id: 'my-learning',
            title: 'Mes Formations',
            subtitle: `${enrolledCourseIds.length} cours actifs`,
            icon: BookOpen,
            color: 'bg-indigo-50 text-indigo-700',
          },
          {
            id: 'tuteur',
            title: 'Tuteur AIDA',
            subtitle: 'IA 24/7 & WhatsApp',
            icon: Bot,
            color: 'bg-teal-50 text-teal-700',
          },
          {
            id: 'gamification',
            title: 'Badges & XP',
            subtitle: `${currentUser?.xp || 0} XP • Nv.${currentUser?.level || 1}`,
            icon: Trophy,
            color: 'bg-emerald-50 text-emerald-700',
          },
        ];

      case 'trainer':
        return [
          {
            id: 'course-builder',
            title: 'Créateur de Cours',
            subtitle: 'Plan + Nano Banana',
            icon: Layers,
            color: 'bg-indigo-50 text-indigo-700',
          },
          {
            id: 'progress-tracker',
            title: 'Suivi Apprenants',
            subtitle: 'Temps réel & Notes',
            icon: Users,
            color: 'bg-emerald-50 text-emerald-700',
          },
          {
            id: 'studio',
            title: 'Studio IA',
            subtitle: 'Générateur Gemini',
            icon: Sparkles,
            color: 'bg-purple-50 text-purple-700',
          },
          {
            id: 'profile',
            title: 'Mon Profil',
            subtitle: 'Mur & Réseau',
            icon: User,
            color: 'bg-blue-50 text-blue-700',
          },
          {
            id: 'tuteur',
            title: 'Assistant Pédagogique',
            subtitle: 'Aide & prompts',
            icon: Bot,
            color: 'bg-teal-50 text-teal-700',
          },
        ];

      case 'center_admin':
        return [
          {
            id: 'center-management',
            title: 'Mon Centre',
            subtitle: 'Formateurs & Campus',
            icon: Building2,
            color: 'bg-blue-50 text-blue-700',
          },
          {
            id: 'progress-tracker',
            title: 'Suivi Apprenants',
            subtitle: 'Analytiques Campus',
            icon: Users,
            color: 'bg-emerald-50 text-emerald-700',
          },
          {
            id: 'course-builder',
            title: 'Création de Cours',
            subtitle: 'Programmes & Modèles',
            icon: Layers,
            color: 'bg-indigo-50 text-indigo-700',
          },
          {
            id: 'profile',
            title: 'Profil Direction',
            subtitle: 'Équipe & Réglages',
            icon: User,
            color: 'bg-purple-50 text-purple-700',
          },
          {
            id: 'studio',
            title: 'Studio IA',
            subtitle: 'Générateur Gemini',
            icon: Sparkles,
            color: 'bg-amber-50 text-amber-700',
          },
        ];

      case 'super_admin':
        return [
          {
            id: 'center-management',
            title: 'Direction Campus',
            subtitle: 'Supervision globale',
            icon: Building2,
            color: 'bg-amber-50 text-amber-800',
          },
          {
            id: 'centers',
            title: 'Multi-Campus',
            subtitle: 'Gestion du Réseau',
            icon: Building2,
            color: 'bg-blue-50 text-blue-700',
          },
          {
            id: 'progress-tracker',
            title: 'Suivi Global',
            subtitle: 'Analytiques Réseau',
            icon: Users,
            color: 'bg-emerald-50 text-emerald-700',
          },
          {
            id: 'course-builder',
            title: 'Créateur de Cours',
            subtitle: 'Modèles Pédagogiques',
            icon: Layers,
            color: 'bg-indigo-50 text-indigo-700',
          },
          {
            id: 'permissions',
            title: 'Matrice RBAC',
            subtitle: 'Permissions & Droits',
            icon: ShieldCheck,
            color: 'bg-slate-100 text-slate-800',
          },
        ];

      default:
        return [
          {
            id: 'home',
            title: 'Accueil Découverte',
            subtitle: 'Présentation & Campus',
            icon: BookOpen,
            color: 'bg-indigo-50 text-indigo-700',
          },
          {
            id: 'catalog',
            title: 'Catalogue Certifiant',
            subtitle: `${courses.length} formations`,
            icon: Award,
            color: 'bg-emerald-50 text-emerald-700',
          },
          {
            id: 'permissions',
            title: 'Matrice Permissions',
            subtitle: 'Sécurité & Rôles',
            icon: ShieldCheck,
            color: 'bg-slate-100 text-slate-800',
          },
        ];
    }
  };

  const roleShortcuts = getRoleShortcuts();

  return (
    <div id="course-catalog-view" className="space-y-8 pb-16">
      {/* Quick Navigation Hub & Shortcuts (Strictly Role-Filtered) */}
      {onNavigate && (
        <div className="bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/80 border border-indigo-100 rounded-3xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Accès Rapide • Espace {userRole === 'learner' ? 'Apprenant' : userRole === 'trainer' ? 'Formateur' : userRole === 'center_admin' ? 'Directeur' : userRole === 'super_admin' ? 'Super Admin' : 'Visiteur'}
              </h2>
              <p className="text-xs text-slate-500">
                {userRole === 'learner'
                  ? 'Accédez directement à vos jalons, vos micro-cours animés, votre profil et vos certificats.'
                  : userRole === 'trainer'
                  ? 'Accédez à votre créateur de cours Nano Banana, au suivi des apprenants et au Studio IA.'
                  : userRole === 'center_admin' || userRole === 'super_admin'
                  ? 'Supervisez vos campus, formateurs, cours et suivi analytique en temps réel.'
                  : 'Découvrez notre catalogue de formations certifiantes et programmes officiels.'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-white rounded-full border border-indigo-100 text-indigo-700 shadow-2xs self-start sm:self-auto">
              <span>{courses.length} formations certifiantes</span>
            </span>
          </div>

          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${Math.min(roleShortcuts.length, 5)} gap-2.5`}>
            {roleShortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <button
                  key={shortcut.id}
                  onClick={() => onNavigate(shortcut.id)}
                  className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-xs transition-all text-left group"
                >
                  <div className={`w-8 h-8 rounded-xl ${shortcut.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600">{shortcut.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{shortcut.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured Masterclass Hero Banner */}
      {featuredCourse && !searchQuery && selectedCategory === 'all' && (
        <div
          id="featured-hero-banner"
          className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm"
        >
          {/* Subtle Accent Background Graphic */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-50/50 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Masterclass Vedette
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {featuredCourse.level}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600" />
                  Certificat Automatisé
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {featuredCourse.title}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base line-clamp-3 leading-relaxed">
                {featuredCourse.description}
              </p>

              {/* Author & Stats bar */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <img
                    src={featuredCourse.authorAvatar}
                    alt={featuredCourse.authorName}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">{featuredCourse.authorName}</span>
                    <span className="text-[11px] text-slate-500">{featuredCourse.authorRole}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{featuredCourse.rating}</span>
                  <span className="text-slate-500 text-xs font-normal">({featuredCourse.reviewCount} avis)</span>
                </div>

                <div className="flex items-center gap-1 text-slate-600">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>{featuredCourse.studentCount} inscrits</span>
                </div>

                <div className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>{featuredCourse.durationHours}h de contenu</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="featured-start-button"
                  onClick={() => {
                    if (!enrolledCourseIds.includes(featuredCourse.id)) {
                      onEnrollCourse(featuredCourse.id);
                    }
                    onSelectCourse(featuredCourse);
                  }}
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm flex items-center gap-2 transform active:scale-95 transition-all"
                >
                  <PlayCircle className="w-5 h-5 fill-white text-indigo-600" />
                  <span>{enrolledCourseIds.includes(featuredCourse.id) ? 'Continuer la formation' : 'Commencer gratuitement'}</span>
                </button>

                <button
                  id="featured-preview-button"
                  onClick={() => setPreviewCourse(featuredCourse)}
                  className="px-5 py-3 rounded-xl text-sm font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-2 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-slate-500" />
                  <span>Voir le programme complet</span>
                </button>
              </div>
            </div>

            {/* Visual Thumbnail Frame */}
            <div className="lg:col-span-5 relative group">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm group-hover:border-indigo-300 transition-colors">
                <img
                  src={featuredCourse.thumbnail}
                  alt={featuredCourse.title}
                  className="w-full h-56 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-medium text-white bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20">
                      {featuredCourse.chapters.length} Modules • {featuredCourse.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)} Leçons
                    </span>
                    <span className="text-xs font-bold text-emerald-300 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-emerald-400/30">
                      +350 XP Récompense
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills & Filters Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Catalogue des Formations Certifiantes</span>
              <span className="text-xs font-semibold text-slate-600 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                {filteredCourses.length} disponibles
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Programmes conçus selon les standards de l'industrie, enrichis par tuteur IA et validés par les centres partenaires.
            </p>
          </div>

          {/* Quick Studio Trigger for Trainers & Centers (Guarded by Permission) */}
          {canAccessStudio && (
            <button
              id="catalog-open-studio-btn"
              onClick={onOpenStudio}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Créer un cours par IA (Studio)</span>
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`filter-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Level Filters */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-600 font-medium">Niveau :</span>
            {['all', 'Débutant', 'Intermédiaire', 'Avancé', 'Tous niveaux'].map((lvl) => (
              <button
                key={lvl}
                id={`filter-level-${lvl}`}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'all' ? 'Tous' : lvl}
              </button>
            ))}
          </div>

          <div className="text-slate-500 hidden sm:block">
            Centre : <strong className="text-slate-800">{activeCenter.name}</strong>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);

          return (
            <div
              key={course.id}
              id={`course-card-${course.id}`}
              className="group flex flex-col rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Thumbnail Header */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                {/* Badges on Thumbnail */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 backdrop-blur text-slate-800 border border-slate-200 shadow-xs uppercase">
                    {course.level}
                  </span>
                  {course.isNew && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white uppercase shadow-xs">
                      Nouveau
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/95 backdrop-blur text-amber-700 border border-amber-200 shadow-xs flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-600" />
                    Certifié
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-medium">
                  <span className="flex items-center gap-1 bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded text-[11px]">
                    <Clock className="w-3 h-3 text-teal-400" />
                    {course.durationHours}h
                  </span>
                  <span className="flex items-center gap-1 bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] text-amber-300 font-bold">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    {course.rating} ({course.reviewCount})
                  </span>
                </div>
              </div>

              {/* Course Info Body */}
              <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Center name */}
                  <div className="text-[11px] text-indigo-600 font-semibold truncate">
                    {course.centerName || activeCenter.name}
                  </div>

                  <h3
                    onClick={() => setPreviewCourse(course)}
                    className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
                  >
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.shortDescription}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {course.skillsGained.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {course.skillsGained.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                        +{course.skillsGained.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Trainer & Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={course.authorAvatar}
                      alt={course.authorName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div className="leading-tight">
                      <span className="text-xs font-semibold text-slate-800 block truncate max-w-[120px]">
                        {course.authorName}
                      </span>
                      <span className="text-[10px] text-slate-500">{totalLessons} leçons</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onEditCourse && hasPermission(userRole, 'create_and_publish_course') && (
                      <button
                        id={`course-edit-btn-${course.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditCourse(course);
                        }}
                        title="Éditer la formation (MasterStudy & Elementor)"
                        className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:text-purple-900 hover:bg-purple-100 border border-purple-200 transition-colors text-xs flex items-center gap-1 font-bold"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Éditer</span>
                      </button>
                    )}

                    <button
                      id={`course-preview-btn-${course.id}`}
                      onClick={() => setPreviewCourse(course)}
                      title="Aperçu rapide du programme"
                      className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors text-xs"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>

                    <button
                      id={`course-action-btn-${course.id}`}
                      onClick={() => {
                        if (!isEnrolled) onEnrollCourse(course.id);
                        onSelectCourse(course);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isEnrolled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 font-semibold shadow-xs'
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Reprendre</span>
                        </>
                      ) : (
                        <>
                          <span>Suivre</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Detail Modal */}
      {previewCourse && (
        <div
          id="course-preview-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setPreviewCourse(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            >
              ✕
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {previewCourse.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-500">• {previewCourse.durationHours} heures</span>
                <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {previewCourse.rating} ({previewCourse.reviewCount} avis)
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900">{previewCourse.title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{previewCourse.description}</p>
            </div>

            {/* Author details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
              <img
                src={previewCourse.authorAvatar}
                alt={previewCourse.authorName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <span className="text-sm font-bold text-slate-900 block">{previewCourse.authorName}</span>
                <span className="text-xs text-slate-500 block">{previewCourse.authorRole}</span>
                <span className="text-[11px] text-indigo-600 font-semibold mt-0.5 block">{previewCourse.centerName}</span>
              </div>
            </div>

            {/* Skills & Curriculum */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Compétences acquises :
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {previewCourse.skillsGained.map((sk, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{sk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chapters breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Structure du programme ({previewCourse.chapters.length} Modules) :
              </h4>
              <div className="space-y-2">
                {previewCourse.chapters.map((ch, idx) => (
                  <div key={ch.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                      <span>{ch.title}</span>
                      <span className="text-slate-500 font-normal">{ch.lessons.length} leçons</span>
                    </div>
                    <div className="space-y-1 pl-2 border-l border-slate-200">
                      {ch.lessons.map((les) => (
                        <div key={les.id} className="flex items-center justify-between text-[11px] text-slate-600 py-0.5">
                          <span className="flex items-center gap-1.5">
                            <PlayCircle className="w-3 h-3 text-indigo-600" />
                            {les.title}
                          </span>
                          <span className="text-slate-400">{les.durationMinutes} min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Inclut Certificat Officiel & Tuteur IA AIDA</span>
              </div>

              <div className="flex items-center gap-2">
                {onEditCourse && hasPermission(userRole, 'create_and_publish_course') && (
                  <button
                    type="button"
                    onClick={() => {
                      const c = previewCourse;
                      setPreviewCourse(null);
                      onEditCourse(c);
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center gap-1.5"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Éditer la Formation</span>
                  </button>
                )}

                <button
                  id="modal-start-course-btn"
                  onClick={() => {
                    if (!enrolledCourseIds.includes(previewCourse.id)) {
                      onEnrollCourse(previewCourse.id);
                    }
                    onSelectCourse(previewCourse);
                    setPreviewCourse(null);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  {enrolledCourseIds.includes(previewCourse.id) ? 'Ouvrir le cours' : "S'inscrire et démarrer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
