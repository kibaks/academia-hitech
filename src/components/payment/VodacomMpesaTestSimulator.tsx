import React, { useState } from 'react';
import { CourseOrder, PaymentGatewayConfig } from '../../types';
import { RdcPaymentLogo } from './RdcPaymentLogo';
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  X,
  Zap,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Send,
  Lock,
  Phone,
  Info,
  Clock
} from 'lucide-react';

interface VodacomMpesaTestSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (order: CourseOrder) => void;
  amount: number;
  currency: string;
  courseTitle: string;
  courseId?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  initialPhone?: string;
}

export const VODACOM_TEST_SCENARIOS = [
  {
    number: '+243 81 000 0001',
    clean: '243810000001',
    scenario: 'success',
    badge: 'Succès Garanti',
    color: 'emerald',
    desc: 'Simule un compte approvisionné (Code INS-0)',
  },
  {
    number: '+243 81 000 0002',
    clean: '243810000002',
    scenario: 'insufficient_funds',
    badge: 'Solde Insuffisant',
    color: 'amber',
    desc: 'Simule un solde M-Pesa insuffisant (Code INS-10)',
  },
  {
    number: '+243 81 000 0003',
    clean: '243810000003',
    scenario: 'cancelled',
    badge: 'Annulé Client',
    color: 'rose',
    desc: 'Simule un rejet ou code PIN erroné (Code INS-1)',
  },
  {
    number: '+243 81 000 0004',
    clean: '243810000004',
    scenario: 'timeout',
    badge: 'Délai Dépassé',
    color: 'slate',
    desc: 'Simule un délai d\'attente USSD expiré 60s (Code INS-2006)',
  },
];

