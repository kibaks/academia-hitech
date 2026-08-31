import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { PROFILE_TEMPLATES } from '../../data/templatesData';
import {
  Save,
  Check,
  Sparkles,
  Shield,
  Bell,
  Eye,
  Lock,
  Globe2,
  Smartphone,
  Mail,
  User,
  GraduationCap,
  Briefcase,
  Layers,
  Wand2
} from 'lucide-react';

interface ProfileSettingsTabProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const ProfileSettingsTab: React.FC<ProfileSettingsTabProps> = ({
  currentUser,
  onUpdateProfile,
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'experience' | 'privacy' | 'templates'>('general');
  const [savedNotification, setSavedNotification] = useState(false);

  // Form states initialized with currentUser data
  const [name, setName] = useState(currentUser.name);
  const [headline, setHeadline] = useState(currentUser.headline || 'Étudiant Passionné en IA & Ingénierie Web');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+33 6 12 34 56 78');
  const [city, setCity] = useState(currentUser.city || 'Paris');
  const [country, setCountry] = useState(currentUser.country || 'France');
  const [skillsStr, setSkillsStr] = useState((currentUser.skills || ['React', 'TypeScript', 'Intelligence Artificielle', 'Python', 'Docker']).join(', '));
  const [languagesStr, setLanguagesStr] = useState((currentUser.languages || ['Français (Natif)', 'Anglais (B2)']).join(', '));

  // Social links
  const [github, setGithub] = useState(currentUser.socialLinks?.github || 'https://github.com');
  const [linkedin, setLinkedin] = useState(currentUser.socialLinks?.linkedin || 'https://linkedin.com');
  const [portfolio, setPortfolio] = useState(currentUser.socialLinks?.portfolio || '');
  const [whatsapp, setWhatsapp] = useState(currentUser.socialLinks?.whatsapp || '');

  // Privacy & Preferences
  const [visibility, setVisibility] = useState(currentUser.privacySettings?.profileVisibility || 'public');
  const [showEmail, setShowEmail] = useState(currentUser.privacySettings?.showEmail ?? true);
  const [showPhone, setShowPhone] = useState(currentUser.privacySettings?.showPhone ?? false);
  const [emailNotifications, setEmailNotifications] = useState(currentUser.privacySettings?.emailNotifications ?? true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(currentUser.privacySettings?.whatsappAlerts ?? true);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const languages = languagesStr.split(',').map((l) => l.trim()).filter(Boolean);

    onUpdateProfile({
      name,
      headline,
      bio,
      email,
      phone,
      city,
      country,
      skills,
      languages,
      socialLinks: {
        github,
        linkedin,
        portfolio,
        whatsapp,
      },
      privacySettings: {
        profileVisibility: visibility as any,
        showEmail,
        showPhone,
        allowDirectMessages: true,
        emailNotifications,
        whatsappAlerts,
      },
    });

    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const applyTemplate = (template: typeof PROFILE_TEMPLATES[0]) => {
    if (template.data) {
      if (template.data.headline) setHeadline(template.data.headline);
      if (template.data.bio) setBio(template.data.bio);
      if (template.data.city) setCity(template.data.city);
      if (template.data.country) setCountry(template.data.country);
      if (template.data.skills) setSkillsStr(template.data.skills.join(', '));
      if (template.data.languages) setLanguagesStr(template.data.languages.join(', '));
      if (template.data.socialLinks?.github) setGithub(template.data.socialLinks.github);
      if (template.data.socialLinks?.linkedin) setLinkedin(template.data.socialLinks.linkedin);
      if (template.data.socialLinks?.portfolio) setPortfolio(template.data.socialLinks.portfolio);

      onUpdateProfile({
        ...template.data,
      });

      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Settings Navigation Bar */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
        <button
          onClick={() => setActiveSection('general')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeSection === 'general'
              ? 'border-sky-500 text-sky-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Informations Générales</span>
        </button>

        <button
          onClick={() => setActiveSection('experience')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeSection === 'experience'
              ? 'border-sky-500 text-sky-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Carrière & Éducation</span>
        </button>

        <button
          onClick={() => setActiveSection('privacy')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeSection === 'privacy'
              ? 'border-sky-500 text-sky-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Confidentialité & Notifications</span>
        </button>

        <button
          onClick={() => setActiveSection('templates')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeSection === 'templates'
              ? 'border-sky-500 text-sky-700 bg-white'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wand2 className="w-4 h-4 text-amber-500" />
          <span>Modèles de Profils Prédéfinis</span>
        </button>
      </div>

      {savedNotification && (
        <div className="m-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Vos paramètres de profil ont été enregistrés avec succès !</span>
        </div>
      )}

      {/* SECTION 1: GENERAL INFORMATIONS */}
      {activeSection === 'general' && (
        <form onSubmit={handleSaveGeneral} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nom Complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Titre / Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ex: Développeur Full-Stack IA | Étudiant Certifié"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Biographie Professionnelle
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Présentez vos objectifs académiques, vos centres d'intérêt et vos projets..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Adresse Email Principale
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Numéro WhatsApp / Téléphone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ville & Pays
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ville"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm"
                />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Pays"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Compétences Clés (séparées par des virgules)
              </label>
              <input
                type="text"
                value={skillsStr}
                onChange={(e) => setSkillsStr(e.target.value)}
                placeholder="React, TypeScript, Python, IA, Cloud..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Langues Parlées
              </label>
              <input
                type="text"
                value={languagesStr}
                onChange={(e) => setLanguagesStr(e.target.value)}
                placeholder="Français (Natif), Lingála (Courant), Anglais (B2)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm"
              />
            </div>
          </div>

          {/* Social Links Section */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-sky-600" />
              <span>Liens Web & Réseaux Sociaux</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Profil GitHub</label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/votre-nom"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Profil LinkedIn</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/votre-nom"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Site Web Portfolio</label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://mon-portfolio.tech"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Lien WhatsApp Direct</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-xs active:scale-95 shadow-sky-500/20 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les Modifications</span>
            </button>
          </div>
        </form>
      )}

      {/* SECTION 2: EXPERIENCE & EDUCATION */}
      {activeSection === 'experience' && (
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-sky-600" />
              <span>Expériences Professionnelles & Stages</span>
            </h4>
            <div className="space-y-3">
              {(currentUser.workplaces || [
                { id: '1', role: 'Apprenant Développeur', company: 'Academia ITECH Lab', period: '2025 - Présent', current: true },
                { id: '2', role: 'Projet Numérique', company: 'Initiative Tech Locale', period: '2024', current: false }
              ]).map((w) => (
                <div key={w.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-slate-900">{w.role}</h5>
                    <p className="text-xs text-slate-600">{w.company} • {w.period}</p>
                  </div>
                  {w.current && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Poste Actuel
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-600" />
              <span>Formation & Diplômes Obtenus</span>
            </h4>
            <div className="space-y-3">
              {(currentUser.education || [
                { id: 'e1', school: currentUser.centerName || 'Academia ITECH Campus', degree: 'Programme d\'Ingénierie IA & Développement Web', year: '2025 - 2026' }
              ]).map((edu) => (
                <div key={edu.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-sm text-slate-900">{edu.degree}</h5>
                  <p className="text-xs text-slate-600">{edu.school} • {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PRIVACY & NOTIFICATIONS */}
      {activeSection === 'privacy' && (
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">Visibilité du Profil</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'public', title: 'Public', desc: 'Visible par tous les membres et visiteurs' },
                { id: 'students_only', title: 'Campus Uniquement', desc: 'Visible uniquement par vos formateurs et camarades' },
                { id: 'private', title: 'Privé', desc: 'Visible uniquement par vous et les administrateurs' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setVisibility(item.id as any)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    visibility === item.id
                      ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    <input
                      type="radio"
                      checked={visibility === item.id}
                      onChange={() => {}}
                      className="text-sky-600"
                    />
                  </div>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Notifications & Alertes</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-600" />
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">Notifications par Email</span>
                    <p className="text-[11px] text-slate-500">Rappels de cours, certifications obtenues et réponses de formateurs</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded text-sky-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">Alertes WhatsApp & Tuteur AIDA</span>
                    <p className="text-[11px] text-slate-500">Quiz quotidiens, conseils d'apprentissage express et rappels de révision</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="rounded text-emerald-600 w-4 h-4"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveGeneral}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-xs active:scale-95 shadow-sky-500/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Enregistrer les Préférences</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: TEMPLATES */}
      {activeSection === 'templates' && (
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-amber-900 mb-0.5">Modèles de Profils Clés en Main</h5>
              <p>
                Appliquez un modèle structuré en un clic pour configurer instantanément votre biographie, vos compétences, vos liens et votre expérience académique.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {PROFILE_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {tpl.role.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{tpl.label}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-3">{tpl.description}</p>
                </div>
                <button
                  onClick={() => applyTemplate(tpl)}
                  className="w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-95 shadow-sky-500/20"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Appliquer ce Modèle</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
