import { NetworkConnection, CourseChatMessage, UserProfile, Course } from '../types';

/**
 * Course-scoped network connections.
 * Learners see teachers of their courses + classmates enrolled in the same course.
 * Trainers see learners enrolled in their courses + fellow trainers.
 */
export const COURSE_NETWORK_DATA: NetworkConnection[] = [
  // --- FORMATION IA & LLMs (course-ia-llm) ---
  {
    id: 'net-fatou-s',
    name: 'Fatou Sow',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    headline: 'Formatrice en Chef IA & Modèles Génératifs',
    centerName: 'Dakar AI & Cyber Hub',
    mutualCount: 24,
    isFriend: true,
    isOnline: true,
    courseId: 'course-ia-llm',
    courseTitle: 'Grands Modèles de Langage (LLMs) & IA Panafricaine',
    relationshipType: 'teacher',
  },
  {
    id: 'net-oumar-ba',
    name: 'Oumar Bâ',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=300&auto=format&fit=crop&q=80',
    headline: 'Apprenant Promo IA • Ingénierie NLP Wolof & Lingala',
    centerName: 'Dakar AI & Cyber Hub',
    mutualCount: 14,
    isFriend: true,
    isOnline: true,
    courseId: 'course-ia-llm',
    courseTitle: 'Grands Modèles de Langage (LLMs) & IA Panafricaine',
    relationshipType: 'peer_learner',
  },
  {
    id: 'net-sarah-z',
    name: 'Sarah Zoumana',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
    headline: 'Apprenante Promo IA • Data Scientist & Prompt Engineer',
    centerName: 'Abidjan Fintech & Tech Lab',
    mutualCount: 11,
    isFriend: true,
    isOnline: false,
    courseId: 'course-ia-llm',
    courseTitle: 'Grands Modèles de Langage (LLMs) & IA Panafricaine',
    relationshipType: 'peer_learner',
  },
  {
    id: 'net-fatou-n',
    name: 'Fatou Ndiaye',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    headline: 'Apprenante Promo IA • Fine-tuning LoRA & Évaluation RAG',
    centerName: 'Dakar AI & Cyber Hub',
    mutualCount: 8,
    isFriend: false,
    isOnline: true,
    courseId: 'course-ia-llm',
    courseTitle: 'Grands Modèles de Langage (LLMs) & IA Panafricaine',
    relationshipType: 'peer_learner',
  },

  // --- FORMATION CLOUD & DEVOPS (course-fullstack-cloud) ---
  {
    id: 'net-landry-b',
    name: 'Dr. Landry Bakweto',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
    headline: 'Professeur & Consultant Lead Cloud Hybride & Kubernetes',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    mutualCount: 31,
    isFriend: true,
    isOnline: true,
    courseId: 'course-fullstack-cloud',
    courseTitle: 'Architectures Cloud Résilientes & DevOps en Afrique',
    relationshipType: 'teacher',
  },
  {
    id: 'net-dieudonne-k',
    name: 'Dieudonné Kasongo',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    headline: 'Apprenant Promo Cloud • DevOps Docker & Multi-cloud',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    mutualCount: 18,
    isFriend: true,
    isOnline: true,
    courseId: 'course-fullstack-cloud',
    courseTitle: 'Architectures Cloud Résilientes & DevOps en Afrique',
    relationshipType: 'peer_learner',
  },
  {
    id: 'net-koffi-a',
    name: 'Koffi Assi',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    headline: 'Apprenant Promo Cloud • Architecte Microservices Go/Rust',
    centerName: 'Abidjan Fintech & Tech Lab',
    mutualCount: 9,
    isFriend: false,
    isOnline: false,
    courseId: 'course-fullstack-cloud',
    courseTitle: 'Architectures Cloud Résilientes & DevOps en Afrique',
    relationshipType: 'peer_learner',
  },
  {
    id: 'net-grace-m',
    name: 'Grace Mukendi',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
    headline: 'Architecte Cloud AWS & GCP • Co-intervenante DevOps',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    mutualCount: 15,
    isFriend: true,
    isOnline: false,
    courseId: 'course-fullstack-cloud',
    courseTitle: 'Architectures Cloud Résilientes & DevOps en Afrique',
    relationshipType: 'co_trainer',
  },

  // --- FORMATION FINTECH & MOBILE MONEY (course-fintech-africa) ---
  {
    id: 'net-amina-d',
    name: 'Amina Diallo',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
    headline: 'Directrice R&D Fintech & Mobile Money Specialist',
    centerName: 'Abidjan Fintech & Tech Lab',
    mutualCount: 22,
    isFriend: true,
    isOnline: true,
    courseId: 'course-fintech-africa',
    courseTitle: 'Ingénierie Fintech & Systèmes Mobile Money',
    relationshipType: 'teacher',
  },
  {
    id: 'net-ibrahim-c',
    name: 'Ibrahim Cissé',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    headline: 'Apprenant Promo Fintech • Passerelles API USSD & Paiements',
    centerName: 'Abidjan Fintech & Tech Lab',
    mutualCount: 7,
    isFriend: false,
    isOnline: true,
    courseId: 'course-fintech-africa',
    courseTitle: 'Ingénierie Fintech & Systèmes Mobile Money',
    relationshipType: 'peer_learner',
  },

  // --- FORMATION CYBERSÉCURITÉ (course-cyber-sec) ---
  {
    id: 'net-malik-k',
    name: 'Malik Konaté',
    role: 'trainer',
    avatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=300&auto=format&fit=crop&q=80',
    headline: 'Consultant Lead Cybersécurité & Responsable SOC',
    centerName: 'Dakar AI & Cyber Hub',
    mutualCount: 27,
    isFriend: true,
    isOnline: false,
    courseId: 'course-cyber-sec',
    courseTitle: 'Cybersécurité Offensive, SOC & Défense Périmétrique',
    relationshipType: 'teacher',
  },
  {
    id: 'net-aissatou-t',
    name: 'Aïssatou Traoré',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    headline: 'Apprenante Promo Cyber • Pentesting & Analyse Forensique',
    centerName: 'Dakar AI & Cyber Hub',
    mutualCount: 13,
    isFriend: true,
    isOnline: true,
    courseId: 'course-cyber-sec',
    courseTitle: 'Cybersécurité Offensive, SOC & Défense Périmétrique',
    relationshipType: 'peer_learner',
  },

  // --- ÉTUDIANTS D'UN FORMATEUR (pour l'affichage côté enseignant) ---
  {
    id: 'net-amara-k',
    name: 'Amara Koné',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    headline: 'Étudiant actif • Progression 75% • Major de session',
    centerName: 'Abidjan Fintech & Tech Lab',
    mutualCount: 19,
    isFriend: true,
    isOnline: true,
    courseId: 'course-ia-llm',
    courseTitle: 'Grands Modèles de Langage (LLMs) & IA Panafricaine',
    relationshipType: 'enrolled_student',
  },
  {
    id: 'net-mamadou-t',
    name: 'Mamadou Touré',
    role: 'learner',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=300&auto=format&fit=crop&q=80',
    headline: 'Étudiant actif • Progression 65% • Projets Cloud validés',
    centerName: 'Kinshasa Silicon River & Digital Campus',
    mutualCount: 14,
    isFriend: true,
    isOnline: true,
    courseId: 'course-fullstack-cloud',
    courseTitle: 'Architectures Cloud Résilientes & DevOps en Afrique',
    relationshipType: 'enrolled_student',
  },
];