export const VodacomMpesaTestSimulator: React.FC<VodacomMpesaTestSimulatorProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  currency,
  courseTitle,
  courseId = 'course-test',
  userId = 'user-guest',
  userName = 'Apprenant ITECH',
  userEmail = 'apprenant@academia-itech.com',
  initialPhone = '+243 81 000 0001',
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [pin, setPin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiLog, setApiLog] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<CourseOrder | null>(null);
  const [simStep, setSimStep] = useState<'input' | 'ussd_prompt' | 'success' | 'failed'>('ussd_prompt');

  if (!isOpen) return null;

  const handleLaunchUssd = () => {
    setErrorMessage(null);
    setSimStep('ussd_prompt');
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setApiLog([
      `[Vodacom OpenAPI] Initialisation C2B Single Stage Sandbox...`,
      `[M-Pesa Gateway] Numéro: ${phoneNumber} | Montant: ${amount} ${currency}`,
    ]);

    try {
      // Call backend endpoint or fallback
      const response = await fetch('/api/payment/vodacom-mpesa/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          phoneNumber,
          courseId,
          courseTitle,
          userId,
          userName,
          userEmail,
          pin,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.order) {
        setApiLog((prev) => [
          ...prev,
          `[INS-0] Validation Sandbox OpenAPI M-Pesa RDC réussie !`,
          `[Réf TX] ${data.transactionReference}`,
        ]);
        setSuccessOrder(data.order);
        setSimStep('success');
      } else {
        const errorText = data.responseDesc || 'Transaction refusée par le Sandbox Vodacom.';
        setErrorMessage(errorText);
        setApiLog((prev) => [...prev, `[${data.responseCode || 'ERROR'}] ${errorText}`]);
        setSimStep('failed');
      }
    } catch {
      // Offline fallback: Simulate successful INS-0 response for sandbox testing
      if (phoneNumber.endsWith('0002')) {
        setErrorMessage('Solde insuffisant sur votre compte Vodacom M-Pesa (Code INS-10).');
        setSimStep('failed');
      } else if (phoneNumber.endsWith('0003') || pin !== '1234') {
        setErrorMessage('Transaction M-Pesa annulée ou code PIN incorrect (Code test attendu: 1234).');
        setSimStep('failed');
      } else {
        const simulatedOrder: CourseOrder = {
          id: 'ord-mpesa-' + Date.now().toString(36),
          userId,
          userEmail,
          userName,
          courseId,
          courseTitle,
          amountUSD: currency === 'USD' ? amount : Math.round((amount / 2850) * 100) / 100,
          paidAmount: amount,
          paidCurrency: currency,
          gateway: 'mpesa',
          paymentType: 'one_time',
          status: 'completed',
          transactionReference: `MPESA-CD-TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
          createdAt: 'À l\'instant',
          receiptNumber: `REC-MPESA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          payerPhoneOrAccount: phoneNumber,
        };
        setSuccessOrder(simulatedOrder);
        setSimStep('success');
        onSuccess(simulatedOrder);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="vodacom-mpesa-simulator-backdrop"
      className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="vodacom-mpesa-simulator-container"
        className="relative w-full max-w-lg bg-white rounded-3xl border border-red-200 shadow-2xl overflow-hidden my-4"
      >
        {/* Header Vodacom M-Pesa RDC */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-1 flex items-center justify-center shadow-xs">
              <RdcPaymentLogo gatewayId="mpesa" size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">
                  Vodacom M-Pesa RDC
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wide">
                  Mode Test Sandbox
                </span>
              </div>
              <p className="text-xs text-red-100">
                Simulateur officiel USSD STK Push (OpenAPI Vodacom DRC)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Quick Scenario Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Sélectionnez un Scénario de Test Vodacom RDC :</span>
              <span className="text-[10px] text-slate-400 font-mono">OpenAPI v2 DRC</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {VODACOM_TEST_SCENARIOS.map((sc) => {
                const isSelected = phoneNumber.includes(sc.clean);
                return (
                  <button
                    key={sc.clean}
                    type="button"
                    onClick={() => {
                      setPhoneNumber(sc.number);
                      setErrorMessage(null);
                      setSimStep('ussd_prompt');
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-50/80 border-red-500 ring-2 ring-red-500/20 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800">{sc.badge}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          sc.color === 'emerald'
                            ? 'bg-emerald-500'
                            : sc.color === 'amber'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      />
                    </div>
                    <p className="text-[10px] font-mono text-slate-600 mt-0.5">{sc.number}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Realistic Mobile Phone Screen USSD Push */}
          {simStep === 'ussd_prompt' && (
            <div className="space-y-4">
              {/* Phone Frame */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white shadow-inner border border-slate-800 space-y-4">
                {/* USSD Prompt Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <Zap className="w-4 h-4 fill-red-400" />
                    <span>Notification USSD Vodacom RDC</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                    *1122#
                  </span>
                </div>

                {/* Prompt Text */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
                  <p className="text-emerald-400 font-bold">
                    Vodacom M-Pesa RDC (Code Marchand: 174379)
                  </p>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    Autoriser le paiement de{' '}
                    <strong className="text-amber-400 font-black">
                      {amount.toLocaleString('fr-FR')} {currency}
                    </strong>{' '}
                    à <strong className="text-white">ACADEMIA ITECH</strong> pour la formation "
                    {courseTitle}".
                  </p>
                </div>

                {/* Phone Number & PIN Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                      Numéro Vodacom :
                    </label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-semibold text-slate-400">
                        Code PIN M-Pesa :
                      </label>
                      <button
                        type="button"
                        onClick={() => setPin('1234')}
                        className="text-[10px] text-red-400 hover:underline font-mono"
                      >
                        Code test: 1234
                      </button>
                    </div>
                    <input
                      type="password"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold text-center tracking-widest focus:outline-none focus:border-red-500"
                      placeholder="••••"
                    />
                  </div>
                </div>

                {/* Action in Phone Screen */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    1. Annuler
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleExecutePayment}
                    className="flex-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 transition-all cursor-pointer active:scale-98"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Validation OpenAPI M-Pesa...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>2. Confirmer & Valider Débit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Result View */}
          {simStep === 'success' && successOrder && (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-black text-slate-900">
                  Transaction Vodacom M-Pesa Confirmée !
                </h4>
                <p className="text-xs text-slate-600">
                  Le paiement en Mode Test Sandbox a été approuvé avec le code <strong>INS-0</strong>.
                  La formation est débloquée avec succès.
                </p>
              </div>

              {/* SMS Received Simulation */}
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-1.5 font-mono border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>SMS M-PESA INFO</span>
                  <span>À l'instant</span>
                </div>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  "Confirmé. {amount.toLocaleString('fr-FR')} {currency} payés à ACADEMIA ITECH RDC.
                  Réf: {successOrder.transactionReference}. Reçu #{successOrder.receiptNumber}. Merci d'utiliser Vodacom M-Pesa."
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (successOrder) {
                      onSuccess(successOrder);
                    }
                    onClose();
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Accéder Immédiatement à la Formation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Failed Result View */}
          {simStep === 'failed' && (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h4 className="text-base font-black text-rose-900">
                  Échec de la Transaction M-Pesa
                </h4>
                <p className="text-xs text-rose-700">
                  {errorMessage || 'Une erreur est survenue lors de la validation Sandbox Vodacom.'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPhoneNumber('+243 81 000 0001');
                    setPin('1234');
                    setErrorMessage(null);
                    setSimStep('ussd_prompt');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réessayer avec le Scénario Succès</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
