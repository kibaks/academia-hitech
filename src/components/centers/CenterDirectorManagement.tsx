import React, { useState } from 'react';
import { Center, Trainer, Course } from '../../types';
import { CENTER_TEMPLATES } from '../../data/templatesData';
import {
  Building2,
  Users,
  Sliders,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Save,
  Wand2,
  Mail,
  Star,
  BookOpen,
  Globe2,
  Palette,
  Shield,
  Layers,
  GraduationCap,
  Calendar,
  Check
} from 'lucide-react';

interface CenterDirectorManagementProps {
  activeCenter: Center;
  courses: Course[];
  onUpdateCenter: (updated: Partial<Center>) => void;
}

export const CenterDirectorManagement: React.FC<CenterDirectorManagementProps> = ({
  activeCenter,
  courses,
  onUpdateCenter,
}) => {
  const [activeTab, setActiveTab] = useState<'trainers' | 'configuration' | 'cohorts' | 'templates'>('trainers');
  const [trainers, setTrainers] = useState<Trainer[]>(activeCenter.trainers || []);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Configuration Form State
  const [centerName, setCenterName] = useState(activeCenter.name);
  const [description, setDescription] = useState(activeCenter.description);
  const [subdomain, setSubdomain] = useState(activeCenter.subdomain);
  const [customDomain, setCustomDomain] = useState(activeCenter.customDomain || '');
  const [primaryColor, setPrimaryColor] = useState(activeCenter.primaryColor || '#0ea5e9');
  const [contactEmail, setContactEmail] = useState(activeCenter.contactEmail);
  const [logo, setLogo] = useState(activeCenter.logo);
  const [maxStudents, setMaxStudents] = useState(activeCenter.maxStudents || 1000);

  // New Trainer Invite Form State
  const [newTrainerName, setNewTrainerName] = useState('');
  const [newTrainerEmail, setNewTrainerEmail] = useState('');
  const [newTrainerSpecialty, setNewTrainerSpecialty] = useState('');
  const [newTrainerBio, setNewTrainerBio] = useState('');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCenter({
      name: centerName,
      description,
      subdomain,
      customDomain,
      primaryColor,
      contactEmail,
      logo,
      maxStudents: Number(maxStudents),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddTrainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainerName.trim() || !newTrainerEmail.trim()) return;

    const newTrainer: Trainer = {
      id: `trainer-${Date.now()}`,
      name: newTrainerName,
      email: newTrainerEmail,
      specialty: newTrainerSpecialty || 'Intelligence Artificielle & Cloud',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: newTrainerBio || 'Formateur certifié auprès de l\'académie.',
      coursesAssigned: [],
      rating: 5.0,
      status: 'active',
    };

    const updatedTrainers = [...trainers, newTrainer];
    setTrainers(updatedTrainers);
    onUpdateCenter({ trainers: updatedTrainers, trainerCount: updatedTrainers.length });

    setNewTrainerName('');
    setNewTrainerEmail('');
    setNewTrainerSpecialty('');
    setNewTrainerBio('');
    setShowInviteModal(false);
  };

  const handleDeleteTrainer = (trainerId: string) => {
    const updated = trainers.filter((t) => t.id !== trainerId);
    setTrainers(updated);
    onUpdateCenter({ trainers: updated, trainerCount: updated.length });
  };

  const handleApplyCenterTemplate = (tpl: typeof CENTER_TEMPLATES[0]) => {
    setCenterName(tpl.name);
    setDescription(tpl.description);
    setSubdomain(tpl.subdomain);
    setPrimaryColor(tpl.primaryColor);
    setLogo(tpl.logo);

    onUpdateCenter({
      name: tpl.name,
      description: tpl.description,
      subdomain: tpl.subdomain,
      primaryColor: tpl.primaryColor,
      logo: tpl.logo,
      subscriptionPlan: tpl.subscriptionPlan,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Center Overview */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={activeCenter.logo}
            alt={activeCenter.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                Direction de Campus
              </span>
              <span className="text-xs text-slate-500 font-mono">Plan {activeCenter.subscriptionPlan.toUpperCase()}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{activeCenter.name}</h2>
            <p className="text-xs text-slate-500">{activeCenter.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('templates')}
            className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Wand2 className="w-4 h-4 text-amber-600" />
            <span>Modèles de Centres</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Configuration du centre enregistrée avec succès !</span>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
          <button
            onClick={() => setActiveTab('trainers')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'trainers'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestion des Formateurs ({trainers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('configuration')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'configuration'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Configuration & Branding du Centre</span>
          </button>

          <button
            onClick={() => setActiveTab('cohorts')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'cohorts'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Cohortes & Salles Virtuelles</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'templates'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-500" />
            <span>Modèles Clés en Main</span>
          </button>
        </div>

        {/* TAB 1: TRAINERS MANAGEMENT */}
        {activeTab === 'trainers' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Corps Enseignant & Formateurs Référents</h3>
                <p className="text-xs text-slate-500">Supervisez les formateurs affectés à votre campus et assignez-leur des cours</p>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Inviter un Formateur</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainers.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                          <span className="text-xs text-indigo-600 font-semibold">{t.specialty}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">{t.bio}</p>

                    <div className="flex items-center justify-between py-2 border-t border-slate-100 text-xs">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{t.rating} / 5.0</span>
                      </span>
                      <span className="text-slate-500 font-medium">
                        {t.coursesAssigned?.length || 1} cours assigné(s)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => alert(`Message envoyé à ${t.name}`)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Contacter</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTrainer(t.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Retirer du campus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CONFIGURATION & BRANDING */}
        {activeTab === 'configuration' && (
          <form onSubmit={handleSaveConfig} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nom du Centre de Formation *
                </label>
                <input
                  type="text"
                  value={centerName}
                  onChange={(e) => setCenterName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email de Contact Officiel *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description & Vision Pédagogique
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sous-domaine Académique
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-l-xl border border-r-0 border-slate-300 text-sm"
                  />
                  <span className="px-3 py-2.5 bg-slate-100 border border-slate-300 rounded-r-xl text-xs text-slate-500 font-mono">
                    .academia-itech.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Domaine Personnalisé (Optionnel)
                </label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="campus.mon-institut.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Couleur Principale du Thème (Hex)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Quota Maximum d'Étudiants
                </label>
                <input
                  type="number"
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer la Configuration</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: COHORTS & CALENDAR */}
        {activeTab === 'cohorts' && (
          <div className="p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Cohortes Actives & Calendrier de Rentrée</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Cohorte Alpha 2026 - IA & Data', dates: '15 Janvier - 15 Juillet 2026', students: 48, max: 60, status: 'En cours' },
                { name: 'Cohorte Beta 2026 - FullStack Web', dates: '1er Mars - 1er Septembre 2026', students: 35, max: 50, status: 'Inscriptions ouvertes' },
              ].map((c, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{c.dates}</p>
                  <div className="text-xs font-semibold text-slate-700 pt-2 border-t border-slate-200">
                    {c.students} / {c.max} étudiants inscrits
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-amber-900 mb-0.5">Modèles de Centres Pré-Configurés</h5>
                <p>
                  Appliquez une identité visuelle, des filières spécialisées et des barèmes d'excellence en un seul clic.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {CENTER_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <img src={tpl.logo} alt={tpl.name} className="w-12 h-12 rounded-xl object-cover mb-3" />
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {tpl.subscriptionPlan.toUpperCase()}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-2">{tpl.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3">{tpl.description}</p>
                  </div>
                  <button
                    onClick={() => handleApplyCenterTemplate(tpl)}
                    className="w-full mt-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Appliquer ce Modèle de Centre</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invite Trainer Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-base text-slate-900">Inviter un Formateur</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleAddTrainer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom & Prénom *</label>
                <input
                  type="text"
                  value={newTrainerName}
                  onChange={(e) => setNewTrainerName(e.target.value)}
                  placeholder="Dr. Jean Dupont"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Professionnel *</label>
                <input
                  type="email"
                  value={newTrainerEmail}
                  onChange={(e) => setNewTrainerEmail(e.target.value)}
                  placeholder="jean.dupont@campus.academy"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Spécialité Principale</label>
                <input
                  type="text"
                  value={newTrainerSpecialty}
                  onChange={(e) => setNewTrainerSpecialty(e.target.value)}
                  placeholder="Intelligence Artificielle & Deep Learning"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter au Campus</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