/**
 * Filter network dynamically based on active user role and their courses
 */
export function getNetworkForUser(
  currentUser: UserProfile,
  allCourses: Course[]
): NetworkConnection[] {
  const userEnrolledCourseIds = currentUser.enrolledCourseIds || ['course-ia-llm', 'course-fullstack-cloud'];

  if (currentUser.role === 'learner') {
    // A learner sees:
    // 1. Teachers of their enrolled courses
    // 2. Classmates (peer_learner) in the same enrolled courses
    return COURSE_NETWORK_DATA.filter(
      (conn) =>
        conn.id !== currentUser.id &&
        conn.courseId &&
        userEnrolledCourseIds.includes(conn.courseId) &&
        (conn.relationshipType === 'teacher' || conn.relationshipType === 'peer_learner' || conn.relationshipType === 'co_trainer')
    );
  }

  if (currentUser.role === 'trainer') {
    // A trainer sees:
    // 1. Students enrolled in their courses
    // 2. Co-trainers and fellow teachers
    return COURSE_NETWORK_DATA.filter(
      (conn) =>
        conn.id !== currentUser.id &&
        (conn.relationshipType === 'enrolled_student' ||
          conn.relationshipType === 'co_trainer' ||
          conn.role === 'trainer')
    );
  }

  // Administrators or visitors see all course connections
  return COURSE_NETWORK_DATA.filter((conn) => conn.id !== currentUser.id);
}

/**
 * Initial seeded chat conversations for courses (direct chat with teacher + forum)
 */
