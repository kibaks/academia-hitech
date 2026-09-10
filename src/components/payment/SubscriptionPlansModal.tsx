import React, { useState, useEffect } from 'react';
import { PaymentSubscriptionPlan, PaymentGatewayConfig, PaymentGatewayId, UserProfile, CourseOrder } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import {
  getStoredSubscriptionPlans,
  getStoredPaymentGateways,
  getStoredOrders,
  saveStoredOrders,
  DEFAULT_SUBSCRIPTION_PLANS,
  DEFAULT_PAYMENT_GATEWAYS
} from '../../lib/paymentGateways';
import { RdcPaymentLogo, RdcPaymentBadgesRow } from './RdcPaymentLogo';
import { VodacomMpesaTestSimulator } from './VodacomMpesaTestSimulator';
import {
  X,
  Check,
  Zap,
  Crown,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Sparkles,
  Award,
  ArrowRight,
  ArrowLeft,
  Receipt,
  CheckCircle2,
  Lock,
  Building2,
  Coins,
  PhoneCall,
  AlertCircle
} from 'lucide-react';

interface SubscriptionPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile;
  onSuccess: (order: CourseOrder, plan: PaymentSubscriptionPlan) => void;
}

export const SubscriptionPlansModal: React.FC<SubscriptionPlansModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}) => {
  const { currencyCode, currencyInfo, formatPrice } = useCurrency();
  const [plans, setPlans] = useState<PaymentSubscriptionPlan[]>(() => {
    try {
      const stored = getStoredSubscriptionPlans();
      return stored.length > 0 ? stored : DEFAULT_SUBSCRIPTION_PLANS;
    } catch {
      return DEFAULT_SUBSCRIPTION_PLANS;
    }
  });
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-annual-pass');
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(() => {
    try {
      const loaded = getStoredPaymentGateways();
      const enabledOnes = loaded.filter((g) => g.isEnabled);
      return enabledOnes.length > 0 ? enabledOnes : (loaded.length > 0 ? loaded : DEFAULT_PAYMENT_GATEWAYS);
    } catch {
      return DEFAULT_PAYMENT_GATEWAYS;
    }
  });
  const [selectedGatewayId, setSelectedGatewayId] = useState<PaymentGatewayId>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('+243 81 000 0001');
  const [subStep, setSubStep] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CourseOrder | null>(null);
  const [isVodacomSimulatorOpen, setIsVodacomSimulatorOpen] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSubStep(1);
      setPaymentError(null);
    }
    try {
      const stored = getStoredSubscriptionPlans();
      setPlans(stored.length > 0 ? stored : DEFAULT_SUBSCRIPTION_PLANS);
      const loaded = getStoredPaymentGateways();
      const gws = loaded.filter((g) => g.isEnabled);
      const list = gws.length > 0 ? gws : (loaded.length > 0 ? loaded : DEFAULT_PAYMENT_GATEWAYS);
      setGateways(list);
      if (list.length > 0 && !list.some((g) => g.id === selectedGatewayId)) {
        setSelectedGatewayId(list[0].id);
      }
    } catch {
      setPlans(DEFAULT_SUBSCRIPTION_PLANS);
      setGateways(DEFAULT_PAYMENT_GATEWAYS);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedPlan: PaymentSubscriptionPlan =
    plans.find((p) => p.id === selectedPlanId) ||
    plans[0] ||
    DEFAULT_SUBSCRIPTION_PLANS[0];
  const selectedGateway: PaymentGatewayConfig =
    gateways.find((g) => g.id === selectedGatewayId) ||
    gateways[0] ||
    DEFAULT_PAYMENT_GATEWAYS[0];

  const localPrice = Math.round((selectedPlan?.priceUSD || 19) * currencyInfo.rateFromUSD);

  const handleSubscribe = async () => {
    if (!selectedPlan || !selectedGateway) return;

    setIsProcessing(true);
    setPaymentError(null);

    // If Vodacom M-Pesa is used, call API endpoint
    if (selectedGateway.id === 'mpesa') {
      try {
        const res = await fetch('/api/payment/vodacom-mpesa/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: localPrice,
            currency: currencyCode,
            phoneNumber,
            courseId: 'subscription-' + (selectedPlan?.code || 'pass'),
            courseTitle: selectedPlan?.name || 'Abonnement Pass Illimité',
            userId: currentUser?.id || 'user-guest',
            userName: currentUser?.name || 'Abonné ITECH',
            userEmail: currentUser?.email || 'apprenant@academia-itech.com',
            pin: '1234',
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.order) {
          const existingOrders = getStoredOrders();
          saveStoredOrders([data.order, ...existingOrders]);
          setIsProcessing(false);
          setCompletedOrder(data.order);
          return;
        } else {
          setIsProcessing(false);
          setPaymentError(data.responseDesc || 'Transaction Vodacom M-Pesa rejetée en mode Sandbox.');
          return;
        }
      } catch (e) {
        console.warn('Fallback to local subscription processing', e);
      }
    }

    setTimeout(() => {
      const newOrder: CourseOrder = {
        id: 'ord-sub-' + Date.now().toString(36),
        userId: currentUser?.id || 'user-guest',
        userEmail: currentUser?.email || 'apprenant@academia-itech.com',
        userName: currentUser?.name || 'Abonné ITECH',
        courseId: 'subscription-' + (selectedPlan?.code || 'pro'),
        courseTitle: selectedPlan?.name || 'Formule Abonnement ITECH',
        amountUSD: selectedPlan?.priceUSD || 19,
        paidAmount: localPrice,
        paidCurrency: currencyCode,
        gateway: selectedGateway?.id || 'mpesa',
        paymentType: 'subscription',
        subscriptionPlanId: selectedPlan?.id || 'plan-pro-monthly',
        status: 'completed',
        transactionReference: `${selectedGateway.id.toUpperCase()}-SUB-${Math.floor(1000000 + Math.random() * 9000000)}`,
        createdAt: 'À l\'instant',
        receiptNumber: `REC-SUB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        payerPhoneOrAccount: phoneNumber,
      };

      const existingOrders = getStoredOrders();
      saveStoredOrders([newOrder, ...existingOrders]);

      setIsProcessing(false);
      setCompletedOrder(newOrder);
    }, 1000);
  };

  return (
    <div
      id="subscription-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="subscription-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-between border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Pass Abonnement Illimité Panafricain</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500 text-white uppercase">
                  Accès Total
                </span>
              </h3>
              <p className="text-xs text-purple-200">
                Débloquez tous les cours certifiants, tuteurs IA illimités et projets guidés
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (completedOrder) {
                onSuccess(completedOrder, selectedPlan);
              }
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {completedOrder ? (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto ring-8 ring-purple-50">
              <Sparkles className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                Abonnement Activé avec Succès !
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Bienvenue dans le cercle d'excellence Academia ITECH. Vous bénéficiez désormais de l'accès complet illimité.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-800 border-b border-slate-200 pb-2">
                <span>Formule : {selectedPlan?.name || 'Abonnement ITECH'}</span>
                <span className="text-purple-600">{formatPrice(selectedPlan?.priceUSD || 19)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Réf. Transaction :</span>
                <span className="font-mono font-semibold">{completedOrder.transactionReference}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px]">
                <span>Passerelle utilisée :</span>
                <span className="font-semibold">{selectedGateway?.name || 'Paiement Sécurisé'}</span>
              </div>
            </div>
            <button
              onClick={() => {
                onSuccess(completedOrder, selectedPlan);
                onClose();
              }}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Profiter de mes formations illimitées
            </button>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Steps Progress Navigation */}
            <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setSubStep(1)}
                className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  subStep === 1
                    ? 'bg-white text-purple-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[11px]">
                  1
                </span>
                <span>Choix de la Formule</span>
              </button>

              <button
                type="button"
                onClick={() => setSubStep(2)}
                className={`flex-1 py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  subStep === 2
                    ? 'bg-white text-purple-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[11px]">
                  2
                </span>
                <span>Modalité & Règlement</span>
              </button>
            </div>

            {/* STEP 1: CHOIX DE LA FORMULE */}
            {subStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {plans.map((p) => {
                    const isSelected = p.id === selectedPlanId;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPlanId(p.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-50/70 border-purple-500 ring-2 ring-purple-500/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {p.isPopular && (
                          <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-600 text-white uppercase shadow-xs">
                            Recommandé
                          </span>
                        )}
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-slate-800">{p.name}</div>
                          <div className="text-xl font-black text-slate-900 font-mono">
                            {formatPrice(p.priceUSD)}
                            <span className="text-xs font-normal text-slate-500">/{p.billingPeriod === 'year' ? 'an' : 'mois'}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-tight">{p.description}</p>
                          <div className="pt-2 border-t border-slate-100 space-y-1">
                            {p.features.slice(0, 3).map((feat, idx) => (
                              <div key={idx} className="text-[10px] text-slate-700 flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-purple-600 shrink-0" />
                                <span className="truncate">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className={`mt-3 py-1.5 text-center rounded-xl text-xs font-bold ${
                          isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isSelected ? '✓ Formule Sélectionnée' : 'Sélectionner'}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSubStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                  >
                    <span>Continuer vers le Paiement</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: MODE DE PAIEMENT & VALIDATION */}
            {subStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* RDC Badges Row */}
                <RdcPaymentBadgesRow size="sm" />

                {/* Gateway selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Mode de Paiement :</span>
                    <span className="text-[10px] font-bold text-red-500">🇨🇩 RDC & International</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {gateways.slice(0, 5).map((gw) => {
                      const isSelected = gw.id === selectedGatewayId;
                      const isRdc = ['mpesa', 'airtel_money', 'afrimoney', 'orange_money', 'stripe'].includes(gw.id);

                      return (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => {
                            setSelectedGatewayId(gw.id);
                            setPaymentError(null);
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-purple-50 border-purple-500 text-purple-950 ring-2 ring-purple-500/20 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="mb-1">
                            {isRdc ? (
                              <RdcPaymentLogo gatewayId={gw.id} size="sm" />
                            ) : (
                              <Smartphone className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                          <span className="truncate text-[11px] font-bold mt-1">{gw.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* If Vodacom M-Pesa is selected -> show Test Mode Sandbox panel */}
                {selectedGatewayId === 'mpesa' && (
                  <div className="p-3.5 rounded-2xl bg-red-50/90 border border-red-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-950">
                        <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                        <span>Mode Test Vodacom M-Pesa RDC Actif</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-white text-red-700 px-2 py-0.5 rounded border border-red-200">
                        PIN Test : 1234
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneNumber('+243 81 000 0001');
                          setPaymentError(null);
                        }}
                        className={`p-1.5 rounded-lg text-left text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                          phoneNumber.includes('0001')
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-slate-700 border-red-200 hover:bg-red-50'
                        }`}
                      >
                        ✓ 081 000 0001 (Succès)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPhoneNumber('+243 81 000 0002');
                          setPaymentError(null);
                        }}
                        className={`p-1.5 rounded-lg text-left text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                          phoneNumber.includes('0002')
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
                        }`}
                      >
                        ⚠️ 081 000 0002 (Solde bas)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPhoneNumber('+243 81 000 0003');
                          setPaymentError(null);
                        }}
                        className={`p-1.5 rounded-lg text-left text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                          phoneNumber.includes('0003')
                            ? 'bg-rose-700 text-white border-rose-700'
                            : 'bg-white text-slate-700 border-rose-200 hover:bg-rose-50'
                        }`}
                      >
                        ✕ 081 000 0003 (Rejet)
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsVodacomSimulatorOpen(true)}
                      className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Simuler Push USSD Vodacom RDC (*1122#)</span>
                    </button>
                  </div>
                )}

                {/* Phone Input or Card Info */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  {selectedGatewayId === 'stripe' ? (
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">
                        Carte Bancaire Visa / Mastercard (Banques RDC & Diaspora) :
                      </label>
                      <input
                        type="text"
                        defaultValue="4242 •••• •••• 4242"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Cartes Rawbank, EquityBCDC, Sofibanque, TMB, Illicocash ou internationales avec 3D Secure.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Numéro Mobile Money RDC :</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Push USSD instantané</span>
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                        placeholder="+243 81 000 0001"
                      />
                    </div>
                  )}
                </div>

                {/* Error feedback */}
                {paymentError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{paymentError}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleSubscribe}
                    disabled={isProcessing}
                    className={`w-full py-3.5 px-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                      isProcessing
                        ? 'bg-slate-400 cursor-not-allowed'
                        : selectedGatewayId === 'mpesa'
                        ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                        : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Activation de l'abonnement en cours...</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 text-purple-200" />
                        <span>
                          Souscrire au {selectedPlan?.name || 'Pass'} ({formatPrice(selectedPlan?.priceUSD || 19)})
                        </span>
                      </>
                    )}
                  </button>

                  <div className="flex justify-start">
                    <button
                      type="button"
                      onClick={() => setSubStep(1)}
                      className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Modifier la formule choisie</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vodacom M-Pesa Simulator for Subscriptions */}
      {isVodacomSimulatorOpen && (
        <VodacomMpesaTestSimulator
          isOpen={isVodacomSimulatorOpen}
          onClose={() => setIsVodacomSimulatorOpen(false)}
          onSuccess={(order) => {
            setIsVodacomSimulatorOpen(false);
            const existingOrders = getStoredOrders();
            saveStoredOrders([order, ...existingOrders]);
            setCompletedOrder(order);
            onSuccess(order, selectedPlan);
          }}
          amount={localPrice}
          currency={currencyCode}
          courseTitle={selectedPlan?.name || 'Abonnement Pass Illimité'}
          courseId={'subscription-' + (selectedPlan?.code || 'pass')}
          userId={currentUser?.id}
          userName={currentUser?.name}
          userEmail={currentUser?.email}
          initialPhone={phoneNumber}
        />
      )}
    </div>
  );
};

