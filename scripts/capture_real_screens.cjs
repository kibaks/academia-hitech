const { chromium } = require('/root/.npm/_npx/e41f203b7505f1fb/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR_REAL = path.join(__dirname, '../src/assets/images/real');
const OUTPUT_DIR_ROOT = path.join(__dirname, '../src/assets/images');

if (!fs.existsSync(OUTPUT_DIR_REAL)) {
  fs.mkdirSync(OUTPUT_DIR_REAL, { recursive: true });
}

async function captureAllScenarios() {
  console.log('🚀 Démarrage de la capture haute-fidélité des écrans réels...');
  
  const browser = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=medium',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // Retina 2x ultra-sharp resolution
    locale: 'fr-FR',
  });

  const page = await context.newPage();

  console.log('1. Chargement de http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2000);

  // Helper pour capturer un scénario avec double sauvegarde (dans images/ et images/real/)
  async function takeScenario(filename, setupFn, waitMs = 1200) {
    console.log(`📸 Capture de ${filename}...`);
    try {
      await page.evaluate(setupFn);
      await page.waitForTimeout(waitMs);
      
      const targetReal = path.join(OUTPUT_DIR_REAL, filename);
      const targetRoot = path.join(OUTPUT_DIR_ROOT, filename);
      
      const buffer = await page.screenshot({ type: 'jpeg', quality: 94 });
      fs.writeFileSync(targetReal, buffer);
      fs.writeFileSync(targetRoot, buffer);
      
      console.log(`✅ ${filename} sauvegardé (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`❌ Erreur capture ${filename}:`, e);
    }
  }

  // 1. SCÉNARIO 1 : PAGE D'ACCUEIL / VISITEUR
  await takeScenario('real_home.jpg', () => {
    window.scrollTo(0, 0);
    window.__ACADEMIA_NAVIGATE__({ tab: 'home', role: 'visitor', openQuiz: false, openCert: false });
  }, 1000);

  // 2. SCÉNARIO 2 : MATRICE DES RÔLES & PERMISSIONS RBAC
  await takeScenario('real_permissions.jpg', () => {
    window.scrollTo(0, 0);
    window.__ACADEMIA_NAVIGATE__({ tab: 'permissions', role: 'super_admin', openQuiz: false, openCert: false });
  }, 1200);

  // 3. SCÉNARIO 3 : CATALOGUE DE COURS & RECHERCHE BIDEVISE
  await takeScenario('real_catalog.jpg', () => {
    window.scrollTo(0, 0);
    window.__ACADEMIA_NAVIGATE__({ tab: 'catalog', role: 'learner', openQuiz: false, openCert: false });
  }, 1200);

  // 4. SCÉNARIO 4 : LECTEUR DE COURS INTERACTIF
  await takeScenario('real_player.jpg', () => {
    window.scrollTo(0, 0);
    window.__ACADEMIA_NAVIGATE__({ tab: 'player', role: 'learner', courseId: 'course-ia-llm', openQuiz: false, openCert: false });
  }, 1500);

  // 5. SCÉNARIO 5 : QUIZ CERTIFICATIF EN DIRECT
  await takeScenario('real_quiz.jpg', () => {
    window.__ACADEMIA_NAVIGATE__({ tab: 'player', role: 'learner', courseId: 'course-ia-llm', openQuiz: true, openCert: false });
  }, 1200);

  // 6. SCÉNARIO 6 : CERTIFICAT OFFICIEL AVEC SCEAU D'OR & QR CODE
  await takeScenario('real_certificate.jpg', () => {
    window.__ACADEMIA_NAVIGATE__({ openQuiz: false, openCert: true });
  }, 1200);

  // Fermer la modal de certificat
  await page.evaluate(() => {
    window.__ACADEMIA_NAVIGATE__({ openCert: false, openQuiz: false });
  });
  await page.waitForTimeout(500);

  // 7. SCÉNARIO 7 : GAMIFICATION, ITECH COINS, NIVEAUX XP & BADGES
  await takeScenario('real_gamification.jpg', () => {
    window.scrollTo(0, 0);
    window.__ACADEMIA_NAVIGATE__({ tab: 'gamification', role: 'learner', openQuiz: false, openCert: false });
  }, 1200);

  // 8. SCÉNARIO 8 : TUTEUR VIRTUEL IA (AIDA)
  await takeScenario('real_tutor.jpg', () => {
    window.scrollTo(0, 0);
    window.__ACADEMIA_NAVIGATE__({ tab: 'tuteur', role: 'learner', openQuiz: false, openCert: false });
  }, 1200);

  // 9. SCÉNARIO 9 : ASSISTANT OMNICANAL WHATSAPP (+1 555-631-6001)
  await takeScenario('real_whatsapp.jpg', () => {
    window.__ACADEMIA_NAVIGATE__({ tab: 'tuteur', role: 'learner', openQuiz: false, openCert: false });
    const el = document.getElementById('whatsapp-connector-card') || 
               document.querySelector('[id*="whatsapp"]') ||
               document.querySelector('.bg-emerald-50, .bg-emerald-950') ||
               document.querySelector('[class*="whatsapp"]');
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
    } else {
      window.scrollBy(0, 500);
    }
  }, 1200);

  // 10. SCÉNARIO 10 : STUDIO DE CRÉATION IA (GEMINI) FORMATEUR
  await takeScenario('real_studio.jpg', () => {
    window.scrollTo(0, 0);
    window.__ACADEMIA_NAVIGATE__({ tab: 'studio', role: 'trainer', openQuiz: false, openCert: false });
  }, 1400);

  // 11. SCÉNARIO 11 : ÉDITEUR VISUEL DE CURRICULUM (BUILDER)
  await takeScenario('real_curriculum_builder.jpg', () => {
    window.scrollTo(0, 0);
    window.__ACADEMIA_NAVIGATE__({ tab: 'course-builder', role: 'trainer', openQuiz: false, openCert: false });
  }, 1400);

  // 12. SCÉNARIO 12 : SUIVI EN DIRECT DE LA PROMOTION (TRACKER)
  await takeScenario('real_progress_tracker.jpg', () => {
    window.scrollTo(0, 0);
    window.__ACADEMIA_NAVIGATE__({ tab: 'progress-tracker', role: 'trainer', openQuiz: false, openCert: false });
  }, 1400);

  // 13. SCÉNARIO 13 : DIRECTION DE CENTRE & GESTION DES CAMPUS
  await takeScenario('real_center_management.jpg', () => {
    window.scrollTo(0, 0);
    window.__ACADEMIA_NAVIGATE__({ tab: 'center-management', role: 'center_admin', openQuiz: false, openCert: false });
  }, 1400);

  // 14. SCÉNARIO 14 : GESTION DES DEVISES & TAUX DE CHANGE ADMIN
  await takeScenario('real_admin_currency.jpg', () => {
    window.scrollTo(0, 0);
    window.__ACADEMIA_NAVIGATE__({ tab: 'admin-currency', role: 'super_admin', openQuiz: false, openCert: false });
  }, 1400);

  console.log('🎉 Toutes les 14 captures d\'écran réelles haute définition ont été générées !');
  await browser.close();
}

captureAllScenarios().catch((err) => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
