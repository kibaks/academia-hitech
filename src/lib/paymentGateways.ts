import { PaymentGatewayConfig, PaymentSubscriptionPlan, CourseOrder, PaymentGatewayId } from '../types';

export const DEFAULT_PAYMENT_GATEWAYS: PaymentGatewayConfig[] = [
  {
    id: 'mpesa',
    name: 'Vodacom M-Pesa RDC',
    providerType: 'mobile_money',
    isEnabled: true,
    isTestMode: true,
    publicKey: 'MPESA_LIVE_API_KEY_SANDBOX_0192',
    secretKey: 'MPESA_PASSKEY_LNM_98172948127391',
    merchantId: '174379',
    supportedCurrencies: ['CDF', 'USD'],
    icon: 'Zap',
    description: 'Paiement instantané USSD STK Push Vodacom M-Pesa en Franc Congolais (CDF) et Dollars US (USD).',
    regions: ['RD Congo (Kinshasa, Lubumbashi, Goma, Bukavu, Matadi)'],
    additionalSettings: {
      shortCode: '174379',
      stkPushEnabled: 'true',
      operatorPrefixes: '081, 082, 083',
    },
  },
  {
    id: 'airtel_money',
    name: 'Airtel Money RDC',
    providerType: 'mobile_money',
    isEnabled: true,
    isTestMode: true,
    publicKey: 'AIRTEL_API_KEY_CD_SANDBOX_82910',
    secretKey: 'AIRTEL_SEC_KEY_CD_TEST_99812470129381',
    merchantId: 'AIRTEL-CD-MERCHANT-01',
    supportedCurrencies: ['CDF', 'USD'],
    icon: 'PhoneCall',
    description: 'Débit direct Airtel Money RDC avec notification USSD instantanée (*501#) en CDF et USD.',
    regions: ['RD Congo (Kinshasa, Kisangani, Kolwezi, Kananga)'],
    additionalSettings: {
      countryCode: 'CD',
      operatorPrefixes: '097, 098, 099',
    },
  },
  {
    id: 'afrimoney',
    name: 'Afrimoney (Africell RDC)',
    providerType: 'mobile_money',
    isEnabled: true,
    isTestMode: true,
    publicKey: 'AFRIMONEY_KEY_CD_SANDBOX_99182',
    secretKey: 'AFRIMONEY_SEC_CD_TEST_88172948127491',
    merchantId: 'AFRICELL-CD-MERCHANT-88',
    supportedCurrencies: ['CDF', 'USD'],
    icon: 'Smartphone',
    description: 'Paiement mobile sécurisé Africell RDC avec confirmation PIN (*1111#) en Franc Congolais et USD.',
    regions: ['RD Congo (Kinshasa, Kongo-Central)'],
    additionalSettings: {
      shortCode: '8849',
      operatorPrefixes: '090, 091',
    },
  },
  {
    id: 'orange_money',
    name: 'Orange Money RDC',
    providerType: 'mobile_money',
    isEnabled: true,
    isTestMode: true,
    publicKey: 'OM_RDC_WEB_AUTH_TEST_8721948124',
    secretKey: 'OM_RDC_SEC_KEY_TEST_9981247012938120',
    merchantId: 'OM-RDC-847291',
    supportedCurrencies: ['CDF', 'USD'],
    icon: 'Phone',
    description: 'Paiement sécurisé avec génération de code OTP (*144#) sur smartphone Orange RDC.',
    regions: ['RD Congo (Kinshasa, Boma, Kikwit, Tshikapa)'],
    additionalSettings: {
      otpTimeoutSeconds: '120',
      operatorPrefixes: '084, 085, 089',
    },
  },
  {
    id: 'stripe',
    name: 'Cartes Bancaires Visa & Mastercard (RDC & International)',
    providerType: 'card',
    isEnabled: true,
    isTestMode: true,
    publicKey: 'pk_test_51AcademiaITECH99281748201948291847291',
    secretKey: 'sk_test_51AcademiaITECH_SECRET_KEY_998127498127',
    webhookSecret: 'whsec_stripe_test_88172948127491',
    merchantId: 'acct_1AcademiaITECH',
    supportedCurrencies: ['CDF', 'USD', 'EUR'],
    icon: 'CreditCard',
    description: 'Cartes bancaires Visa & Mastercard émises par les banques congolaises (Rawbank, EquityBCDC, Sofibanque, TMB, Illicocash) et cartes internationales avec 3D Secure 2.',
    regions: ['RD Congo (Rawbank, EquityBCDC, TMB)', 'International & Diaspora'],
    additionalSettings: {
      enable3DSecure: 'true',
      acceptedNetworks: 'Visa, Mastercard',
    },
  },
  {
    id: 'maxicash',
    name: 'MaxiCash RDC (Agrégateur National)',
    providerType: 'aggregator',
    isEnabled: true,
    isTestMode: true,
    publicKey: 'MAXICASH_PUBLIC_KEY_RDC_881920',
    secretKey: 'MAXICASH_SECRET_KEY_RDC_771920',
    merchantId: 'MAXICASH-ACADEMIA-CD',
    supportedCurrencies: ['CDF', 'USD'],
    icon: 'Globe2',
    description: 'Passerelle e-commerce agréée RDC unifiant M-Pesa, Airtel Money, Orange Money et Cartes Bancaires locales.',
    regions: ['RD Congo', 'Diaspora Congolaise'],
    additionalSettings: {
      settlementBank: 'Rawbank / EquityBCDC',
    },
  },
  {
    id: 'cinetpay',
    name: 'CinetPay Guichet Unique Panafricain',
    providerType: 'aggregator',
    isEnabled: true,
    isTestMode: true,
    publicKey: 'CINETPAY_APIKEY_SANDBOX_9918274918274918',
    secretKey: 'CINETPAY_SECRET_SANDBOX_8817294812749182',
    merchantId: 'SITE_ID_884912',
    supportedCurrencies: ['CDF', 'USD', 'XOF', 'XAF'],
    icon: 'Coins',
    description: 'Guichet unique régional couvrant la RDC et plus de 15 pays d\'Afrique avec conversion instantanée.',
    regions: ['RD Congo', 'Zone CEMAC', 'Zone UEMOA'],
    additionalSettings: {
      siteId: '884912',
    },
  },
  {
    id: 'wave',
    name: 'Wave Mobile Money',
    providerType: 'mobile_money',
    isEnabled: true,
    isTestMode: true,
    publicKey: 'wave_ci_pk_test_928174628419572',
    secretKey: 'wave_ci_sk_test_SECRET_9817498127391823',
    webhookSecret: 'whsec_wave_sandbox_01928301',
    merchantId: 'WAVE-ACAD-SN-01',
    supportedCurrencies: ['XOF', 'CDF', 'USD'],
    icon: 'Smartphone',
    description: 'Paiement instantané par QR code Wave.',
    regions: ['Sénégal', 'Côte d\'Ivoire'],
  },
  {
    id: 'paypal',
    name: 'PayPal Commerce Platform',
    providerType: 'wallet',
    isEnabled: true,
    isTestMode: true,
    publicKey: 'PAYPAL_CLIENT_ID_SANDBOX_AZ_8917294812749182',
    secretKey: 'PAYPAL_SECRET_SANDBOX_EL_99182749182739182',
    merchantId: 'PAYPAL-ACAD-HQ',
    supportedCurrencies: ['USD', 'EUR'],
    icon: 'DollarSign',
    description: 'Portefeuille électronique international pour les étudiants de la diaspora.',
    regions: ['International', 'Diaspora'],
  },
];

