export type CurrencyCode = 'CDF' | 'XOF' | 'USD' | 'EUR' | 'NGN' | 'KES' | 'ZAR' | 'GHS';

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  country: string;
  rateFromUSD: number; // 1 USD = rateFromUSD units
  decimals: number;
  formatPattern: 'symbol_before' | 'symbol_after';
  isClientDetected?: boolean;
}

export const BASE_SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  {
    code: 'CDF',
    name: 'Franc Congolais (CDF)',
    symbol: 'FC',
    flag: '🇨🇩',
    country: 'RD Congo (Kinshasa)',
    rateFromUSD: 2800,
    decimals: 0,
    formatPattern: 'symbol_after',
  },
  {
    code: 'XOF',
    name: 'Franc CFA (FCFA)',
    symbol: 'FCFA',
    flag: '🌍',
    country: 'UEMOA / CEMAC (Sénégal, Côte d\'Ivoire, Cameroun...)',
    rateFromUSD: 600,
    decimals: 0,
    formatPattern: 'symbol_after',
  },
  {
    code: 'USD',
    name: 'Dollar US ($)',
    symbol: '$',
    flag: '🇺🇸',
    country: 'International',
    rateFromUSD: 1.0,
    decimals: 2,
    formatPattern: 'symbol_before',
  },
  {
    code: 'EUR',
    name: 'Euro (€)',
    symbol: '€',
    flag: '🇪🇺',
    country: 'Europe / International',
    rateFromUSD: 0.92,
    decimals: 2,
    formatPattern: 'symbol_after',
  },
  {
    code: 'NGN',
    name: 'Naira Nigérian (₦)',
    symbol: '₦',
    flag: '🇳🇬',
    country: 'Nigeria (Lagos)',
    rateFromUSD: 1450,
    decimals: 0,
    formatPattern: 'symbol_before',
  },
  {
    code: 'KES',
    name: 'Shilling Kényan (KSh)',
    symbol: 'KSh',
    flag: '🇰🇪',
    country: 'Kenya (Nairobi)',
    rateFromUSD: 130,
    decimals: 0,
    formatPattern: 'symbol_before',
  },
  {
    code: 'ZAR',
    name: 'Rand Sud-Africain (R)',
    symbol: 'R',
    flag: '🇿🇦',
    country: 'Afrique du Sud',
    rateFromUSD: 18.5,
    decimals: 2,
    formatPattern: 'symbol_before',
  },
  {
    code: 'GHS',
    name: 'Cedi Ghanéen (GH₵)',
    symbol: 'GH₵',
    flag: '🇬🇭',
    country: 'Ghana (Accra)',
    rateFromUSD: 15.5,
    decimals: 2,
    formatPattern: 'symbol_before',
  },
];

export const DEFAULT_CURRENCY_CODE: CurrencyCode = 'CDF';

export const STORAGE_KEY_RATES = 'academia_itech_exchange_rates';
export const STORAGE_KEY_DEFAULT_CURRENCY = 'academia_itech_default_currency';

/**
 * Automatically detect client local currency based on browser timezone, locale, and region
 */
export function detectClientCurrency(): CurrencyCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const tzLower = tz.toLowerCase();

    // Timezone based detection
    if (tzLower.includes('kinshasa') || tzLower.includes('lubumbashi') || tzLower.includes('congo')) {
      return 'CDF';
    }
    if (
      tzLower.includes('dakar') ||
      tzLower.includes('abidjan') ||
      tzLower.includes('douala') ||
      tzLower.includes('bamako') ||
      tzLower.includes('ouagadougou') ||
      tzLower.includes('lome') ||
      tzLower.includes('cotonou') ||
      tzLower.includes('niamey') ||
      tzLower.includes('ndjamena') ||
      tzLower.includes('libreville') ||
      tzLower.includes('brazzaville')
    ) {
      return 'XOF';
    }
    if (tzLower.includes('lagos') || tzLower.includes('kano')) {
      return 'NGN';
    }
    if (tzLower.includes('nairobi') || tzLower.includes('kampala') || tzLower.includes('dar_es_salaam')) {
      return 'KES';
    }
    if (tzLower.includes('johannesburg') || tzLower.includes('cape_town')) {
      return 'ZAR';
    }
    if (tzLower.includes('accra')) {
      return 'GHS';
    }
    if (tzLower.includes('paris') || tzLower.includes('brussels') || tzLower.includes('berlin') || tzLower.includes('madrid') || tzLower.includes('rome') || tzLower.includes('amsterdam') || tzLower.includes('europe')) {
      return 'EUR';
    }
    if (tzLower.includes('new_york') || tzLower.includes('los_angeles') || tzLower.includes('chicago') || tzLower.includes('america')) {
      return 'USD';
    }

    // Locale based detection fallback
    const languages = navigator.languages || [navigator.language || ''];
    for (const lang of languages) {
      const l = lang.toUpperCase();
      if (l.includes('-CD')) return 'CDF';
      if (l.includes('-SN') || l.includes('-CI') || l.includes('-CM') || l.includes('-BF') || l.includes('-ML') || l.includes('-TG') || l.includes('-BJ') || l.includes('-NE') || l.includes('-GA')) {
        return 'XOF';
      }
      if (l.includes('-NG')) return 'NGN';
      if (l.includes('-KE')) return 'KES';
      if (l.includes('-ZA')) return 'ZAR';
      if (l.includes('-GH')) return 'GHS';
      if (l.includes('-FR') || l.includes('-BE') || l.includes('-DE') || l.includes('-ES') || l.includes('-IT')) {
        return 'EUR';
      }
      if (l.includes('-US') || l.includes('-CA')) {
        return 'USD';
      }
    }
  } catch {
    // Ignore detection error
  }
  return DEFAULT_CURRENCY_CODE;
}

