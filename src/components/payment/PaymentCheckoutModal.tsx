import React, { useState, useEffect } from 'react';
import { Course, CourseOrder, PaymentGatewayConfig, PaymentGatewayId, UserProfile } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { getStoredPaymentGateways, getStoredOrders, saveStoredOrders, DEFAULT_PAYMENT_GATEWAYS } from '../../lib/paymentGateways';
import { RdcPaymentLogo, RdcPaymentBadgesRow } from './RdcPaymentLogo';
import { RdcPaymentIntegrationGuideModal } from './RdcPaymentIntegrationGuideModal';
import { VodacomMpesaTestSimulator } from './VodacomMpesaTestSimulator';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Smartphone,
  PhoneCall,
  Zap,
  Phone,
  Coins,
  Receipt,
  Download,
  Printer,
  Sparkles,
  Lock,
  ArrowRight,
  ArrowLeft,
  Clock,
  Award,
  BookOpen,
  Tag,
  Check,
  QrCode,
  ExternalLink,
  ChevronRight,
  Info,
  HelpCircle
} from 'lucide-react';

interface PaymentCheckoutModalProps {
  course: Course;
  currentUser?: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: CourseOrder) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  course,
  currentUser,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currencyCode, currencyInfo, convertPrice, formatPrice, formatAmount, availableCurrencies, setCurrencyCode } = useCurrency();

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
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<CourseOrder | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isVodacomSimulatorOpen, setIsVodacomSimulatorOpen] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Form Fields
  const [phoneNumber, setPhoneNumber] = useState('+243 81 000 0001');
  const [otpCode, setOtpCode] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('389');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Landry Kibakweto');

  // Coupon / Promo code
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0); // percentage 0-100
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Load configured active gateways
  useEffect(() => {
    if (isOpen) {
      setCheckoutStep(1);
      setPaymentError(null);
    }
    try {
      const loaded = getStoredPaymentGateways();
      const enabledOnes = loaded.filter((g) => g.isEnabled);
      const list = enabledOnes.length > 0 ? enabledOnes : (loaded.length > 0 ? loaded : DEFAULT_PAYMENT_GATEWAYS);
      setGateways(list);
      if (list.length > 0 && !list.some((g) => g.id === selectedGatewayId)) {
        setSelectedGatewayId(list[0].id);
      }
    } catch {
      setGateways(DEFAULT_PAYMENT_GATEWAYS);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedGateway: PaymentGatewayConfig =
    gateways.find((g) => g.id === selectedGatewayId) ||
    gateways[0] ||
    DEFAULT_PAYMENT_GATEWAYS[0];

  // Pricing calculations
  const rawPriceUSD = course.price || 40;
  const discountedPriceUSD = appliedDiscount > 0 ? rawPriceUSD * (1 - appliedDiscount / 100) : rawPriceUSD;
  const localPrice = convertPrice(discountedPriceUSD);
  const originalLocalPrice = course.originalPrice ? convertPrice(course.originalPrice) : null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'AFRICA2026' || clean === 'ITECH20') {
      setAppliedDiscount(20);
      setCouponSuccess('Code promo appliqué : -20% de réduction immédiate !');
    } else if (clean === 'FREE100' || clean === 'DEMOFREE') {
      setAppliedDiscount(100);
      setCouponSuccess('Coupon VIP activé : Accès gratuit à 100% pour test !');
    } else if (clean === 'STUDENT50') {
      setAppliedDiscount(50);
      setCouponSuccess('Tarif Étudiant validé : -50% appliqué !');
    } else {
      setCouponError('Code promo non valide ou expiré.');
    }
  };

  const handleFastVodacomTest = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    setProcessingStep('1/3 - Initialisation OpenAPI Vodacom DRC Sandbox (*1122#)...');

    try {
      setProcessingStep('2/3 - Émission requête C2B Sandbox Vodacom (Compte +243810000001)...');
      const res = await fetch('/api/payment/vodacom-mpesa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(localPrice),
          currency: currencyCode,
          phoneNumber: '+243 81 000 0001',
          courseId: course.id,
          courseTitle: course.title,
          userId: currentUser?.id || 'user-guest',
          userName: currentUser?.name || 'Apprenant ITECH',
          userEmail: currentUser?.email || 'apprenant@academia-itech.com',
          pin: '1234',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.order) {
        setProcessingStep('3/3 - Validation INS-0 reçue. Enregistrement du reçu certifié...');
        setTimeout(() => {
          const existingOrders = getStoredOrders();
          saveStoredOrders([data.order, ...existingOrders]);
          setIsProcessing(false);
          setCompletedOrder(data.order);
        }, 600);
      } else {
        setIsProcessing(false);
        setPaymentError(data.responseDesc || 'La transaction Vodacom M-Pesa n\'a pas pu aboutir.');
      }
    } catch (err: any) {
      console.warn('Fallback to client simulation for Vodacom M-Pesa', err);
      setTimeout(() => {
        const simOrder: CourseOrder = {
          id: 'ord-mpesa-' + Date.now().toString(36),
          userId: currentUser?.id || 'user-guest',
          userEmail: currentUser?.email || 'apprenant@academia-itech.com',
          userName: currentUser?.name || 'Apprenant ITECH',
          courseId: course.id,
          courseTitle: course.title,
          amountUSD: discountedPriceUSD,
          paidAmount: Math.round(localPrice),
          paidCurrency: currencyCode,
          gateway: 'mpesa',
          paymentType: 'one_time',
          status: 'completed',
          transactionReference: `MPESA-CD-TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
          createdAt: 'À l\'instant',
          receiptNumber: `REC-MPESA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          payerPhoneOrAccount: '+243 81 000 0001',
        };
        const existingOrders = getStoredOrders();
        saveStoredOrders([simOrder, ...existingOrders]);
        setIsProcessing(false);
        setCompletedOrder(simOrder);
      }, 700);
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    setProcessingStep('1/3 - Connexion sécurisée à la passerelle ' + (selectedGateway?.name || 'Sécurisée') + '...');

    // If Vodacom M-Pesa is selected, call the dedicated Sandbox API
    if (selectedGateway.id === 'mpesa') {
      try {
        setProcessingStep('2/3 - Émission requête C2B OpenAPI Sandbox Vodacom RDC (*1122#)...');
        const res = await fetch('/api/payment/vodacom-mpesa/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(localPrice),
            currency: currencyCode,
            phoneNumber,
            courseId: course.id,
            courseTitle: course.title,
            userId: currentUser?.id || 'user-guest',
            userName: currentUser?.name || 'Apprenant ITECH',
            userEmail: currentUser?.email || 'apprenant@academia-itech.com',
            pin: '1234',
          }),
        });

        const data = await res.json();

        if (res.ok && data.success && data.order) {
          setProcessingStep('3/3 - Validation INS-0 reçue. Enregistrement du reçu...');
          setTimeout(() => {
            const existingOrders = getStoredOrders();
            saveStoredOrders([data.order, ...existingOrders]);
            setIsProcessing(false);
            setCompletedOrder(data.order);
          }, 600);
          return;
        } else {
          setIsProcessing(false);
          setPaymentError(data.responseDesc || 'La transaction Vodacom M-Pesa n\'a pas pu aboutir.');
          return;
        }
      } catch (err: any) {
        console.warn('Fallback to client simulation for Vodacom M-Pesa', err);
      }
    }

    setTimeout(() => {
      setProcessingStep('2/3 - Autorisation de la transaction en mode ' + (selectedGateway?.isTestMode ? 'Sandbox' : 'Production') + '...');

      setTimeout(() => {
        setProcessingStep('3/3 - Émission du reçu certifié et déverrouillage du cours...');

        setTimeout(() => {
          const newOrder: CourseOrder = {
            id: 'ord-' + Date.now().toString(36),
            userId: currentUser?.id || 'user-guest',
            userEmail: currentUser?.email || 'apprenant@academia-itech.com',
            userName: currentUser?.name || 'Étudiant ITECH',
            courseId: course.id,
            courseTitle: course.title,
            amountUSD: discountedPriceUSD,
            paidAmount: Math.round(localPrice),
            paidCurrency: currencyCode,
            gateway: selectedGateway.id,
            paymentType: 'one_time',
            status: 'completed',
            transactionReference: `${selectedGateway.id.toUpperCase()}-TX-${Math.floor(1000000 + Math.random() * 9000000)}`,
            createdAt: 'À l\'instant',
            receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            payerPhoneOrAccount:
              selectedGateway.providerType === 'card'
                ? 'Visa •••• ' + cardNumber.slice(-4)
                : phoneNumber,
          };

          const existingOrders = getStoredOrders();
          saveStoredOrders([newOrder, ...existingOrders]);

          setIsProcessing(false);
          setCompletedOrder(newOrder);
        }, 800);
      }, 900);
    }, 900);
  };

  const getGatewayIcon = (providerType: string, id: string) => {
    switch (id) {
      case 'wave':
        return Smartphone;
      case 'orange_money':
        return PhoneCall;
      case 'mpesa':
        return Zap;
      case 'mtn_momo':
        return Phone;
      case 'stripe':
        return CreditCard;
      default:
        return Coins;
    }
  };

  return (
    <div
      id="payment-checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-hidden"
    >
      <div
        id="payment-checkout-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
      >
        {/* Modal Header */}
        <div className="shrink-0 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold flex items-center gap-2 text-white leading-tight">
                <span>Passerelle de Paiement Sécurisée</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-sky-500 text-white uppercase tracking-wider">
                  SSL 256-bit
                </span>
              </h3>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                Abonnement & cours certifiant avec conversion multi-devises
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (completedOrder) {
                onSuccess(completedOrder);
              }
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* If Order Completed -> Show Receipt View */}
        {completedOrder ? (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-6 ring-emerald-50 shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-0.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Paiement Confirmé avec Succès !
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Félicitations, votre inscription à la formation est validée. Vous avez maintenant un accès complet à vie et votre certificat officiel.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5 font-sans max-w-lg mx-auto shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-sky-600" />
                  <span className="text-xs font-bold text-slate-800">Reçu Officiel #{completedOrder.receiptNumber}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  Payé ({completedOrder.gateway.toUpperCase()})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Formation :</span>
                  <span className="font-bold text-slate-900 line-clamp-1">{completedOrder.courseTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Bénéficiaire :</span>
                  <span className="font-bold text-slate-900">{completedOrder.userName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Réf. Transaction :</span>
                  <span className="font-mono text-slate-700 font-bold">{completedOrder.transactionReference}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Montant réglé :</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    {formatAmount(completedOrder.paidAmount, completedOrder.paidCurrency as any)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Date : {completedOrder.createdAt}</span>
                <span>Mode : Sandbox Test Validé</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Imprimer Reçu</span>
              </button>

              <button
                onClick={() => {
                  if (completedOrder) {
                    onSuccess(completedOrder);
                  }
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-sky-500/20 active:scale-95 transition-all"
              >
                <span>Accéder au Cours Maintenant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Compact Sticky Course Summary Banner */}
            <div className="shrink-0 px-4 py-2 sm:px-5 border-b border-slate-100 bg-white">
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span className="font-bold text-sky-700 uppercase bg-sky-100/80 px-1.5 py-0.2 rounded text-[9px]">
                        {course.category.replace('_', ' ')}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 text-slate-400" />
                        {course.durationHours}h
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline text-emerald-600 font-semibold flex items-center gap-0.5">
                        <Award className="w-3 h-3" />
                        Certifié
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-snug">
                      {course.title}
                    </h4>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] text-slate-400 block font-medium leading-none mb-0.5">Total</span>
                  <span className="text-sm sm:text-base font-black text-sky-700 font-mono leading-none">
                    {formatPrice(discountedPriceUSD)}
                  </span>
                </div>
              </div>
            </div>

            {/* Compact Step Navigation Progress Bar */}
            <div className="shrink-0 px-4 py-1.5 sm:px-5 border-b border-slate-100 bg-slate-50/70">
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {/* Step 1 */}
                <button
                  type="button"
                  onClick={() => setCheckoutStep(1)}
                  className={`flex items-center justify-center sm:justify-start gap-1.5 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                    checkoutStep === 1
                      ? 'bg-white text-sky-700 shadow-2xs border border-sky-200 ring-1 ring-sky-500/10'
                      : checkoutStep > 1
                      ? 'text-slate-700 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                      checkoutStep > 1
                        ? 'bg-emerald-600 text-white'
                        : checkoutStep === 1
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {checkoutStep > 1 ? <Check className="w-2.5 h-2.5" /> : '1'}
                  </span>
                  <span className="text-[11px] truncate">1. Mode</span>
                </button>

                {/* Step 2 */}
                <button
                  type="button"
                  onClick={() => setCheckoutStep(2)}
                  className={`flex items-center justify-center sm:justify-start gap-1.5 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                    checkoutStep === 2
                      ? 'bg-white text-sky-700 shadow-2xs border border-sky-200 ring-1 ring-sky-500/10'
                      : checkoutStep > 2
                      ? 'text-slate-700 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                      checkoutStep > 2
                        ? 'bg-emerald-600 text-white'
                        : checkoutStep === 2
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {checkoutStep > 2 ? <Check className="w-2.5 h-2.5" /> : '2'}
                  </span>
                  <span className="text-[11px] truncate">2. Coordonnées</span>
                </button>

                {/* Step 3 */}
                <button
                  type="button"
                  onClick={() => setCheckoutStep(3)}
                  className={`flex items-center justify-center sm:justify-start gap-1.5 py-1.5 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                    checkoutStep === 3
                      ? 'bg-white text-sky-700 shadow-2xs border border-sky-200 ring-1 ring-sky-500/10'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 ${
                      checkoutStep === 3
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    3
                  </span>
                  <span className="text-[11px] truncate">3. Confirmation</span>
                </button>
              </div>
            </div>

            {/* Scrollable Step Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-3 min-h-0 scrollbar-thin">

            {/* STEP 1: CHOIX DU MODE DE PAIEMENT & DEVISE */}
            {checkoutStep === 1 && (
              <div className="space-y-3 animate-in fade-in duration-150">
                {/* Currency Selector Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-sky-50/70 border border-sky-100 text-xs">
                  <div className="flex items-center gap-1.5 text-sky-950 font-bold text-[11px]">
                    <Coins className="w-3.5 h-3.5 text-sky-600" />
                    <span>Devise de Facturation :</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    {availableCurrencies.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setCurrencyCode(c.code)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          c.code === currencyCode
                            ? 'bg-sky-600 text-white shadow-2xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {c.flag} {c.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Gateway Grid */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>Sélectionnez votre moyen de paiement :</span>
                    {selectedGateway?.isTestMode && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-200">
                        Mode Sandbox RDC
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {gateways.map((gw) => {
                      const isSelected = gw.id === selectedGatewayId;
                      const isRdc = ['mpesa', 'airtel_money', 'afrimoney', 'orange_money', 'stripe', 'maxicash'].includes(gw.id);

                      return (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => {
                            setSelectedGatewayId(gw.id);
                            setPaymentError(null);
                          }}
                          className={`p-2 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer min-h-[58px] ${
                            isSelected
                              ? 'bg-sky-50 border-sky-500 ring-1.5 ring-sky-500/20 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            {isRdc ? (
                              <RdcPaymentLogo gatewayId={gw.id} size="sm" />
                            ) : (
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                                isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                <Coins className="w-3 h-3" />
                              </div>
                            )}
                            {isSelected ? (
                              <div className="w-3.5 h-3.5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                                <Check className="w-2 h-2" />
                              </div>
                            ) : isRdc ? (
                              <span className="text-[9px]">🇨🇩</span>
                            ) : null}
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                              {gw.name}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Method Details Overview Card */}
                <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-sky-50 via-slate-50 to-emerald-50/50 border border-sky-200/80 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1 rounded-lg bg-white border border-slate-200 shrink-0">
                      <RdcPaymentLogo gatewayId={selectedGateway.id} size="sm" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {selectedGateway.name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 shrink-0">
                          0% Frais
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {selectedGateway.id === 'mpesa'
                          ? 'Vodacom M-Pesa RDC (*1122#) avec push USSD sécurisé.'
                          : selectedGateway.id === 'airtel_money'
                          ? 'Airtel Money RDC (*501#) avec PIN mobile.'
                          : selectedGateway.id === 'afrimoney'
                          ? 'Afrimoney RDC (*1111#) sécurisé.'
                          : selectedGateway.id === 'orange_money'
                          ? 'Orange Money RDC avec OTP (*144*4*6#).'
                          : selectedGateway.id === 'stripe'
                          ? 'Carte bancaire Visa / Mastercard (Rawbank, EquityBCDC, Sofibanque...).'
                          : 'Paiement sécurisé avec accès immédiat.'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-sky-700 font-mono">
                      {formatPrice(discountedPriceUSD)}
                    </span>
                  </div>
                </div>

                {/* Badges & Guide link */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Sécurisé SSL 256-bit
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsGuideModalOpen(true)}
                    className="text-sky-600 hover:underline font-semibold cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Guide Technique RDC</span>
                  </button>
                </div>

                {/* Next Step Button */}
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(2)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98"
                  >
                    <span>Continuer vers les Coordonnées</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: COORDONNÉES DE PAIEMENT & PROMO */}
            {checkoutStep === 2 && (
              <div className="space-y-3 animate-in fade-in duration-150">
                {/* Gateway Interactive Inputs */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <RdcPaymentLogo gatewayId={selectedGateway.id} size="sm" />
                      <span>Coordonnées pour {selectedGateway?.name || 'Paiement'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {['mpesa', 'airtel_money', 'afrimoney', 'orange_money'].includes(selectedGateway.id) && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Push USSD 🇨🇩
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(1)}
                        className="text-[11px] text-sky-600 hover:text-sky-800 font-bold underline cursor-pointer"
                      >
                        Changer
                      </button>
                    </div>
                  </div>

                  {/* 1. M-PESA RDC */}
                  {selectedGateway.id === 'mpesa' && (
                    <div className="space-y-2">
                      {/* Vodacom Sandbox Test Numbers Picker */}
                      <div className="p-2.5 rounded-xl bg-red-50/90 border border-red-200 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1 font-black text-red-950">
                            <Zap className="w-3 h-3 text-red-600 fill-red-600" />
                            <span>Sandbox Vodacom RDC (PIN: 1234)</span>
                          </div>
                          <span className="text-[10px] text-red-700 font-bold">Sélection rapide :</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setPhoneNumber('+243 81 000 0001');
                              setPaymentError(null);
                            }}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              phoneNumber.includes('0001')
                                ? 'bg-red-600 text-white border-red-600 shadow-2xs font-bold'
                                : 'bg-white text-slate-800 border-red-200 hover:bg-red-50'
                            }`}
                          >
                            <div className="text-[9px] uppercase font-bold">1. Succès</div>
                            <div className="text-[10px] font-mono">081 000 0001</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setPhoneNumber('+243 81 000 0002');
                              setPaymentError(null);
                            }}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              phoneNumber.includes('0002')
                                ? 'bg-amber-600 text-white border-amber-600 shadow-2xs font-bold'
                                : 'bg-white text-slate-800 border-amber-200 hover:bg-amber-50'
                            }`}
                          >
                            <div className="text-[9px] uppercase font-bold">2. Solde bas</div>
                            <div className="text-[10px] font-mono">081 000 0002</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setPhoneNumber('+243 81 000 0003');
                              setPaymentError(null);
                            }}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              phoneNumber.includes('0003')
                                ? 'bg-rose-700 text-white border-rose-700 shadow-2xs font-bold'
                                : 'bg-white text-slate-800 border-rose-200 hover:bg-rose-50'
                            }`}
                          >
                            <div className="text-[9px] uppercase font-bold">3. Annulé</div>
                            <div className="text-[10px] font-mono">081 000 0003</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setPhoneNumber('+243 81 000 0004');
                              setPaymentError(null);
                            }}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              phoneNumber.includes('0004')
                                ? 'bg-slate-800 text-white border-slate-800 shadow-2xs font-bold'
                                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="text-[9px] uppercase font-bold">4. Expiré</div>
                            <div className="text-[10px] font-mono">081 000 0004</div>
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                          <span>Numéro Vodacom M-Pesa RDC :</span>
                          <span className="text-[10px] text-slate-400 font-mono">Préfixes : 081, 082, 083</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-red-500"
                            placeholder="+243 81 000 0001"
                          />
                          <button
                            type="button"
                            onClick={() => setIsVodacomSimulatorOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] whitespace-nowrap shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-98 shrink-0"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Simulateur</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

              {/* 2. AIRTEL MONEY RDC */}
              {selectedGateway.id === 'airtel_money' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Numéro Airtel Money RDC :</span>
                      <span className="text-[10px] text-slate-400 font-mono">Préfixes : 097, 098, 099</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                        placeholder="+243 97 123 4567"
                      />
                      <button
                        type="button"
                        onClick={() => alert('Notification USSD Push Airtel Money envoyée au ' + phoneNumber + ' !')}
                        className="px-3 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-[11px] whitespace-nowrap shadow-xs cursor-pointer"
                      >
                        Ping USSD (*501#)
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-[11px] leading-relaxed flex items-start gap-2">
                    <PhoneCall className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Procédure Airtel Money :</strong> Validation instantanée par notification USSD push. Le montant sera automatiquement prélevé de votre compte principal Airtel Money.
                    </span>
                  </div>
                </div>
              )}

              {/* 3. AFRIMONEY (AFRICELL RDC) */}
              {selectedGateway.id === 'afrimoney' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Numéro Africell Afrimoney RDC :</span>
                      <span className="text-[10px] text-slate-400 font-mono">Préfixes : 090, 091</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                        placeholder="+243 90 123 4567"
                      />
                      <button
                        type="button"
                        onClick={() => alert('Notification USSD Afrimoney envoyée au ' + phoneNumber + ' !')}
                        className="px-3 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-[11px] whitespace-nowrap shadow-xs cursor-pointer"
                      >
                        Ping USSD (*1111#)
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px] leading-relaxed flex items-start gap-2">
                    <Smartphone className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Procédure Afrimoney :</strong> Confirmez le débit en entrant votre code secret Africell via le menu interactif sécurisé.
                    </span>
                  </div>
                </div>
              )}

              {/* 4. ORANGE MONEY RDC */}
              {selectedGateway.id === 'orange_money' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                      Numéro Orange Money RDC (084, 085, 089) :
                    </label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                      placeholder="+243 85 123 4567"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                      Code OTP Orange (*144*4*6#) :
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={otpCode || '847291'}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono text-slate-800 focus:outline-none focus:border-sky-500"
                      placeholder="Code OTP..."
                    />
                  </div>
                </div>
              )}

              {/* 5. CARTES VISA / MASTERCARD (BANQUES RDC & INTERNATIONAL) */}
              {selectedGateway.id === 'stripe' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-[11px]">
                    <CreditCard className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>
                      Cartes acceptées : <strong>Rawbank, EquityBCDC, Sofibanque, TMB, Illicocash</strong> ainsi que toutes cartes Visa et Mastercard internationales avec protection 3D Secure 2.
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                      Numéro de carte bancaire Visa / Mastercard :
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                      placeholder="4242 •••• •••• 4242"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 mb-1 block">Date Expiration</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white border border-slate-200 font-mono text-center focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 mb-1 block">CVC / CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-white border border-slate-200 font-mono text-center focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 mb-1 block">Protocole 3DS</label>
                      <span className="w-full px-2 py-1.5 text-[10px] rounded-xl bg-emerald-50 text-emerald-700 font-bold block text-center border border-emerald-200">
                        3D Secure 2 ✓
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. MAXICASH RDC */}
              {selectedGateway.id === 'maxicash' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 mb-1 block">
                      Téléphone ou Compte MaxiCash RDC :
                    </label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                      placeholder="+243 82 000 0000"
                    />
                  </div>
                  <p className="text-[11px] text-slate-600">
                    La passerelle MaxiCash RDC débitera votre portefeuille ou votre carte bancaire MaxiCash avec règlement direct en Francs Congolais ou USD.
                  </p>
                </div>
              )}

              {/* 7. AUTRES (WAVE, PAYPAL...) */}
              {selectedGateway.id === 'wave' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 mb-1 block">
                        Numéro Mobile Wave :
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                        placeholder="+221 77 123 4567 ou +243 82..."
                      />
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200">
                      <QrCode className="w-8 h-8 text-sky-600 shrink-0" />
                      <div className="text-[11px] text-slate-600 leading-tight">
                        <span className="font-bold text-slate-900 block">Paiement QR Code Wave</span>
                        Scan automatique via l'application mobile
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Promo Code input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Code Promo (ex: AFRICA2026, FREE100)..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 font-mono uppercase focus:outline-none focus:border-sky-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  Appliquer
                </button>
              </div>
              {couponSuccess && (
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{couponSuccess}</span>
                </div>
              )}
              {couponError && (
                <div className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{couponError}</span>
                </div>
              )}
            </form>

            {/* Step 2 Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setCheckoutStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Mode de Paiement</span>
              </button>
              <button
                type="button"
                onClick={() => setCheckoutStep(3)}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Vérifier le Récapitulatif</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RÉCAPITULATIF & VALIDATION */}
        {checkoutStep === 3 && (
          <div className="space-y-2.5 animate-in fade-in duration-150">
            {/* Method Review Card */}
            <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-sky-950 font-bold">
                <span>Détails de transaction :</span>
                <button
                  type="button"
                  onClick={() => setCheckoutStep(1)}
                  className="text-[11px] text-sky-600 hover:underline font-bold cursor-pointer"
                >
                  Changer de mode
                </button>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-sky-200/60">
                <span className="text-slate-600">Passerelle :</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <RdcPaymentLogo gatewayId={selectedGateway.id} size="sm" />
                  <span>{selectedGateway.name}</span>
                </span>
              </div>

              {['mpesa', 'airtel_money', 'afrimoney', 'orange_money', 'maxicash', 'wave'].includes(selectedGateway.id) && phoneNumber && (
                <div className="flex items-center justify-between py-1 border-b border-sky-200/60">
                  <span className="text-slate-600">Numéro débiteur :</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{phoneNumber}</span>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(2)}
                      className="text-[10px] text-sky-600 hover:underline font-semibold cursor-pointer"
                    >
                      (modifier)
                    </button>
                  </div>
                </div>
              )}

              {['stripe', 'visa_mastercard'].includes(selectedGateway.id) && (
                <div className="flex items-center justify-between py-1 border-b border-sky-200/60">
                  <span className="text-slate-600">Titulaire Carte :</span>
                  <span className="font-bold text-slate-900">{cardHolder}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-slate-600">Accès formation :</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Immédiat & Illimité avec Certificat
                </span>
              </div>
            </div>

            {/* If Vodacom M-Pesa is selected: Sandbox Quick Actions */}
            {selectedGateway.id === 'mpesa' && (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-amber-700 text-white shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>Mode Test Vodacom DRC (Sandbox)</span>
                  </div>
                  <span className="text-[10px] text-red-100 font-mono">Numéro: {phoneNumber}</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={handleFastVodacomTest}
                    disabled={isProcessing}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 text-red-700 font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Zap className="w-3 h-3 fill-red-600 text-red-600" />
                    <span>⚡ Valider en Mode Test Vodacom (1-Clic)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsVodacomSimulatorOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-950/80 text-white font-bold text-xs flex items-center gap-1 border border-red-400/40 active:scale-95 transition-all cursor-pointer"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Écran USSD (*1122#)</span>
                  </button>
                </div>
              </div>
            )}

            {/* Total Recap */}
            <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Prix du cours :</span>
                <span>{formatPrice(rawPriceUSD)} (~{rawPriceUSD} USD)</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>Réduction (-{appliedDiscount}%) :</span>
                  <span>- {formatPrice((rawPriceUSD * appliedDiscount) / 100)}</span>
                </div>
              )}

              <div className="pt-1.5 border-t border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Total net à régler :</span>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    {formatPrice(discountedPriceUSD)}
                  </span>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <span>1 USD = {currencyInfo.rateFromUSD.toLocaleString('fr-FR')} {currencyCode}</span>
                </div>
              </div>
            </div>

            {/* Error feedback if payment fails */}
            {paymentError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-start gap-1.5 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-950">Échec : </span>
                    <span className="text-[11px] text-rose-800">{paymentError}</span>
                  </div>
                </div>
                {selectedGateway.id === 'mpesa' && (
                  <div className="pt-1 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneNumber('+243 81 000 0001');
                        setPaymentError(null);
                        handleProcessPayment();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer transition-colors"
                    >
                      <span>Réessayer avec 081 000 0001 (Succès garanti)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsVodacomSimulatorOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] cursor-pointer transition-colors"
                    >
                      <span>Simulateur USSD</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Payment Action Button */}
            <div className="space-y-1.5 pt-1">
              <button
                id="confirm-checkout-payment-btn"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isProcessing
                    ? 'bg-slate-400 cursor-not-allowed'
                    : selectedGateway.id === 'mpesa'
                    ? 'bg-red-600 hover:bg-red-500 active:scale-98 shadow-red-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 active:scale-98 shadow-emerald-600/20'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{processingStep}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white/90" />
                    <span>
                      {selectedGateway.id === 'mpesa'
                        ? `Valider ${formatPrice(discountedPriceUSD)} (Vodacom Sandbox)`
                        : `Payer ${formatPrice(discountedPriceUSD)} (${selectedGateway?.name || 'Sécurisé'})`}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setCheckoutStep(2)}
                  className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Modifier les coordonnées</span>
                </button>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Garantie 30 jours
                </span>
              </div>
            </div>
          </div>
        )}
            </div>
          </div>
        )}
      </div>

      {/* Guide Intégration RDC */}
      <RdcPaymentIntegrationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Vodacom M-Pesa Test Simulator */}
      {isVodacomSimulatorOpen && (
        <VodacomMpesaTestSimulator
          isOpen={isVodacomSimulatorOpen}
          onClose={() => setIsVodacomSimulatorOpen(false)}
          onSuccess={(order) => {
            setIsVodacomSimulatorOpen(false);
            const existingOrders = getStoredOrders();
            saveStoredOrders([order, ...existingOrders]);
            setCompletedOrder(order);
            onSuccess(order);
          }}
          amount={Math.round(localPrice)}
          currency={currencyCode}
          courseTitle={course.title}
          courseId={course.id}
          userId={currentUser?.id}
          userName={currentUser?.name}
          userEmail={currentUser?.email}
          initialPhone={phoneNumber}
        />
      )}
    </div>
  );
};