export const DEFAULT_SUBSCRIPTION_PLANS: PaymentSubscriptionPlan[] = [
  {
    id: 'plan-monthly-pass',
    name: 'Pass Mensuel Tech & IA',
    code: 'monthly_pass',
    priceUSD: 19,
    billingPeriod: 'month',
    description: 'Accès illimité à l\'ensemble du catalogue de formations, certifications et tuteur IA AIDA 24/7.',
    features: [
      'Accès illimité à +30 cours certifiants',
      'Tuteur IA AIDA illimité en vocal & WhatsApp',
      'Certificats officiels blockchain inclus',
      'Accès aux ateliers de code en direct',
      'Annulation sans engagement à tout moment',
    ],
    isPopular: false,
    activeSubscribersCount: 412,
  },
  {
    id: 'plan-annual-pass',
    name: 'Pass Annuel Panafricain Pro',
    code: 'annual_pass',
    priceUSD: 149, // Save ~35%
    billingPeriod: 'year',
    description: 'Le pass complet pour propulser sa carrière tech. Inclut le mentorat formateur et l\'accès prioritaire aux campus physiques.',
    features: [
      'Tout le catalogue en accès illimité 365 jours',
      '2 mois gratuits inclus vs paiement mensuel',
      'Accès prioritaire aux FabLabs des campus partenaires',
      'Mentorat individuel trimestriel avec un formateur',
      'Inclusion automatique au vivier de recrutement partenaires',
      'Diplômes d\'Excellence ITECH',
    ],
    isPopular: true,
    activeSubscribersCount: 1280,
  },
  {
    id: 'plan-enterprise-pass',
    name: 'Pass Entreprise & Centre Affilié',
    code: 'enterprise_pass',
    priceUSD: 499,
    billingPeriod: 'year',
    description: 'Solution pour entreprises, universités et centres de formation partenaires jusqu\'à 25 apprenants.',
    features: [
      '25 licences complètes pour vos collaborateurs',
      'Dashboard administrateur & suivi des compétences RH',
      'Création de cours personnalisés dans le Studio IA',
      'Support dédié par ingénieur pédagogique sous 2h',
      'Facturation d\'entreprise conforme OHADA / BCEAO / BCC',
    ],
    isPopular: false,
    activeSubscribersCount: 86,
  },
];

