import React, { useState } from 'react';
import {
  INITIAL_COURSES,
  INITIAL_CENTERS,
  INITIAL_BADGES,
  INITIAL_REWARDS,
  INITIAL_LEADERBOARD,
  INITIAL_USER_PROFILE,
  DEMO_PROFILES,
} from './data/initialData';
import {
  Course,
  Center,
  Badge,
  RewardItem,
  LeaderboardUser,
  UserProfile,
  Quiz,
  EarnedCertificate,
  UserRole,
} from './types';
import { hasPermission, ROLE_DETAILS } from './lib/permissions';

// Components
import { Preloader } from './components/common/Preloader';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { VisitorHome } from './components/home/VisitorHome';
import { AuthModal } from './components/auth/AuthModal';
import { PermissionsMatrixView } from './components/permissions/PermissionsMatrixView';
import { CourseCatalog } from './components/catalog/CourseCatalog';
import { CoursePlayer } from './components/player/CoursePlayer';
import { QuizPlayer } from './components/quiz/QuizPlayer';
import { AIContentStudio } from './components/studio/AIContentStudio';
import { VirtualTutor } from './components/tutor/VirtualTutor';
import { GamificationView } from './components/gamification/GamificationView';
import { CenterManagementView } from './components/centers/CenterManagementView';
import { LearnerDashboard } from './components/dashboard/LearnerDashboard';
import { CertificateModal } from './components/certificates/CertificateModal';
import { FacebookProfileView } from './components/profile/FacebookProfileView';
import { CourseCurriculumBuilder } from './components/teacher/CourseCurriculumBuilder';
import { LearnerProgressTracker } from './components/teacher/LearnerProgressTracker';
import { CenterDirectorManagement } from './components/centers/CenterDirectorManagement';
import { LearnerJourneyView } from './components/learner/LearnerJourneyView';
import { MobileDrawer } from './components/common/MobileDrawer';
import { Lock, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  // Preloader State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [preloaderMessage, setPreloaderMessage] = useState<string>("Initialisation de l'Académie IA & des Permissions...");

  // Mobile Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Authentication & Session States
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'demo'>('login');
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('learner');

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<string>('catalog');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data States
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [centers, setCenters] = useState<Center[]>(INITIAL_CENTERS);
  const [activeCenter, setActiveCenter] = useState<Center>(INITIAL_CENTERS[0]);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [rewards, setRewards] = useState<RewardItem[]>(INITIAL_REWARDS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);

  // User Profile & Enrolments
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([
    INITIAL_COURSES[0].id,
    INITIAL_COURSES[1].id,
  ]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([
    INITIAL_COURSES[0].chapters[0].lessons[0].id,
    INITIAL_COURSES[0].chapters[0].lessons[1].id,
  ]);

  // Active Entities for Modals & Players
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<EarnedCertificate | null>(null);
  const [tutorContextLesson, setTutorContextLesson] = useState<string>('');

  // Trigger preloader momentarily on role switch or explicit demand
  const triggerPreloader = (msg: string, callback?: () => void) => {
    setPreloaderMessage(msg);
    setIsLoading(true);
    setTimeout(() => {
      if (callback) callback();
    }, 700);
  };

  // Authentication Handlers
  const handleOpenAuth = (mode: 'login' | 'register' | 'demo' = 'login', defaultRole?: UserRole) => {
    setAuthModalMode(mode);
    if (defaultRole) setAuthDefaultRole(defaultRole);
    setShowAuthModal(true);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(user.role !== 'visitor');
    
    // Target tab based on strict role
    let nextTab = 'catalog';
    if (user.role === 'trainer') {
      nextTab = 'studio';
    } else if (user.role === 'center_admin') {
      nextTab = 'centers';
    } else if (user.role === 'visitor') {
      nextTab = 'home';
    } else {
      nextTab = 'catalog';
    }

    triggerPreloader(`Connexion en tant que ${user.name} (${ROLE_DETAILS[user.role]?.title || user.role})...`, () => {
      setActiveTab(nextTab);
    });
  };

  const handleLogout = () => {
    triggerPreloader('Déconnexion de la session...', () => {
      setIsAuthenticated(false);
      setCurrentUser({
        ...INITIAL_USER_PROFILE,
        role: 'visitor',
        name: 'Visiteur Invité',
        email: 'visiteur@academia-itech.com',
      });
      setActiveTab('home');
    });
  };

  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === 'visitor') {
      handleLogout();
      return;
    }

    const matchingProfile = DEMO_PROFILES.find((p) => p.role === newRole);
    const updated = matchingProfile || { ...currentUser, role: newRole };

    let targetTab = 'catalog';
    if (newRole === 'learner') {
      targetTab = 'learner-journey';
    } else if (newRole === 'trainer') {
      targetTab = 'course-builder';
    } else if (newRole === 'center_admin') {
      targetTab = 'center-management';
    } else if (newRole === 'super_admin') {
      targetTab = 'center-management';
    } else {
      targetTab = 'catalog';
    }

    triggerPreloader(`Bascule sur le profil ${ROLE_DETAILS[newRole]?.title}...`, () => {
      setIsAuthenticated(true);
      setCurrentUser(updated);
      setActiveTab(targetTab);
    });
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveTab('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnrollCourse = (courseId: string) => {
    if (!isAuthenticated || currentUser.role === 'visitor') {
      handleOpenAuth('register', 'learner');
      return;
    }
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds((prev) => [...prev, courseId]);
    }
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      const newCompleted = [...completedLessonIds, lessonId];
      setCompletedLessonIds(newCompleted);

      // Award XP (+50 XP) and update streak / level
      const updatedXp = currentUser.xp + 50;
      const newLevel = Math.floor(updatedXp / 500) + 1;

      setCurrentUser((prev) => ({
        ...prev,
        xp: updatedXp,
        level: Math.max(prev.level, newLevel),
      }));

      // Update leaderboard
      setLeaderboard((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, xp: updatedXp, level: newLevel } : u))
      );
    }
  };

  const handleStartQuiz = (quizId?: string) => {
    if (!isAuthenticated || currentUser.role === 'visitor') {
      handleOpenAuth('login');
      return;
    }
    if (selectedCourse?.finalQuiz) {
      setActiveQuiz(selectedCourse.finalQuiz);
    } else if (courses[0]?.finalQuiz) {
      setActiveQuiz(courses[0].finalQuiz);
    }
  };

  const handleQuizComplete = (scorePercentage: number, xpEarned: number, certificate?: EarnedCertificate) => {
    const updatedXp = currentUser.xp + xpEarned;
    const newLevel = Math.floor(updatedXp / 500) + 1;

    let updatedCerts = currentUser.earnedCertificates;
    let updatedBadgeIds = [...currentUser.unlockedBadgeIds];

    // Unlock Quiz perfection badge if 100%
    if (scorePercentage === 100 && !updatedBadgeIds.includes('badge-3')) {
      updatedBadgeIds.push('badge-3');
    }

    if (certificate) {
      updatedCerts = [certificate, ...updatedCerts];
    }

    setCurrentUser((prev) => ({
      ...prev,
      xp: updatedXp,
      level: Math.max(prev.level, newLevel),
      earnedCertificates: updatedCerts,
      unlockedBadgeIds: updatedBadgeIds,
    }));

    setLeaderboard((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, xp: updatedXp, level: newLevel } : u))
    );
  };

  const handleRedeemReward = (reward: RewardItem) => {
    if (currentUser.xp >= reward.costXp) {
      const updatedXp = currentUser.xp - reward.costXp;
      setCurrentUser((prev) => ({
        ...prev,
        xp: updatedXp,
      }));
      setLeaderboard((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, xp: updatedXp } : u))
      );
    }
  };

  const handlePublishCourseFromStudio = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    setEnrolledCourseIds((prev) => [newCourse.id, ...prev]);
    setSelectedCourse(newCourse);
    setActiveTab('player');
  };

  const handleOpenAIAssistantWithContext = (lessonTitle: string) => {
    setTutorContextLesson(lessonTitle);
    setActiveTab('tuteur');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCenter = (updatedCenter: Partial<Center>) => {
    setActiveCenter((prev) => ({ ...prev, ...updatedCenter } as Center));
    setCenters((prev) => prev.map((c) => (c.id === activeCenter.id ? { ...c, ...updatedCenter } as Center : c)));
  };

  const handleUpdateProfile = (updatedProfile: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  const enrolledCoursesList = courses.filter((c) => enrolledCourseIds.includes(c.id));

  // Render Permission Restricted Guard for unauthorized views
  const renderAccessRestricted = (requiredRole: UserRole, roleName: string) => (
    <div className="max-w-2xl mx-auto py-12 px-6 text-center space-y-6 bg-white rounded-3xl border border-slate-200 shadow-sm my-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Accès Restreint par les Permissions RBAC</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Cette section nécessite le rôle <strong>{roleName}</strong>. Votre profil actif est{' '}
          <span className="text-indigo-600 font-semibold">{ROLE_DETAILS[currentUser.role]?.title || currentUser.role}</span>.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => handleRoleChange(requiredRole)}
          className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Basculer en tant que {roleName} (Démo)</span>
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          Consulter la Matrice des Permissions
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Animated Tech Logo Preloader on startup & role transitions */}
      {isLoading && (
        <Preloader
          message={preloaderMessage}
          onFinish={() => setIsLoading(false)}
          duration={800}
        />
      )}

      {/* Clean, Non-Overflowing Sticky Header with Strict Profile Items */}
      <Header
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onSelectRole={handleRoleChange}
        centers={centers}
        activeCenter={activeCenter}
        onSelectCenter={setActiveCenter}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        onOpenCertVerifier={() => {
          if (currentUser.earnedCertificates.length > 0) {
            setActiveCertificate(currentUser.earnedCertificates[0]);
          } else {
            setActiveTab('home');
            window.scrollTo({ top: 900, behavior: 'smooth' });
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main App Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24 md:pb-12">
        {/* VIEW 0: Visitor Homepage */}
        {activeTab === 'home' && (
          <VisitorHome
            courses={courses}
            centers={centers}
            onOpenAuth={handleOpenAuth}
            onExploreCatalog={() => setActiveTab('catalog')}
            onSelectCourse={handleSelectCourse}
            onVerifyCert={() => {
              if (currentUser.earnedCertificates.length > 0) {
                setActiveCertificate(currentUser.earnedCertificates[0]);
              }
            }}
            onViewPermissions={() => setActiveTab('permissions')}
          />
        )}

        {/* VIEW 1: Catalog of Courses */}
        {activeTab === 'catalog' && (
          <CourseCatalog
            courses={courses}
            enrolledCourseIds={enrolledCourseIds}
            activeCenter={activeCenter}
            searchQuery={searchQuery}
            onSelectCourse={handleSelectCourse}
            onEnrollCourse={handleEnrollCourse}
            onOpenStudio={() => setActiveTab('studio')}
            onEditCourse={(course) => {
              setEditingCourse(course);
              setActiveTab('course-builder');
            }}
            onNavigate={setActiveTab}
            currentUser={currentUser}
          />
        )}

        {/* VIEW 2: Interactive Course Player */}
        {activeTab === 'player' && (
          <CoursePlayer
            course={selectedCourse || courses[0]}
            completedLessonIds={completedLessonIds}
            onCompleteLesson={handleCompleteLesson}
            onStartQuiz={handleStartQuiz}
            onBackToCatalog={() => setActiveTab('catalog')}
            onOpenAIAssistantWithContext={handleOpenAIAssistantWithContext}
          />
        )}

        {/* VIEW 3: AI Content Studio (Guarded by Permission: Formateur / Admin only) */}
        {activeTab === 'studio' && (
          hasPermission(currentUser.role, 'access_ai_studio') ? (
            <AIContentStudio
              centers={centers}
              activeCenter={activeCenter}
              onPublishCourse={handlePublishCourseFromStudio}
              onOpenCourse={handleSelectCourse}
            />
          ) : (
            renderAccessRestricted('trainer', 'Formateur')
          )
        )}

        {/* VIEW 4: Virtual AI Tutor (AIDA) & WhatsApp Connector */}
        {activeTab === 'tuteur' && (
          <VirtualTutor
            currentCourse={selectedCourse || courses[0]}
            currentLessonTitle={tutorContextLesson || selectedCourse?.chapters[0]?.lessons[0]?.title}
          />
        )}

        {/* VIEW 5: Gamification, Badges & Rewards */}
        {activeTab === 'gamification' && (
          <GamificationView
            currentUser={currentUser}
            badges={badges}
            rewards={rewards}
            leaderboard={leaderboard}
            activeCenter={activeCenter}
            onRedeemReward={handleRedeemReward}
          />
        )}

        {/* VIEW 6: Learner Dashboard & My Courses */}
        {(activeTab === 'dashboard' || activeTab === 'my-learning') && (
          <LearnerDashboard
            currentUser={currentUser}
            enrolledCourses={enrolledCoursesList}
            completedLessonIds={completedLessonIds}
            onSelectCourse={handleSelectCourse}
            onOpenCertificateModal={setActiveCertificate}
            onNavigateToCatalog={() => setActiveTab('catalog')}
          />
        )}

        {/* VIEW 7: Center Subscription & Trainer Management (Guarded by Permission: Direction only) */}
        {activeTab === 'centers' && (
          hasPermission(currentUser.role, 'manage_trainers') ? (
            <CenterManagementView
              activeCenter={activeCenter}
              allCenters={centers}
              courses={courses}
              onUpdateCenter={handleUpdateCenter}
              onSwitchCenter={setActiveCenter}
            />
          ) : (
            renderAccessRestricted('center_admin', 'Directeur de Centre')
          )
        )}

        {/* VIEW 8: Facebook-Style Profile & Settings Hub */}
        {activeTab === 'profile' && (
          <FacebookProfileView
            currentUser={currentUser}
            courses={courses}
            onUpdateProfile={handleUpdateProfile}
            onOpenCertificateModal={setActiveCertificate}
            onNavigateToCourse={(cId) => {
              const target = courses.find((c) => c.id === cId);
              if (target) handleSelectCourse(target);
            }}
            onOpenStudio={() => setActiveTab('course-builder')}
          />
        )}

        {/* VIEW 9: Learner Journey & Milestones */}
        {activeTab === 'learner-journey' && (
          <LearnerJourneyView
            currentUser={currentUser}
            courses={courses}
            onNavigateToCourse={(cId) => {
              const target = courses.find((c) => c.id === cId);
              if (target) handleSelectCourse(target);
            }}
            onOpenCertificateModal={setActiveCertificate}
            onOpenFacebookProfile={() => setActiveTab('profile')}
          />
        )}

        {/* VIEW 10: Teacher Course Curriculum Builder (MasterStudy & Elementor) (Guarded by Permission) */}
        {activeTab === 'course-builder' && (
          hasPermission(currentUser.role, 'create_and_publish_course') ? (
            <CourseCurriculumBuilder
              existingCourse={editingCourse}
              coursesList={courses}
              onSelectCourseToEdit={(c) => setEditingCourse(c)}
              onSaveCourse={(savedCourse) => {
                setCourses((prev) => {
                  const idx = prev.findIndex((c) => c.id === savedCourse.id);
                  if (idx >= 0) {
                    const copy = [...prev];
                    copy[idx] = savedCourse;
                    return copy;
                  }
                  return [savedCourse, ...prev];
                });
                setSelectedCourse(savedCourse);
                setEditingCourse(savedCourse);
              }}
              onPreviewInPlayer={(courseToPlay) => {
                setSelectedCourse(courseToPlay);
                setActiveTab('player');
              }}
              onCancel={() => setActiveTab('catalog')}
            />
          ) : (
            renderAccessRestricted('trainer', 'Formateur / Enseignant')
          )
        )}

        {/* VIEW 11: Real-time Learner Progress Tracker by Course (Guarded by Permission) */}
        {activeTab === 'progress-tracker' && (
          hasPermission(currentUser.role, 'view_center_analytics') ? (
            <LearnerProgressTracker courses={courses} />
          ) : (
            renderAccessRestricted('trainer', 'Formateur / Enseignant')
          )
        )}

        {/* VIEW 12: Center Director Management (Trainers & Center Configuration) (Guarded by Permission) */}
        {activeTab === 'center-management' && (
          hasPermission(currentUser.role, 'manage_trainers') ? (
            <CenterDirectorManagement
              activeCenter={activeCenter}
              courses={courses}
              onUpdateCenter={handleUpdateCenter}
            />
          ) : (
            renderAccessRestricted('center_admin', 'Directeur de Centre')
          )
        )}

        {/* VIEW 13: Permissions & RBAC Matrix Audit */}
        {activeTab === 'permissions' && (
          <PermissionsMatrixView
            currentRole={currentUser.role}
            onSelectRole={handleRoleChange}
            onOpenAuthModal={() => handleOpenAuth('demo')}
          />
        )}
      </main>

      {/* Interactive Quiz Assessment Modal Overlay */}
      {activeQuiz && (
        <QuizPlayer
          quiz={activeQuiz}
          courseTitle={selectedCourse?.title || 'Masterclass Certification ITECH'}
          currentUser={currentUser}
          onQuizComplete={handleQuizComplete}
          onClose={() => setActiveQuiz(null)}
          onOpenCertificateModal={(cert) => {
            setActiveQuiz(null);
            setActiveCertificate(cert);
          }}
        />
      )}

      {/* Official Printable Certificate Modal Overlay */}
      {activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}

      {/* Authentication & Account Creation Modal */}
      <AuthModal
        isOpen={showAuthModal}
        initialMode={authModalMode}
        defaultRole={authDefaultRole}
        centers={centers}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Mobile Smartphone Bottom Navigation with strict role filter */}
      <MobileNav
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userRole={currentUser.role}
        isAuthenticated={isAuthenticated}
        onOpenAuth={() => handleOpenAuth('login')}
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Unified Mobile Slide-out Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectRole={handleRoleChange}
        centers={centers}
        activeCenter={activeCenter}
        onSelectCenter={setActiveCenter}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenCertVerifier={() => {
          if (currentUser.earnedCertificates.length > 0) {
            setActiveCertificate(currentUser.earnedCertificates[0]);
          } else {
            setActiveTab('home');
            window.scrollTo({ top: 900, behavior: 'smooth' });
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}
