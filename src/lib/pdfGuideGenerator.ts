import { jsPDF } from 'jspdf';

// Fallback image asset imports in Vite
import homeImg from '../assets/images/real_home.jpg';
import permissionsImg from '../assets/images/real_permissions.jpg';
import catalogImg from '../assets/images/real_catalog.jpg';
import playerImg from '../assets/images/real_player.jpg';
import quizImg from '../assets/images/real_quiz.jpg';
import certImg from '../assets/images/real_certificate.jpg';
import gamificationImg from '../assets/images/real_gamification.jpg';
import tutorImg from '../assets/images/real_tutor.jpg';
import whatsappImg from '../assets/images/real_whatsapp.jpg';
import studioImg from '../assets/images/real_studio.jpg';
import curriculumImg from '../assets/images/real_curriculum_builder.jpg';
import trackerImg from '../assets/images/real_progress_tracker.jpg';
import centersImg from '../assets/images/real_center_management.jpg';
import currenciesImg from '../assets/images/real_admin_currency.jpg';

const ASSET_FALLBACKS: Record<string, string> = {
  home: homeImg,
  permissions: permissionsImg,
  catalog: catalogImg,
  player: playerImg,
  quiz: quizImg,
  certificate: certImg,
  gamification: gamificationImg,
  tutor: tutorImg,
  whatsapp: whatsappImg,
  studio: studioImg,
  curriculum: curriculumImg,
  tracker: trackerImg,
  centers: centersImg,
  currencies: currenciesImg,
};

let cachedImages: Record<string, string> = {};

/**
 * Charge l'ensemble des 14 captures réelles sous forme de chaînes Base64 (data:image/jpeg;base64,...).
 * Essaie d'abord l'API dédiée haute vitesse /api/guide-assets-base64,
 * puis bascule élégamment sur le chargement direct des assets en cas d'indisponibilité.
 */
async function fetchAllGuideImages(): Promise<Record<string, string>> {
  if (Object.keys(cachedImages).length >= 14) {
    return cachedImages;
  }

  // 1. Tentative via l'API locale instantanée
  try {
    const res = await fetch('/api/guide-assets-base64');
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        cachedImages = data;
        return cachedImages;
      }
    }
  } catch (err) {
    console.warn('API /api/guide-assets-base64 non disponible, tentative fallback...', err);
  }

  // 2. Fallback direct via fetch de chaque asset
  const result: Record<string, string> = {};
  await Promise.all(
    Object.entries(ASSET_FALLBACKS).map(async ([key, url]) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(blob);
        });
        if (base64) result[key] = base64;
      } catch (e) {
        console.warn(`Impossible de précharger l'image ${key}:`, e);
      }
    })
  );

  cachedImages = result;
  return cachedImages;
}

interface ScenarioDef {
  num: string;
  key: string;
  title: string;
  category: string;
  url: string;
  synopsis: string;
  caption: string;
  steps: { title: string; desc: string }[];
  callout: { title: string; text: string; type: 'info' | 'tip' | 'warning' };
}

