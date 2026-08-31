import React, { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { CurrencyCode, BASE_SUPPORTED_CURRENCIES } from '../../lib/currency';
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
  AlertCircle
} from 'lucide-react';

export const AdminCurrencySettings: React.FC = () => {
  const {
    currencyCode,
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

  // Local editing state for rates
  const [editingRates, setEditingRates] = useState<Record<string, number>>(() => ({
    ...exchangeRates,
  }));
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Conversion simulator state
  const [simulationUSD, setSimulationUSD] = useState<number>(50);

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

  const handleResetDefaults = () => {
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

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-sky-500/10 via-sky-50 to-white border border-sky-200 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Paramétrage Multi-Devises & Taux de Conversion</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500 text-white uppercase tracking-wider">
                Admin
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Gérez les devises supportées, ajustez les taux de change et configurez la détection automatique pour vos apprenants.
            </p>
          </div>
        </div>

        {/* Global Save Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all flex items-center gap-1.5 shadow-2xs"
            title="Réinitialiser tous les taux"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Taux par Défaut</span>
          </button>

          <button
            onClick={handleSaveAllRates}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-xs shadow-sky-500/25 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer Tous les Taux</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {saveFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* Quick Status Cards: Client Detected vs Platform Default */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Client Local Currency Auto-Detection */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              <span>Devise Détectée du Client (Localisation)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Auto-Détecté
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{clientDetectedCurrency.flag}</span>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {clientDetectedCurrency.name}
                </div>
                <div className="text-xs text-slate-600">
                  {clientDetectedCurrency.country} • Symbole : <strong className="text-sky-600">{clientDetectedCurrency.symbol}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={resetToClientCurrency}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currencyCode === clientDetectedCode
                  ? 'bg-sky-500 text-white shadow-2xs'
                  : 'bg-white text-sky-700 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              {currencyCode === clientDetectedCode ? '✓ Active' : 'Appliquer'}
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            Le système détecte automatiquement la monnaie géographique de l'apprenant (ex: Franc Congolais en RD Congo, FCFA en Afrique de l'Ouest/Centrale, Euro en Europe).
          </p>
        </div>

        {/* Card 2: Platform Default Baseline */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-sky-500" />
              <span>Devise Principale du Campus / Plateforme</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
              Référence
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Sélectionner la devise par défaut :</label>
            <select
              value={defaultPlatformCurrency}
              onChange={(e) => setDefaultPlatformCurrency(e.target.value as CurrencyCode)}
              className="w-full p-2.5 rounded-xl bg-slate-50 text-slate-900 text-xs font-bold border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white"
            >
              {availableCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} - ({c.country})
                </option>
              ))}
            </select>
          </div>

          <p className="text-[11px] text-slate-500">
            Devise de référence utilisée pour les nouveaux comptes n'ayant pas encore de géolocalisation ou d'historique de paiement.
          </p>
        </div>
      </div>

      {/* Interactive Rates Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-500" />
              <span>Tableau des Taux de Change & Facteurs de Conversion</span>
            </h4>
            <p className="text-xs text-slate-500">
              Définissez la valeur de 1.00 USD ($) dans chaque monnaie africaine et internationale.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200/60">
            Base Référence : 1 USD ($)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Monnaie & Région</th>
                <th className="py-3 px-3">Symbole</th>
                <th className="py-3 px-3">Taux (1 USD = X)</th>
                <th className="py-3 px-3">Exemple de Conversion ($50)</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {availableCurrencies.map((curr) => {
                const currentVal = editingRates[curr.code] !== undefined ? editingRates[curr.code] : curr.rateFromUSD;
                const isSelected = curr.code === currencyCode;
                const converted50 = 50 * currentVal;

                return (
                  <tr
                    key={curr.code}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-sky-50/40 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{curr.flag}</span>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{curr.name}</span>
                            {curr.code === clientDetectedCode && (
                              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-emerald-100 text-emerald-700">
                                📍 Votre zone
                              </span>
                            )}
                            {curr.code === defaultPlatformCurrency && (
                              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-sky-100 text-sky-700">
                                ⭐ Défaut
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{curr.country}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-sky-600">
                      {curr.symbol}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2 max-w-[180px]">
                        <input
                          type="number"
                          step={curr.decimals > 0 ? '0.01' : '1'}
                          value={currentVal}
                          onChange={(e) => handleRateInputChange(curr.code, e.target.value)}
                          className="w-28 p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold text-xs focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        />
                        <span className="text-[11px] font-mono text-slate-500">{curr.code}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-mono text-slate-800 font-semibold">
                        {curr.decimals === 0
                          ? Math.round(converted50).toLocaleString('fr-FR')
                          : converted50.toLocaleString('fr-FR', { minimumFractionDigits: curr.decimals, maximumFractionDigits: curr.decimals })}
                        {' '}{curr.symbol}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSaveSingleRate(curr.code)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-700 border border-slate-200 transition-colors"
                          title="Sauvegarder ce taux"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setCurrencyCode(curr.code)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                            isSelected
                              ? 'bg-sky-500 text-white shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isSelected ? 'Active' : 'Choisir'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Conversion Simulator */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-sky-500" />
            <span>Simulateur Interactif de Prix & Tarifs des Formations</span>
          </h4>
          <span className="text-xs text-slate-500">Test en direct</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="w-full sm:w-auto flex-1">
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Prix de base du cours ou abonnement (en USD $) :
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="0"
                value={simulationUSD}
                onChange={(e) => setSimulationUSD(parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                placeholder="Montant en USD..."
              />
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {[20, 50, 100, 250, 500].map((preset) => (
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

        {/* Live Grid of Converted Amounts */}
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
  );
};
