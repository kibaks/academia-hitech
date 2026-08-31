export type UserRole = 'visitor' | 'learner' | 'trainer' | 'center_admin' | 'super_admin';

export type PermissionKey =
  | 'view_landing'
  | 'view_catalog'
  | 'preview_course'
  | 'enroll_course'
  | 'access_player'
  | 'take_quiz'
  | 'earn_certificate'
  | 'access_ai_tutor'
  | 'access_gamification'
  | 'access_ai_studio'
  | 'create_and_publish_course'
  | 'manage_trainers'
  | 'edit_center_branding'
  | 'manage_subscriptions'
  | 'view_center_analytics'
  | 'manage_all_centers'
  | 'manage_permissions_matrix';

export interface PermissionDefinition {
  key: PermissionKey;
  label: string;
  category: 'Général & Découverte' | 'Apprentissage & Évaluation' | 'Création & Studio IA' | 'Administration Centre' | 'Super Gouvernance';
  description: string;
}

export interface EarnedCertificate {
  id: string;
  certificateNumber: string;
  courseId: string;
  courseTitle: string;
  learnerId: string;
  learnerName: string;
  issueDate: string;
  gradePercentage: number;
  distinction: 'Mention Très Bien' | 'Mention Bien' | 'Mention Assez Bien' | 'Succès';
  qrCodeData: string;
  trainerName: string;
  centerName: string;
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'pdf' | 'github' | 'link' | 'dataset' | 'slides' | 'code';
  url: string;
  fileSize?: string;
  size?: string;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  specialty: string;
  avatar: string;
  bio: string;
  coursesAssigned?: string[];
  rating: number;
  status: 'active' | 'pending' | 'inactive';
}

export interface Center {
  id: string;
  name: string;
  slug?: string;
  description: string;
  subdomain: string;
  customDomain?: string;
  primaryColor: string;
  contactEmail: string;
  logo: string;
  bannerImage?: string;
  subscriptionPlan: 'starter' | 'pro' | 'enterprise';
  plan?: 'starter' | 'pro' | 'enterprise';
  studentCount?: number;
  studentsCount?: number;
  trainerCount?: number;
  courseCount?: number;
  maxStudents?: number;
  trainers?: Trainer[];
  coursesOffered?: string[];
  location?: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coverPhoto?: string;
  headline?: string;
  bio?: string;
  city?: string;
  country?: string;
  phone?: string;
  website?: string;
  joinedDate?: string;
  role: UserRole;
  centerId?: string;
  centerName?: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  enrolledCourseIds: string[];
  unlockedBadgeIds: string[];
  earnedCertificates: EarnedCertificate[];
  workplaces?: { id: string; role: string; company: string; period: string; current: boolean }[];
  education?: { id: string; school: string; degree: string; year: string }[];
  socialLinks?: { github?: string; linkedin?: string; twitter?: string; portfolio?: string; whatsapp?: string; website?: string };
  skills?: string[];
  languages?: string[];
  privacySettings?: {
    profileVisibility: 'public' | 'students_only' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    allowDirectMessages: boolean;
    emailNotifications: boolean;
    whatsappAlerts: boolean;
  };
}

export interface ProfilePostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface ProfilePost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  content: string;
  type: 'status' | 'project_showcase' | 'certificate_earned' | 'code_snippet' | 'course_announcement';
  mediaUrl?: string;
  codeLanguage?: string;
  codeContent?: string;
  certificateRef?: { courseTitle: string; distinction: string; certificateNumber: string };
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  isPinned?: boolean;
  comments: ProfilePostComment[];
}

export interface NetworkConnection {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  headline: string;
  centerName: string;
  mutualCount: number;
  isFriend: boolean;
  isOnline?: boolean;
}