const SCENARIOS: ScenarioDef[] = [
  {
    num: '01',
    key: 'home',
    title: "Page d'Accueil & Espace Visiteur",
    category: "Portail Public • Découverte",
    url: "https://academia-itech.org/",
    synopsis: "Portail institutionnel panafricain présentant les filières d'excellence (IA, Cloud, Cybersécurité, Développement), les statistiques de diplomation en direct et le sélecteur de campus.",
    caption: "Figure 1.1 : Vue d'accueil réelle avec statistiques en direct, sélecteur de campus régional et accès direct aux programmes.",
    steps: [
      {
        title: "Exploration des Programmes",
        desc: "Les visiteurs parcourent les cursus technologiques, le taux de réussite (94.2%) et le nombre d'apprenants certifiés."
      },
      {
        title: "Sélection d'un Campus Régional",
        desc: "Le sélecteur supérieur permet d'adapter les cours locaux et la devise monétaire (USD ou Franc Congolais)."
      },
      {
        title: "Mode Démo 1-Clic",
        desc: "Permet d'évaluer instantanément les 5 rôles (Apprenant, Formateur, Directeur, Super Admin) sans créer de compte."
      }
    ],
    callout: {
      title: "💡 Bon à savoir :",
      text: "Le portail public est entièrement responsive et conçu pour charger à grande vitesse sur les connexions mobiles à débit variable.",
      type: "tip"
    }
  },
  {
    num: '02',
    key: 'permissions',
    title: "Matrice de Sécurité & Rôles RBAC",
    category: "Sécurité & Gouvernance",
    url: "https://academia-itech.org/rbac-matrix",
    synopsis: "Contrôle d'accès granulaire basé sur les rôles (RBAC). Cloisonnement strict des privilèges entre Visiteurs, Apprenants, Formateurs, Directeurs de centres et Super Administrateurs.",
    caption: "Figure 2.1 : Matrice de sécurité RBAC affichant la distribution des permissions par catégorie et rôle utilisateur.",
    steps: [
      {
        title: "5 Rôles Distincts",
        desc: "Chaque utilisateur possède un ensemble de droits précis vérifiés côté client et scellés par des règles Firestore sécurisées."
      },
      {
        title: "Contrôle d'Édition & Validation",
        desc: "Seuls les formateurs et directeurs de centre peuvent concevoir ou valider les curriculums et émettre des diplômes."
      },
      {
        title: "Bascule Instantanée en Démo",
        desc: "Les auditeurs peuvent commuter de profil en un clic pour contrôler l'étanchéité des vues et des menus d'action."
      }
    ],
    callout: {
      title: "🛡️ Sécurité Institutionnelle :",
      text: "Aucune action critique ne peut être exécutée sans jeton d'authentification valide. Les règles Firestore rejettent toute tentative d'écriture non autorisée.",
      type: "info"
    }
  },
  {
    num: '03',
    key: 'catalog',
    title: "Catalogue des Formations & Devises (USD / FC)",
    category: "Espace Apprenant • Inscriptions",
    url: "https://academia-itech.org/catalog",
    synopsis: "Catalogue interactif de cours certifiants avec filtres thématiques, barre de recherche temps réel et tarification dynamique en USD ($) ou Francs Congolais (FC).",
    caption: "Figure 3.1 : Catalogue complet avec cartes de formations, niveaux d'expertise, tags technologiques et bascule de devises.",
    steps: [
      {
        title: "Filtres Multi-Critères",
        desc: "Tri instantané par domaine (IA, Cloud, Mobile, Cybersécurité) et par niveau (Débutant, Intermédiaire, Avancé)."
      },
      {
        title: "Bascule Monétaire Dynamique",
        desc: "Les tarifs sont recalculés automatiquement selon le taux officiel du centre sélectionné (ex: 1 USD = 2850 CDF)."
      },
      {
        title: "Inscription en 1 Clic",
        desc: "Accès instantané aux cours ouverts ou paiement sécurisé via Mobile Money (Vodacom M-Pesa, Orange, Airtel)."
      }
    ],
    callout: {
      title: "🎯 Pédagogie par Compétences :",
      text: "Chaque fiche de formation liste explicitement les prérequis, la durée totale en heures et les certifications visées.",
      type: "tip"
    }
  },
  {
    num: '04',
    key: 'player',
    title: "Lecteur de Cours Vidéo, Chapitres & Code",
    category: "Espace Apprenant • Immersion",
    url: "https://academia-itech.org/player",
    synopsis: "Lecteur pédagogique immersif avec navigation chapitrée, lecteur vidéo HD sans distraction, éditeur d'extraits de code et ressources documentaires téléchargeables.",
    caption: "Figure 4.1 : Lecteur interactif avec volet latéral de leçons, progression en direct, lecteur vidéo et support de cours.",
    steps: [
      {
        title: "Arborescence & Suivi de Complétion",
        desc: "Visualisation claire des leçons terminées (coche verte) et reprise automatique de lecture là où vous vous étiez arrêté."
      },
      {
        title: "Code Source & Démonstrations",
        desc: "Blocs de syntaxe colorée avec bouton de copie en 1 clic pour reproduire les exercices sur son environnement local."
      },
      {
        title: "Ressources PDF & GitHub",
        desc: "Téléchargement immédiat des fiches mémos, slides de cours et dépôts de code d'accompagnement."
      }
    ],
    callout: {
      title: "⚡ Synchronisation Cloud :",
      text: "Chaque leçon validée met immédiatement à jour le profil étudiant sur Firebase, permettant une alternance fluide entre PC et mobile.",
      type: "info"
    }
  },
  {
    num: '05',
    key: 'quiz',
    title: "Quiz d'Évaluation & Calculateur de Score",
    category: "Évaluation & Compétences",
    url: "https://academia-itech.org/quiz",
    synopsis: "Moteur d'évaluation interactif avec questions à choix multiples, chronomètre optionnel, calcul instantané de la moyenne et explications pédagogiques détaillées.",
    caption: "Figure 5.1 : Interface de passage de quiz avec feedback immédiat, barème de validation (75%) et attribution de points d'XP.",
    steps: [
      {
        title: "Questions Contextualisées",
        desc: "QCM pratiques portant sur des cas réels d'ingénierie et de développement pour vérifier l'assimilation concrète."
      },
      {
        title: "Correction Pédagogique Justifiée",
        desc: "Explications systématiques pour chaque réponse afin d'éclairer l'étudiant sur la démarche intellectuelle attendue."
      },
      {
        title: "Seuil de Réussite de 75%",
        desc: "La réussite du quiz débloque immédiatement les points d'XP et contribue à l'obtention du certificat officiel."
      }
    ],
    callout: {
      title: "🔄 Droit au Rattrapage :",
      text: "En cas de score inférieur à 75%, l'apprenant est invité à revoir les notions clés avant de repasser l'évaluation.",
      type: "tip"
    }
  },
  {
    num: '06',
    key: 'certificate',
    title: "Diplôme Officiel & QR Code Infalsifiable",
    category: "Certification & Diplomation",
    url: "https://academia-itech.org/certificate",
    synopsis: "Certificat de réussite officiel émis avec signature numérique institutionnelle, numéro d'enregistrement cryptographique et QR code vérifiable en ligne.",
    caption: "Figure 6.1 : Diplôme certifiant Academia ITECH avec QR code de validation publique et export haute résolution.",
    steps: [
      {
        title: "Émission Automatique",
        desc: "Le diplôme est délivré dès que 100% des leçons sont visionnées et que le quiz final est réussi avec au moins 75%."
      },
      {
        title: "Vérification Publique par QR Code",
        desc: "Tout recruteur ou université peut scanner le code pour confirmer instantanément l'authenticité sur la page officielle."
      },
      {
        title: "Téléchargement PDF A4",
        desc: "Export immédiat au format PDF prêt à imprimer pour valoriser le parcours sur LinkedIn et dans les dossiers de candidature."
      }
    ],
    callout: {
      title: "🔒 Intégrité Cryptographique :",
      text: "Chaque diplôme possède un identifiant unique immuable stocké dans la collection Firestore, empêchant toute falsification.",
      type: "info"
    }
  },
  {
    num: '07',
    key: 'gamification',
    title: "Gamification : Niveaux, Badges & ITECH Coins",
    category: "Motivation & Engagement",
    url: "https://academia-itech.org/gamification",
    synopsis: "Système de récompenses pédagogiques complet : points d'expérience (XP), niveaux de maîtrise, monnaie virtuelle (ITECH Coins), badges d'honneur et classement de promotion.",
    caption: "Figure 7.1 : Tableau de bord de gamification avec jauges de niveau, vitrine de badges débloqués et boutique d'ITECH Coins.",
    steps: [
      {
        title: "Accumulation d'XP & Niveaux",
        desc: "Chaque leçon lue et quiz réussi octroie de l'XP pour progresser du rang Débutant au rang Grand Maître Technologique."
      },
      {
        title: "Boutique d'ITECH Coins",
        desc: "Les pièces gagnées permettent de déverrouiller des cours premiums, masterclasses exclusives ou bonus d'examen."
      },
      {
        title: "Badges d'Excellence",
        desc: "Trophées honorifiques (Pionnier IA, Codeur Sans Faute, Assiduité Parfaite) valorisant la régularité du travail."
      }
    ],
    callout: {
      title: "🏆 Émulation Inter-Campus :",
      text: "Le classement des apprenants met en valeur les meilleurs talents des campus de Kinshasa, Dakar, Lubumbashi et Abidjan.",
      type: "tip"
    }
  },
  {
    num: '08',
    key: 'tutor',
    title: "Tuteur Virtuel IA Interactif & Mascotte",
    category: "Assistance Pédagogique IA",
    url: "https://academia-itech.org/tutor",
    synopsis: "Assistant pédagogique intelligent animé alimenté par Google Gemini. Capable de répondre vocalement, d'expliquer des concepts ardus et de débugger du code en temps réel.",
    caption: "Figure 8.1 : Mascotte animée du Tuteur IA avec synthèse vocale, boîte de dialogue contextuelle et questions suggérées.",
    steps: [
      {
        title: "Dialogue en Langage Naturel",
        desc: "Posez n'importe quelle question sur le cours en cours : l'IA adapte son niveau d'explication au profil de l'élève."
      },
      {
        title: "Moteur de Synthèse Vocale",
        desc: "Écoutez les explications grâce au lecteur audio intégré en français avec articulation naturelle et contrôle du tempo."
      },
      {
        title: "Analyse de Code en Direct",
        desc: "Collez vos erreurs de syntaxe pour que le tuteur identifie la faille et propose la correction commentée."
      }
    ],
    callout: {
      title: "🧠 Contexte Pédagogique :",
      text: "Le tuteur prend en compte la leçon précise que l'apprenant est en train de suivre, garantissant des réponses adaptées et précises.",
      type: "info"
    }
  },
  {
    num: '09',
    key: 'whatsapp',
    title: "Extension WhatsApp Cloud (+1 555-631-6001)",
    category: "Omnicanalité & Mobilité",
    url: "https://academia-itech.org/whatsapp",
    synopsis: "Passerelle mobile officielle connectée à WhatsApp Cloud API et Cloudflare Workers. Permet de réviser, recevoir des quiz et dialoguer avec le bot sans ordinateur.",
    caption: "Figure 9.1 : Simulateur et documentation de l'intégration WhatsApp Cloud connectée au numéro officiel +1 555-631-6001.",
    steps: [
      {
        title: "Numéro Officiel International",
        desc: "Enregistrez le contact +1 555-631-6001 sur WhatsApp et envoyez un premier message 'MENU' pour démarrer."
      },
      {
        title: "Micro-Leçons & Quiz Mobiles",
        desc: "Recevez de courts résumés de cours, des questions à choix multiples et vos alertes de progression par message."
      },
      {
        title: "Haute Résilience Cloudflare",
        desc: "L'infrastructure sans serveur répond en moins d'une seconde, garantissant une continuité même avec une faible connexion."
      }
    ],
    callout: {
      title: "📲 Règle des 24h Meta :",
      text: "Répondez toujours au message d'accueil pour ouvrir la fenêtre de conversation gratuite de 24h avec le robot pédagogique.",
      type: "warning"
    }
  },
  {
    num: '10',
    key: 'studio',
    title: "Studio Formateur IA & Générateur Gemini",
    category: "Espace Formateur • Création",
    url: "https://academia-itech.org/studio",
    synopsis: "Accélérateur de création pédagogique pour formateurs. Conçoit automatiquement l'arborescence d'une formation, les résumés de chapitres et les quiz d'évaluation en 30 secondes.",
    caption: "Figure 10.1 : Studio formateur avec formulaire de cadrage, génération automatique par Gemini et aperçu de curriculum.",
    steps: [
      {
        title: "Cadrage Pédagogique",
        desc: "L'enseignant indique le sujet, le niveau de difficulté, le nombre de modules et les objectifs opérationnels visés."
      },
      {
        title: "Génération par Gemini",
        desc: "L'IA produit un curriculum complet avec titres de leçons, descriptifs pédagogiques, extraits de code et quiz."
      },
      {
        title: "Publication Immédiate",
        desc: "Après relecture et ajustements par le formateur, le cours est injecté directement dans le catalogue du centre."
      }
    ],
    callout: {
      title: "⚡ Gain de Temps Majeur :",
      text: "Le studio réduit le temps d'ingénierie pédagogique de plusieurs semaines à quelques minutes tout en maintenant une haute rigueur académique.",
      type: "tip"
    }
  },
  {
    num: '11',
    key: 'curriculum',
    title: "Concepteur Visuel de Curriculum & Leçons",
    category: "Espace Formateur • Structure",
    url: "https://academia-itech.org/curriculum-builder",
    synopsis: "Éditeur de structure modulaire inspiré des standards modernes de LMS. Permet d'organiser les modules, d'insérer des vidéos, des documents PDF et des exercices pratiques.",
    caption: "Figure 11.1 : Outil d'assemblage visuel des modules, réorganisation par glisser-déposer et attachement de ressources.",
    steps: [
      {
        title: "Structure Modulaire Hiérarchique",
        desc: "Découpage en modules thématiques et leçons unitaires pour garantir une courbe d'apprentissage équilibrée."
      },
      {
        title: "Intégration Multimédia Riche",
        desc: "Attachez vidéos HD, fichiers téléchargeables (cheatsheets, code) et barèmes d'évaluation pour chaque leçon."
      },
      {
        title: "Prévisualisation Mode Apprenant",
        desc: "Vérifiez exactement l'expérience visuelle de vos étudiants avant d'activer la visibilité publique du cours."
      }
    ],
    callout: {
      title: "📋 Bonnes Pratiques :",
      text: "Privilégiez des leçons courtes de 7 à 15 minutes complétées par un exercice pratique pour maximiser le taux de mémorisation.",
      type: "tip"
    }
  },
  {
    num: '12',
    key: 'tracker',
    title: "Suivi de Promotion & Émargement Pédagogique",
    category: "Supervision Pédagogique",
    url: "https://academia-itech.org/progress-tracker",
    synopsis: "Tableau de bord de pilotage en direct pour formateurs et tuteurs. Affiche la liste des inscrits, les taux de complétion nominatifs, les résultats aux quiz et les alertes de décrochage.",
    caption: "Figure 12.1 : Console de supervision avec suivi individuel des étudiants, scores d'examens et export de rapports d'émargement.",
    steps: [
      {
        title: "Suivi Nominatif des Inscrits",
        desc: "Visualisez chaque étudiant avec sa date d'inscription, sa dernière leçon consultée et son pourcentage de complétion."
      },
      {
        title: "Détection du Décrochage",
        desc: "Des indicateurs colorés signalent immédiatement les apprenants inactifs depuis plus de 7 jours pour un accompagnement ciblé."
      },
      {
        title: "Analyse des Notes aux Quiz",
        desc: "Identifiez les questions ayant posé le plus de difficultés pour organiser une séance de tutorat de consolidation."
      }
    ],
    callout: {
      title: "📊 Émargement Officiel :",
      text: "Les données de complétion sont certifiées et exportables en formats CSV et PDF pour justifier de l'assiduité des promotions.",
      type: "info"
    }
  },
  {
    num: '13',
    key: 'centers',
    title: "Direction de Centre & Administration Campus",
    category: "Administration Régionale",
    url: "https://academia-itech.org/center-management",
    synopsis: "Console de gestion pour directeurs de campus régionaux (Kinshasa, Dakar, Lubumbashi, Paris). Supervision des formateurs rattachés, effectifs d'étudiants et paramètres régionaux.",
    caption: "Figure 13.1 : Tableau de bord de direction de centre avec métriques consolidées, gestion des formateurs et quotas.",
    steps: [
      {
        title: "Affectation du Corps Enseignant",
        desc: "Rattachez les formateurs certifiés à votre centre et attribuez les droits de publication selon les filières."
      },
      {
        title: "Supervision des Quotas d'Inscriptions",
        desc: "Contrôlez les jauges de capacité des promotions présentielles et hybrides avec alertes de saturation."
      },
      {
        title: "Personnalisation Régionale",
        desc: "Définissez le logo du campus, les coordonnées locales du support et les partenaires industriels affiliés."
      }
    ],
    callout: {
      title: "🏛️ Autonomie & Synergie :",
      text: "Chaque campus conserve son autonomie de gestion tout en partageant le tronc commun technologique et les diplômes d'excellence ITECH.",
      type: "info"
    }
  },
  {
    num: '14',
    key: 'currencies',
    title: "Gestion Multi-Devises & Taux de Change (USD / FC)",
    category: "Administration Financière",
    url: "https://academia-itech.org/admin-currency",
    synopsis: "Module de configuration monétaire permettant aux administrateurs de définir les taux de parité de référence entre USD, Franc Congolais (CDF) et devises régionales, avec arrondis.",
    caption: "Figure 14.1 : Interface de configuration des devises avec saisie du taux de change officiel, marges et passerelles Mobile Money.",
    steps: [
      {
        title: "Taux de Référence Officiel",
        desc: "Saisissez le cours de change pivot (ex: 1 USD = 2850 CDF) appliqué en temps réel à l'ensemble du catalogue de cours."
      },
      {
        title: "Règles d'Arrondi Monétaire",
        desc: "Paramétrez les paliers d'arrondi (à la centaine ou au millier) pour fluidifier les paiements en argent liquide ou Mobile Money."
      },
      {
        title: "Passerelles de Paiement Locales",
        desc: "Activez et testez les intégrations Vodacom M-Pesa RDC, Airtel Money, Orange Money et cartes bancaires internationales."
      }
    ],
    callout: {
      title: "💰 Transparence Tarifaire :",
      text: "L'affichage du prix en monnaie locale rassure l'étudiant et garantit un montant exact sans frais cachés de conversion bancaire.",
      type: "tip"
    }
  }
];