/**
 * Retrieve custom admin exchange rates from localStorage
 */
export function getStoredExchangeRates(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RATES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Fallback
  }
  const defaultRates: Record<string, number> = {};
  BASE_SUPPORTED_CURRENCIES.forEach((c) => {
    defaultRates[c.code] = c.rateFromUSD;
  });
  return defaultRates;
}

/**
 * Save custom admin exchange rates to localStorage
 */
export function saveExchangeRates(rates: Record<string, number>): void {
  try {
    localStorage.setItem(STORAGE_KEY_RATES, JSON.stringify(rates));
  } catch {
    // Ignore
  }
}

/**
 * Get active list of currencies with dynamic rates applied
 */
export function getSupportedCurrencies(customRates?: Record<string, number>): CurrencyInfo[] {
  const rates = customRates || getStoredExchangeRates();
  const detectedCode = detectClientCurrency();

  return BASE_SUPPORTED_CURRENCIES.map((curr) => {
    const rate = rates[curr.code] !== undefined ? rates[curr.code] : curr.rateFromUSD;
    return {
      ...curr,
      rateFromUSD: rate,
      isClientDetected: curr.code === detectedCode,
    };
  });
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = getSupportedCurrencies();

/**
 * Gets currency info by code with dynamic rate
 */
export function getCurrencyInfo(code: CurrencyCode | string, customRates?: Record<string, number>): CurrencyInfo {
  const currencies = getSupportedCurrencies(customRates);
  const match = currencies.find((c) => c.code === code);
  return match || currencies[0]; // Defaults to CDF
}

/**
 * Formats a price (defined in USD baseline) into the chosen currency.
 * If price is 0 or undefined, returns "Gratuit" or custom label.
 */
export function formatPrice(
  priceInUSD: number | undefined | null,
  currencyCode: CurrencyCode = 'CDF',
  freeLabel: string = 'Gratuit',
  customRates?: Record<string, number>
): string {
  if (priceInUSD === undefined || priceInUSD === null || priceInUSD === 0) {
    return freeLabel;
  }

  const curr = getCurrencyInfo(currencyCode, customRates);
  const convertedAmount = priceInUSD * curr.rateFromUSD;

  let formattedNumber = '';
  if (curr.decimals === 0) {
    // Round to whole units for currencies like CDF, FCFA, NGN, KES
    const rounded = Math.round(convertedAmount);
    formattedNumber = rounded.toLocaleString('fr-FR');
  } else {
    formattedNumber = convertedAmount.toLocaleString('fr-FR', {
      minimumFractionDigits: curr.decimals,
      maximumFractionDigits: curr.decimals,
    });
  }

  if (curr.formatPattern === 'symbol_before') {
    return `${curr.symbol} ${formattedNumber}`;
  }
  return `${formattedNumber} ${curr.symbol}`;
}

/**
 * Converts a raw USD amount to specific currency amount value
 */
export function convertAmount(
  priceInUSD: number,
  currencyCode: CurrencyCode = 'CDF',
  customRates?: Record<string, number>
): number {
  const curr = getCurrencyInfo(currencyCode, customRates);
  return priceInUSD * curr.rateFromUSD;
}

/**
 * Formats a raw amount in a specific currency without conversion
 */
export function formatCurrencyAmount(
  amount: number,
  currencyCode: CurrencyCode = 'CDF',
  customRates?: Record<string, number>
): string {
  const curr = getCurrencyInfo(currencyCode, customRates);
  let formattedNumber = '';
  if (curr.decimals === 0) {
    formattedNumber = Math.round(amount).toLocaleString('fr-FR');
  } else {
    formattedNumber = amount.toLocaleString('fr-FR', {
      minimumFractionDigits: curr.decimals,
      maximumFractionDigits: curr.decimals,
    });
  }

  if (curr.formatPattern === 'symbol_before') {
    return `${curr.symbol} ${formattedNumber}`;
  }
  return `${formattedNumber} ${curr.symbol}`;
}
