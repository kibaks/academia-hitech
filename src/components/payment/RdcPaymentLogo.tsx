import React from 'react';
import { PaymentGatewayId } from '../../types';

interface RdcPaymentLogoProps {
  gatewayId: PaymentGatewayId | 'visa' | 'mastercard' | 'airtel' | 'vodacom';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const RdcPaymentLogo: React.FC<RdcPaymentLogoProps> = ({
  gatewayId,
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-10 w-auto',
    xl: 'h-12 w-auto',
  };

  const renderSvg = () => {
    switch (gatewayId) {
      // 1. VODACOM M-PESA RDC
      case 'mpesa':
      case 'vodacom':
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-xs border border-red-500/30 ${className}`}>
            <svg viewBox="0 0 120 40" className={sizeClasses[size]} fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Phone / Sim icon with arrow */}
              <rect x="2" y="5" width="22" height="30" rx="4" fill="white" />
              <rect x="5" y="9" width="16" height="18" rx="2" fill="#E60000" />
              <circle cx="13" cy="31" r="1.5" fill="#E60000" />
              <path d="M10 18L13 15L16 18M13 16V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Text "m-pesa" */}
              <text x="32" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="16" fill="white" letterSpacing="-0.5">
                m-pesa
              </text>
              <text x="32" y="34" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="8" fill="#FEE2E2" letterSpacing="0.8">
                VODACOM RDC
              </text>
            </svg>
            {showLabel && <span className="text-xs font-black text-white">M-Pesa RDC</span>}
          </div>
        );

      // 2. AIRTEL MONEY RDC
      case 'airtel_money':
      case 'airtel':
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-red-700 to-red-600 text-white shadow-xs border border-red-500/30 ${className}`}>
            <svg viewBox="0 0 130 40" className={sizeClasses[size]} fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Airtel Swirl Logo */}
              <circle cx="16" cy="20" r="13" fill="white" />
              <path
                d="M16 10C11.5 10 9 13.5 9 17.5C9 22.5 13.5 25 17 25C20.5 25 23 23 23 19.5C23 15.5 19.5 15.5 17 15.5"
                stroke="#E21818"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <circle cx="16" cy="18" r="2.2" fill="#E21818" />
              {/* Typography */}
              <text x="36" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="14" fill="white" letterSpacing="-0.3">
                airtel
              </text>
              <text x="76" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="12" fill="#FEF08A">
                money
              </text>
              <text x="36" y="33" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="8" fill="#FEE2E2" letterSpacing="0.5">
                RDC • CDF / USD
              </text>
            </svg>
            {showLabel && <span className="text-xs font-black text-white">Airtel Money RDC</span>}
          </div>
        );

