import React, { useState } from 'react';
import { Badge, RewardItem, LeaderboardUser, UserProfile, Center } from '../../types';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Zap,
  Flame,
  Crown,
  Bot,
  Code2,
  ShieldCheck,
  Star,
  CheckCircle2,
  Lock,
  Gift,
  Video,
  Ticket,
  Package,
  Sparkles,
  ShoppingBag,
  Filter
} from 'lucide-react';

interface GamificationViewProps {
  currentUser: UserProfile;
  badges: Badge[];
  rewards: RewardItem[];
  leaderboard: LeaderboardUser[];
  activeCenter: Center;
  onRedeemReward: (reward: RewardItem) => void;
}

export const GamificationView: React.FC<GamificationViewProps> = ({
  currentUser,
  badges,
  rewards,
  leaderboard,
  activeCenter,
  onRedeemReward,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges' | 'rewards'>('leaderboard');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'global' | 'center'>('global');

  // Next level math
  const nextLevelXp = (currentUser.level + 1) * 500;
  const currentLevelBaseXp = currentUser.level * 500;
  const xpInCurrentLevel = currentUser.xp - currentLevelBaseXp;
  const progressToNextLevel = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / 500) * 100)));

  const handleRedeem = (reward: RewardItem) => {
    if (currentUser.xp < reward.costXp) {
      alert(`⚠️ Vous avez besoin de ${reward.costXp} XP (Solde actuel : ${currentUser.xp} XP). Complétez des cours et des quiz pour en gagner !`);
      return;
    }
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#06b6d4'],
      });
    } catch (e) {}

    onRedeemReward(reward);
    alert(`🎉 Félicitations ! Vous avez échangé ${reward.costXp} XP contre "${reward.title}". Votre coupon a été validé !`);
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return Bot;
      case 'Flame':
        return Flame;
      case 'Award':
        return Award;
      case 'Code2':
        return Code2;
      case 'ShieldCheck':
        return ShieldCheck;
      default:
        return Zap;
    }
  };

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return Video;
      case 'Ticket':
        return Ticket;
      case 'Package':
        return Package;
      case 'Crown':
        return Crown;
      default:
        return Gift;
    }
  };

  const filteredLeaderboard = leaderboardFilter === 'global'
    ? leaderboard
    : leaderboard.filter((u) => u.centerName.includes(activeCenter.name) || u.id === currentUser.id);

  return (
    <div id="gamification-view" className="space-y-8 pb-16">
      {/* Gamification Header & User XP Stats Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Niveau {currentUser.level} • {currentUser.level >= 5 ? 'Architecte ITECH' : 'Initié Développeur'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                {currentUser.streakDays} jours de série
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Système de Gamification, Badges & Récompenses
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Chaque module validé, quiz réussi et contribution communautaire vous rapporte des points XP échangeables dans la Boutique de Récompenses.
            </p>

            {/* Level Progression Bar */}
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                <span>Progression vers Niveau {currentUser.level + 1}</span>
                <span className="text-indigo-600 font-bold">{currentUser.xp} / {nextLevelXp} XP</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 border border-slate-200 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${progressToNextLevel}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Balance Tile */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <span className="text-xs uppercase font-bold text-slate-400">Solde XP Disponible</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-600 flex items-center gap-2">
              <Zap className="w-7 h-7 fill-amber-500 text-amber-500" />
              <span>{currentUser.xp}</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              {currentUser.unlockedBadgeIds.length} Badges Débloqués • {currentUser.earnedCertificates.length} Certificats
            </span>
          </div>
        </div>
      </div>

      {/* Gamification Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          id="gamification-tab-leaderboard"
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Classement & Podiums</span>
        </button>

        <button
          id="gamification-tab-badges"
          onClick={() => setActiveTab('badges')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'badges'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Galerie des Badges ({badges.length})</span>
        </button>

        <button
          id="gamification-tab-rewards"
          onClick={() => setActiveTab('rewards')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rewards'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Boutique de Récompenses</span>
        </button>
      </div>

      {/* TAB 1: Leaderboard & Podiums */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLeaderboardFilter('global')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  leaderboardFilter === 'global'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-500 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                Classement Mondial
              </button>
              <button
                onClick={() => setLeaderboardFilter('center')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  leaderboardFilter === 'center'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-500 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                Mon Centre ({activeCenter.name})
              </button>
            </div>
            <span className="text-xs text-slate-500">Actualisé en direct</span>
          </div>

          {/* Top 3 Podium Visual */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 pb-4 items-end">
            {/* 2nd Place */}
            {filteredLeaderboard[1] && (
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <img
                    src={filteredLeaderboard[1].avatar}
                    alt={filteredLeaderboard[1].name}
                    className="w-14 sm:w-16 h-14 sm:h-16 rounded-full object-cover ring-4 ring-slate-300 shadow-xs"
                  />
                  <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold text-xs absolute -bottom-1 -right-1 flex items-center justify-center shadow-xs">
                    2
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate max-w-[100px]">
                  {filteredLeaderboard[1].name}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">{filteredLeaderboard[1].xp} XP</div>
                <div className="w-full h-24 rounded-t-2xl bg-slate-100 border-t border-slate-300 flex items-center justify-center text-slate-600 font-bold text-sm">
                  🥈 Argent
                </div>
              </div>
            )}

            {/* 1st Place (Center & Highest) */}
            {filteredLeaderboard[0] && (
              <div className="flex flex-col items-center text-center space-y-2 -translate-y-2">
                <Crown className="w-6 h-6 text-amber-500 fill-amber-500 animate-bounce" />
                <div className="relative">
                  <img
                    src={filteredLeaderboard[0].avatar}
                    alt={filteredLeaderboard[0].name}
                    className="w-18 sm:w-20 h-18 sm:h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-md"
                  />
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold text-xs absolute -bottom-1 -right-1 flex items-center justify-center shadow-xs">
                    1
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[120px]">
                  {filteredLeaderboard[0].name}
                </div>
                <div className="text-xs text-amber-700 font-mono font-bold">{filteredLeaderboard[0].xp} XP</div>
                <div className="w-full h-32 rounded-t-2xl bg-amber-100/70 border-t-2 border-amber-400 flex items-center justify-center text-amber-900 font-bold text-base shadow-xs">
                  🥇 Champion
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {filteredLeaderboard[2] && (
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <img
                    src={filteredLeaderboard[2].avatar}
                    alt={filteredLeaderboard[2].name}
                    className="w-14 sm:w-16 h-14 sm:h-16 rounded-full object-cover ring-4 ring-amber-200 shadow-xs"
                  />
                  <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs absolute -bottom-1 -right-1 flex items-center justify-center shadow-xs">
                    3
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate max-w-[100px]">
                  {filteredLeaderboard[2].name}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">{filteredLeaderboard[2].xp} XP</div>
                <div className="w-full h-20 rounded-t-2xl bg-slate-100 border-t border-amber-300 flex items-center justify-center text-amber-800 font-bold text-sm">
                  🥉 Bronze
                </div>
              </div>
            )}
          </div>

          {/* Full Ranks Table */}
          <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
              <span>Rang & Apprenant</span>
              <div className="flex items-center gap-8">
                <span className="hidden sm:inline">Centre</span>
                <span>Série</span>
                <span>Points XP</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredLeaderboard.map((user, idx) => {
                const isMe = user.id === currentUser.id;
                return (
                  <div
                    key={user.id}
                    className={`p-4 flex items-center justify-between text-xs transition-colors ${
                      isMe ? 'bg-indigo-50/60 border-l-4 border-indigo-600 font-bold text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-6 font-mono font-bold text-slate-400 text-sm">
                        #{idx + 1}
                      </span>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <span className="font-bold block text-slate-900 flex items-center gap-1.5">
                          {user.name}
                          {isMe && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                              MOI
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">Niveau {user.level} • {user.badgesCount} badges</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <span className="text-[11px] text-slate-500 hidden sm:inline truncate max-w-[150px]">
                        {user.centerName}
                      </span>
                      <span className="flex items-center gap-1 text-orange-600 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                        {user.streakDays}j
                      </span>
                      <span className="font-mono font-bold text-amber-700 text-sm min-w-[70px] text-right">
                        {user.xp} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Badges Showcase */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const isUnlocked = currentUser.unlockedBadgeIds.includes(badge.id);
            const Icon = getBadgeIcon(badge.icon);

            return (
              <div
                key={badge.id}
                id={`badge-card-${badge.id}`}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                  isUnlocked
                    ? 'bg-white border-indigo-200 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center p-0.5 ${
                      isUnlocked
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-600'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                    badge.rarity === 'legendary'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : badge.rarity === 'epic'
                      ? 'bg-purple-50 text-purple-800 border border-purple-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {badge.rarity}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{badge.title}</span>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{badge.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={isUnlocked ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                    {isUnlocked ? '✓ Débloqué' : 'Verrouillé'}
                  </span>
                  <span className="text-amber-700 font-mono font-bold">+150 XP</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: Rewards Boutique */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Boutique Officielle Academia ITECH</h3>
              <p className="text-xs text-slate-500 mt-0.5">Échangez vos points XP gagnés contre des sessions d'experts et des privilèges exclusifs.</p>
            </div>
            <div className="text-xs text-amber-800 font-mono font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              Votre solde : {currentUser.xp} XP
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((reward) => {
              const Icon = getRewardIcon(reward.icon);
              const canAfford = currentUser.xp >= reward.costXp;

              return (
                <div
                  key={reward.id}
                  id={`reward-item-${reward.id}`}
                  className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{reward.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{reward.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Coût :</span>
                      <span className="font-mono font-bold text-amber-700 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {reward.costXp} XP
                      </span>
                    </div>

                    <button
                      id={`redeem-btn-${reward.id}`}
                      onClick={() => handleRedeem(reward)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        canAfford
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Échanger mes XP' : 'XP Insuffisants'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
