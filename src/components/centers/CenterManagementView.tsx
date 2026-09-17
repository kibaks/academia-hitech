import React, { useState } from 'react';
import { Center, Trainer, Course } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { AdminCurrencySettings } from '../admin/AdminCurrencySettings';
import { AdminInstructorManagement } from '../admin/AdminInstructorManagement';
import { ImageUploader } from '../common/ImageUploader';
import {
  Building2,
  Users,
  UserPlus,
  Shield,
  CreditCard,
  CheckCircle2,
  Settings,
  Sparkles,
  Award,
  BookOpen,
  Mail,
  Edit,
  Trash2,
  TrendingUp,
  Zap,
  Coins
} from 'lucide-react';

interface CenterManagementViewProps {
  activeCenter: Center;
  allCenters: Center[];
  courses: Course[];
  onUpdateCenter: (updatedCenter: Center) => void;
  onSwitchCenter: (center: Center) => void;
}

export const CenterManagementView: React.FC<CenterManagementViewProps> = ({
  activeCenter,
  allCenters,
  courses,
  onUpdateCenter,
  onSwitchCenter,
}) => {
  const { formatPrice, currencyInfo } = useCurrency();
  const [activeTab, setActiveTab] = useState<'trainers' | 'subscription' | 'currencies' | 'settings' | 'analytics'>('trainers');
  const [trainers, setTrainers] = useState<Trainer[]>(activeCenter.trainers);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Pricing constants in USD baseline
  const PLAN_PRICES = {
    starter: { monthly: 320, annual: 260 },
    pro: { monthly: 750, annual: 600 },
    enterprise: { monthly: 1620, annual: 1300 },
  };

  // New Trainer Form Modal state
  const [showAddTrainerModal, setShowAddTrainerModal] = useState(false);
  const [trainerName, setTrainerName] = useState('');
  const [trainerEmail, setTrainerEmail] = useState('');
  const [trainerSpecialty, setTrainerSpecialty] = useState('');
  const [trainerBio, setTrainerBio] = useState('');

  // Center Settings State
  const [centerName, setCenterName] = useState(activeCenter.name);
  const [centerLogo, setCenterLogo] = useState(activeCenter.logo);
  const [primaryColor, setPrimaryColor] = useState(activeCenter.primaryColor || '#0ea5e9');

  const handleAddTrainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerName || !trainerEmail) return;

    const newTrainer: Trainer = {
      id: `trainer-${Date.now()}`,
      name: trainerName,
      email: trainerEmail,
      specialty: trainerSpecialty || 'Intelligence Artificielle & Cloud',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      bio: trainerBio || 'Formateur certifié Academia ITECH.',
      coursesAssigned: [],
      rating: 5.0,
      status: 'active',
    };

    const updatedTrainers = [...trainers, newTrainer];
    setTrainers(updatedTrainers);
    onUpdateCenter({
      ...activeCenter,
      trainers: updatedTrainers,
    });

    setTrainerName('');
    setTrainerEmail('');
    setTrainerSpecialty('');
    setTrainerBio('');
    setShowAddTrainerModal(false);
    alert(`✅ Formateur ${trainerName} ajouté avec succès au centre ${activeCenter.name} !`);
  };

  const handleUpdatePlan = (newPlan: Center['subscriptionPlan']) => {
    const updated = {
      ...activeCenter,
      subscriptionPlan: newPlan,
      maxStudents: newPlan === 'enterprise' ? 5000 : newPlan === 'pro' ? 1000 : 250,
    };
    onUpdateCenter(updated);
    alert(`🎉 Abonnement du centre mis à jour vers : Plan ${newPlan.toUpperCase()} !`);
  };

  const handleSaveSettings = () => {
    onUpdateCenter({
      ...activeCenter,
      name: centerName,
      logo: centerLogo,
      primaryColor: primaryColor,
    });
    alert('Paramètres de l’organisation enregistrés !');
  };

  return (
    <div id="center-management-view" className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={activeCenter.logo}
              alt={activeCenter.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-50 text-sky-700 border border-sky-200">
                  Centre Partenaire Partagé
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  Plan {activeCenter.subscriptionPlan.toUpperCase()}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {activeCenter.name}
              </h1>
              <p className="text-xs text-slate-500">
                Domaine : <span className="text-sky-600 font-medium">{activeCenter.subdomain}.academia-itech.com</span>
              </p>
            </div>
          </div>

          {/* Quick Center Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <Building2 className="w-4 h-4 text-slate-500 ml-2" />
            <select
              value={activeCenter.id}
              onChange={(e) => {
                const found = allCenters.find((c) => c.id === e.target.value);
                if (found) onSwitchCenter(found);
              }}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none pr-2 cursor-pointer"
            >
              {allCenters.map((c) => (
                <option key={c.id} value={c.id} className="bg-white text-slate-800">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick KPI Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Apprenants Inscrits</span>
            <div className="text-xl font-bold text-slate-900 mt-1">
              {activeCenter.studentsCount} <span className="text-xs text-slate-500 font-normal">/ {activeCenter.maxStudents}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Corps Enseignant</span>
            <div className="text-xl font-bold text-sky-600 mt-1">
              {trainers.length} Formateurs
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Certificats Délivrés</span>
            <div className="text-xl font-bold text-amber-600 mt-1">
              142 Titres
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Taux de Réussite</span>
            <div className="text-xl font-bold text-emerald-600 mt-1">
              94.8%
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('trainers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'trainers'
              ? 'bg-sky-500 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestion des Formateurs ({trainers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'subscription'
              ? 'bg-sky-500 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Abonnement & Licences</span>
        </button>

        <button
          onClick={() => setActiveTab('currencies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'currencies'
              ? 'bg-sky-500 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Devises & Taux de Conversion</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'settings'
              ? 'bg-sky-500 text-white shadow-xs font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Personnalisation & Marque Blanche</span>
        </button>
      </div>

      {/* TAB 1: Trainers */}
      {activeTab === 'trainers' && (
        <AdminInstructorManagement
          trainers={trainers}
          courses={courses}
          activeCenter={activeCenter}
          onUpdateTrainers={(updatedTrainers) => {
            setTrainers(updatedTrainers);
            onUpdateCenter({
              ...activeCenter,
              trainers: updatedTrainers,
              trainerCount: updatedTrainers.length,
            });
          }}
        />
      )}

      {/* TAB 2: Subscriptions & Center Tiers with Dynamic Currency Configuration */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
              <Coins className="w-3.5 h-3.5 text-sky-500" />
              <span>Facturation selon devise active : {currencyInfo.flag} {currencyInfo.name}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Formules d'Abonnement pour Centres de Formation</h3>
            <p className="text-xs text-slate-500">
              Débloquez des quotas étendus, l'accès illimité au Studio IA, et la délivrance de certificats officiels illimités.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold mt-2">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mensuel
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  billingCycle === 'annual'
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annuel</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${billingCycle === 'annual' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 bg-white shadow-xs transition-all ${
              activeCenter.subscriptionPlan === 'starter'
                ? 'border-sky-500 ring-2 ring-sky-500/20'
                : 'border-slate-200'
            }`}>
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase text-slate-500">Starter</span>
                <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-1">
                  <span>{formatPrice(billingCycle === 'monthly' ? PLAN_PRICES.starter.monthly : PLAN_PRICES.starter.annual)}</span>
                  <span className="text-xs text-slate-500 font-normal">/ mois</span>
                </div>
                <p className="text-xs text-slate-600">Idéal pour les petits instituts et centres en démarrage.</p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div>✓ Jusqu'à 250 apprenants</div>
                  <div>✓ 5 Formateurs inclus</div>
                  <div>✓ 50 générations IA / mois</div>
                  <div>✓ Tuteur WhatsApp basique</div>
                </div>
              </div>
              <button
                onClick={() => handleUpdatePlan('starter')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeCenter.subscriptionPlan === 'starter'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 cursor-default font-bold'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95'
                }`}
              >
                {activeCenter.subscriptionPlan === 'starter' ? 'Formule Actuelle' : 'Choisir Starter'}
              </button>
            </div>

            {/* Pro Plan */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 relative bg-white shadow-sm transition-all ${
              activeCenter.subscriptionPlan === 'pro'
                ? 'border-sky-500 ring-2 ring-sky-500/30'
                : 'border-slate-200'
            }`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-sky-500 text-white uppercase shadow-xs shadow-sky-500/20">
                Le Plus Populaire
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase text-sky-600">Pro Academy</span>
                <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-1">
                  <span>{formatPrice(billingCycle === 'monthly' ? PLAN_PRICES.pro.monthly : PLAN_PRICES.pro.annual)}</span>
                  <span className="text-xs text-slate-500 font-normal">/ mois</span>
                </div>
                <p className="text-xs text-slate-600">Conçu pour les académies technologiques en pleine croissance.</p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div>✓ Jusqu'à 1 000 apprenants</div>
                  <div>✓ Formateurs illimités</div>
                  <div>✓ Studio IA Illimité (Gemini 3.7)</div>
                  <div>✓ Tuteur WhatsApp & Rappels IA</div>
                  <div>✓ Certificats Blockchain sécurisés</div>
                </div>
              </div>
              <button
                onClick={() => handleUpdatePlan('pro')}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  activeCenter.subscriptionPlan === 'pro'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 cursor-default font-bold'
                    : 'bg-sky-500 hover:bg-sky-400 text-white shadow-xs shadow-sky-500/20 active:scale-95'
                }`}
              >
                {activeCenter.subscriptionPlan === 'pro' ? 'Formule Actuelle' : 'Activer Pro Academy'}
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-6 bg-white shadow-xs transition-all ${
              activeCenter.subscriptionPlan === 'enterprise'
                ? 'border-sky-500 ring-2 ring-sky-500/20'
                : 'border-slate-200'
            }`}>
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase text-slate-700">Enterprise Multi-Campuses</span>
                <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-1">
                  <span>{formatPrice(billingCycle === 'monthly' ? PLAN_PRICES.enterprise.monthly : PLAN_PRICES.enterprise.annual)}</span>
                  <span className="text-xs text-slate-500 font-normal">/ mois</span>
                </div>
                <p className="text-xs text-slate-600">Pour les universités et réseaux de centres mondiaux.</p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div>✓ 5 000+ apprenants</div>
                  <div>✓ Marque blanche intégrale</div>
                  <div>✓ Connecteurs API & SSO SAML</div>
                  <div>✓ Serveur Dédié & SLA 99.9%</div>
                </div>
              </div>
              <button
                onClick={() => handleUpdatePlan('enterprise')}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeCenter.subscriptionPlan === 'enterprise'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 cursor-default font-bold'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95'
                }`}
              >
                {activeCenter.subscriptionPlan === 'enterprise' ? 'Formule Actuelle' : 'Choisir Enterprise'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Currencies & Conversion Rates */}
      {activeTab === 'currencies' && (
        <AdminCurrencySettings />
      )}

      {/* TAB 4: Settings & White-Label */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900">Personnalisation du Centre (Marque Blanche)</h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Nom du Centre :</label>
              <input
                type="text"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>

            <ImageUploader
              id="center-logo-uploader"
              label="Logo Officiel du Centre / Campus"
              description="PNG, SVG, JPG (format carré recommandé)"
              value={centerLogo}
              onChange={(newLogo) => setCenterLogo(newLogo)}
              aspectRatio="square"
              shape="rounded"
              placeholderText="Glissez le logo de votre campus ou parcourez vos fichiers"
              className="py-1"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Couleur Primaire Thématique :</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-600">{primaryColor}</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 rounded-xl text-xs font-bold bg-sky-500 text-white hover:bg-sky-400 shadow-xs shadow-sky-500/20 active:scale-95 transition-all"
              >
                Sauvegarder les modifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
