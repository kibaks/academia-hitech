import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencyCode, BASE_SUPPORTED_CURRENCIES } from '../../lib/currency';
import {
  PaymentGatewayConfig,
  PaymentSubscriptionPlan,
  CourseOrder,
  PaymentGatewayId
} from '../../types';
import {
  getStoredPaymentGateways,
  saveStoredPaymentGateways,
  getStoredSubscriptionPlans,
  saveStoredSubscriptionPlans,
  getStoredOrders,
  saveStoredOrders,
  DEFAULT_PAYMENT_GATEWAYS
} from '../../lib/paymentGateways';
import { RdcPaymentLogo, RdcPaymentBadgesRow } from '../payment/RdcPaymentLogo';
import { RdcPaymentIntegrationGuideModal } from '../payment/RdcPaymentIntegrationGuideModal';
import {
  Coins,
  RefreshCw,
  Save,
  CheckCircle2,
  Sliders,
  DollarSign,
  ArrowRightLeft,
  Globe2,
  Sparkles,
  MapPin,
  TrendingUp,
  RotateCcw,
  Check,
  AlertCircle,
  CreditCard,
  Smartphone,
  PhoneCall,
  Zap,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Receipt,
  Crown,
  Search,
  Filter,
  ExternalLink,
  PlayCircle,
  CheckCheck,
  BookOpen,
  HelpCircle
} from 'lucide-react';

type AdminFinanceTab = 'gateways' | 'currencies' | 'subscriptions' | 'transactions';