      // 3. AFRIMONEY (AFRICELL RDC)
      case 'afrimoney':
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-800 via-purple-700 to-fuchsia-700 text-white shadow-xs border border-purple-500/30 ${className}`}>
            <svg viewBox="0 0 130 40" className={sizeClasses[size]} fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Africell Purple icon */}
              <rect x="3" y="6" width="24" height="28" rx="6" fill="#F43F5E" />
              <path d="M9 20L15 14L21 20M15 15V26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Afrimoney text */}
              <text x="34" y="22" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="15" fill="white" letterSpacing="-0.5">
                afrimoney
              </text>
              <text x="34" y="33" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="8" fill="#F5D0FE" letterSpacing="0.6">
                AFRICELL RDC
              </text>
            </svg>
            {showLabel && <span className="text-xs font-black text-white">Afrimoney RDC</span>}
          </div>
        );

      // 4. ORANGE MONEY RDC
      case 'orange_money':
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs border border-orange-500/30 ${className}`}>
            <svg viewBox="0 0 130 40" className={sizeClasses[size]} fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Orange Square */}
              <rect x="3" y="6" width="26" height="26" rx="4" fill="#000000" />
              <rect x="6" y="9" width="20" height="20" rx="2" fill="#FF7900" />
              <text x="16" y="24" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="15" fill="white" textAnchor="middle">
                O
              </text>
              {/* Text */}
              <text x="36" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="13" fill="white" letterSpacing="-0.2">
                orange
              </text>
              <text x="82" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="13" fill="#FFF7ED">
                money
              </text>
              <text x="36" y="32" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="8" fill="#FFEDD5" letterSpacing="0.5">
                KINSHASA / RDC
              </text>
            </svg>
            {showLabel && <span className="text-xs font-black text-white">Orange Money RDC</span>}
          </div>
        );

      // 5. VISA
      case 'visa':
        return (
          <div className={`inline-flex items-center px-2 py-0.5 rounded-lg bg-white border border-slate-200 shadow-2xs ${className}`}>
            <svg viewBox="0 0 70 28" className={sizeClasses[size]} fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="2" y="22" fontFamily="'Arial Black', sans-serif" fontStyle="italic" fontWeight="900" fontSize="24" fill="#1A1F71" letterSpacing="-1">
                VISA
              </text>
            </svg>
            {showLabel && <span className="text-xs font-extrabold text-slate-800 ml-1">Visa</span>}
          </div>
        );

      // 6. MASTERCARD
      case 'mastercard':
        return (
          <div className={`inline-flex items-center px-2 py-0.5 rounded-lg bg-white border border-slate-200 shadow-2xs ${className}`}>
            <svg viewBox="0 0 70 28" className={sizeClasses[size]} fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="26" cy="14" r="11" fill="#EB001B" />
              <circle cx="44" cy="14" r="11" fill="#F79E1B" fillOpacity="0.9" />
              <path
                d="M35 5.5A11 11 0 0 1 35 22.5A11 11 0 0 1 35 5.5Z"
                fill="#FF5F00"
              />
            </svg>
            {showLabel && <span className="text-xs font-extrabold text-slate-800 ml-1">Mastercard</span>}
          </div>
        );

      // 7. STRIPE / CARTE BANCAIRE (VISA & MASTERCARD ENSEMBLE)
      case 'stripe':
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xs border border-indigo-500/30 ${className}`}>
            <div className="flex items-center bg-white px-1.5 py-0.5 rounded-md">
              <svg viewBox="0 0 50 20" className="h-4 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="16" fontFamily="'Arial Black', sans-serif" fontStyle="italic" fontWeight="900" fontSize="17" fill="#1A1F71" letterSpacing="-0.5">
                  VISA
                </text>
              </svg>
            </div>
            <div className="flex items-center bg-white px-1.5 py-0.5 rounded-md">
              <svg viewBox="0 0 34 20" className="h-4 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="10" r="7.5" fill="#EB001B" />
                <circle cx="23" cy="10" r="7.5" fill="#F79E1B" fillOpacity="0.9" />
                <path d="M17 4.2A7.5 7.5 0 0 1 17 15.8A7.5 7.5 0 0 1 17 4.2Z" fill="#FF5F00" />
              </svg>
            </div>
            {showLabel && <span className="text-xs font-black text-white">Visa / Mastercard RDC</span>}
          </div>
        );

      // 8. MAXICASH RDC
      case 'maxicash':
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-xs border border-emerald-500/30 ${className}`}>
            <svg viewBox="0 0 120 40" className={sizeClasses[size]} fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="20" r="12" fill="#10B981" />
              <text x="18" y="25" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="14" fill="white" textAnchor="middle">
                M
              </text>
              <text x="36" y="22" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="14" fill="white">
                MAXI
              </text>
              <text x="75" y="22" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="14" fill="#34D399">
                CASH
              </text>
              <text x="36" y="32" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="7.5" fill="#D1FAE5" letterSpacing="0.5">
                PASSERELLE RDC
              </text>
            </svg>
            {showLabel && <span className="text-xs font-black text-white">MaxiCash RDC</span>}
          </div>
        );

      // 9. CINETPAY
      case 'cinetpay':
        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-700 to-sky-700 text-white shadow-xs border border-blue-500/30 ${className}`}>
            <svg viewBox="0 0 110 40" className={sizeClasses[size]} fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="8" width="22" height="24" rx="5" fill="#38BDF8" />
              <path d="M15 14V26M10 20H20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <text x="32" y="23" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="14" fill="white">
                CinetPay
              </text>
              <text x="32" y="32" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="7" fill="#E0F2FE">
                GUICHET RDC & AFRIQUE
              </text>
            </svg>
            {showLabel && <span className="text-xs font-black text-white">CinetPay</span>}
          </div>
        );

      default:
        return (
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-white text-xs font-bold ${className}`}>
            <span>{gatewayId.toUpperCase()}</span>
          </div>
        );
    }
  };

  return renderSvg();
};

/**
 * DRC Payment Showcase Banner
 * Renders all the primary DRC payment badges side-by-side
 */
export const RdcPaymentBadgesRow: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}> = ({ className = '', size = 'sm', showSubtitle = true }) => {
  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-500/30 text-white shadow-lg ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🇨🇩</span>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
              <span>Modalités de Paiement RDC (Kinshasa & Provinces)</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                Franc Congolais (CDF) & USD
              </span>
            </h4>
            {showSubtitle && (
              <p className="text-[11px] text-slate-300">
                Paiements mobiles instantanés sans frais cachés, agrégés et sécurisés aux normes BCC.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <RdcPaymentLogo gatewayId="mpesa" size={size} />
        <RdcPaymentLogo gatewayId="airtel_money" size={size} />
        <RdcPaymentLogo gatewayId="afrimoney" size={size} />
        <RdcPaymentLogo gatewayId="orange_money" size={size} />
        <RdcPaymentLogo gatewayId="stripe" size={size} />
      </div>
    </div>
  );
};
