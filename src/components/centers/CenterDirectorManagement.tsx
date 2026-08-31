import React, { useState } from 'react';
import { Center, Trainer, Course } from '../../types';
import { CENTER_TEMPLATES } from '../../data/templatesData';
import { AdminCurrencySettings } from '../admin/AdminCurrencySettings';
import { AdminInstructorManagement } from '../admin/AdminInstructorManagement';
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
  Check,
  Coins
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
  const [activeTab, setActiveTab] = useState<'trainers' | 'configuration' | 'currencies' | 'cohorts' | 'templates'>('trainers');
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
                ? 'border-sky-500 text-sky-700 bg-white'
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
                ? 'border-sky-500 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Configuration & Branding du Centre</span>
          </button>

          <button
            onClick={() => setActiveTab('currencies')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'currencies'
                ? 'border-sky-500 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coins className="w-4 h-4 text-sky-600" />
            <span>Devises & Conversions</span>
          </button>

          <button
            onClick={() => setActiveTab('cohorts')}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'cohorts'
                ? 'border-sky-500 text-sky-700 bg-white'
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
                ? 'border-sky-500 text-sky-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wand2 className="w-4 h-4 text-amber-500" />
            <span>Modèles Clés en Main</span>
          </button>
        </div>

        {/* TAB 1: TRAINERS MANAGEMENT */}
        {activeTab === 'trainers' && (
          <div className="p-6">
            <AdminInstructorManagement
              trainers={trainers}
              courses={courses}
              activeCenter={activeCenter}
              onUpdateTrainers={(updatedTrainers) => {
                setTrainers(updatedTrainers);
                onUpdateCenter({ trainers: updatedTrainers, trainerCount: updatedTrainers.length });
              }}
            />
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

        {/* TAB 3: CURRENCIES */}
        {activeTab === 'currencies' && (
          <div className="p-6">
            <AdminCurrencySettings />
          </div>
        )}

        {/* TAB 4: COHORTS & CALENDAR */}
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

        {/* TAB 5: TEMPLATES */}
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
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <img src={tpl.logo} alt={tpl.name} className="w-12 h-12 rounded-xl object-cover mb-3" />
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      {tpl.subscriptionPlan.toUpperCase()}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-2">{tpl.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3">{tpl.description}</p>
                  </div>
                  <button
                    onClick={() => handleApplyCenterTemplate(tpl)}
                    className="w-full mt-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
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
    </div>
  );
};
