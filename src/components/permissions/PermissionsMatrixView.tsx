import React, { useState } from 'react';
import { UserRole, PermissionKey } from '../../types';
import {
  ALL_PERMISSIONS,
  ROLE_PERMISSIONS_MAP,
  ROLE_DETAILS,
  hasPermission
} from '../../lib/permissions';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  Sparkles,
  GraduationCap,
  Building2,
  UserCheck,
  Globe2,
  Filter,
  Info
} from 'lucide-react';

interface PermissionsMatrixViewProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenAuthModal?: () => void;
}

export const PermissionsMatrixView: React.FC<PermissionsMatrixViewProps> = ({
  currentRole,
  onSelectRole,
  onOpenAuthModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterQuery, setFilterQuery] = useState<string>('');

  const categories = [
    'all',
    'Général & Découverte',
    'Apprentissage & Évaluation',
    'Création & Studio IA',
    'Administration Centre',
    'Super Gouvernance',
  ];

  const rolesOrder: UserRole[] = ['visitor', 'learner', 'trainer', 'center_admin', 'super_admin'];

  const filteredPermissions = ALL_PERMISSIONS.filter((perm) => {
    const matchesCategory = selectedCategory === 'all' || perm.category === selectedCategory;
    const matchesSearch =
      perm.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
      perm.description.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="permissions-matrix-root" className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Sécurité & Contrôle d'Accès (RBAC)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Matrice des Rôles & Système de Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Organisation hiérarchique et granulaire des droits d'accès pour chaque rôle au sein de l'écosystème Academia ITECH.
          </p>
        </div>

        {/* Current Active Role Banner */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            {currentRole === 'visitor' && <Globe2 className="w-5 h-5" />}
            {currentRole === 'learner' && <GraduationCap className="w-5 h-5" />}
            {currentRole === 'trainer' && <Sparkles className="w-5 h-5" />}
            {currentRole === 'center_admin' && <Building2 className="w-5 h-5" />}
            {currentRole === 'super_admin' && <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Votre Rôle Actif :</span>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{ROLE_DETAILS[currentRole].title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${ROLE_DETAILS[currentRole].badgeStyle}`}>
                {ROLE_DETAILS[currentRole].badgeLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rôles Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {rolesOrder.map((r) => {
          const info = ROLE_DETAILS[r];
          const isCurrent = currentRole === r;
          const permCount = ROLE_PERMISSIONS_MAP[r].length;

          return (
            <button
              key={r}
              onClick={() => onSelectRole(r)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between space-y-3 ${
                isCurrent
                  ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${info.badgeStyle}`}>
                    {info.badgeLabel}
                  </span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-indigo-200 animate-ping" />
                  )}
                </div>
                <h3 className="text-xs font-bold text-slate-900">{info.title}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                  {info.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-medium">{permCount} / {ALL_PERMISSIONS.length} privilèges</span>
                <span className={`font-bold ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {isCurrent ? 'Rôle Actuel' : 'Simuler'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Toutes les permissions' : cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Rechercher une permission..."
          className="w-full sm:w-64 px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-3.5 px-4 font-bold w-2/5">Permission & Fonctionnalité</th>
                <th className="py-3.5 px-3 text-center font-bold">Visiteur</th>
                <th className="py-3.5 px-3 text-center font-bold">Apprenant</th>
                <th className="py-3.5 px-3 text-center font-bold">Formateur</th>
                <th className="py-3.5 px-3 text-center font-bold">Directeur</th>
                <th className="py-3.5 px-3 text-center font-bold text-amber-900">Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPermissions.map((perm) => (
                <tr key={perm.key} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{perm.label}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                          {perm.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{perm.description}</p>
                    </div>
                  </td>

                  {rolesOrder.map((role) => {
                    const granted = hasPermission(role, perm.key);
                    const isCurrentCol = currentRole === role;

                    return (
                      <td
                        key={role}
                        className={`py-3 px-3 text-center ${
                          isCurrentCol ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        {granted ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                            <XCircle className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information Box */}
      <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs text-indigo-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold">Politique de Sécurité & RBAC Dynamique</h4>
          <p className="text-slate-600 leading-relaxed">
            Le système applique strictement les permissions au niveau des composants et des contrôles de navigation.
            Vous pouvez basculer de rôle à tout moment à l'aide du sélecteur en haut à droite pour tester en temps réel chaque interface et valider les accès.
          </p>
        </div>
      </div>
    </div>
  );
};
