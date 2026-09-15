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
  type: 'pdf' | 'github' | 'link' | 'dataset' | 'slides' | 'code' | 'pptx' | 'image';
  url: string;
  fileSize?: string;
  size?: string;
  description?: string;
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
  quizScores?: Record<string, number>; // quizId or courseId -> score percentage
  unlockedBadgeIds: string[];
  earnedCertificates: EarnedCertificate[];
  paidCourseIds?: string[]; // Courses individually unlocked/purchased
  paidLessonIds?: string[]; // Specific premium lessons individually unlocked
  subscription?: {
    plan: 'starter' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'expired';
    validUntil?: string;
  };
  subscriptionPlan?: 'starter' | 'pro' | 'enterprise' | 'none';
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
  mediaType?: 'image' | 'video' | 'document' | 'link';
  mediaName?: string;
  mediaSize?: string;
  feeling?: string;
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
  courseId?: string;
  courseTitle?: string;
  relationshipType?: 'teacher' | 'peer_learner' | 'enrolled_student' | 'co_trainer';
}

export interface CourseChatMessage {
  id: string;
  courseId: string;
  courseTitle: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: UserRole;
  recipientId?: string;
  recipientName?: string;
  message: string;
  timestamp: string;
  isDirectToTeacher: boolean;
  isPinned?: boolean;
  codeSnippet?: string;
  attachmentName?: string;
  likes?: number;
  isLiked?: boolean;
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

export type AnimakerCharacterPose =
  | 'explaining'
  | 'pointing'
  | 'thinking'
  | 'waving'
  | 'coding'
  | 'celebrating'
  | 'warning'
  | 'presenting'
  | 'alert_danger'
  | 'hands_open'
  | 'thumbs_up'
  | 'cross_arms';

export type AnimakerSceneBackground =
  | 'factory_floor'
  | 'warehouse'
  | 'construction_site'
  | 'industrial_lab'
  | 'tech_classroom'
  | 'ai_lab'
  | 'modern_office'
  | 'cloud_datacenter'
  | 'hacker_terminal'
  | 'startup_hub'
  | 'whiteboard_studio';

export interface AnimakerBoardCard {
  icon?: string;
  iconName?: string;
  title: string;
  subtitle?: string;
  category?: string;
  color?: string;
}

export interface AnimakerGridItem {
  icon?: string;
  iconName?: string;
  image?: string;
  title: string;
  desc: string;
  badge?: string;
}

export interface AnimakerNumberedStep {
  stepNumber: number;
  title: string;
  desc: string;
  icon?: string;
  image?: string;
}

export interface AnimakerBoardContent {
  type:
    | 'bullet_points'
    | 'code'
    | 'diagram'
    | 'quote'
    | 'stat_card'
    | 'three_cards'
    | 'four_grid'
    | 'correct_incorrect'
    | 'numbered_steps'
    | 'danger_alert'
    | 'title_intro';
  title: string;
  items?: string[];
  codeSnippet?: string;
  codeLanguage?: string;
  highlightText?: string;
  // Specialized cards & video layouts as in industrial training & Animaker videos
  cards?: AnimakerBoardCard[];
  gridItems?: AnimakerGridItem[];
  steps?: AnimakerNumberedStep[];
  // Correct vs Incorrect comparison
  correctTitle?: string;
  correctDesc?: string;
  correctItems?: string[];
  correctPoints?: string[];
  correctImage?: string;
  incorrectTitle?: string;
  incorrectDesc?: string;
  incorrectItems?: string[];
  incorrectPoints?: string[];
  incorrectImage?: string;
  // Danger / Safety Alert
  alertTitle?: string;
  alertMessage?: string;
  dangerBannerText?: string;
  requiredActions?: string[];
  prohibitedActions?: string[];
  rules?: { text: string; isCorrect: boolean }[];
  warningLevel?: 'critical' | 'warning' | 'mandatory';
  // Title Intro
  badgeText?: string;
  companyName?: string;
  subtitle?: string;
}

export interface AnimakerScene {
  id: string;
  title: string;
  characterId: string;
  characterName: string;
  characterAvatar: string;
  pose: AnimakerCharacterPose;
  dialogueText: string;
  background: AnimakerSceneBackground;
  characterLayout?: 'left' | 'center' | 'right' | 'split' | 'fullscreen_avatar' | 'fullscreen_board' | 'corner_pip';
  cameraShot?: 'wide' | 'medium' | 'close_up' | 'pan_right' | 'pan_left';
  boardContent?: AnimakerBoardContent;
  keyTakeaway?: string;
  miniQuiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  durationSeconds: number;
}

export interface AnimakerLesson {
  id: string;
  title: string;
  topic: string;
  targetAudience?: string;
  leadCharacterName: string;
  leadCharacterAvatar: string;
  totalDurationSeconds: number;
  scenes: AnimakerScene[];
}

// -------------------------------------------------------------
// LOGICIEL DE MONTAGE VIDÉO & MULTIMÉDIA PÉDAGOGIQUE (NLE TIMELINE)
// -------------------------------------------------------------
export type VideoTrackType = 'video' | 'avatar' | 'overlay_text' | 'audio' | 'voiceover' | 'interactive';

export interface TimelineClipTransform {
  x: number; // percentage (-50 to 50 or 0 to 100)
  y: number;
  scale: number; // 0.2 to 2.0 (1 = 100%)
  opacity: number; // 0 to 1
  rotation?: number; // degrees
  pipPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'fullscreen';
  chromaKey?: boolean;
}

export interface TimelineClip {
  id: string;
  trackId: string;
  title: string;
  type:
    | 'video'
    | 'b_roll'
    | 'screen_recording'
    | 'avatar'
    | 'title_text'
    | 'lower_third'
    | 'code_snippet'
    | 'voiceover'
    | 'music'
    | 'sound_effect'
    | 'interactive_quiz';
  startSeconds: number;
  durationSeconds: number;
  sourceUrl?: string;
  thumbnail?: string;
  color?: string;
  volume?: number; // 0 - 100
  fadeIn?: number; // in seconds
  fadeOut?: number; // in seconds
  playbackRate?: number;
  transform?: TimelineClipTransform;
  textContent?: string;
  textSubtitle?: string;
  textStyle?: {
    fontSize?: 'small' | 'medium' | 'large' | 'title';
    textColor?: string;
    bgColor?: string;
    animation?: 'fade' | 'slide-up' | 'pop' | 'typewriter';
    position?: 'lower-third' | 'center-title' | 'top-banner' | 'side-callout';
    bubbleStyle?: 'speech' | 'thought' | 'comic_badge' | 'standard';
    comicBadge?: 'eureka' | 'warning' | 'tip' | 'bam' | 'question';
  };
  codeContent?: {
    code: string;
    language: string;
    highlightLines?: number[];
  };
  voiceoverData?: {
    characterId: string;
    characterName: string;
    characterAvatar: string;
    speechText: string;
    voiceTone?: string;
  };
  quizData?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  transition?: {
    type: 'cut' | 'crossfade' | 'slide-left' | 'slide-right' | 'fade-to-black' | 'zoom-in';
    durationSeconds: number;
  };
}

export interface TimelineTrack {
  id: string;
  name: string;
  type: VideoTrackType;
  label: string;
  color: string;
  isMuted?: boolean;
  isLocked?: boolean;
  isHidden?: boolean;
  height?: number;
}

export interface CourseVideoProject {
  id: string;
  title: string;
  topic: string;
  description?: string;
  targetAudience?: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  resolution: '1080p' | '720p' | '4k';
  fps: 30 | 60;
  totalDurationSeconds: number;
  tracks: TimelineTrack[];
  clips: TimelineClip[];
  markers?: { id: string; timeSeconds: number; label: string; color?: string }[];
  thumbnailUrl?: string;
  leadCharacterName?: string;
  leadCharacterAvatar?: string;
  styleTheme?: 'cartoon_animated' | 'whiteboard' | 'comic_strip' | 'realistic';
  theme?: string;
  authorName?: string;
  authorAvatar?: string;
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
  | 'presentation'
  | 'nano_banana'
  | 'animaker_lesson'
  | 'video_timeline'
  | 'quiz'
  | 'resources'
  | 'divider';

export interface PresentationSlide {
  title: string;
  content: string;
  imageUrl?: string;
  speakerNotes?: string;
}

export interface PresentationData {
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  format?: 'pptx' | 'ppt' | 'pdf' | 'embed';
  embedUrl?: string;
  slideCount?: number;
  slides?: PresentationSlide[];
}

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
  imageSize?: 'small' | 'medium' | 'full';
  imageAlign?: 'left' | 'center' | 'right';
  presentationData?: PresentationData;
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
  animakerData?: AnimakerLesson;
  videoProjectData?: CourseVideoProject;
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
  type: 'video' | 'article' | 'interactive_code' | 'exercise' | 'animated_nano_banana' | 'animaker_animated' | 'video_project' | 'presentation';
  videoUrl?: string;
  content: string; // Markdown or rich text
  codeStarter?: string;
  codeSolution?: string;
  codeLanguage?: string;
  resources?: LessonResource[];
  quizId?: string;
  nanoBananaData?: NanoBananaLesson;
  animakerData?: AnimakerLesson;
  videoProjectData?: CourseVideoProject;
  presentationData?: PresentationData;
  blocks?: ElementorBlock[];
  summary?: string;
  prerequisites?: string[];
  allowPreview?: boolean;
  requiredQuizScore?: number; // Passing score percentage required on checkpoint quiz (e.g. 75 or 80)
  requiresPayment?: boolean; // Strictly requires course fee payment or individual lesson unlock
  lessonPrice?: number; // Optional single-lesson purchase price (e.g. $5 USD)
  isPremiumLocked?: boolean; // Locked specifically behind single payment or subscription
  prerequisiteQuizId?: string; // Specific quiz ID required to unlock this lesson
  prerequisiteQuizTitle?: string; // Title of quiz prerequisite
  requiresSubscription?: boolean; // Available only to active subscribers
  checkpointQuiz?: Quiz;
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
  checkpointQuiz?: Quiz;
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
  originalPrice?: number;
  pricingType?: 'free' | 'paid' | 'subscription';
  subscriptionPlanRequired?: 'starter' | 'pro' | 'enterprise' | 'all';
  requiresLogin?: boolean; // Strictly requires login/account even if browsing
  prerequisiteQuizId?: string; // Admission or preparatory quiz required to access course
  prerequisiteQuizTitle?: string;
  prerequisiteQuizMinScore?: number; // Minimum passing percentage required (e.g. 80%)
  prerequisiteQuiz?: Quiz; // Full quiz definition for admission testing
  isFeatured?: boolean;
  isNew?: boolean;
  hasCertificate: boolean;
  tags: string[];
  chapters: Chapter[];
  finalQuiz?: Quiz;
  skillsGained: string[];
  courseMaterials?: LessonResource[];
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

// Payment Aggregator & Subscription Types
export type PaymentGatewayId =
  | 'mpesa'
  | 'airtel_money'
  | 'afrimoney'
  | 'orange_money'
  | 'stripe'
  | 'maxicash'
  | 'cinetpay'
  | 'wave'
  | 'mtn_momo'
  | 'paypal'
  | 'paystack'
  | 'flutterwave';

export interface PaymentGatewayConfig {
  id: PaymentGatewayId;
  name: string;
  providerType: 'card' | 'mobile_money' | 'wallet' | 'aggregator';
  isEnabled: boolean;
  isTestMode: boolean;
  publicKey: string;
  secretKey: string;
  webhookSecret?: string;
  merchantId?: string;
  supportedCurrencies: string[];
  icon: string;
  description: string;
  regions: string[];
  additionalSettings?: Record<string, string>;
}

export interface CourseOrder {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  unlockedLessonId?: string;
  lessonTitle?: string;
  amountUSD: number;
  paidAmount: number;
  paidCurrency: string;
  gateway: PaymentGatewayId;
  paymentType: 'one_time' | 'subscription';
  subscriptionPlanId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionReference: string;
  createdAt: string;
  receiptNumber: string;
  payerPhoneOrAccount?: string;
}

export interface PaymentSubscriptionPlan {
  id: string;
  name: string;
  code: 'monthly_pass' | 'annual_pass' | 'enterprise_pass';
  priceUSD: number;
  billingPeriod: 'month' | 'year';
  description: string;
  features: string[];
  isPopular?: boolean;
  activeSubscribersCount: number;
}

