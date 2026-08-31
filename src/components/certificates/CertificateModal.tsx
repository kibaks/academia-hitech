import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { EarnedCertificate } from '../../types';
import { Award, Download, Printer, ShieldCheck, QrCode, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';

interface CertificateModalProps {
  certificate: EarnedCertificate;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="certificate-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200 print:p-0 print:bg-white"
    >
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-auto print:border-none print:shadow-none print:bg-white print:p-0">
        {/* Action Header for Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Certificat Officiel de Réussite</h3>
              <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Vérifié & Authentifié sur la Blockchain ITECH
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white flex items-center gap-1.5 shadow-xs active:scale-95 shadow-sky-500/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / Télécharger PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-800 transition-all text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* The Printable Certificate Design */}
        <div
          id="printable-certificate-canvas"
          className="relative bg-white border-4 border-amber-600/70 rounded-2xl p-8 sm:p-12 text-center space-y-6 overflow-hidden shadow-md print:border-8 print:border-amber-700 print:text-black print:bg-white print:p-8"
        >
          {/* Subtle Guilloche & Luxury Watermark */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
            <Award className="w-[450px] h-[450px] text-amber-700" />
          </div>

          {/* Certificate Header Branding */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-black text-lg shadow-xs">
                AI
              </div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                ACADEMIA <span className="text-sky-600">ITECH</span>
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-700 font-bold">
              INSTITUT INTERNATIONAL DES TECHNOLOGIES ET DU SAVOIR NUMÉRIQUE
            </p>
          </div>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />

          {/* Certificate Main Body */}
          <div className="space-y-4 relative z-10">
            <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide uppercase">
              Le présent certificat d'excellence est décerné à
            </p>

            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 font-serif">
              {certificate.learnerName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              pour avoir complété avec succès et brio l'intégralité des modules, projets pratiques et l'évaluation finale du programme certifiant :
            </p>

            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm sm:text-base md:text-xl font-bold text-slate-900 max-w-2xl mx-auto shadow-xs break-words leading-snug">
              {certificate.courseTitle}
            </div>

            {/* Distinction & Grade */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 uppercase tracking-wider">
                ★ {certificate.distinction}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                Score Global : {certificate.gradePercentage}%
              </span>
            </div>
          </div>

          {/* Footer: Signatures, Seal & QR Code */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center relative z-10">
            {/* Left: Dean / Trainer Signature */}
            <div className="text-center sm:text-left space-y-1">
              <div className="font-serif italic text-sm text-slate-900 font-semibold">
                {certificate.trainerName}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Direction Académique & Pédagogique
              </div>
              <div className="text-[10px] text-slate-400">Délivré le : {certificate.issueDate}</div>
            </div>

            {/* Center: Gold ITECH Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-1 flex items-center justify-center shadow-xs">
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-amber-700 font-bold text-[9px] uppercase tracking-tighter">
                  <Award className="w-6 h-6 text-amber-600 mb-0.5" />
                  <span>ITECH SEAL</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-600 mt-1">
                {certificate.certificateNumber}
              </span>
            </div>

            {/* Right: QR Code & Verification info */}
            <div className="text-center sm:text-right space-y-1">
              <div className="inline-block p-1 bg-white border border-slate-200 rounded-lg shadow-xs">
                <QRCodeSVG
                  value={`https://academia-itech.edu/verify/${certificate.certificateNumber}`}
                  size={42}
                  level="M"
                />
              </div>
              <div className="text-[10px] font-semibold text-emerald-700">
                Certificat Authentifié
              </div>
              <div className="text-[9px] text-slate-500">
                Centre : {certificate.centerName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