export const SEED_COURSE_CHAT_MESSAGES: Record<string, CourseChatMessage[]> = {
  'course-ia-llm': [
    {
      id: 'msg-ia-1',
      courseId: 'course-ia-llm',
      courseTitle: 'Grands Modèles de Langage (LLMs) & IA Panafricaine',
      senderId: 'trainer-fatou-s',
      senderName: 'Fatou Sow',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      senderRole: 'trainer',
      message: 'Bienvenue dans ce cours sur les LLMs ! N’hésitez pas à me poser vos questions ici sur le mécanisme d’attention et la tokenisation pour les langues locales.',
      timestamp: 'Hier à 14:30',
      isDirectToTeacher: true,
      recipientId: 'user-amara-k',
      recipientName: 'Amara Koné',
      likes: 3,
    },
    {
      id: 'msg-ia-2',
      courseId: 'course-ia-llm',
      courseTitle: 'Grands Modèles de Langage (LLMs) & IA Panafricaine',
      senderId: 'user-amara-k',
      senderName: 'Amara Koné',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'learner',
      message: 'Bonjour Professeure Fatou, merci ! J’ai une question sur l’exercice 1.2 : comment gérez-vous le vocabulaire BPE quand on mélange le Français et le Lingala ?',
      timestamp: 'Hier à 16:15',
      isDirectToTeacher: true,
      recipientId: 'trainer-fatou-s',
      recipientName: 'Fatou Sow',
    },
    {
      id: 'msg-ia-3',
      courseId: 'course-ia-llm',
      courseTitle: 'Grands Modèles de Langage (LLMs) & IA Panafricaine',
      senderId: 'trainer-fatou-s',
      senderName: 'Fatou Sow',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      senderRole: 'trainer',
      message: 'Excellente question Amara ! Pour les corpus multilingues d’Afrique, nous entraînons un tokenizer SentencePiece unigramme avec un ratio d’échantillonnage tempéré (alpha = 0.3) afin que le Lingala ne soit pas sous-représenté par rapport au Français. Regardez le notebook dans les ressources du module 1 !',
      timestamp: 'Hier à 17:02',
      isDirectToTeacher: true,
      recipientId: 'user-amara-k',
      recipientName: 'Amara Koné',
      codeSnippet: `import sentencepiece as spm\n# Tokenizer équilibré pour corpus multilingue\nspm.SentencePieceTrainer.train(\n    input='corpus_lingala_fr.txt',\n    model_prefix='m_african_llm',\n    vocab_size=32000,\n    character_coverage=0.9995,\n    model_type='unigram'\n)`,
      likes: 4,
    },
    // Forum messages
    {
      id: 'msg-ia-forum-1',
      courseId: 'course-ia-llm',
      courseTitle: 'Grands Modèles de Langage (LLMs) & IA Panafricaine',
      senderId: 'trainer-fatou-s',
      senderName: 'Fatou Sow',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      senderRole: 'trainer',
      message: '📢 [Annonce Officielle] La session de questions/réponses en direct aura lieu ce jeudi à 18h GMT sur la plateforme. Préparez vos notebooks pour l’atelier d’alignement DPO !',
      timestamp: 'Il y a 3 heures',
      isDirectToTeacher: false,
      isPinned: true,
      likes: 12,
    },
    {
      id: 'msg-ia-forum-2',
      courseId: 'course-ia-llm',
      courseTitle: 'Grands Modèles de Langage (LLMs) & IA Panafricaine',
      senderId: 'net-oumar-ba',
      senderName: 'Oumar Bâ',
      senderAvatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=300&auto=format&fit=crop&q=80',
      senderRole: 'learner',
      message: 'Bonjour à tous ! Est-ce que quelqu’un a testé la quantification 4-bit avec bitsandbytes sur Google Colab gratuit ? Ça passe sans OOM ?',
      timestamp: 'Il y a 1 heure',
      isDirectToTeacher: false,
      likes: 5,
    },
    {
      id: 'msg-ia-forum-3',
      courseId: 'course-ia-llm',
      courseTitle: 'Grands Modèles de Langage (LLMs) & IA Panafricaine',
      senderId: 'net-sarah-z',
      senderName: 'Sarah Zoumana',
      senderAvatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
      senderRole: 'learner',
      message: 'Oui @Oumar ! Avec Llama-3-8B-Instruct et load_in_4bit=True, ça consomme environ 5.8 Go de VRAM, donc parfait sur le T4 de Colab.',
      timestamp: 'Il y a 40 minutes',
      isDirectToTeacher: false,
      likes: 7,
    },
  ],

  'course-fullstack-cloud': [
    {
      id: 'msg-cloud-1',
      courseId: 'course-fullstack-cloud',
      courseTitle: 'Architectures Cloud Résilientes & DevOps en Afrique',
      senderId: 'trainer-landry-b',
      senderName: 'Dr. Landry Bakweto',
      senderAvatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
      senderRole: 'trainer',
      message: 'Bonjour ! Je suis Dr. Bakweto. Pour vos architectures distribuées, privilégiez toujours la mise en cache locale et les replicas multi-régions Dakar/Kinshasa/Johannesburg pour amortir la latence.',
      timestamp: 'Hier à 10:10',
      isDirectToTeacher: true,
      recipientId: 'user-amara-k',
      recipientName: 'Amara Koné',
      likes: 2,
    },
    {
      id: 'msg-cloud-2',
      courseId: 'course-fullstack-cloud',
      courseTitle: 'Architectures Cloud Résilientes & DevOps en Afrique',
      senderId: 'user-amara-k',
      senderName: 'Amara Koné',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      senderRole: 'learner',
      message: 'Bonjour Dr. Bakweto, j’ai configuré le cluster Kubernetes avec ingress-nginx. Comment gérer les coupures réseau temporaires sur notre nœud edge ?',
      timestamp: 'Hier à 11:35',
      isDirectToTeacher: true,
      recipientId: 'trainer-landry-b',
      recipientName: 'Dr. Landry Bakweto',
    },
    {
      id: 'msg-cloud-3',
      courseId: 'course-fullstack-cloud',
      courseTitle: 'Architectures Cloud Résilientes & DevOps en Afrique',
      senderId: 'trainer-landry-b',
      senderName: 'Dr. Landry Bakweto',
      senderAvatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
      senderRole: 'trainer',
      message: 'Utilisez K3s avec KubeEdge ! Il embarque un stockage local SQLite sur chaque nœud afin que les pods continuent à tourner même sans connexion au plan de contrôle central.',
      timestamp: 'Hier à 12:00',
      isDirectToTeacher: true,
      recipientId: 'user-amara-k',
      recipientName: 'Amara Koné',
      likes: 6,
    },
    // Forum messages
    {
      id: 'msg-cloud-forum-1',
      courseId: 'course-fullstack-cloud',
      courseTitle: 'Architectures Cloud Résilientes & DevOps en Afrique',
      senderId: 'trainer-landry-b',
      senderName: 'Dr. Landry Bakweto',
      senderAvatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
      senderRole: 'trainer',
      message: '💡 Astuce de la semaine : Pour vos pipelines CI/CD GitHub Actions vers les serveurs en RDC, activez les runners self-hosted locaux pour éviter les transferts lourds outre-mer.',
      timestamp: 'Hier à 15:45',
      isDirectToTeacher: false,
      isPinned: true,
      likes: 8,
    },
  ],

  'course-fintech-africa': [
    {
      id: 'msg-fin-1',
      courseId: 'course-fintech-africa',
      courseTitle: 'Ingénierie Fintech & Systèmes Mobile Money',
      senderId: 'trainer-amina-d',
      senderName: 'Amina Diallo',
      senderAvatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=300&auto=format&fit=crop&q=80',
      senderRole: 'trainer',
      message: 'Bienvenue dans la spécialisation Fintech ! Ce canal direct vous permet de me soumettre vos schémas d’architecture de paiement Orange Money / Wave / MTN Momo.',
      timestamp: 'Lundi à 09:20',
      isDirectToTeacher: true,
      recipientId: 'user-amara-k',
      recipientName: 'Amara Koné',
      likes: 4,
    },
  ],

  'course-cyber-sec': [
    {
      id: 'msg-sec-1',
      courseId: 'course-cyber-sec',
      courseTitle: 'Cybersécurité Offensive, SOC & Défense Périmétrique',
      senderId: 'trainer-malik-k',
      senderName: 'Malik Konaté',
      senderAvatar: 'https://images.unsplash.com/photo-1507152832244-10d45c7eda57?w=300&auto=format&fit=crop&q=80',
      senderRole: 'trainer',
      message: 'Attention aux règles d’engagement sur nos labos Wazuh et Suricata. Aucun scan externe sans autorisation préalable signée !',
      timestamp: 'Mardi à 11:00',
      isDirectToTeacher: true,
      recipientId: 'user-amara-k',
      recipientName: 'Amara Koné',
      likes: 5,
    },
  ],
};