export const AdminCurrencySettings: React.FC = () => {
  const {
    currencyCode,
    currencyInfo,
    setCurrencyCode,
    clientDetectedCode,
    clientDetectedCurrency,
    resetToClientCurrency,
    availableCurrencies,
    exchangeRates,
    updateExchangeRate,
    resetExchangeRates,
    defaultPlatformCurrency,
    setDefaultPlatformCurrency,
    formatAmount,
    convertPrice,
  } = useCurrency();

  // Active top tab
  const [activeTab, setActiveTab] = useState<AdminFinanceTab>('gateways');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // --- 1. GATEWAYS STATE ---
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(() => getStoredPaymentGateways());
  const [editingGatewayId, setEditingGatewayId] = useState<PaymentGatewayId | null>(null);
  const [gatewayCategoryFilter, setGatewayCategoryFilter] = useState<'all' | 'mobile_money' | 'card' | 'wallet' | 'aggregator'>('all');
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [gatewayFeedback, setGatewayFeedback] = useState<string | null>(null);
  const [pingStatus, setPingStatus] = useState<Record<string, 'idle' | 'testing' | 'success' | 'failed'>>({});

  // --- 2. CURRENCIES STATE ---
  const [editingRates, setEditingRates] = useState<Record<string, number>>(() => ({
    ...exchangeRates,
  }));
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [simulationUSD, setSimulationUSD] = useState<number>(50);

  // --- 3. SUBSCRIPTION PLANS STATE ---
  const [subscriptionPlans, setSubscriptionPlans] = useState<PaymentSubscriptionPlan[]>(() => getStoredSubscriptionPlans());
  const [planFeedback, setPlanFeedback] = useState<string | null>(null);

  // --- 4. TRANSACTIONS / ORDERS STATE ---
  const [orders, setOrders] = useState<CourseOrder[]>(() => getStoredOrders());
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderFilterGateway, setOrderFilterGateway] = useState<string>('all');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<CourseOrder | null>(null);

  useEffect(() => {
    setGateways(getStoredPaymentGateways());
    setSubscriptionPlans(getStoredSubscriptionPlans());
    setOrders(getStoredOrders());
  }, []);

  // --- GATEWAYS HANDLERS ---
  const handleToggleGatewayEnabled = (id: PaymentGatewayId) => {
    const updated = gateways.map((g) => (g.id === id ? { ...g, isEnabled: !g.isEnabled } : g));
    setGateways(updated);
    saveStoredPaymentGateways(updated);
    setGatewayFeedback(`Statut de ${id.toUpperCase()} mis à jour.`);
    setTimeout(() => setGatewayFeedback(null), 2500);
  };

  const handleToggleGatewayTestMode = (id: PaymentGatewayId) => {
    const updated = gateways.map((g) => (g.id === id ? { ...g, isTestMode: !g.isTestMode } : g));
    setGateways(updated);
    saveStoredPaymentGateways(updated);
    setGatewayFeedback(`Mode de ${id.toUpperCase()} basculé.`);
    setTimeout(() => setGatewayFeedback(null), 2500);
  };

  const handleUpdateGatewayField = (id: PaymentGatewayId, field: keyof PaymentGatewayConfig, val: any) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: val } : g))
    );
  };

  const handleSaveGateway = (id: PaymentGatewayId) => {
    saveStoredPaymentGateways(gateways);
    setGatewayFeedback(`Configuration de ${id.toUpperCase()} enregistrée avec succès !`);
    setTimeout(() => setGatewayFeedback(null), 3000);
  };

  const handleResetAllGateways = () => {
    if (confirm('Voulez-vous réinitialiser tous les agrégateurs de paiement aux valeurs d\'usine ?')) {
      saveStoredPaymentGateways(DEFAULT_PAYMENT_GATEWAYS);
      setGateways(DEFAULT_PAYMENT_GATEWAYS);
      setGatewayFeedback('Passerelles réinitialisées avec succès.');
      setTimeout(() => setGatewayFeedback(null), 3000);
    }
  };

  const handlePingGateway = (id: PaymentGatewayId) => {
    setPingStatus((prev) => ({ ...prev, [id]: 'testing' }));
    setTimeout(() => {
      setPingStatus((prev) => ({ ...prev, [id]: 'success' }));
      setTimeout(() => {
        setPingStatus((prev) => ({ ...prev, [id]: 'idle' }));
      }, 4000);
    }, 1000);
  };

  const toggleCurrencyInGateway = (gatewayId: PaymentGatewayId, currCode: string) => {
    const target = gateways.find((g) => g.id === gatewayId);
    if (!target) return;
    const exists = target.supportedCurrencies.includes(currCode);
    const newCurrencies = exists
      ? target.supportedCurrencies.filter((c) => c !== currCode)
      : [...target.supportedCurrencies, currCode];
    handleUpdateGatewayField(gatewayId, 'supportedCurrencies', newCurrencies);
  };

  // --- CURRENCIES HANDLERS ---
  const handleRateInputChange = (code: string, valueStr: string) => {
    const val = parseFloat(valueStr);
    setEditingRates((prev) => ({
      ...prev,
      [code]: isNaN(val) ? 0 : val,
    }));
  };

  const handleSaveSingleRate = (code: CurrencyCode) => {
    const newRate = editingRates[code];
    if (newRate && newRate > 0) {
      updateExchangeRate(code, newRate);
      setSaveFeedback(`Taux pour ${code} mis à jour : 1 USD = ${newRate.toLocaleString('fr-FR')} ${code}`);
      setTimeout(() => setSaveFeedback(null), 3500);
    }
  };

  const handleSaveAllRates = () => {
    (Object.entries(editingRates) as [CurrencyCode, number][]).forEach(([code, rate]) => {
      if (typeof rate === 'number' && rate > 0) {
        updateExchangeRate(code, rate);
      }
    });
    setSaveFeedback('Tous les taux de conversion ont été enregistrés avec succès !');
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  const handleResetRates = () => {
    if (confirm('Voulez-vous réinitialiser tous les taux aux valeurs officielles par défaut ?')) {
      resetExchangeRates();
      const defaultRates: Record<string, number> = {};
      BASE_SUPPORTED_CURRENCIES.forEach((c) => {
        defaultRates[c.code] = c.rateFromUSD;
      });
      setEditingRates(defaultRates);
      setSaveFeedback('Taux de change réinitialisés aux valeurs standards.');
      setTimeout(() => setSaveFeedback(null), 3000);
    }
  };

  // --- SUBSCRIPTIONS HANDLERS ---
  const handleUpdatePlanPrice = (planId: string, price: number) => {
    const updated = subscriptionPlans.map((p) => (p.id === planId ? { ...p, priceUSD: price } : p));
    setSubscriptionPlans(updated);
    saveStoredSubscriptionPlans(updated);
    setPlanFeedback('Tarif d\'abonnement mis à jour.');
    setTimeout(() => setPlanFeedback(null), 2500);
  };

  // --- TRANSACTIONS HANDLERS ---
  const handleCreateTestOrder = () => {
    const newOrder: CourseOrder = {
      id: 'ord-' + Date.now().toString(36),
      userId: 'user-test-' + Math.floor(Math.random() * 1000),
      userEmail: 'etudiant.test@academia-itech.com',
      userName: 'Étudiant Test Kinshasa',
      courseId: 'course-ia-llm',
      courseTitle: 'Masterclass IA Générative, LLMs & Traitement des Langues Africaines (NLP)',
      amountUSD: 45,
      paidAmount: 126000,
      paidCurrency: 'CDF',
      gateway: 'wave',
      paymentType: 'one_time',
      status: 'completed',
      transactionReference: 'WAVE-SIMUL-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: 'À l\'instant',
      receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      payerPhoneOrAccount: '+243 82 456 7890',
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveStoredOrders(updated);
  };

  const handleRefundOrder = (orderId: string) => {
    if (confirm('Confirmer le remboursement test de cette commande ?')) {
      const updated = orders.map((o) => (o.id === orderId ? { ...o, status: 'refunded' as const } : o));
      setOrders(updated);
      saveStoredOrders(updated);
    }
  };

  const filteredGateways = gateways.filter((g) => {
    if (gatewayCategoryFilter === 'all') return true;
    return g.providerType === gatewayCategoryFilter;
  });

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      orderSearchQuery === '' ||
      o.userName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.courseTitle.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.transactionReference.toLowerCase().includes(orderSearchQuery.toLowerCase());
    const matchGateway = orderFilterGateway === 'all' || o.gateway === orderFilterGateway;
    return matchSearch && matchGateway;
  });

  const totalRevenueUSD = orders.filter((o) => o.status === 'completed').reduce((acc, o) => acc + o.amountUSD, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-sky-500/10 via-sky-50 to-white border border-sky-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Gestion Financière & Agrégateurs de Paiement</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500 text-white uppercase tracking-wider">
                Admin
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Configuration des passerelles Mobile Money, conversion des devises FX et suivi des transactions.
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('transactions')}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Receipt className="w-3.5 h-3.5 text-sky-600" />
            <span>{orders.length} Transactions</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('gateways')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'gateways'
              ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Agrégateurs de Paiement ({gateways.filter((g) => g.isEnabled).length}/{gateways.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('currencies')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'currencies'
              ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Devises & Taux de Change FX ({availableCurrencies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'subscriptions'
              ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Formules d'Abonnement ({subscriptionPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'transactions'
              ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Journal des Commandes ({orders.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PAYMENT GATEWAYS CONFIGURATION                      */}
      {/* ========================================================= */}
      {activeTab === 'gateways' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* RDC Payment Banner & Guide Launcher */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇨🇩</span>
                <h4 className="text-sm font-black text-white">
                  Modalités de Paiement République Démocratique du Congo (RDC)
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  M-Pesa • Airtel • Afrimoney • Orange • Cartes RDC
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Paiements mobiles en Francs Congolais (CDF) et Dollars US (USD) avec Push USSD interactif et cartes bancaires 3D Secure.
              </p>
            </div>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-sky-500/30 transition-all cursor-pointer shrink-0"
            >
              <BookOpen className="w-4 h-4" />
              <span>Guide d'Intégration RDC (BCC)</span>
            </button>
          </div>

          <RdcPaymentBadgesRow size="md" />

          {/* Top filter & info bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1">Filtrer par type :</span>
              {[
                { id: 'all', label: 'Tous' },
                { id: 'mobile_money', label: 'Mobile Money' },
                { id: 'card', label: 'Cartes Bancaires' },
                { id: 'wallet', label: 'Portefeuilles & Guichets' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setGatewayCategoryFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                    gatewayCategoryFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetAllGateways}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Valeurs d'usine</span>
              </button>
            </div>
          </div>

          {gatewayFeedback && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{gatewayFeedback}</span>
            </div>
          )}

          {/* Gateways List Cards */}
          <div className="space-y-4">
            {filteredGateways.map((gw) => {
              const isExpanded = editingGatewayId === gw.id;
              const isSecretVisible = visibleSecrets[gw.id] || false;
              const ping = pingStatus[gw.id] || 'idle';
              const isRdc = ['mpesa', 'airtel_money', 'afrimoney', 'orange_money', 'stripe', 'maxicash', 'cinetpay'].includes(gw.id);

              return (
                <div
                  key={gw.id}
                  className={`rounded-3xl border transition-all ${
                    gw.isEnabled
                      ? 'bg-white border-slate-200 shadow-2xs hover:border-sky-300'
                      : 'bg-slate-50/70 border-slate-200/80 opacity-75'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3.5">
                      {isRdc ? (
                        <div className="p-1 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                          <RdcPaymentLogo gatewayId={gw.id} size="md" />
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          gw.isEnabled ? 'bg-sky-500/10 text-sky-600' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {gw.providerType === 'card' ? (
                            <CreditCard className="w-6 h-6" />
                          ) : gw.providerType === 'mobile_money' ? (
                            <Smartphone className="w-6 h-6" />
                          ) : (
                            <Zap className="w-6 h-6" />
                          )}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-extrabold text-slate-900">{gw.name}</h4>
                          {isRdc && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-red-100 text-red-700 border border-red-200">
                              🇨🇩 RDC
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                            {gw.providerType === 'mobile_money' ? 'Mobile Money' : gw.providerType === 'card' ? 'Carte Bancaire' : 'Portefeuille'}
                          </span>
                          {gw.isTestMode ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                              SANDBOX TEST
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                              PRODUCTION LIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{gw.description}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {gw.regions.map((r, i) => (
                            <span key={i} className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick toggles */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleToggleGatewayTestMode(gw.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          gw.isTestMode
                            ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title="Basculer entre Test Sandbox et Production"
                      >
                        {gw.isTestMode ? 'Passer en Live' : 'Passer en Test'}
                      </button>

                      <button
                        onClick={() => handleToggleGatewayEnabled(gw.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          gw.isEnabled
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xs'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {gw.isEnabled ? 'Activé' : 'Désactivé'}
                      </button>

                      <button
                        onClick={() => setEditingGatewayId(isExpanded ? null : gw.id)}
                        className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Settings Panel */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-4 rounded-b-3xl animate-in fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Public Key */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">
                            Clé Publique / Client ID / Token Public :
                          </label>
                          <input
                            type="text"
                            value={gw.publicKey}
                            onChange={(e) => handleUpdateGatewayField(gw.id, 'publicKey', e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        {/* Secret Key with Show/Hide toggle */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block flex items-center justify-between">
                            <span>Clé Secrète / Secret Key / API Token :</span>
                            <button
                              type="button"
                              onClick={() =>
                                setVisibleSecrets((prev) => ({ ...prev, [gw.id]: !isSecretVisible }))
                              }
                              className="text-[11px] text-sky-600 font-semibold flex items-center gap-1 hover:underline"
                            >
                              {isSecretVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              <span>{isSecretVisible ? 'Masquer' : 'Afficher'}</span>
                            </button>
                          </label>
                          <input
                            type={isSecretVisible ? 'text' : 'password'}
                            value={gw.secretKey}
                            onChange={(e) => handleUpdateGatewayField(gw.id, 'secretKey', e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
                          />
                        </div>

                        {/* Webhook Secret */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">
                            Secret Webhook / Signature Idempotente :
                          </label>
                          <input
                            type="text"
                            value={gw.webhookSecret || ''}
                            onChange={(e) => handleUpdateGatewayField(gw.id, 'webhookSecret', e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
                            placeholder="whsec_..."
                          />
                        </div>

                        {/* Merchant ID */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 mb-1 block">
                            ID Marchand / Shortcode USSD :
                          </label>
                          <input
                            type="text"
                            value={gw.merchantId || ''}
                            onChange={(e) => handleUpdateGatewayField(gw.id, 'merchantId', e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
                            placeholder="MERCHANT-01..."
                          />
                        </div>
                      </div>

                      {/* Supported Currencies Multi-select */}
                      <div>
                        <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                          Devises Acceptées par cet Agrégateur :
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {availableCurrencies.map((c) => {
                            const isIncluded = gw.supportedCurrencies.includes(c.code);
                            return (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => toggleCurrencyInGateway(gw.id, c.code)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                  isIncluded
                                    ? 'bg-sky-500 text-white shadow-2xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <span>{c.flag}</span>
                                <span>{c.code}</span>
                                {isIncluded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action buttons footer */}
                      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePingGateway(gw.id)}
                            disabled={ping === 'testing'}
                            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            {ping === 'testing' ? (
                              <>
                                <div className="w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                                <span>Test Ping API...</span>
                              </>
                            ) : ping === 'success' ? (
                              <>
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Ping 200 OK Sandbox</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span>Tester la Connexion API</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveGateway(gw.id)}
                            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Enregistrer Configuration</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CURRENCIES & FX RATES                               */}
      {/* ========================================================= */}
      {activeTab === 'currencies' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Quick Platform Base Currency & Geolocation Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Geolocation Card */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Détection Géographique Client</h4>
                    <p className="text-[11px] text-slate-500">Basé sur le fuseau horaire du navigateur</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  Actif
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{clientDetectedCurrency?.flag || '🌍'}</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {clientDetectedCurrency?.name || 'Devise locale'} ({clientDetectedCurrency?.code || 'USD'})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {clientDetectedCurrency?.country || 'Détection automatique'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={resetToClientCurrency}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  <span>Réactiver</span>
                </button>
              </div>
            </div>

            {/* Platform Base Currency */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Devise Pivôt de Référence</h4>
                    <p className="text-[11px] text-slate-500">Tous les cours sont tarifiés en USD puis convertis</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 uppercase">
                  Pivôt
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇺🇸</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Dollar Américain (USD)</div>
                    <div className="text-[11px] text-slate-500">Standard bancaire international</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700">
                  1 USD = 1.0000
                </span>
              </div>
            </div>
          </div>

          {/* Rates Edition Table */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Grille des Taux de Change Actuels</span>
                  <span className="text-xs text-slate-500 font-normal">
                    (Multiplicateur officiel pour 1.00 USD)
                  </span>
                </h4>
                <p className="text-xs text-slate-500">
                  Modifiez les taux pour ajuster instantanément les prix des cours affichés aux étudiants africains et internationaux.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetRates}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>

                <button
                  onClick={handleSaveAllRates}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Sauvegarder Tous les Taux</span>
                </button>
              </div>
            </div>

            {saveFeedback && (
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveFeedback}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableCurrencies.map((curr) => {
                const isUSD = curr.code === 'USD';
                const currentVal = editingRates[curr.code] !== undefined ? editingRates[curr.code] : curr.rateFromUSD;

                return (
                  <div
                    key={curr.code}
                    className={`p-4 rounded-2xl border transition-all ${
                      curr.code === currencyCode
                        ? 'bg-sky-50/50 border-sky-300 ring-1 ring-sky-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{curr.flag}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{curr.name}</div>
                          <div className="text-[10px] text-slate-500">{curr.country}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {curr.code} ({curr.symbol})
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
                        <span>1 USD =</span>
                        <span className="text-[10px] text-slate-500">Décimales : {curr.decimals}</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step={curr.decimals === 0 ? '1' : '0.0001'}
                          min="0.0001"
                          disabled={isUSD}
                          value={currentVal}
                          onChange={(e) => handleRateInputChange(curr.code, e.target.value)}
                          className={`w-full px-3 py-1.5 text-xs font-mono rounded-xl border font-bold ${
                            isUSD
                              ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                              : 'bg-white border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500'
                          }`}
                        />

                        {!isUSD && (
                          <button
                            onClick={() => handleSaveSingleRate(curr.code)}
                            title="Enregistrer ce taux spécifique"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-600 transition-colors"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Simulator */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              <span>Simulateur en Direct : Conversion d'un Cours</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-64">
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    min="0"
                    value={simulationUSD}
                    onChange={(e) => setSimulationUSD(parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:border-sky-500"
                    placeholder="Montant en USD..."
                  />
                </div>
              </div>

              <div className="w-full sm:w-auto flex items-center gap-2">
                {[20, 45, 100, 250].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setSimulationUSD(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      simulationUSD === preset
                        ? 'bg-sky-500 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {availableCurrencies.map((curr) => {
                const currentVal = editingRates[curr.code] !== undefined ? editingRates[curr.code] : curr.rateFromUSD;
                const amount = simulationUSD * currentVal;

                return (
                  <div
                    key={curr.code}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      curr.code === currencyCode
                        ? 'bg-sky-50/80 border-sky-300 ring-1 ring-sky-500/20'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold mb-1">
                      <span>{curr.flag} {curr.code}</span>
                      <span className="text-sky-600">{curr.symbol}</span>
                    </div>
                    <div className="text-base font-black text-slate-900 font-mono">
                      {curr.decimals === 0
                        ? Math.round(amount).toLocaleString('fr-FR')
                        : amount.toLocaleString('fr-FR', { minimumFractionDigits: curr.decimals, maximumFractionDigits: curr.decimals })}
                      {' '}
                      <span className="text-xs font-bold text-slate-500">{curr.symbol}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SUBSCRIPTION PLANS CONFIGURATION                   */}
      {/* ========================================================= */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900">Formules d'Abonnement Panafricaines</h4>
              <p className="text-xs text-slate-500">Configurez le prix en USD et les options de chaque formule d'abonnement.</p>
            </div>
          </div>

          {planFeedback && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{planFeedback}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-bold text-slate-900">{plan.name}</span>
                  </div>
                  {plan.isPopular && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      Populaire
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600">{plan.description}</p>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                    Prix de base (USD / {plan.billingPeriod === 'year' ? 'an' : 'mois'}) :
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={plan.priceUSD}
                      onChange={(e) => handleUpdatePlanPrice(plan.id, parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-xs font-bold text-slate-500">USD</span>
                  </div>
                  <div className="text-[11px] text-purple-700 font-bold mt-1">
                    Équivalent local : {formatAmount(plan.priceUSD * currencyInfo.rateFromUSD, currencyCode)}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700">Fonctionnalités incluses :</div>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: TRANSACTIONS & ORDERS LOG                           */}
      {/* ========================================================= */}
      {activeTab === 'transactions' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Metrics summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total Recettes Enregistrées :</span>
              <span className="text-xl font-black text-slate-900 font-mono">
                ${totalRevenueUSD.toLocaleString('fr-FR')} USD
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                ~ {formatAmount(totalRevenueUSD * currencyInfo.rateFromUSD, currencyCode)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Nombre de Commandes :</span>
              <span className="text-xl font-black text-slate-900 font-mono">{orders.length}</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {orders.filter((o) => o.status === 'completed').length} validées
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Simulateur de Test :</span>
                <span className="text-xs font-bold text-slate-700">Créer une commande fictive</span>
              </div>
              <button
                onClick={handleCreateTestOrder}
                className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                + Simuler Commande
              </button>
            </div>
          </div>

          {/* Orders Filter & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Rechercher par étudiant, email, cours..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Passerelle :</span>
              <select
                value={orderFilterGateway}
                onChange={(e) => setOrderFilterGateway(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none"
              >
                <option value="all">Toutes les passerelles</option>
                <option value="wave">Wave Mobile Money</option>
                <option value="orange_money">Orange Money</option>
                <option value="mpesa">Vodacom M-Pesa</option>
                <option value="stripe">Stripe Payments</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-3xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Référence / Date</th>
                    <th className="p-3.5">Étudiant</th>
                    <th className="p-3.5">Formation / Formule</th>
                    <th className="p-3.5">Montant Réglé</th>
                    <th className="p-3.5">Passerelle</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        Aucune transaction trouvée pour ces critères.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5">
                          <div className="font-mono font-bold text-slate-900">{order.transactionReference}</div>
                          <div className="text-[10px] text-slate-400">{order.createdAt}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{order.userName}</div>
                          <div className="text-[10px] text-slate-500">{order.userEmail}</div>
                        </td>
                        <td className="p-3.5 max-w-xs truncate">
                          <div className="font-semibold text-slate-800 truncate" title={order.courseTitle}>
                            {order.courseTitle}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-mono">
                            {order.paymentType === 'subscription' ? 'Abonnement' : 'À l\'unité'}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-black text-emerald-600 font-mono">
                            {formatAmount(order.paidAmount, order.paidCurrency as any)}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            (~${order.amountUSD} USD)
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                            {order.gateway}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            order.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'refunded'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {order.status === 'completed' ? 'Validé' : order.status === 'refunded' ? 'Remboursé' : 'Échoué'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedReceiptOrder(order)}
                            className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-[11px]"
                          >
                            Reçu
                          </button>
                          {order.status === 'completed' && (
                            <button
                              onClick={() => handleRefundOrder(order.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-[11px]"
                            >
                              Rembourser
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-600" />
                <span className="font-bold text-slate-900 text-sm">Reçu #{selectedReceiptOrder.receiptNumber}</span>
              </div>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Formation :</span>
                <span className="font-bold text-slate-900 text-right line-clamp-1">{selectedReceiptOrder.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Client :</span>
                <span className="font-bold text-slate-900">{selectedReceiptOrder.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Passerelle :</span>
                <span className="font-mono uppercase font-bold text-slate-800">{selectedReceiptOrder.gateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Réf. Transaction :</span>
                <span className="font-mono text-slate-700">{selectedReceiptOrder.transactionReference}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-bold">Total Réglé :</span>
                <span className="font-black text-emerald-600 text-sm">
                  {formatAmount(selectedReceiptOrder.paidAmount, selectedReceiptOrder.paidCurrency as any)}
                </span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Imprimer / Sauvegarder en PDF
            </button>
          </div>
        </div>
      )}

      {/* Guide Intégration RDC */}
      <RdcPaymentIntegrationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
};