/**
 * Générateur principal du Guide Utilisateur Officiel Academia ITECH en format PDF A4.
 * Télécharge un document complet de 17 pages comprenant :
 * - Page 1 : Couverture prestigieuse
 * - Page 2 : Sommaire exécutif & table des matières
 * - Pages 3 à 16 : Les 14 scénarios réels illustrés avec captures d'écran HD, cadre navigateur et étapes
 * - Page 17 : FAQ institutionnelle & coordonnées officielles d'assistance
 */
export async function generateUserGuidePDF(): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // Palette institutionnelle Academia ITECH
  const PRIMARY = [15, 23, 42]; // Slate 900
  const ACCENT_BLUE = [2, 132, 199]; // Sky 600
  const TEXT_DARK = [30, 41, 59]; // Slate 800
  const TEXT_MUTED = [100, 116, 139]; // Slate 500
  const BG_LIGHT = [248, 250, 252]; // Slate 50

  const totalPages = 17;
  let currentPage = 1;

  // Préchargement de toutes les captures réelles en Base64
  const images = await fetchAllGuideImages();

  // Helper pour ajouter en-tête et pied de page
  const addHeaderAndFooter = (pageNumber: number) => {
    if (pageNumber === 1) return; // Pas d'en-tête sur la couverture

    // En-tête supérieur
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(ACCENT_BLUE[0], ACCENT_BLUE[1], ACCENT_BLUE[2]);
    doc.text('ACADEMIA ITECH', margin, 11);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text("•  Manuel Utilisateur & Documentation Officielle Illustrée (Édition A4)", margin + 28, 11);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 13.5, pageWidth - margin, 13.5);

    // Pied de page inférieur
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text('© 2026 Academia ITECH - Tous droits réservés • Direction Pédagogique & Technique', margin, pageHeight - 7.5);

    const pageStr = `Page ${pageNumber} sur ${totalPages}`;
    doc.text(pageStr, pageWidth - margin - doc.getTextWidth(pageStr), pageHeight - 7.5);
  };

  // Helper pour titre de section
  const addSectionHeader = (number: string, title: string, yPos: number, category = '') => {
    // Badge numéro
    doc.setFillColor(ACCENT_BLUE[0], ACCENT_BLUE[1], ACCENT_BLUE[2]);
    doc.roundedRect(margin, yPos, 7.5, 7.5, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(number, margin + 3.75, yPos + 5.2, { align: 'center' });

    // Titre principal
    doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
    doc.setFontSize(12.5);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 10.5, yPos + 5.5);

    // Badge catégorie optionnel
    if (category) {
      const catWidth = doc.getTextWidth(category) + 6;
      doc.setFillColor(224, 242, 254);
      doc.roundedRect(pageWidth - margin - catWidth, yPos + 0.5, catWidth, 6, 1, 1, 'F');
      doc.setFontSize(7);
      doc.setTextColor(3, 105, 161);
      doc.text(category, pageWidth - margin - catWidth / 2, yPos + 4.6, { align: 'center' });
    }

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos + 9.5, pageWidth - margin, yPos + 9.5);

    return yPos + 14;
  };

  // Helper pour paragraphe avec retour automatique à la ligne
  const addParagraph = (text: string, yPos: number, fontSize = 8.5, lineHeight = 4.2, color = TEXT_DARK) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, yPos);
    return yPos + lines.length * lineHeight;
  };

  // Helper pour dessiner une boîte d'alerte / astuce
  const addCalloutBox = (title: string, text: string, yPos: number, type: 'info' | 'tip' | 'warning' = 'info') => {
    const lines = doc.splitTextToSize(text, contentWidth - 10);
    const boxHeight = lines.length * 4 + 10;

    let fillColor = [240, 249, 255]; // sky 50
    let borderColor = [2, 132, 199]; // sky 600
    let titleColor = [3, 105, 161]; // sky 700

    if (type === 'tip') {
      fillColor = [236, 253, 245]; // emerald 50
      borderColor = [16, 185, 129]; // emerald 500
      titleColor = [6, 95, 70]; // emerald 800
    } else if (type === 'warning') {
      fillColor = [255, 251, 235]; // amber 50
      borderColor = [245, 158, 11]; // amber 500
      titleColor = [146, 64, 14]; // amber 800
    }

    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, yPos, contentWidth, boxHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(titleColor[0], titleColor[1], titleColor[2]);
    doc.text(title, margin + 4, yPos + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(lines, margin + 4, yPos + 10);

    return yPos + boxHeight + 4;
  };

  // Helper pour dessiner la carte de capture d'écran avec cadre navigateur macOS
  const addScreenshotCard = (
    imgKey: string,
    urlStr: string,
    captionStr: string,
    yPos: number
  ): number => {
    const cardWidth = contentWidth; // 180mm
    const headerHeight = 6.5;
    const imgWidth = 172;
    // Ratio 1440x820 = 1.756 => 172 / 1.756 = 98mm
    const imgHeight = 98;
    const captionHeight = 7;
    const totalCardHeight = headerHeight + imgHeight + captionHeight + 4; // 115.5mm

    // Cadre extérieur
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.35);
    doc.roundedRect(margin, yPos, cardWidth, totalCardHeight, 2, 2, 'FD');

    // Barre supérieure macOS (Gris clair)
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, yPos, cardWidth, headerHeight, 2, 2, 'F');
    // Séparateur
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, yPos + headerHeight, margin + cardWidth, yPos + headerHeight);

    // 3 Pastilles de fenêtre macOS
    // Rouge
    doc.setFillColor(239, 68, 68);
    doc.circle(margin + 4, yPos + 3.25, 1.1, 'F');
    // Jaune
    doc.setFillColor(245, 158, 11);
    doc.circle(margin + 7.5, yPos + 3.25, 1.1, 'F');
    // Vert
    doc.setFillColor(34, 197, 94);
    doc.circle(margin + 11, yPos + 3.25, 1.1, 'F');

    // Barre d'URL
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin + 15, yPos + 1.2, 85, 4.2, 1, 1, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(urlStr, margin + 17.5, yPos + 4.2);

    // Badge "Capture Réelle Plateforme"
    doc.setFillColor(220, 252, 231); // emerald 100
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin + cardWidth - 48, yPos + 1.2, 44, 4.2, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(22, 101, 52);
    doc.text('● CAPTURE RÉELLE PLATEFORME', margin + cardWidth - 26, yPos + 4.2, { align: 'center' });

    // Intégration de l'image réelle
    const imgX = margin + 4;
    const imgY = yPos + headerHeight + 2;
    const base64Data = images[imgKey];

    if (base64Data && base64Data.startsWith('data:image')) {
      try {
        doc.addImage(base64Data, 'JPEG', imgX, imgY, imgWidth, imgHeight, undefined, 'FAST');
      } catch (err) {
        console.warn(`Erreur lors de l'insertion de l'image ${imgKey}:`, err);
        // Fallback dessin de placeholder
        drawPlaceholder(imgX, imgY, imgWidth, imgHeight, imgKey);
      }
    } else {
      drawPlaceholder(imgX, imgY, imgWidth, imgHeight, imgKey);
    }

    // Légende inférieure
    const captionY = imgY + imgHeight + 1.5;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin + 2, captionY, cardWidth - 4, 5.5, 1, 1, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(captionStr, margin + 4, captionY + 3.8);

    return yPos + totalCardHeight + 5;
  };

  // Helper placeholder si l'image n'est pas encore dispo
  const drawPlaceholder = (x: number, y: number, w: number, h: number, key: string) => {
    doc.setFillColor(241, 245, 249);
    doc.rect(x, y, w, h, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Capture d'écran de l'interface : ${key}`, x + w / 2, y + h / 2, { align: 'center' });
  };

  // ============================================================================
  // PAGE 1 : COUVERTURE OFFICIELLE HAUTE DÉFINITION
  // ============================================================================
  // Fond supérieur bleu institutionnel
  doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.rect(0, 0, pageWidth, 130, 'F');

  // Filet d'accentuation bleu ciel
  doc.setFillColor(ACCENT_BLUE[0], ACCENT_BLUE[1], ACCENT_BLUE[2]);
  doc.rect(0, 127, pageWidth, 3, 'F');

  // Badge Institutionnel
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, 24, 82, 7.5, 1.5, 1.5, 'F');
  doc.setTextColor(2, 132, 199);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('ACADÉMIE TECHNOLOGIQUE PANAFRICAINE', margin + 3.5, 29.2);

  // Titre Principal
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text('ACADEMIA ITECH', margin, 48);

  doc.setFontSize(14);
  doc.setTextColor(186, 230, 253);
  doc.text("Manuel Utilisateur & Documentation Officielle", margin, 58);

  // Sous-titre descriptif
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  const coverSub =
    "Guide illustré intégrant les 14 scénarios réels de la plateforme : portail public, sécurité RBAC, catalogue bidevise (USD & Franc Congolais), lecteur vidéo interactif, certification infalsifiable avec QR code, tuteur Gemini, extension WhatsApp et administration multi-campus.";
  doc.text(doc.splitTextToSize(coverSub, contentWidth), margin, 68);

  // Puces clés sur la couverture
  const pills = [
    '✓ 14 Scénarios Réels documentés avec Captures d\'Écran Haute Définition',
    '✓ Passerelle WhatsApp Cloud Bot officielle (+1 555-631-6001)',
    '✓ Certifications infalsifiables avec vérification publique QR Code',
    '✓ Tarification Bidevise (USD & CDF) et Intégration Vodacom M-Pesa RDC',
  ];
  let pillY = 96;
  pills.forEach((pill) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(125, 211, 252);
    doc.text(pill, margin, pillY);
    pillY += 6;
  });

  // Métadonnées du document (partie inférieure)
  const metaY = 150;
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.roundedRect(margin, metaY, contentWidth, 85, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, metaY, contentWidth, 85, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.text('Informations Institutionnelles du Document', margin + 8, metaY + 12);

  const docInfos = [
    ['Version du document :', 'v4.2.0 (Édition Officielle Illustrée 2026)'],
    ['Plateforme logicielle :', 'Academia ITECH Web, Mobile & WhatsApp Gateway'],
    ['Éditeur & Conception :', 'Direction Pédagogique & Direction Technique'],
    ['Moteurs intégrés :', 'Google Gemini 2.5 / Meta WhatsApp Cloud API / Firebase Firestore'],
    ['Devises supportées :', 'USD ($) et Franc Congolais (FC) avec taux garanti'],
    ['Numéro WhatsApp Bot :', '+1 555-631-6001 (Serveur Cloudflare Workers)'],
    ['Date d\'édition :', new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Statut de diffusion :', 'Document de Référence pour Formateurs, Directeurs & Apprenants'],
  ];

  let infoRowY = metaY + 22;
  docInfos.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(label, margin + 8, infoRowY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(val, margin + 55, infoRowY);
    infoRowY += 7.5;
  });

  // Bas de page couverture
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Document technique édité et téléchargeable directement depuis la plateforme Academia ITECH.', margin, pageHeight - 14);

  // ============================================================================
  // PAGE 2 : SOMMAIRE GÉNÉRAL & PARCOURS DES 14 SCÉNARIOS
  // ============================================================================
  doc.addPage();
  currentPage++;
  addHeaderAndFooter(currentPage);

  let y = addSectionHeader('00', 'Sommaire Général des 14 Scénarios Illustrés', 22);

  y = addParagraph(
    "Ce manuel a été conçu pour guider les apprenants, formateurs, directeurs de centres régionaux et administrateurs. Chaque scénario ci-dessous fait l'objet d'une fiche complète intégrant une capture d'écran réelle, la démarche opératoire pas-à-pas et les points d'attention.",
    y,
    8.5,
    4.5
  );
  y += 4;

  const tocItems = [
    { num: '01', title: "Page d'Accueil & Espace Visiteur (Portail Public)", page: 'Page 3' },
    { num: '02', title: "Matrice de Sécurité & Gestion des Rôles RBAC", page: 'Page 4' },
    { num: '03', title: "Catalogue des Formations & Tarification Bidevise (USD / FC)", page: 'Page 5' },
    { num: '04', title: "Lecteur de Cours Vidéo, Chapitres & Code Source Interactif", page: 'Page 6' },
    { num: '05', title: "Quiz d'Évaluation, Chronomètre & Calculateur de Score", page: 'Page 7' },
    { num: '06', title: "Diplôme Officiel de Réussite & QR Code Infalsifiable", page: 'Page 8' },
    { num: '07', title: "Gamification : Niveaux d'XP, Badges & Boutique d'ITECH Coins", page: 'Page 9' },
    { num: '08', title: "Tuteur Virtuel IA Interactif & Synthèse Vocale Gemini", page: 'Page 10' },
    { num: '09', title: "Passerelle WhatsApp Cloud API (+1 555-631-6001)", page: 'Page 11' },
    { num: '10', title: "Studio Formateur IA & Générateur de Cours par Gemini", page: 'Page 12' },
    { num: '11', title: "Concepteur Visuel de Curriculum & Leçons Modulaires", page: 'Page 13' },
    { num: '12', title: "Suivi de Promotion & Émargement Pédagogique en Direct", page: 'Page 14' },
    { num: '13', title: "Direction de Centre & Administration des Campus Régionaux", page: 'Page 15' },
    { num: '14', title: "Gestion Multi-Devises, Taux de Change & Vodacom M-Pesa", page: 'Page 16' },
    { num: '15', title: "FAQ Officielle, Support Pédagogique & Canaux d'Assistance", page: 'Page 17' },
  ];

  tocItems.forEach((item) => {
    doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
    doc.roundedRect(margin, y, contentWidth, 9.5, 1.2, 1.2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 9.5, 1.2, 1.2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(ACCENT_BLUE[0], ACCENT_BLUE[1], ACCENT_BLUE[2]);
    doc.text(item.num, margin + 4, y + 6.2);

    doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
    doc.setFontSize(8);
    doc.text(item.title, margin + 14, y + 6.2);

    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.setFontSize(7.5);
    doc.text(item.page, pageWidth - margin - 15, y + 6.2);

    y += 11.5;
  });

  y += 2;
  addCalloutBox(
    '💡 Astuce de navigation dans l\'application :',
    "Toutes ces interfaces sont accessibles en direct depuis le bandeau de navigation supérieur ou le tiroir mobile. Le sélecteur de profil en mode Démo vous permet d'éprouver immédiatement les écrans formateur et administrateur.",
    y,
    'info'
  );

  // ============================================================================
  // PAGES 3 À 16 : LES 14 SCÉNARIOS AVEC VRAIES CAPTURES D'ÉCRAN
  // ============================================================================
  for (const sc of SCENARIOS) {
    doc.addPage();
    currentPage++;
    addHeaderAndFooter(currentPage);

    let scY = addSectionHeader(sc.num, `Scénario ${sc.num} : ${sc.title}`, 22, sc.category);

    // Synopsis
    scY = addParagraph(sc.synopsis, scY, 8.5, 4.2);
    scY += 1;

    // Carte Capture d'Écran réelle avec cadre macOS
    scY = addScreenshotCard(sc.key, sc.url, sc.caption, scY);

    // Sous-titre pour les étapes
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
    doc.text('Étapes Opérationnelles & Bonnes Pratiques :', margin, scY);
    scY += 5;

    // Liste des 3 étapes
    sc.steps.forEach((step, idx) => {
      // Pastille numéro
      doc.setFillColor(ACCENT_BLUE[0], ACCENT_BLUE[1], ACCENT_BLUE[2]);
      doc.circle(margin + 3.5, scY + 2.5, 2.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(String(idx + 1), margin + 3.5, scY + 3.4, { align: 'center' });

      // Titre étape
      doc.setTextColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(step.title, margin + 8.5, scY + 3.4);

      // Description étape
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      const descLines = doc.splitTextToSize(step.desc, contentWidth - 10);
      doc.text(descLines, margin + 8.5, scY + 7.5);

      scY += 7.5 + descLines.length * 3.5 + 2;
    });

    scY += 1;
    // Boîte conseil / astuce
    addCalloutBox(sc.callout.title, sc.callout.text, scY, sc.callout.type);
  }

  // ============================================================================
  // PAGE 17 : FAQ & CANAUX D'ASSISTANCE OFFICIELS
  // ============================================================================
  doc.addPage();
  currentPage++;
  addHeaderAndFooter(currentPage);

  let faqY = addSectionHeader('15', 'FAQ Officielle & Canaux d\'Assistance', 22, 'Support & Maintenance');

  const faqs = [
    {
      q: "Q1 : Comment s'assurer que le Bot WhatsApp répond 24h/24 sans interruption ?",
      r: "Le bot officiel (+1 555-631-6001) est déployé sur le réseau sans serveur de Cloudflare Workers relié à Meta Cloud API. Pour engager la conversation, enregistrez le numéro avec l'indicatif international (+1) et envoyez 'MENU'. Veillez à répondre au message modèle pour activer la fenêtre de 24h."
    },
    {
      q: "Q2 : Comment un recruteur ou une entreprise valide-t-il l'authenticité d'un diplôme ?",
      r: "Il suffit de scanner le QR code présent sur le certificat papier ou PDF à l'aide de tout smartphone. La page officielle sécurisée s'affiche instantanément avec le nom de l'apprenant, le cours certifié, la note obtenue, la mention et la date d'émission scellée sur Firestore."
    },
    {
      q: "Q3 : Les progressions sont-elles conservées si un étudiant change d'appareil ?",
      r: "Oui. Toutes les leçons terminées, quiz validés, certificats obtenus, XP et pièces sont stockés de manière sécurisée sur Google Cloud Firestore. Il suffit de se reconnecter sur le nouvel équipement (PC, tablette, mobile) pour retrouver l'intégralité de son parcours."
    },
    {
      q: "Q4 : Comment fonctionne la simulation de paiement Vodacom M-Pesa RDC ?",
      r: "La plateforme intègre le simulateur Open API officiel de Vodacom RDC. Utilisez le numéro test +243 81 000 0001 avec le code PIN 1234 pour valider un paiement immédiat, ou les numéros tests 0002 (solde insuffisant) et 0003 (annulation) pour tester les erreurs."
    },
    {
      q: "Q5 : Comment basculer entre les profils pour tester les fonctions formateur ?",
      r: "Dans la barre de navigation supérieure ou via le tiroir mobile, cliquez sur l'avatar ou le sélecteur de rôle pour commuter entre Apprenant, Formateur, Directeur de centre et Super Administrateur."
    }
  ];

  faqs.forEach((item) => {
    doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
    const qLines = doc.splitTextToSize(item.q, contentWidth - 8);
    const rLines = doc.splitTextToSize(item.r, contentWidth - 8);
    const itemHeight = qLines.length * 4 + rLines.length * 3.6 + 10;

    doc.roundedRect(margin, faqY, contentWidth, itemHeight, 1.5, 1.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, faqY, contentWidth, itemHeight, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(ACCENT_BLUE[0], ACCENT_BLUE[1], ACCENT_BLUE[2]);
    doc.text(qLines, margin + 4, faqY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(rLines, margin + 4, faqY + 5.5 + qLines.length * 4);

    faqY += itemHeight + 3.5;
  });

  faqY += 2;
  // Boîte contact institutionnelle
  doc.setFillColor(PRIMARY[0], PRIMARY[1], PRIMARY[2]);
  doc.roundedRect(margin, faqY, contentWidth, 32, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Coordonnées Officielles & Support Technique Academia ITECH', margin + 6, faqY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(203, 213, 225);
  doc.text('• Assistance Pédagogique & Étudiants : support@academia-itech.cd / etudiants@academia-itech.cd', margin + 6, faqY + 13.5);
  doc.text('• Direction des Certifications & Vérification : certificats@academia-itech.cd', margin + 6, faqY + 19);
  doc.text('• Robot Pédagogique WhatsApp Cloud Officiel : +1 555-631-6001 (Disponible 24h/24, 7j/7)', margin + 6, faqY + 24.5);

  // Téléchargement effectif du document PDF complet
  doc.save('Manuel_Utilisateur_Academia_ITECH_Edition_Illustree.pdf');
}
