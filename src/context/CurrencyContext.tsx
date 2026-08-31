import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CurrencyCode,
  CurrencyInfo,
  BASE_SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY_CODE,
  getCurrencyInfo,
  getSupportedCurrencies,
  getStoredExchangeRates,
  saveExchangeRates,
  detectClientCurrency,
  formatPrice as formatPriceUtil,
  formatCurrencyAmount as formatAmountUtil,
  convertAmount as convertAmountUtil,
  STORAGE_KEY_DEFAULT_CURRENCY,
} from '../lib/currency';

interface CurrencyContextType {
  currencyCode: CurrencyCode;
  currencyInfo: CurrencyInfo;
  clientDetectedCode: CurrencyCode;
  clientDetectedCurrency: CurrencyInfo;
  setCurrencyCode: (code: CurrencyCode) => void;
  resetToClientCurrency: () => void;
  formatPrice: (priceInUSD: number | undefined | null, freeLabel?: string) => string;
  formatAmount: (amount: number, code?: CurrencyCode) => string;
  convertPrice: (priceInUSD: number, targetCurrency?: CurrencyCode) => number;
  availableCurrencies: CurrencyInfo[];
  exchangeRates: Record<string, number>;
  updateExchangeRate: (code: CurrencyCode, rate: number) => void;
  resetExchangeRates: () => void;
  defaultPlatformCurrency: CurrencyCode;
  setDefaultPlatformCurrency: (code: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY_USER_CURRENCY = 'academia_itech_user_currency';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Detect Client Currency
  const [clientDetectedCode] = useState<CurrencyCode>(() => detectClientCurrency());

  // 2. Custom Exchange Rates State
  const [exchangeRates, setExchangeRatesState] = useState<Record<string, number>>(() =>
    getStoredExchangeRates()
  );

  // 3. Platform Default Currency
  const [defaultPlatformCurrency, setDefaultPlatformCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEFAULT_CURRENCY);
      if (saved && BASE_SUPPORTED_CURRENCIES.some((c) => c.code === saved)) {
        return saved as CurrencyCode;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CURRENCY_CODE;
  });

  // 4. Current Selected Currency (defaults to client detected currency or saved user choice)
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER_CURRENCY);
      if (saved && BASE_SUPPORTED_CURRENCIES.some((c) => c.code === saved)) {
        return saved as CurrencyCode;
      }
    } catch {
      // Fallback
    }
    // If no user preference saved, directly use client detected currency!
    return detectClientCurrency() || DEFAULT_CURRENCY_CODE;
  });

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrencyCodeState(code);
    try {
      localStorage.setItem(STORAGE_KEY_USER_CURRENCY, code);
    } catch {
      // Ignore
    }
  };

  const resetToClientCurrency = () => {
    const detected = detectClientCurrency();
    setCurrencyCode(detected);
  };

  const updateExchangeRate = (code: CurrencyCode, rate: number) => {
    if (rate <= 0 || isNaN(rate)) return;
    const updated = {
      ...exchangeRates,
      [code]: rate,
    };
    setExchangeRatesState(updated);
    saveExchangeRates(updated);
  };

  const resetExchangeRates = () => {
    const defaultRates: Record<string, number> = {};
    BASE_SUPPORTED_CURRENCIES.forEach((c) => {
      defaultRates[c.code] = c.rateFromUSD;
    });
    setExchangeRatesState(defaultRates);
    saveExchangeRates(defaultRates);
  };

  const setDefaultPlatformCurrency = (code: CurrencyCode) => {
    setDefaultPlatformCurrencyState(code);
    try {
      localStorage.setItem(STORAGE_KEY_DEFAULT_CURRENCY, code);
    } catch {
      // Ignore
    }
  };

  const availableCurrencies = getSupportedCurrencies(exchangeRates);
  const currencyInfo = getCurrencyInfo(currencyCode, exchangeRates);
  const clientDetectedCurrency = getCurrencyInfo(clientDetectedCode, exchangeRates);

  const formatPrice = (priceInUSD: number | undefined | null, freeLabel?: string) => {
    return formatPriceUtil(priceInUSD, currencyCode, freeLabel, exchangeRates);
  };

  const formatAmount = (amount: number, code?: CurrencyCode) => {
    return formatAmountUtil(amount, code || currencyCode, exchangeRates);
  };

  const convertPrice = (priceInUSD: number, targetCurrency?: CurrencyCode) => {
    return convertAmountUtil(priceInUSD, targetCurrency || currencyCode, exchangeRates);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencyCode,
        currencyInfo,
        clientDetectedCode,
        clientDetectedCurrency,
        setCurrencyCode,
        resetToClientCurrency,
        formatPrice,
        formatAmount,
        convertPrice,
        availableCurrencies,
        exchangeRates,
        updateExchangeRate,
        resetExchangeRates,
        defaultPlatformCurrency,
        setDefaultPlatformCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    const detected = detectClientCurrency();
    const defaultInfo = getCurrencyInfo(detected);
    const defaultRates = getStoredExchangeRates();
    return {
      currencyCode: detected,
      currencyInfo: defaultInfo,
      clientDetectedCode: detected,
      clientDetectedCurrency: defaultInfo,
      setCurrencyCode: () => {},
      resetToClientCurrency: () => {},
      formatPrice: (p, f) => formatPriceUtil(p, detected, f, defaultRates),
      formatAmount: (a, c) => formatAmountUtil(a, c || detected, defaultRates),
      convertPrice: (p, c) => convertAmountUtil(p, c || detected, defaultRates),
      availableCurrencies: getSupportedCurrencies(defaultRates),
      exchangeRates: defaultRates,
      updateExchangeRate: () => {},
      resetExchangeRates: () => {},
      defaultPlatformCurrency: DEFAULT_CURRENCY_CODE,
      setDefaultPlatformCurrency: () => {},
    };
  }
  return context;
};