export interface NanoBananaScene {
  id: string;
  title: string;
  narratorText: string;
  animationType: 'neural_network' | 'code_flow' | 'cloud_deploy' | 'security_shield' | 'database_query' | 'concept_card';
  visualElement: {
    type: 'svg_diagram' | 'code_step' | 'comparison' | 'interactive_choice';
    title: string;
    description: string;
    details?: string[];
    codeBefore?: string;
    codeAfter?: string;
    highlightLines?: number[];
  };
  keyTakeaway: string;
  miniQuiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface NanoBananaLesson {
  id: string;
  title: string;
  topic: string;
  characterAvatar: string;
  characterName: string;
  totalDurationSeconds: number;
  scenes: NanoBananaScene[];
}

export type ElementorBlockType =
  | 'heading'
  | 'text'
  | 'video'
  | 'audio'
  | 'code'
  | 'callout'
  | 'accordion'
  | 'image'
  | 'nano_banana'
  | 'quiz'
  | 'resources'
  | 'divider';

export interface ElementorBlock {
  id: string;
  type: ElementorBlockType;
  title?: string;
  content?: string;
  headingLevel?: 'h1' | 'h2' | 'h3';
  videoUrl?: string;
  audioUrl?: string;
  imageUrl?: string;
  imageCaption?: string;
  codeLanguage?: string;
  codeContent?: string;
  calloutType?: 'info' | 'tip' | 'warning' | 'success';
  accordionItems?: { title: string; content: string }[];
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  resources?: LessonResource[];
  nanoBananaData?: NanoBananaLesson;
  customStyles?: {
    textAlign?: 'left' | 'center' | 'right';
    bgColor?: string;
    textColor?: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'video' | 'article' | 'interactive_code' | 'exercise' | 'animated_nano_banana';
  videoUrl?: string;
  content: string; // Markdown or rich text
  codeStarter?: string;
  codeSolution?: string;
  codeLanguage?: string;
  resources?: LessonResource[];
  quizId?: string;
  nanoBananaData?: NanoBananaLesson;
  blocks?: ElementorBlock[];
  summary?: string;
  prerequisites?: string[];
  allowPreview?: boolean;
}

export interface LearnerCourseProgress {
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  learnerAvatar: string;
  courseId: string;
  courseTitle: string;
  progressPercentage: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  quizAveragePercentage: number;
  timeSpentMinutes: number;
  lastActive: string;
  status: 'ahead' | 'on_track' | 'needs_help';
  lastCompletedLessonTitle: string;
  notes?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  passingScore: number; // e.g. 75%
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  xpReward: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: 'ia_data' | 'cybersecurity' | 'development' | 'cloud_devops' | 'business' | 'design';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux';
  thumbnail: string;
  bannerImage: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  centerId?: string;
  centerName?: string;
  durationHours: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  price: number;
  isFeatured?: boolean;
  isNew?: boolean;
  hasCertificate: boolean;
  tags: string[];
  chapters: Chapter[];
  finalQuiz?: Quiz;
  skillsGained: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'course' | 'quiz' | 'xp' | 'special';
  xpRequirement?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  costXp: number;
  category: 'coaching' | 'discount' | 'swag' | 'perk';
  icon: string;
  stock?: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  centerName: string;
  xp: number;
  level: number;
  rank: number;
  badgesCount: number;
  streakDays: number;
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor' | 'system';
  text: string;
  timestamp: string;
  codeSnippet?: string;
  suggestions?: string[];
  audioUrl?: string;
  audioDuration?: number;
  isVoiceNote?: boolean;
  transcription?: string;
  status?: 'sending' | 'transcribing' | 'done' | 'error';
  isStreaming?: boolean;
}

export interface WhatsAppSimMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  type?: 'text' | 'quiz' | 'reminder';
}

export interface TutorPersona {
  id: string;
  name: string;
  gender: 'female' | 'male';
  title: string;
  specialty: string;
  avatarUrl: string;
  badge: string;
  accentColor: string;
  voiceGenderName: string;
  defaultPitch: number;
  defaultRate: number;
  greetingMessage: string;
  systemPromptStyle: string;
  traits: string[];
}

export interface TutorLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
  speechRecognitionLang: string;
  sampleGreeting: string;
  shortPromptDirective: string;
}

export interface TutorConfig {
  personaId: string;
  speedMode: 'flash' | 'pro'; // flash <0.8s vs pro detailed
  teachingStyle: 'supportive' | 'expert' | 'coach' | 'socratic';
  voiceGender: 'female' | 'male';
  voiceName: string;
  voicePitch: number;
  voiceRate: number;
  autoSpeak: boolean;
  enableCallVideo: boolean;
  enableSpeechRecognition: boolean;
  audioLanguage: string; // e.g. 'fr-FR', 'ln-CD', 'en-US', 'sw-CD', 'es-ES'
}

export interface CallLogItem {
  id: string;
  speaker: 'user' | 'tutor';
  text: string;
  timestamp: string;
}