const LOCAL_STORAGE_GATEWAYS_KEY = 'academia_itech_payment_gateways_v1';
const LOCAL_STORAGE_ORDERS_KEY = 'academia_itech_course_orders_v1';
const LOCAL_STORAGE_PLANS_KEY = 'academia_itech_subscription_plans_v1';

export function getStoredPaymentGateways(): PaymentGatewayConfig[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_GATEWAYS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading gateways from localStorage:', e);
  }
  return DEFAULT_PAYMENT_GATEWAYS;
}

export function saveStoredPaymentGateways(gateways: PaymentGatewayConfig[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_GATEWAYS_KEY, JSON.stringify(gateways));
  } catch (e) {
    console.error('Error saving gateways to localStorage:', e);
  }
}

export function getStoredSubscriptionPlans(): PaymentSubscriptionPlan[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PLANS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading subscription plans from localStorage:', e);
  }
  return DEFAULT_SUBSCRIPTION_PLANS;
}

export function saveStoredSubscriptionPlans(plans: PaymentSubscriptionPlan[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PLANS_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Error saving subscription plans to localStorage:', e);
  }
}

export function getStoredOrders(): CourseOrder[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading orders from localStorage:', e);
  }
  // Initial seed orders for realistic look
  return [
    {
      id: 'ord-1001',
      userId: 'user-alain-m',
      userEmail: 'alain.mukendi@campus.itech.cd',
      userName: 'Alain Mukendi',
      courseId: 'course-ia-llm',
      courseTitle: 'Masterclass IA Générative, LLMs & Traitement des Langues Africaines (NLP)',
      amountUSD: 45,
      paidAmount: 126000,
      paidCurrency: 'CDF',
      gateway: 'wave',
      paymentType: 'one_time',
      status: 'completed',
      transactionReference: 'WAVE-TX-9982410',
      createdAt: 'Hier à 16:42',
      receiptNumber: 'REC-2026-0819',
      payerPhoneOrAccount: '+243 82 491 8201',
    },
    {
      id: 'ord-1002',
      userId: 'user-fatou-s',
      userEmail: 'fatou.sow@dakar-ai.sn',
      userName: 'Fatou Sow',
      courseId: 'subscription-annual',
      courseTitle: 'Pass Annuel Panafricain Pro (Abonnement Illimité)',
      amountUSD: 149,
      paidAmount: 90890,
      paidCurrency: 'XOF',
      gateway: 'orange_money',
      paymentType: 'subscription',
      subscriptionPlanId: 'plan-annual-pass',
      status: 'completed',
      transactionReference: 'OM-TX-4481029',
      createdAt: 'Il y a 3 jours',
      receiptNumber: 'REC-2026-0792',
      payerPhoneOrAccount: '+221 77 654 3210',
    },
    {
      id: 'ord-1003',
      userId: 'user-malik-k',
      userEmail: 'malik.konate@cyber.itech.sn',
      userName: 'Malik Konaté',
      courseId: 'course-cyber-sec',
      courseTitle: 'Cybersécurité Offensive, Audit Bancaire & Défense des Infrastructures Africaines',
      amountUSD: 50,
      paidAmount: 50,
      paidCurrency: 'USD',
      gateway: 'stripe',
      paymentType: 'one_time',
      status: 'completed',
      transactionReference: 'ch_3N82b9AcademiaITECH01',
      createdAt: 'Il y a 5 jours',
      receiptNumber: 'REC-2026-0715',
      payerPhoneOrAccount: '•••• 4242 (Visa)',
    },
  ];
}

export function saveStoredOrders(orders: CourseOrder[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders to localStorage:', e);
  }
}
