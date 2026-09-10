import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building2,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Zap,
  Globe2,
  Coins
} from 'lucide-react';
import { RdcPaymentLogo } from './RdcPaymentLogo';

interface RdcPaymentIntegrationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RdcPaymentIntegrationGuideModal: React.FC<RdcPaymentIntegrationGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeSnippet(id);
    setTimeout(() => setCopiedCodeSnippet(null), 2500);
  };

  const steps = [
    {
      id: 1,
      title: '1. Choix Stratégique',
      subtitle: 'Agrégateur Tout-en-un vs Direct Télécoms',
      badge: 'Architecture',
    },
    {
      id: 2,
      title: '2. Conformité BCC & Marchand',
      subtitle: 'Contrats, RCCM, NIF & Comptes CDF/USD',
      badge: 'Juridique',
    },
    {
      id: 3,
      title: '3. Implémentation APIs RDC',
      subtitle: 'M-Pesa STK Push, Airtel, Afrimoney, Visa',
      badge: 'Technique',
    },
    {
      id: 4,
      title: '4. Webhooks & Sécurité',
      subtitle: 'Signatures HMAC, Idempotence, Double devise',
      badge: 'Sécurité',
    },
    {
      id: 5,
      title: '5. Recette & Go Live',
      subtitle: 'Tests Sandbox avec numéros réels RDC',
      badge: 'Déploiement',
    },
  ];

  const mpesaSampleCode = `// Exemple Node.js / TypeScript : Déclenchement STK Push M-Pesa RDC
import axios from 'axios';

export async function initiateMpesaStkPushRDC(params: {
  amount: number;       // Montant en Franc Congolais (CDF) ou USD
  currency: 'CDF' | 'USD';
  phoneNumber: string; // Ex: '243810000001' (Format international RDC)
  orderId: string;
}) {
  const token = await getMpesaBearerToken(); // Auth OAuth 2.0 Vodacom

  const payload = {
    input_TransactionReference: params.orderId,
    input_CustomerMSISDN: params.phoneNumber,
    input_Amount: params.amount.toString(),
    input_ThirdPartyReference: params.orderId,
    input_ServiceProviderCode: process.env.VODACOM_SHORTCODE_RDC, // Ex: '174379'
    input_Currency: params.currency, // 'CDF' ou 'USD'
    input_PaymentReason: 'Abonnement Formation Academia ITECH'
  };

  const response = await axios.post(
    'https://openapi.m-pesa.vodacom.cd/sandbox/ipg/v2/vodacomDRC/c2bPayment/singleStage/',
    payload,
    {
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Origin': 'developer.vodacom.cd',
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data; // Notification USSD instantanée envoyée sur le mobile client
}`;

  const airtelSampleCode = `// Exemple : Débit Marchand Airtel Money RDC (Collections API)
export async function initiateAirtelMoneyPaymentRDC(params: {
  amount: number;
  currency: 'CDF' | 'USD';
  phoneNumber: string; // Ex: '243970000002' (Airtel RDC)
  reference: string;
}) {
  const authToken = await getAirtelAuthToken();

  const payload = {
    reference: params.reference,
    subscriber: {
      country: 'CD', // République Démocratique du Congo
      currency: params.currency, // CDF ou USD
      msisdn: params.phoneNumber.replace('+', '')
    },
    transaction: {
      amount: params.amount,
      country: 'CD',
      currency: params.currency,
      id: params.reference
    }
  };

  const response = await axios.post(
    'https://openapi.airtel.africa/merchant/v1/payments/',
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Country': 'CD',
        'X-Currency': params.currency,
        'Authorization': \`Bearer \${authToken}\`
      }
    }
  );

  return response.data;
}`;

  return (
    <div
      id="rdc-integration-guide-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="rdc-integration-guide-container"
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex items-center justify-between border-b border-sky-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-xs">
              <span className="text-xl">🇨🇩</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Guide Officiel d'Intégration des Paiements en RDC
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 uppercase tracking-wider">
                  M-Pesa • Airtel • Afrimoney • Visa/Mastercard
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Marche à suivre pas-à-pas pour connecter techniquement et juridiquement votre plateforme en République Démocratique du Congo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logos Showcase Strip */}
        <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Modalités supportées :
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <RdcPaymentLogo gatewayId="mpesa" size="sm" />
            <RdcPaymentLogo gatewayId="airtel_money" size="sm" />
            <RdcPaymentLogo gatewayId="afrimoney" size="sm" />
            <RdcPaymentLogo gatewayId="orange_money" size="sm" />
            <RdcPaymentLogo gatewayId="stripe" size="sm" />
          </div>
        </div>

        {/* Step Tabs Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`px-3 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs font-black'
                    : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200 font-semibold'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {step.id}
                </div>
                <div>
                  <div className="text-xs">{step.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Body - Tabbed Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* STEP 1: CHOIX STRATÉGIQUE */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Étape 1 : Choisir la Méthode d'Intégration en RDC</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                      Recommandation
                    </span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    En RDC, vous avez deux approches majeures pour accepter M-Pesa, Airtel Money, Afrimoney et les cartes bancaires :
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option A: Agrégateur Tout-en-un */}
                <div className="p-5 rounded-2xl border-2 border-sky-500 bg-sky-50/50 space-y-3 relative shadow-xs">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-600 text-white uppercase tracking-wider absolute top-4 right-4">
                    Recommandé (90% des projets)
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <h5 className="text-base font-black text-slate-900">
                    Option A : Passer par un Agrégateur Agréé RDC
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Exemples : <strong>MaxiCash RDC</strong>, <strong>CinetPay RDC</strong>, <strong>Flutterwave RDC</strong>, <strong>Rawbank Illicocash API</strong>.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>1 seul contrat</strong> pour M-Pesa + Airtel + Afrimoney + Orange + Visa/Mastercard.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>1 seule API REST</strong> moderne avec documentation Swagger et Webhooks unifiés.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Règlement direct sur votre compte bancaire (Rawbank, EquityBCDC, Sofibanque, TMB) en CDF ou USD.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Délai de mise en production rapide (environ 3 à 7 jours).</span>
                    </li>
                  </ul>
                </div>

                {/* Option B: Intégration Directe avec chaque Opérateur */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h5 className="text-base font-black text-slate-900">
                    Option B : Intégrations Directes Télécom par Télécom
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Négociation directe auprès de chaque opérateur de télécommunication en RDC.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span><strong>Vodacom RDC</strong> : Portail Open API M-Pesa (Shortcode C2B / B2B).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span><strong>Airtel RDC</strong> : Airtel Money Developer Portal (Africa Hub).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span><strong>Africell RDC</strong> : API Afrimoney Merchant Services.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span><strong>Orange RDC</strong> : Orange Money Web Payment API.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span><em>Inconvénient :</em> Nécessite 4 à 5 contrats séparés, 4 intégrations techniques et dépôts de garantie. Idéal pour très gros volumes (&gt;50 000 transactions/mois).</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 rounded-2xl bg-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">
                  Prêt pour les démarches administratives et bancaires ?
                </span>
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Passer à l'étape 2 : Cadre Réglementaire BCC</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONFORMITÉ & JURIDIQUE */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Étape 2 : Démarches Administratives, Réglementation BCC & Dossier Marchand
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  En RDC, la Banque Centrale du Congo (BCC) encadre strictement les services de paiement via l'Instruction n°24. Voici les documents indispensables :
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <h5 className="font-extrabold text-sm text-slate-900">Statuts & Entreprise RDC</h5>
                  <p className="text-xs text-slate-600">
                    - Registre du Commerce (RCCM Kinshasa ou Province)<br />
                    - Numéro d'Identification Nationale (Id. Nat)<br />
                    - Numéro d'Impôt (NIF)<br />
                    - Pièce d'identité du gérant (Passeport / Carte d'électeur)
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <h5 className="font-extrabold text-sm text-slate-900">Compte Bancaire Local</h5>
                  <p className="text-xs text-slate-600">
                    RIB/Attestation bancaire dans une banque commerciale agréée en RDC (Rawbank, EquityBCDC, TMB, Sofibanque, Ecobank) :<br />
                    - <strong>Sous-compte CDF</strong> (Franc Congolais)<br />
                    - <strong>Sous-compte USD</strong> (Dollars)
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <h5 className="font-extrabold text-sm text-slate-900">Contrat Marchand E-Commerce</h5>
                  <p className="text-xs text-slate-600">
                    - Signature de l'accord marchand Mobile Money C2B<br />
                    - Conditions Générales de Vente (CGV) et politique de remboursement conformes au droit OHADA / RDC<br />
                    - Attribution d'un <strong>Merchant Shortcode</strong> unique
                  </p>
                </div>
              </div>

              {/* Currency specifics */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <Coins className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-extrabold block text-amber-950">
                    Spécificité RDC : Gestion de la Double Devise (CDF & USD)
                  </span>
                  En RDC, les prix des formations peuvent être libellés en Dollars US (USD) pour la stabilité, mais l'étudiant congolais paie généralement en Francs Congolais (CDF) depuis son compte M-Pesa ou Airtel Money. Votre backend doit gérer la conversion avec le taux indicatif officiel (ex: 1 USD = 2800 CDF).
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  ← Précédent
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Passer à l'étape 3 : Implémentation APIs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: IMPLÉMENTATION TECHNIQUE */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Étape 3 : Spécifications Techniques & Codes Exemples
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Le mode d'encaissement recommandé est le <strong>STK Push (Push USSD)</strong> : le client entre son numéro de téléphone sur Academia ITECH, et une popup interactive s'affiche automatiquement sur son téléphone lui demandant d'entrer son code PIN secret.
                </p>
              </div>

              {/* M-Pesa Code Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RdcPaymentLogo gatewayId="mpesa" size="sm" />
                    <span className="text-xs font-bold text-slate-900">Exemple d'appel M-Pesa Open API (RDC)</span>
                  </div>
                  <button
                    onClick={() => handleCopy(mpesaSampleCode, 'mpesa')}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCodeSnippet === 'mpesa' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{mpesaSampleCode}</pre>
                </div>
              </div>

              {/* Airtel Money Code Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RdcPaymentLogo gatewayId="airtel_money" size="sm" />
                    <span className="text-xs font-bold text-slate-900">Exemple d'appel Airtel Money RDC (Merchant API)</span>
                  </div>
                  <button
                    onClick={() => handleCopy(airtelSampleCode, 'airtel')}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCodeSnippet === 'airtel' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{airtelSampleCode}</pre>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  ← Précédent
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Passer à l'étape 4 : Webhooks & Sécurité</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: WEBHOOKS & SÉCURITÉ */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Étape 4 : Webhooks, Signatures HMAC & Sécurisation
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Les réseaux mobiles congolais peuvent avoir des micro-coupures. Ne validez JAMAIS un paiement uniquement sur le navigateur de l'utilisateur : utilisez toujours un <strong>Webhook serveur-à-serveur (IPN)</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-sky-700 font-black text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Signature HMAC-SHA256</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Chaque requête webhook reçue sur <code>/api/payments/webhook</code> contient un en-tête de signature (ex: <code>X-Signature</code>). Vérifiez que <code>crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex')</code> correspond exactement avant de débloquer le cours.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-black text-sm">
                    <Zap className="w-5 h-5" />
                    <span>Idempotence des Transactions</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Les opérateurs (Vodacom, Airtel, Africell) peuvent renvoyer 2 ou 3 fois la même notification en cas de latence réseau. Enregistrez l'identifiant unique <code>transactionReference</code> dans Firestore pour ne jamais créditer deux fois.
                  </p>
                </div>
              </div>

              {/* Cartes bancaires Visa / Mastercard via 3D Secure */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 space-y-2">
                <div className="flex items-center gap-2 font-black text-sm text-indigo-900">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Cartes Bancaires en RDC (Visa / Mastercard) : Exigence 3D Secure 2</span>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Pour les étudiants payant par carte bancaire (cartes de débit/crédit émises par Rawbank, EquityBCDC, TMB, Illicocash ou internationales), le protocole <strong>3D Secure 2 avec OTP SMS bancaire</strong> est obligatoire pour éviter toute répudiation de charge (chargeback).
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  ← Précédent
                </button>
                <button
                  onClick={() => setActiveStep(5)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Passer à l'étape 5 : Recette & Mise en Production</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: RECETTE & GO LIVE */}
          {activeStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h4 className="text-lg font-black text-slate-900">
                  Étape 5 : Environnement Bac à Sable (Sandbox) & Mise en Production
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Checklist finale pour valider les paiements réels avec des cartes SIM congolaises avant l'ouverture au public :
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Numéros de Test RDC Recommandés pour la Sandbox :
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-red-600 block">Vodacom M-Pesa RDC</span>
                      <span className="font-mono text-slate-700">+243 81 000 0001 (Succès)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">PIN: 1234</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-red-700 block">Airtel Money RDC</span>
                      <span className="font-mono text-slate-700">+243 97 000 0002 (Succès)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">PIN: 1234</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-purple-700 block">Afrimoney (Africell)</span>
                      <span className="font-mono text-slate-700">+243 90 000 0003 (Succès)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">PIN: 0000</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-700 block">Visa / Mastercard RDC</span>
                      <span className="font-mono text-slate-700">4242 •••• •••• 4242</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">3DS: OK</span>
                  </div>
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Checklist Avant Déploiement Public :
                </h5>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Remplacement des clés Sandbox par les clés Live de production dans les variables d'environnement.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Test réel d'une transaction de 1 000 CDF avec un vrai téléphone Vodacom, Airtel et Africell.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Vérification de la réception du relevé de virement sur le compte Rawbank / EquityBCDC.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Émission automatique du reçu officiel Academia ITECH avec numéro de transaction BCC.</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  ← Précédent
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Compris ! Retour à la Plateforme</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
