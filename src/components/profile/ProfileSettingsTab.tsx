import React, { useState, useRef, useEffect } from 'react';
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
  Wand2,
  Upload,
  Camera,
  Image as ImageIcon
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

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

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

  // Synchronize when currentUser changes (e.g. from Firebase or role switch)
  useEffect(() => {
    setName(currentUser.name);
    setHeadline(currentUser.headline || 'Étudiant Passionné en IA & Ingénierie Web');
    setBio(currentUser.bio || '');
    setEmail(currentUser.email);
    setPhone(currentUser.phone || '+33 6 12 34 56 78');
    setCity(currentUser.city || 'Paris');
    setCountry(currentUser.country || 'France');
    setSkillsStr((currentUser.skills || ['React', 'TypeScript', 'Intelligence Artificielle', 'Python', 'Docker']).join(', '));
    setLanguagesStr((currentUser.languages || ['Français (Natif)', 'Anglais (B2)']).join(', '));
    setGithub(currentUser.socialLinks?.github || 'https://github.com');
    setLinkedin(currentUser.socialLinks?.linkedin || 'https://linkedin.com');
    setPortfolio(currentUser.socialLinks?.portfolio || '');
    setWhatsapp(currentUser.socialLinks?.whatsapp || '');
    setVisibility(currentUser.privacySettings?.profileVisibility || 'public');
    setShowEmail(currentUser.privacySettings?.showEmail ?? true);
    setShowPhone(currentUser.privacySettings?.showPhone ?? false);
    setEmailNotifications(currentUser.privacySettings?.emailNotifications ?? true);
    setWhatsappAlerts(currentUser.privacySettings?.whatsappAlerts ?? true);
  }, [currentUser]);

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onUpdateProfile({ avatar: ev.target.result as string });
          setSavedNotification(true);
          setTimeout(() => setSavedNotification(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onUpdateProfile({ coverPhoto: ev.target.result as string });
          setSavedNotification(true);
          setTimeout(() => setSavedNotification(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

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
      {/* Settings Navigation Bar - Responsive segmented pills with zero overflow */}
      <div className="flex items-center gap-1.5 p-2 bg-slate-50 border-b border-slate-200 overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { id: 'general', label: 'Informations Générales', icon: User },
          { id: 'experience', label: 'Carrière & Éducation', icon: Briefcase },
          { id: 'privacy', label: 'Confidentialité & Alertes', icon: Shield },
          { id: 'templates', label: 'Modèles de Profils', icon: Wand2, isAmber: true },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-white text-sky-700 shadow-xs border border-slate-200/90 ring-1 ring-sky-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? (sec.isAmber ? 'text-amber-500' : 'text-sky-600') : 'text-slate-400'}`} />
              <span>{sec.label}</span>
            </button>
          );
        })}
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
          {/* Photos Upload Cards from Local Device */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Avatar upload */}
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFile}
            />
            <div className="flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-200 shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">Photo de Profil</div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Charger depuis mon PC</span>
                </button>
              </div>
            </div>

            {/* Cover upload */}
            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleCoverFile}
            />
            <div className="flex items-center gap-3.5">
              <div className="relative w-20 h-14 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-800 shrink-0">
                <img
                  src={currentUser.coverPhoto || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80'}
                  alt="Couverture"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800">Photo de Couverture</div>
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Charger une couverture</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1.5">
                Nom & Prénom Complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-950 font-bold text-sm sm:text-base focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1.5">
                Titre Professionnel / Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ex: Développeur Full-Stack IA | Étudiant Certifié"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
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
