/**
 * Générateur de la Documentation Institutionnelle HTML & PDF d'Academia ITECH
 * Contient les 14 scénarios d'utilisation avec les VRAIES captures d'écran
 * capturées directement depuis la plateforme en direct.
 */

export function renderOfficialDocumentationHtml(getGuideImageBase64: (filename: string) => string): string {
  const homeImg = getGuideImageBase64("real_home.jpg");
  const permissionsImg = getGuideImageBase64("real_permissions.jpg");
  const catalogImg = getGuideImageBase64("real_catalog.jpg");
  const playerImg = getGuideImageBase64("real_player.jpg");
  const quizImg = getGuideImageBase64("real_quiz.jpg");
  const certImg = getGuideImageBase64("real_certificate.jpg");
  const gamificationImg = getGuideImageBase64("real_gamification.jpg");
  const tutorImg = getGuideImageBase64("real_tutor.jpg");
  const whatsappImg = getGuideImageBase64("real_whatsapp.jpg");
  const studioImg = getGuideImageBase64("real_studio.jpg");
  const curriculumImg = getGuideImageBase64("real_curriculum_builder.jpg");
  const trackerImg = getGuideImageBase64("real_progress_tracker.jpg");
  const centersImg = getGuideImageBase64("real_center_management.jpg");
  const currenciesImg = getGuideImageBase64("real_admin_currency.jpg");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Guide Utilisateur & Manuel Opérationnel - Academia ITECH (Édition Illustrée)</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 18mm 15mm;
    }
    *, *:before, *:after { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background: #f8fafc;
      font-size: 12px;
    }
    .no-print {
      background: #0f172a;
      color: #fff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .btn {
      background: #0284c7;
      color: #fff;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 13px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn:hover { background: #0369a1; }
    .btn-secondary {
      background: #334155;
      margin-left: 8px;
    }
    .page-container {
      max-width: 860px;
      margin: 0 auto;
      background: #fff;
      padding: 30px 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .cover-page {
      page-break-after: always;
      text-align: center;
      padding: 60px 20px 40px;
      border-bottom: 2px solid #e2e8f0;
      min-height: 85vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .badge {
      display: inline-block;
      padding: 4px 14px;
      background: #e0f2fe;
      color: #0369a1;
      border-radius: 999px;
      font-weight: 700;
      font-size: 11px;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    h1 {
      font-size: 32px;
      color: #0f172a;
      margin: 0 0 10px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 15px;
      color: #0284c7;
      margin: 0 0 20px;
      font-weight: 600;
    }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px 24px;
      text-align: left;
      width: 100%;
      max-width: 580px;
      margin: 25px auto;
      font-size: 11.5px;
    }
    .meta-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .meta-row:last-child { border: none; }
    .chapter {
      page-break-inside: avoid;
      page-break-before: always;
      margin-top: 30px;
      padding-top: 15px;
    }
    .chapter-first {
      page-break-before: auto;
    }
    h2 {
      font-size: 18px;
      color: #0f172a;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 6px;
      margin-top: 0;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .chapter-num {
      background: #0284c7;
      color: #fff;
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 800;
    }
    .screenshot-card {
      background: #0f172a;
      border-radius: 10px;
      overflow: hidden;
      margin: 16px 0;
      border: 1px solid #334155;
      box-shadow: 0 4px 14px rgba(0,0,0,0.12);
    }
    .screenshot-header {
      background: #1e293b;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid #334155;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #eab308; }
    .dot-green { background: #22c55e; }
    .screenshot-title {
      color: #94a3b8;
      font-size: 10px;
      font-family: monospace;
      margin-left: 8px;
      flex: 1;
    }
    .screenshot-badge {
      background: #0284c7;
      color: #fff;
      font-size: 9.5px;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .screenshot-img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
    .screenshot-caption {
      background: #f8fafc;
      padding: 8px 14px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #475569;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .step-list {
      margin: 12px 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 9px 12px;
      border-radius: 8px;
    }
    .step-num {
      width: 22px;
      height: 22px;
      background: #0284c7;
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 11px;
      flex-shrink: 0;
    }
    .step-body { flex: 1; }
    .step-body strong { color: #0f172a; font-size: 12px; display: block; margin-bottom: 2px; }
    .step-body p { margin: 0; color: #475569; font-size: 11px; }
    .callout {
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      padding: 9px 12px;
      border-radius: 0 8px 8px 0;
      margin: 12px 0;
      font-size: 11px;
      color: #065f46;
    }
    .callout-warning {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      color: #92400e;
    }
    .callout-info {
      background: #f0f9ff;
      border-left: 4px solid #0284c7;
      color: #075985;
    }
    .card-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 12px 0;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
    }
    .card-title {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 3px;
      font-size: 11.5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 11px;
    }
    th, td {
      border: 1px solid #e2e8f0;
      padding: 6px 9px;
      text-align: left;
    }
    th { background: #f1f5f9; color: #0f172a; font-weight: 700; }
    @media print {
      .no-print { display: none !important; }
      body { background: #fff; font-size: 9.5pt; }
      .page-container { max-width: 100%; padding: 0; box-shadow: none; }
      .cover-page { height: 95vh; border-bottom: none; }
      .chapter { page-break-before: always; }
      a { text-decoration: none; color: inherit; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <div>
      <strong>Academia ITECH - Manuel Utilisateur Illustré (PDF & Print)</strong>
      <span style="opacity: 0.7; font-size: 12px; margin-left: 8px;">• 14 Vraies Captures d'Écran HD & Scénarios Complets</span>
    </div>
    <div>
      <button class="btn" onclick="window.print()">🖨️ Enregistrer en PDF / Imprimer A4</button>
      <button class="btn btn-secondary" onclick="window.close()">Fermer</button>
    </div>
  </div>

  <div class="page-container">
    <!-- PAGE DE GARDE -->
    <div class="cover-page">
      <span class="badge">DOCUMENTATION OFFICIELLE • ÉDITION ILLUSTRÉE 2026</span>
      <h1>ACADEMIA ITECH</h1>
      <div class="subtitle">Guide Utilisateur & Manuel Opérationnel Tout-en-Un</div>
      <p style="max-width: 520px; color: #64748b; font-size: 13px; margin: 0 auto 20px;">
        Manuel de référence complet intégrant les <strong>14 scénarios réels</strong> de la plateforme d'excellence technologique : portail public, matrice de sécurité RBAC, catalogue bidevise (USD & Franc Congolais), lecteur vidéo HD, certification infalsifiable avec QR code, tuteur vocal Gemini, intégration omnicanale WhatsApp Cloud API et administration multi-campus.
      </p>

      <div class="meta-box">
        <div class="meta-row"><span>Version de la Plateforme</span><strong>v4.2.0 Panafricaine Production</strong></div>
        <div class="meta-row"><span>Numéro Officiel WhatsApp Bot</span><strong>+1 555-631-6001 (WhatsApp Cloud API)</strong></div>
        <div class="meta-row"><span>Moteur d'Intelligence Artificielle</span><strong>Google Gemini 2.5 / 3.0 Multimodal</strong></div>
        <div class="meta-row"><span>Infrastructure Base de Données</span><strong>Google Cloud Firestore (Temps Réel)</strong></div>
        <div class="meta-row"><span>Passerelle Webhook Sans Serveur</span><strong>Cloudflare Workers Haute Résilience</strong></div>
        <div class="meta-row"><span>Audience & Utilisateurs Cibles</span><strong>Étudiants, Formateurs, Directeurs, Admins</strong></div>
        <div class="meta-row"><span>Date de Publication & Révision</span><strong>Septembre 2026</strong></div>
      </div>

      <p style="margin-top: 25px; font-size: 11px; color: #94a3b8;">
        Pour générer le PDF officiel, cliquez sur « Enregistrer en PDF / Imprimer A4 » puis choisissez « Enregistrer au format PDF » avec marges par défaut.
      </p>
    </div>

    <!-- SOMMAIRE EXÉCUTIF -->
    <div class="chapter chapter-first">
      <h2><span class="chapter-num">00</span> Table des Matières & Parcours des Scénarios</h2>
      <div class="card-grid">
        <div class="card">
          <div class="card-title">MODULE FONDATION & SÉCURITÉ</div>
          <p style="margin:0; color:#475569; font-size:11px;">
            • <strong>Scénario 01</strong> : Page d'Accueil & Espace Visiteur<br>
            • <strong>Scénario 02</strong> : Matrice des Rôles & Sécurité RBAC
          </p>
        </div>
        <div class="card">
          <div class="card-title">MODULE APPRENANT & CERTIFICATION</div>
          <p style="margin:0; color:#475569; font-size:11px;">
            • <strong>Scénario 03</strong> : Catalogue des Formations & Devises<br>
            • <strong>Scénario 04</strong> : Lecteur de Cours & Console de Pratique<br>
            • <strong>Scénario 05</strong> : Évaluation Certificative & Quiz QCM<br>
            • <strong>Scénario 06</strong> : Diplôme Officiel & QR Code Infalsifiable
          </p>
        </div>
        <div class="card">
          <div class="card-title">MODULE GAMIFICATION & IA CONVERSATIONNELLE</div>
          <p style="margin:0; color:#475569; font-size:11px;">
            • <strong>Scénario 07</strong> : Gamification, Niveaux XP & ITECH Coins<br>
            • <strong>Scénario 08</strong> : Tuteur Virtuel IA & Mascotte Robot Android<br>
            • <strong>Scénario 09</strong> : Extension Omnicanale WhatsApp (+1 555-631-6001)
          </p>
        </div>
        <div class="card">
          <div class="card-title">MODULE FORMATEURS & ADMINISTRATION</div>
          <p style="margin:0; color:#475569; font-size:11px;">
            • <strong>Scénario 10</strong> : Studio Formateur IA & Curriculums Gemini<br>
            • <strong>Scénario 11</strong> : Éditeur Visuel de Curriculum MasterStudy<br>
            • <strong>Scénario 12</strong> : Suivi de Promotion & Émargement<br>
            • <strong>Scénario 13</strong> : Direction de Centre & Gestion des Campus<br>
            • <strong>Scénario 14</strong> : Gestion Multi-Devises & Taux de Change
          </p>
        </div>
      </div>
    </div>

    <!-- SCÉNARIO 1 : ACCUEIL -->
    <div class="chapter">
      <h2><span class="chapter-num">01</span> Scénario 1 : Page d'Accueil & Espace Visiteur</h2>
      <p>Le portail d'accueil public présente l'écosystème Academia ITECH aux candidats, recruteurs et partenaires institutionnels.</p>
      
      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/home</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${homeImg}" alt="Page d'accueil réelle" />
        <div class="screenshot-caption">
          <span>Figure 1.1 : Portail institutionnel avec statistiques en direct, sélection des centres régionaux et accès Démo 1-Clic.</span>
        </div>
      </div>

      <div class="step-list">
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-body">
            <strong>Découverte Panafricaine</strong>
            <p>Le visiteur consulte les formations phares en Intelligence Artificielle, Cloud, Cybersécurité et Fullstack, ainsi que les taux d'insertion professionnelle.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-body">
            <strong>Sélection de Campus</strong>
            <p>Choix instantané du campus d'excellence (Kinshasa Silicon River, Dakar Cyber Hub) via le sélecteur géographique en en-tête.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-body">
            <strong>Mode Démo 1-Clic</strong>
            <p>Bouton d'exploration sans mot de passe permettant d'auditer l'application immédiatement sous n'importe quel rôle.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SCÉNARIO 2 : RBAC PERMISSIONS -->
    <div class="chapter">
      <h2><span class="chapter-num">02</span> Scénario 2 : Matrice des Rôles & Sécurité RBAC</h2>
      <p>Academia ITECH applique une politique de sécurité basée sur 5 rôles étanches assurant la conformité et la protection des données.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/permissions</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${permissionsImg}" alt="Matrice de sécurité RBAC réelle" />
        <div class="screenshot-caption">
          <span>Figure 2.1 : Matrice d'audit de sécurité RBAC détaillant les 5 profils et leurs permissions granulaires.</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Rôle</th>
            <th>Missions Principales</th>
            <th>Privilèges Clés</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Visiteur</strong></td>
            <td>Découverte et prospection</td>
            <td>Consultation catalogue, vérification diplômes publics par QR code</td>
          </tr>
          <tr>
            <td><strong>Apprenant</strong></td>
            <td>Étudiant inscrit</td>
            <td>Suivi de cours, pratique console, passage de quiz, obtention certificats, XP & jetons</td>
          </tr>
          <tr>
            <td><strong>Formateur</strong></td>
            <td>Enseignant certifié</td>
            <td>Accès Studio IA Gemini, création de cours, édition curriculum, suivi d'émargement</td>
          </tr>
          <tr>
            <td><strong>Directeur</strong></td>
            <td>Gestionnaire de campus</td>
            <td>Gestion du corps enseignant, attribution des filières, suivi des quotas d'inscriptions</td>
          </tr>
          <tr>
            <td><strong>Super Admin</strong></td>
            <td>Gouvernance globale</td>
            <td>Administration multi-devises (USD/FC), politiques tarifaires et audit plateforme</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- SCÉNARIO 3 : CATALOGUE -->
    <div class="chapter">
      <h2><span class="chapter-num">03</span> Scénario 3 : Catalogue des Formations & Devises</h2>
      <p>Le catalogue centralise tous les parcours certifiants avec filtres réactifs et affichage en devises locales (USD et Franc Congolais).</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/catalog</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${catalogImg}" alt="Catalogue des cours réel" />
        <div class="screenshot-caption">
          <span>Figure 3.1 : Catalogue avec cartes de cours, instructeurs associés, badges de difficulté et conversion de devises.</span>
        </div>
      </div>

      <div class="step-list">
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-body">
            <strong>Filtres Spécialisés</strong>
            <p>Filtrage instantané par spécialité : IA & Grands Modèles, Cloud Distribué, Cybersécurité, Développement Fullstack.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-body">
            <strong>Bascule Monétaire Dynamique</strong>
            <p>Affichage synchronisé en USD ($) ou Franc Congolais (FC) calculé en temps réel selon le taux de change officiel.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-body">
            <strong>Démarrage Immédiat</strong>
            <p>Un clic sur « Commencer » inscrit immédiatement l'étudiant et lance le lecteur de cours sans rupture.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SCÉNARIO 4 : LECTEUR DE COURS -->
    <div class="chapter">
      <h2><span class="chapter-num">04</span> Scénario 4 : Lecteur de Cours & Console Interactive</h2>
      <p>Espace d'apprentissage immersif regroupant la vidéo haute définition, le sommaire séquentiel, les fichiers sources et le suivi d'avancement.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/player</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${playerImg}" alt="Lecteur de cours interactif réel" />
        <div class="screenshot-caption">
          <span>Figure 4.1 : Lecteur multimédia avec réglages vidéo, chapitrage à coches, bouton +50 XP et console de travail.</span>
        </div>
      </div>

      <div class="callout callout-info">
        <strong>Synchronisation Cloud Automatique :</strong> Chaque clic sur « Marquer comme terminé » transmet l'état d'avancement à la base Firestore en temps réel et crédite 50 points d'expérience (XP) au compte de l'élève.
      </div>
    </div>

    <!-- SCÉNARIO 5 : QUIZ CERTIFICATIF -->
    <div class="chapter">
      <h2><span class="chapter-num">05</span> Scénario 5 : Évaluation Certificative & Quiz QCM</h2>
      <p>Examens officiels cadencés par chronomètre pour valider les compétences théoriques et pratiques acquises.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/quiz-player</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${quizImg}" alt="Quiz interactif réel" />
        <div class="screenshot-caption">
          <span>Figure 5.1 : Interface d'examen avec compte à rebours, questions techniques et validation en direct.</span>
        </div>
      </div>

      <div class="card-grid">
        <div class="card">
          <div class="card-title">Seuil d'Admissibilité : 80%</div>
          <p style="margin:0; color:#475569; font-size:11px;">Un score minimal de 80% est exigé pour débloquer la certification officielle. En deçà, l'élève est invité à réviser avec le tuteur IA.</p>
        </div>
        <div class="card">
          <div class="card-title">Feedback Immédiat</div>
          <p style="margin:0; color:#475569; font-size:11px;">Chaque réponse incorrecte est accompagnée d'une explication conceptuelle détaillée pour consolider les acquis.</p>
        </div>
      </div>
    </div>

    <!-- SCÉNARIO 6 : CERTIFICAT & QR CODE -->
    <div class="chapter">
      <h2><span class="chapter-num">06</span> Scénario 6 : Diplôme Officiel & QR Code Infalsifiable</h2>
      <p>Attestation institutionnelle infalsifiable délivrée automatiquement à la réussite des épreuves.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/certificate-verify</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${certImg}" alt="Diplôme officiel infalsifiable réel" />
        <div class="screenshot-caption">
          <span>Figure 6.1 : Diplôme d'excellence avec sceau or, identifiant unique, mention d'honneur et QR code de contrôle.</span>
        </div>
      </div>

      <div class="step-list">
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-body">
            <strong>Génération Sécurisée</strong>
            <p>Calcul automatique de la mention (Très Bien, Bien, Assez Bien) et inscription du matricule unique en registre cloud.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-body">
            <strong>Téléchargement PDF A4</strong>
            <p>Fichier haute définition vectoriel prêt pour encadrement ou attachement aux dossiers de candidature professionnelle.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-body">
            <strong>Vérification Publique Instantanée</strong>
            <p>Tout recruteur scannant le QR code accède à la fiche officielle attestant de l'authenticité sans intermédiaire.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SCÉNARIO 7 : GAMIFICATION -->
    <div class="chapter">
      <h2><span class="chapter-num">07</span> Scénario 7 : Gamification, Niveaux XP & ITECH Coins</h2>
      <p>Mécanique d'émulation pédagogique récompensant la régularité et l'excellence académique des étudiants.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/gamification</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${gamificationImg}" alt="Espace gamification réel" />
        <div class="screenshot-caption">
          <span>Figure 7.1 : Profil étudiant avec jauge d'expérience, palier de rang, boutique de pièces ITECH Coins et classement.</span>
        </div>
      </div>

      <div class="card-grid">
        <div class="card">
          <div class="card-title">Progression par XP</div>
          <p style="margin:0; color:#475569; font-size:11px;">Chaque leçon achevée rapporte +50 XP et chaque quiz réussi rapporte +100 XP, permettant de gravir les échelons de rang.</p>
        </div>
        <div class="card">
          <div class="card-title">Boutique ITECH Coins</div>
          <p style="margin:0; color:#475569; font-size:11px;">Les pièces virtuelles accumulées permettent de débloquer gratuitement des cours premiums et masterclasses exclusives.</p>
        </div>
      </div>
    </div>

    <!-- SCÉNARIO 8 : TUTEUR IA GEMINI -->
    <div class="chapter">
      <h2><span class="chapter-num">08</span> Scénario 8 : Tuteur Virtuel IA & Mascotte Robot Android</h2>
      <p>Assistant conversationnel interactif propulsé par Google Gemini, conscient du cours en cours de visionnage.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/tuteur</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${tutorImg}" alt="Tuteur virtuel IA réel" />
        <div class="screenshot-caption">
          <span>Figure 8.1 : Tuteur virtuel AIDA avec mascotte robot animée, historique de discussion et suggestions rapides.</span>
        </div>
      </div>

      <div class="callout callout-info">
        <strong>Contextualisation Automatique :</strong> Le tuteur sait exactement à quelle leçon vous êtes arrêté et formule des explications sur mesure adaptées aux technologies abordées.
      </div>
    </div>

    <!-- SCÉNARIO 9 : WHATSAPP OMNICANAL -->
    <div class="chapter">
      <h2><span class="chapter-num">09</span> Scénario 9 : Extension Omnicanale WhatsApp (+1 555-631-6001)</h2>
      <p>Accès universel à la formation pour les apprenants sur mobile, sans ordinateur ni connexion internet haut débit.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/whatsapp-connector</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${whatsappImg}" alt="Assistant WhatsApp réel" />
        <div class="screenshot-caption">
          <span>Figure 9.1 : Passerelle WhatsApp Cloud API avec QR code de contact rapide, webhook résilient et diagnostic en direct.</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Commande WhatsApp</th>
            <th>Action Déclenchée</th>
            <th>Exemple de Réponse</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Bonjour / Salut</strong></td>
            <td>Message d'accueil officiel et menu interactif</td>
            <td>« Bienvenue sur Academia ITECH ! Tapez !cours pour explorer... »</td>
          </tr>
          <tr>
            <td><strong>!quiz</strong></td>
            <td>Envoi immédiat d'une question technique avec choix</td>
            <td>« Question IA : Qu'est-ce qu'un token dans un LLM ? 1) ... 2) ... »</td>
          </tr>
          <tr>
            <td><strong>!aide</strong></td>
            <td>Affichage du guide des commandes rapides</td>
            <td>« Commandes disponibles : !quiz, !cours, !certificat, !support »</td>
          </tr>
          <tr>
            <td><em>Question libre</em></td>
            <td>Analyse pédagogique en direct par Gemini</td>
            <td>Explication simple avec analogie pratique et conseil de code</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- SCÉNARIO 10 : STUDIO FORMATEUR IA -->
    <div class="chapter">
      <h2><span class="chapter-num">10</span> Scénario 10 : Studio Formateur IA & Générateur Gemini</h2>
      <p>Accélérateur de production pédagogique pour formateurs permettant de concevoir un curriculum complet en 30 secondes.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/studio</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${studioImg}" alt="Studio formateur IA réel" />
        <div class="screenshot-caption">
          <span>Figure 10.1 : Studio IA de génération de cours avec sélection de sujet, public cible et structure automatique.</span>
        </div>
      </div>

      <div class="step-list">
        <div class="step-item">
          <div class="step-num">1</div>
          <div class="step-body">
            <strong>Paramétrage Pédagogique</strong>
            <p>L'enseignant définit le titre, le nombre de modules, le niveau d'expertise et les acquis d'apprentissage visés.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div class="step-body">
            <strong>Génération Assistée par Gemini</strong>
            <p>L'intelligence artificielle rédige l'arborescence complète, les résumés de leçons et les questions de quiz associées.</p>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div class="step-body">
            <strong>Publication Directe</strong>
            <p>Une fois relu, le cours est injecté directement dans le catalogue accessible aux étudiants du campus.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- SCÉNARIO 11 : CURRICULUM BUILDER -->
    <div class="chapter">
      <h2><span class="chapter-num">11</span> Scénario 11 : Éditeur Visuel de Curriculum & Leçons</h2>
      <p>Concepteur visuel modulaire inspiré de MasterStudy & Elementor pour assembler des formations structurées.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/course-builder</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${curriculumImg}" alt="Éditeur de curriculum réel" />
        <div class="screenshot-caption">
          <span>Figure 11.1 : Outil de composition visuelle des leçons, vidéos, ressources téléchargeables et évaluations.</span>
        </div>
      </div>
    </div>

    <!-- SCÉNARIO 12 : PROGRESS TRACKER -->
    <div class="chapter">
      <h2><span class="chapter-num">12</span> Scénario 12 : Suivi de Promotion & Émargement Pédagogique</h2>
      <p>Tableau de bord de supervision en direct pour surveiller la complétion des parcours et prévenir les décrochages.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/progress-tracker</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${trackerImg}" alt="Suivi de promotion réel" />
        <div class="screenshot-caption">
          <span>Figure 12.1 : Suivi nominatif des étudiants inscrits, taux de progression et résultats aux quiz.</span>
        </div>
      </div>
    </div>

    <!-- SCÉNARIO 13 : GESTION DES CENTRES -->
    <div class="chapter">
      <h2><span class="chapter-num">13</span> Scénario 13 : Direction de Centre & Administration Campus</h2>
      <p>Console de pilotage pour directeurs régionaux supervisant les formateurs, les effectifs étudiants et les abonnements.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/center-management</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${centersImg}" alt="Direction de campus réel" />
        <div class="screenshot-caption">
          <span>Figure 13.1 : Pilotage de campus avec affectation des enseignants, jauges d'effectifs et paramètres régionaux.</span>
        </div>
      </div>
    </div>

    <!-- SCÉNARIO 14 : MULTI-DEVISES -->
    <div class="chapter">
      <h2><span class="chapter-num">14</span> Scénario 14 : Gestion Multi-Devises & Taux de Change (USD / FC)</h2>
      <p>Administration financière permettant d'ajuster les taux de parité et d'activer les paiements Mobile Money locaux.</p>

      <div class="screenshot-card">
        <div class="screenshot-header">
          <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
          <span class="screenshot-title">https://academia-itech.org/admin-currency</span>
          <span class="screenshot-badge">Capture Réelle Plateforme</span>
        </div>
        <img class="screenshot-img" src="${currenciesImg}" alt="Administration des devises réelle" />
        <div class="screenshot-caption">
          <span>Figure 14.1 : Console de gestion monétaire : taux de référence USD/FC, marges de fluctuation et arrondis.</span>
        </div>
      </div>
    </div>

    <!-- CHAPITRE 15 : FAQ & SUPPORT -->
    <div class="chapter">
      <h2><span class="chapter-num">15</span> FAQ & Canaux d'Assistance Officiels</h2>
      <div class="card" style="margin-bottom:10px;">
        <div class="card-title">Comment s'assurer que le bot WhatsApp répond 24h/24 ?</div>
        <p style="margin:0; color:#475569; font-size:11px;">Le bot est déployé sur Cloudflare Workers et connecté au numéro officiel <strong>+1 555-631-6001</strong>. Veillez à utiliser l'indicatif international (+1) lors de l'enregistrement du contact.</p>
      </div>
      <div class="card" style="margin-bottom:10px;">
        <div class="card-title">Comment un recruteur valide-t-il un certificat Academia ITECH ?</div>
        <p style="margin:0; color:#475569; font-size:11px;">En scannant le QR code sur le diplôme papier ou PDF. La page officielle sécurisée affiche instantanément le nom de l'apprenant, le cours, la mention et la date d'émission.</p>
      </div>
      <div class="card">
        <div class="card-title">Coordonnées Officielles</div>
        <p style="margin:0; color:#475569; font-size:11px;">
          • Assistance Pédagogique : <strong>support@academia-itech.cd</strong><br>
          • Direction des Certifications : <strong>certificats@academia-itech.cd</strong><br>
          • Siège : Kinshasa & Lubumbashi (RDC) • Antenne Internationale : Dakar & Paris
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
