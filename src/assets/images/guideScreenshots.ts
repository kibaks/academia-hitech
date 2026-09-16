import homeImg from './real_home.jpg';
import catalogImg from './real_catalog.jpg';
import playerImg from './real_player.jpg';
import quizImg from './real_quiz.jpg';
import certImg from './real_certificate.jpg';
import tutorImg from './real_tutor.jpg';
import whatsappImg from './real_whatsapp.jpg';
import studioImg from './real_studio.jpg';
import curriculumImg from './real_curriculum_builder.jpg';
import trackerImg from './real_progress_tracker.jpg';
import gamificationImg from './real_gamification.jpg';
import centersImg from './real_center_management.jpg';
import permissionsImg from './real_permissions.jpg';
import currenciesImg from './real_admin_currency.jpg';

export interface GuideScreenshotItem {
  id: string;
  category: 'core' | 'learner' | 'trainer' | 'admin';
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  highlights: string[];
  explanationSteps: {
    step: number;
    title: string;
    description: string;
  }[];
}

export const GUIDE_SCREENSHOTS: Record<string, GuideScreenshotItem> = {
  home: {
    id: 'home',
    category: 'core',
    title: 'Scénario 1 : Page d\'Accueil & Espace Visiteur',
    subtitle: 'Portail d\'accueil institutionnel d\'Academia ITECH : présentation de la plateforme panafricaine, statistiques en direct et sélection des campus.',
    image: homeImg,
    badge: 'Portail Public • Découverte',
    highlights: [
      'Présentation des programmes phares (IA, Cloud, Cybersécurité, Développement)',
      'Statistiques consolidées en direct : apprenants certifiés, taux de complétion et campus régionaux',
      'Sélecteur de Campus d\'excellence (Kinshasa Silicon River, Dakar Cyber Hub, etc.)',
      'Accès rapide à la vérification des diplômes publics et au mode Démo 1-Clic'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Exploration de l\'Académie',
        description: 'Tout visiteur peut parcourir la page d\'accueil pour découvrir les parcours certifiants, les formateurs d\'élite et les centres partenaires.'
      },
      {
        step: 2,
        title: 'Sélection d\'un Campus Régional',
        description: 'Choisissez votre campus dans le sélecteur supérieur pour adapter les cours et les devises de paiement locales.'
      },
      {
        step: 3,
        title: 'Connexion ou Inscription Gratuite',
        description: 'Cliquez sur « Connexion » ou activez « Démo 1-Clic » pour tester la plateforme instantanément sans formulaire préalable.'
      }
    ]
  },
  permissions: {
    id: 'permissions',
    category: 'core',
    title: 'Scénario 2 : Matrice des Rôles & Sécurité RBAC',
    subtitle: 'Audit en direct du contrôle d\'accès basé sur les rôles (RBAC) pour les 5 profils de l\'académie.',
    image: permissionsImg,
    badge: 'Sécurité & Gouvernance • RBAC',
    highlights: [
      '5 Rôles étanches : Visiteur, Apprenant, Formateur, Directeur de Centre, Super Admin',
      'Tableau d\'audit granulaire des privilèges (lecture, certification, publication, finances)',
      'Bascule instantanée de profil pour tester l\'interface sous la perspective de chaque utilisateur',
      'Protection stricte des données et isolation multi-tenant par centre académique'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Consultation des Prérogatives',
        description: 'Vérifiez la liste exacte des actions autorisées pour chaque statut avant d\'attribuer des rôles aux collaborateurs.'
      },
      {
        step: 2,
        title: 'Simulation de Rôle en Direct',
        description: 'Cliquez sur un rôle dans la barre d\'en-tête pour basculer instantanément l\'interface et tester l\'expérience utilisateur.'
      },
      {
        step: 3,
        title: 'Audit de Conformité Pédagogique',
        description: 'Vérifiez que les formateurs ne peuvent modifier que leurs propres cours et que seuls les directeurs gèrent les finances.'
      }
    ]
  },
  catalog: {
    id: 'catalog',
    category: 'learner',
    title: 'Scénario 3 : Catalogue des Formations & Devises',
    subtitle: 'Moteur de recherche multicritères, filtrage par spécialité technologique et affichage transparent des prix en USD et Franc Congolais (FC).',
    image: catalogImg,
    badge: 'Catalogue • Inscription 1-Clic',
    highlights: [
      'Filtres thématiques réactifs : Intelligence Artificielle, Cloud, Cybersécurité, Fullstack',
      'Affichage bidevise instantané : USD ($) et Franc Congolais (FC) avec convertisseur dynamique',
      'Cartes de cours détaillées : durée en heures, niveau requis, instructeur et badge de certification',
      'Bouton d\'inscription immédiate ou déverrouillage via points d\'expérience ITECH Coins'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Recherche & Filtrage Thématique',
        description: 'Utilisez les badges de compétences (IA, Cloud, etc.) ou saisissez un mot-clé dans la barre de recherche pour cibler une formation.'
      },
      {
        step: 2,
        title: 'Choix de la Devise de Paiement',
        description: 'Basculez entre Dollar américain (USD) et Franc Congolais (FC) dans l\'en-tête pour visualiser les tarifs locaux.'
      },
      {
        step: 3,
        title: 'Démarrage du Programme',
        description: 'Cliquez sur « Commencer » ou « Débloquer » pour être inscrit automatiquement et basculer directement dans le lecteur multimédia.'
      }
    ]
  },
  player: {
    id: 'player',
    category: 'learner',
    title: 'Scénario 4 : Lecteur de Cours & Console Interactive',
    subtitle: 'Espace d\'apprentissage multimédia haute définition avec chapitrage séquentiel, ressources téléchargeables et terminal de code.',
    image: playerImg,
    badge: 'Lecteur E-learning • Mode Pratique',
    highlights: [
      'Lecteur vidéo HD avec cadencement ajustable (0.75x à 2.0x) et mode plein écran',
      'Volet de chapitrage synchronisé avec coches d\'avancement en temps réel',
      'Console de pratique intégrée et onglet ressources (diapositives PDF, code source GitHub)',
      'Bouton d\'action « Marquer comme terminé (+50 XP) » avec synchronisation cloud Firebase'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Suivi de la Leçon Multimédia',
        description: 'Visionnez la vidéo pédagogique et consultez les notes de cours fournies par l\'instructeur certifié.'
      },
      {
        step: 2,
        title: 'Pratique & Téléchargement des Supports',
        description: 'Ouvrez le panneau des ressources complémentaires pour récupérer les diapositives PDF et exécuter les exercices de code.'
      },
      {
        step: 3,
        title: 'Validation & Gain d\'Expérience XP',
        description: 'Cliquez sur « Marquer comme terminé » : votre progression est enregistrée et 50 XP sont crédités sur votre profil.'
      }
    ]
  },
  quiz: {
    id: 'quiz',
    category: 'learner',
    title: 'Scénario 5 : Évaluation Certificative & Quiz QCM',
    subtitle: 'Interface d\'examen officiel avec chronomètre, questions à choix multiples, feedback pédagogique et seuil d\'admissibilité à 80%.',
    image: quizImg,
    badge: 'Évaluation Certifiante • Examen',
    highlights: [
      'Chronomètre officiel dégressif garantissant l\'équité des épreuves',
      'Questions techniques conçues par les formateurs ou générées par l\'IA Gemini',
      'Calcul instantané de la note sur 100% avec explications détaillées des erreurs',
      'Déblocage immédiat du certificat officiel avec mention d\'honneur dès 80% de réussite'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Lancement du Quiz',
        description: 'Accédez au quiz de fin de chapitre ou à l\'examen final du cours depuis le lecteur multimédia.'
      },
      {
        step: 2,
        title: 'Réponse aux Questions',
        description: 'Sélectionnez vos réponses parmi les options proposées avant l\'échéance du chronomètre.'
      },
      {
        step: 3,
        title: 'Résultat & Dépassement du Seuil 80%',
        description: 'Si vous atteignez 80% ou plus, vous obtenez votre diplôme certifié avec félicitations et attribution de la mention.'
      }
    ]
  },
  certificate: {
    id: 'certificate',
    category: 'learner',
    title: 'Scénario 6 : Diplôme Officiel & QR Code Infalsifiable',
    subtitle: 'Certificat officiel haute définition avec sceau doré, identifiant de registre unique et QR Code de vérification publique.',
    image: certImg,
    badge: 'Titres & Certifications • Infalsifiable',
    highlights: [
      'Sceau doré d\'excellence institutionnelle et signatures numériques de la direction',
      'Numéro de certificat inviolable (ex: CERT-2026-IT-98214) référencé en base de données',
      'Mention honorifique attribuée selon le score (Très Bien, Bien, Assez Bien)',
      'QR Code public scannable par les recruteurs et entreprises pour vérification d\'authenticité'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Obtention après Réussite',
        description: 'Le certificat se génère automatiquement lors de la réussite du quiz final d\'un parcours certifiant.'
      },
      {
        step: 2,
        title: 'Téléchargement PDF Haute Définition',
        description: 'Cliquez sur « Télécharger le Certificat (PDF) » pour obtenir le fichier prêt pour impression A4 ou partage LinkedIn.'
      },
      {
        step: 3,
        title: 'Contrôle Public par QR Code',
        description: 'Toute personne scannant le QR code avec son téléphone arrive sur la page publique officielle validant le titulaire et la date.'
      }
    ]
  },
  gamification: {
    id: 'gamification',
    category: 'learner',
    title: 'Scénario 7 : Gamification, Niveaux XP & ITECH Coins',
    subtitle: 'Tableau de bord de motivation étudiante avec jauge d\'expérience, collection de badges d\'honneur et boutique d\'échange.',
    image: gamificationImg,
    badge: 'Gamification • Progression & Récompenses',
    highlights: [
      'Jauge d\'expérience XP et palier de rang (Novice, Développeur Pro, Architecte IA)',
      'Solde de monnaie virtuelle ITECH Coins gagnée lors des leçons et quiz réussis',
      'Boutique de récompenses : déverrouillage de masterclasses VIP et bons de réduction',
      'Leaderboard des meilleurs étudiants par campus et classement panafricain'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Accumulation des Points d\'XP',
        description: 'Complétez chaque jour des leçons (+50 XP) et réussissez des quiz (+100 XP) pour monter en niveau.'
      },
      {
        step: 2,
        title: 'Collection des Badges d\'Excellence',
        description: 'Débloquez des distinctions honorifiques : « Premier de la Classe », « Marathonien du Code », « Expert IA ».'
      },
      {
        step: 3,
        title: 'Dépense dans la Boutique ITECH Coins',
        description: 'Échangez vos jetons accumulés contre l\'accès à des cours premium sans débourser d\'argent réel.'
      }
    ]
  },
  tutor: {
    id: 'tutor',
    category: 'learner',
    title: 'Scénario 8 : Tuteur Virtuel IA & Mascotte Robot Android',
    subtitle: 'Assistant pédagogique interactif propulsé par Gemini 2.5/3, avec contextualisation automatique de la leçon en cours et synthèse vocale.',
    image: tutorImg,
    badge: 'Tuteur IA • Assistance 24h/24',
    highlights: [
      'Intelligence artificielle avancée Google Gemini entraînée sur les cours de technologie',
      'Connaissance automatique de la leçon et du chapitre actuellement étudiés par l\'élève',
      'Mascotte robot Android interactive avec voix de synthèse et animations bienveillantes',
      'Suggestions rapides de questions pour débloquer les difficultés d\'apprentissage en 1 clic'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Ouverture du Tuteur IA',
        description: 'Cliquez sur l\'onglet « Tuteur IA » dans la barre d\'en-tête ou sur le bouton d\'aide dans le lecteur de cours.'
      },
      {
        step: 2,
        title: 'Formulation d\'une Question',
        description: 'Posez votre question en langage naturel (ex: « Explique-moi la différence entre Docker et Kubernetes »).'
      },
      {
        step: 3,
        title: 'Explications Détaillées & Exemples',
        description: 'Le robot vous répond avec des analogies simples, du code commenté et des exercices pratiques d\'application.'
      }
    ]
  },
  whatsapp: {
    id: 'whatsapp',
    category: 'learner',
    title: 'Scénario 9 : Extension Omnicanale WhatsApp (+1 555-631-6001)',
    subtitle: 'Accès mobile universel aux cours et aux révisions via WhatsApp Cloud API et webhook Cloudflare Workers.',
    image: whatsappImg,
    badge: 'WhatsApp Cloud • Mobile First',
    highlights: [
      'Numéro officiel certifié : +1 555-631-6001 accessible directement sur WhatsApp',
      'Apprentissage possible sans ordinateur ni haut débit Internet depuis n\'importe quel smartphone',
      'Commandes rapides interactives : !quiz (question d\'entraînement), !cours (résumé), !aide (menu)',
      'Architecture résiliente Cloudflare Workers avec monitoring de latence et webhook sécurisé'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Enregistrement du Contact',
        description: 'Enregistrez le numéro +1 555-631-6001 dans votre carnet d\'adresses sous le nom « Academia ITECH WhatsApp ».'
      },
      {
        step: 2,
        title: 'Premier Message de Salutation',
        description: 'Ouvrez WhatsApp et envoyez « Bonjour » pour déclencher l\'accueil interactif et découvrir les cours disponibles.'
      },
      {
        step: 3,
        title: 'Révisions Mobiles Quotidiennes',
        description: 'Envoyez la commande « !quiz » pour recevoir un test d\'entraînement avec correction immédiate.'
      }
    ]
  },
  studio: {
    id: 'studio',
    category: 'trainer',
    title: 'Scénario 10 : Studio Formateur IA & Générateur de Curriculums',
    subtitle: 'Outil de productivité pour enseignants propulsé par Google Gemini : génération en 30 secondes d\'un programme complet avec chapitres et quiz.',
    image: studioImg,
    badge: 'Espace Enseignant • IA Générative',
    highlights: [
      'Génération assistée par IA Gemini : syllabus complet, objectifs pédagogiques, chapitres et leçons',
      'Personnalisation du niveau d\'expertise (Débutant, Intermédiaire, Avancé) et de la durée cible',
      'Génération automatique des quiz de contrôle et grilles d\'évaluation',
      'Publication instantanée vers le catalogue des étudiants du campus en 1 clic'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Saisie des Paramètres du Cours',
        description: 'Renseignez le sujet cible (ex: « Sécurité du Cloud AWS »), la cible étudiante et les prérequis techniques.'
      },
      {
        step: 2,
        title: 'Génération du Curriculum en 1 Clic',
        description: 'Cliquez sur « Générer avec Gemini » : en 30 secondes, la table des matières complète et structurée est produite.'
      },
      {
        step: 3,
        title: 'Revue & Publication Pédagogique',
        description: 'Ajustez les descriptifs ou ajoutez des vidéos avant de publier la formation sur le campus assigné.'
      }
    ]
  },
  curriculum: {
    id: 'curriculum',
    category: 'trainer',
    title: 'Scénario 11 : Éditeur Visuel de Curriculum & Leçons',
    subtitle: 'Constructeur de parcours d\'apprentissage inspiré de MasterStudy & Elementor : glisser-déposer, organisation modulaire et quiz.',
    image: curriculumImg,
    badge: 'Concepteur Visuel • MasterStudy Builder',
    highlights: [
      'Arborescence modulaire hiérarchique : sections, chapitres, leçons vidéo, exercices et examens',
      'Ajout direct de fichiers PDF, liens vidéo YouTube/Vimeo et supports d\'exercices',
      'Configuration des quiz de validation et barèmes de notation',
      'Prévisualisation en direct dans le lecteur de cours tel que vu par les apprenants'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Structuration des Chapitres',
        description: 'Créez les grandes étapes de la formation et ordonnez les leçons selon une progression pédagogique logique.'
      },
      {
        step: 2,
        title: 'Insertion des Médias & Liens',
        description: 'Ajoutez les URLs des vidéos explicatives et joignez les documents de cours en format PDF ou code source.'
      },
      {
        step: 3,
        title: 'Prévisualisation & Sauvegarde',
        description: 'Testez la vue étudiant avec le bouton « Prévisualiser dans le lecteur » puis enregistrez dans Firebase.'
      }
    ]
  },
  tracker: {
    id: 'tracker',
    category: 'trainer',
    title: 'Scénario 12 : Suivi de Promotion & Émargement Pédagogique',
    subtitle: 'Tableau de bord de supervision en direct pour formateurs : taux de complétion, notes d\'examens et détection des décrochages.',
    image: trackerImg,
    badge: 'Supervision Pédagogique • Émargement',
    highlights: [
      'Vue consolidée des étudiants inscrits par classe et par spécialité',
      'Indicateurs visuels de progression (pourcentages de leçons terminées en temps réel)',
      'Relevé des notes obtenues aux quiz avec alertes sur les élèves nécessitant un tutorat',
      'Historique d\'assiduité et attestation d\'émargement pour la conformité académique'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Sélection de la Promotion',
        description: 'Choisissez la formation et la cohorte d\'apprenants à superviser dans le menu déroulant.'
      },
      {
        step: 2,
        title: 'Analyse des Taux de Réussite',
        description: 'Observez les moyennes générales de la classe et les points de blocage sur certains chapitres.'
      },
      {
        step: 3,
        title: 'Intervention Pédagogique Ciblée',
        description: 'Identifiez les élèves en retard pour leur envoyer un rappel ou proposer une session de tutorat de renfort.'
      }
    ]
  },
  centers: {
    id: 'centers',
    category: 'admin',
    title: 'Scénario 13 : Direction de Centre & Administration des Campus',
    subtitle: 'Gestion globale des campus régionaux (Kinshasa, Dakar, etc.) : affectation des formateurs, quotas étudiants et KPIs financiers.',
    image: centersImg,
    badge: 'Direction de Campus • Multi-Centres',
    highlights: [
      'Supervision multi-campus avec personnalisation de marque (logo, couleurs primaires, domaine)',
      'Affectation des formateurs certifiés aux différentes filières de formation du centre',
      'Suivi des jauges d\'effectifs et abonnements (Pro, Enterprise) selon la capacité d\'accueil',
      'Tableau de bord de performance académique et financière du campus'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Configuration du Campus',
        description: 'Paramétrez l\'adresse de contact, le sous-domaine institutionnel et le quota maximal d\'étudiants admis.'
      },
      {
        step: 2,
        title: 'Gestion du Corps Enseignant',
        description: 'Assignez des formateurs experts aux modules techniques et suivez leur charge de cours.'
      },
      {
        step: 3,
        title: 'Rapports d\'Activité Mensuels',
        description: 'Générez les synthèses administratives relatives aux inscriptions, certifications délivrées et revenus.'
      }
    ]
  },
  currencies: {
    id: 'currencies',
    category: 'admin',
    title: 'Scénario 14 : Gestion Multi-Devises & Passerelles Financières',
    subtitle: 'Console d\'administration financière : cours de change en temps réel (USD, Franc Congolais FC, Euro), marges de sécurité et Mobile Money.',
    image: currenciesImg,
    badge: 'Finance & Trésorerie • Multi-Devises',
    highlights: [
      'Prise en charge native du Dollar américain (USD), Franc Congolais (FC) et Euro (EUR)',
      'Paramétrage du taux de change officiel avec marge d\'ajustement pour fluctuations monétaires',
      'Intégration prévue pour les opérateurs Mobile Money locaux (M-Pesa, Orange Money, Airtel)',
      'Historique des conversions et transparence des montants affichés aux apprenants'
    ],
    explanationSteps: [
      {
        step: 1,
        title: 'Définition du Taux Référence',
        description: 'Ajustez le taux de parité officiel USD/CDF (ex: 1 USD = 2850 FC) pour refléter le marché local.'
      },
      {
        step: 2,
        title: 'Application des Arrondis Commerciaux',
        description: 'Activez l\'arrondi aux milliers de francs congolais pour simplifier les paiements en espèces ou par téléphone.'
      },
      {
        step: 3,
        title: 'Synchronisation Immédiate',
        description: 'Enregistrez les paramètres : l\'ensemble du catalogue et des factures applique instantanément les nouveaux prix.'
      }
    ]
  }
};
