import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Course, EarnedCertificate, ProfilePost, NetworkConnection } from '../../types';
import { INITIAL_PROFILE_POSTS, INITIAL_NETWORK_CONNECTIONS } from '../../data/templatesData';
import { ProfileSettingsTab } from './ProfileSettingsTab';
import {
  Camera,
  Edit3,
  Settings,
  Share2,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  Globe2,
  Mail,
  Phone,
  MessageSquare,
  ThumbsUp,
  Award,
  Sparkles,
  BookOpen,
  Code2,
  Users,
  Flame,
  Zap,
  Lock,
  Plus,
  Send,
  MoreHorizontal,
  Bookmark,
  Building2,
  ExternalLink,
  ShieldCheck,
  Check,
  Sliders,
  Tv
} from 'lucide-react';

interface FacebookProfileViewProps {
  currentUser: UserProfile;
  courses: Course[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenCertificateModal: (cert: EarnedCertificate) => void;
  onNavigateToCourse: (courseId: string) => void;
  onOpenStudio?: () => void;
}

export const FacebookProfileView: React.FC<FacebookProfileViewProps> = ({
  currentUser,
  courses,
  onUpdateProfile,
  onOpenCertificateModal,
  onNavigateToCourse,
  onOpenStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'courses' | 'network' | 'badges' | 'settings'>('posts');
  const [posts, setPosts] = useState<ProfilePost[]>(INITIAL_PROFILE_POSTS);
  const [network, setNetwork] = useState<NetworkConnection[]>(INITIAL_NETWORK_CONNECTIONS);
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  // New post form state
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'status' | 'code_snippet'>('status');
  const [newPostCode, setNewPostCode] = useState('');

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const coverOptions = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
  ];

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  ];

  const currentCover = currentUser.coverPhoto || coverOptions[0];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: ProfilePost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      content: newPostContent,
      type: newPostType,
      codeLanguage: newPostType === 'code_snippet' ? 'typescript' : undefined,
      codeContent: newPostType === 'code_snippet' ? newPostCode : undefined,
      timestamp: 'À l\'instant',
      likes: 0,
      isLiked: false,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostCode('');
    setNewPostType('status');
  };

  const handleToggleLike = (postId: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c-${Date.now()}`,
                authorId: currentUser.id,
                authorName: currentUser.name,
                authorAvatar: currentUser.avatar,
                content: text.trim(),
                timestamp: 'À l\'instant',
                likes: 0,
              },
            ],
          };
        }
        return p;
      })
    );

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const handleToggleFriend = (connId: string) => {
    setNetwork(
      network.map((c) => (c.id === connId ? { ...c, isFriend: !c.isFriend } : c))
    );
  };

  // Enrolled or authored courses
  const userCourses = courses.filter((c) =>
    currentUser.role === 'trainer'
      ? c.authorName === currentUser.name || c.authorId === currentUser.id
      : currentUser.enrolledCourseIds.includes(c.id)
  );

  return (
    <div className="min-h-screen bg-slate-100/90 py-4 sm:py-6">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
        {/* FACEBOOK STYLE COVER & HEADER CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-72 lg:h-80 w-full bg-slate-800 overflow-hidden">
            <img
              src={currentCover}
              alt="Photo de couverture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Change Cover Button */}
            <button
              onClick={() => setIsEditingCover(!isEditingCover)}
              className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-white/20 transition-all shadow-lg"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Changer la couverture</span>
            </button>

            {/* Cover Selector Drawer */}
            {isEditingCover && (
              <div className="absolute bottom-16 right-4 p-3 bg-white rounded-2xl shadow-2xl border border-slate-200 z-20 flex gap-2 animate-fadeIn">
                {coverOptions.map((cov, idx) => (
                  <img
                    key={idx}
                    src={cov}
                    alt={`Option ${idx}`}
                    onClick={() => {
                      onUpdateProfile({ coverPhoto: cov });
                      setIsEditingCover(false);
                    }}
                    className="w-14 h-10 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-indigo-600 transition-all"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Profile Header Details */}
          <div className="px-4 sm:px-8 pb-4 sm:pb-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 sm:gap-6">
              {/* Avatar + Status Indicator */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-200">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Avatar Edit Button */}
                  <button
                    onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                    className="absolute bottom-2 right-2 p-2 rounded-full bg-slate-900/90 text-white hover:bg-indigo-600 border-2 border-white shadow-md transition-colors"
                    title="Modifier la photo de profil"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  {/* Avatar Options Selector */}
                  {isEditingAvatar && (
                    <div className="absolute top-0 left-full ml-3 p-3 bg-white rounded-2xl shadow-2xl border border-slate-200 z-30 grid grid-cols-3 gap-2 w-48 animate-fadeIn">
                      {avatarOptions.map((av, idx) => (
                        <img
                          key={idx}
                          src={av}
                          alt={`Avatar ${idx}`}
                          onClick={() => {
                            onUpdateProfile({ avatar: av });
                            setIsEditingAvatar(false);
                          }}
                          className="w-12 h-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-indigo-600"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Name, Headline & Roles */}
                <div className="mb-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {currentUser.name}
                    </h1>
                    <span className="p-0.5 rounded-full bg-blue-500 text-white shadow-xs" title="Profil Vérifié Academia ITECH">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-600 mt-0.5">
                    {currentUser.headline || 'Étudiant Passionné en Intelligence Artificielle & Web'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {currentUser.role === 'trainer' ? 'Formateur Certifié' : currentUser.role === 'center_admin' ? 'Chef de Centre' : 'Apprenant Académie'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {currentUser.centerName || 'Campus Paris Digital Hub'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      {currentUser.xp} XP • Niveau {currentUser.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center">
                {currentUser.role === 'trainer' && onOpenStudio && (
                  <button
                    onClick={onOpenStudio}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Créer un Cours</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm flex items-center gap-2 border border-indigo-200 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Modifier le profil</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  title="Paramètres de compte"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* FACEBOOK STYLE TAB NAVIGATION */}
            <div className="flex border-t border-slate-200 mt-6 -mb-4 overflow-x-auto">
              {[
                { id: 'posts', label: 'Publications & Journal', icon: MessageSquare },
                { id: 'about', label: 'À Propos & Parcours', icon: Briefcase },
                { id: 'courses', label: currentUser.role === 'trainer' ? 'Cours Créés' : 'Formations & Diplômes', icon: BookOpen, badge: `${userCourses.length}` },
                { id: 'network', label: 'Réseau & Amis', icon: Users, badge: `${network.length}` },
                { id: 'badges', label: 'Vitrine & Badges', icon: Award },
                { id: 'settings', label: 'Paramètres & Modèles', icon: Sliders },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                      isActive
                        ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TAB CONTENTS */}

        {/* 1. POSTS / JOURNAL FEED */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Intro Summary & Info Box */}
            <div className="lg:col-span-4 space-y-6">
              {/* Intro Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Intro & Informations</span>
                </h3>

                {currentUser.bio && (
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic border-l-2 border-indigo-500 pl-3">
                    "{currentUser.bio}"
                  </p>
                )}

                <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>
                      Travaille à <strong>{currentUser.workplaces?.[0]?.company || 'Academia ITECH Hub'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span>
                      A étudié à <strong>{currentUser.education?.[0]?.school || currentUser.centerName || 'Campus Paris'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>
                      Habite à <strong>{currentUser.city || 'Paris'}, {currentUser.country || 'France'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Inscrit en <strong>{currentUser.joinedDate || '2025'}</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('about')}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Voir tous les détails
                </button>
              </div>

              {/* Skills Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Compétences & Outils</span>
                  <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer" onClick={() => setActiveTab('about')}>
                    Gérer
                  </span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {(currentUser.skills || ['React', 'TypeScript', 'Intelligence Artificielle', 'Python', 'Docker']).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Photos & Badges Preview */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Certificats Débloqués</h3>
                  <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer" onClick={() => setActiveTab('courses')}>
                    Tout voir ({currentUser.earnedCertificates.length})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {currentUser.earnedCertificates.slice(0, 2).map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => onOpenCertificateModal(cert)}
                      className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 hover:border-indigo-300 cursor-pointer transition-all text-center"
                    >
                      <Award className="w-8 h-8 text-indigo-600 mx-auto mb-1" />
                      <p className="font-bold text-[11px] text-slate-900 truncate">{cert.courseTitle}</p>
                      <span className="text-[9px] text-indigo-700 font-bold">{cert.distinction}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Create Post & Feed */}
            <div className="lg:col-span-8 space-y-5">
              {/* Create Post Box (Facebook Style) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder={`Que souhaitez-vous partager avec l'académie, ${currentUser.name.split(' ')[0]} ?`}
                      rows={2}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                    {newPostType === 'code_snippet' && (
                      <textarea
                        value={newPostCode}
                        onChange={(e) => setNewPostCode(e.target.value)}
                        placeholder="// Collez votre code TypeScript / Python / React ici..."
                        rows={3}
                        className="w-full mt-2 font-mono text-xs p-3 rounded-xl bg-slate-900 text-emerald-300 border border-slate-800 focus:outline-none"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setNewPostType(newPostType === 'code_snippet' ? 'status' : 'code_snippet')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        newPostType === 'code_snippet'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Snippet de Code</span>
                    </button>
                  </div>

                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publier</span>
                  </button>
                </div>
              </div>

              {/* Feed List */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    {/* Post Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{post.authorName}</h4>
                            {post.isPinned && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                Épinglé 📌
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{post.timestamp}</p>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Certificate Ref Attachment */}
                    {post.certificateRef && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                              {post.certificateRef.courseTitle}
                            </h5>
                            <p className="text-[11px] text-indigo-700 font-semibold">
                              {post.certificateRef.distinction} • {post.certificateRef.certificateNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Code Snippet Attachment */}
                    {post.codeContent && (
                      <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800">
                        <pre>{post.codeContent}</pre>
                      </div>
                    )}

                    {/* Likes & Comments Count */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                        <span>{post.likes} mentions J'aime</span>
                      </span>
                      <span>{post.comments.length} commentaires</span>
                    </div>

                    {/* Action Bar */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs font-semibold">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                          post.isLiked
                            ? 'bg-blue-50 text-blue-600 font-bold'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-blue-600 text-blue-600' : ''}`} />
                        <span>J'aime</span>
                      </button>
                      <button className="py-2 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center justify-center gap-2 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>Commenter</span>
                      </button>
                    </div>

                    {/* Comments Section */}
                    {post.comments.length > 0 && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        {post.comments.map((c) => (
                          <div key={c.id} className="flex items-start gap-2.5 text-xs">
                            <img
                              src={c.authorAvatar}
                              alt={c.authorName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div className="p-3 rounded-2xl bg-slate-100 text-slate-800 max-w-[85%]">
                              <span className="font-bold text-slate-900 block">{c.authorName}</span>
                              <p className="mt-0.5">{c.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <img
                        src={currentUser.avatar}
                        alt="Moi"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        placeholder="Écrivez un commentaire..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. ABOUT & CAREER TAB */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-8">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span>Expériences & Postes Professionnels</span>
              </h3>
              <div className="space-y-4">
                {(currentUser.workplaces || [
                  { id: '1', role: 'Apprenant en Ingénierie Logicielle', company: 'Academia ITECH Lab', period: '2025 - Présent', current: true },
                  { id: '2', role: 'Projet Numérique Open Source', company: 'Initiative Tech', period: '2024 - 2025', current: false },
                ]).map((w) => (
                  <div key={w.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{w.role}</h4>
                      <p className="text-xs text-slate-600">{w.company} • {w.period}</p>
                    </div>
                    {w.current && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Poste Actuel
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>Cursus Académique & Certifications</span>
              </h3>
              <div className="space-y-3">
                {(currentUser.education || [
                  { id: 'e1', school: currentUser.centerName || 'Academia ITECH Campus', degree: 'Programme d\'Excellence en IA Générative et FullStack', year: '2025 - 2026' },
                ]).map((edu) => (
                  <div key={edu.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-sm text-slate-900">{edu.degree}</h4>
                    <p className="text-xs text-slate-600">{edu.school} • {edu.year}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-indigo-600" />
                <span>Coordonnées & Réseaux Sociaux</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span className="text-slate-800">{currentUser.email}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-800">{currentUser.phone || '+33 6 12 34 56 78'}</span>
                </div>
                {currentUser.socialLinks?.github && (
                  <a
                    href={currentUser.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-between text-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-slate-700" />
                      <span>GitHub</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
                {currentUser.socialLinks?.linkedin && (
                  <a
                    href={currentUser.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-between text-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Globe2 className="w-4 h-4 text-blue-600" />
                      <span>LinkedIn</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. COURSES & CERTIFICATES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Certificates Showcase */}
            {currentUser.earnedCertificates.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Certificats & Diplômes Officiels</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.earnedCertificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-md flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            {cert.distinction}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{cert.issueDate}</span>
                        </div>
                        <h4 className="font-bold text-base text-white">{cert.courseTitle}</h4>
                        <p className="text-xs text-slate-300 mt-1">Délivré par {cert.centerName}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                        <span className="text-[10px] font-mono text-slate-400">{cert.certificateNumber}</span>
                        <button
                          onClick={() => onOpenCertificateModal(cert)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <span>Voir le Diplôme</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Courses List */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>{currentUser.role === 'trainer' ? 'Formations Créées' : 'Formations en Cours'}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => onNavigateToCourse(c.id)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all bg-white flex flex-col justify-between"
                  >
                    <div>
                      <img src={c.thumbnail} alt={c.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        {c.level}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-2 line-clamp-2">{c.title}</h4>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span>{c.durationHours}h de contenu</span>
                      <span className="text-indigo-600 font-bold">Ouvrir →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. NETWORK & FRIENDS TAB */}
        {activeTab === 'network' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Réseau Académique & Connexions</h3>
                <p className="text-xs text-slate-500">Formateurs, mentors et apprenants de votre campus</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                {network.length} Contacts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {network.map((conn) => (
                <div
                  key={conn.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <img
                        src={conn.avatar}
                        alt={conn.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      {conn.isOnline && (
                        <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{conn.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{conn.headline}</p>
                      <span className="text-[10px] text-slate-400">{conn.mutualCount} amis en commun</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleToggleFriend(conn.id)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        conn.isFriend
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500'
                      }`}
                    >
                      {conn.isFriend ? 'Ami ✓' : 'Ajouter'}
                    </button>
                    <button className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. BADGES & VITRINE */}
        {activeTab === 'badges' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Vitrine des Succès & Badges</h3>
              <p className="text-xs text-slate-500 mb-4">Badges débloqués tout au long de vos sessions d'apprentissage</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { title: 'Pionnier IA', desc: 'Compléter 5 modules d\'IA', icon: '🤖', level: 'Légendaire' },
                { title: 'Série de Feu', desc: '7 jours consécutifs d\'étude', icon: '🔥', level: 'Épique' },
                { title: 'Codeur Propre', desc: '100% de succès aux tests de code', icon: '💻', level: 'Rare' },
                { title: 'Major de Promo', desc: 'Obtenir une Mention Très Bien', icon: '🏆', level: 'Légendaire' },
              ].map((b, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center">
                  <span className="text-3xl mb-2">{b.icon}</span>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{b.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{b.desc}</p>
                  <span className="mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-800">
                    {b.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. SETTINGS & TEMPLATES TAB */}
        {activeTab === 'settings' && (
          <ProfileSettingsTab currentUser={currentUser} onUpdateProfile={onUpdateProfile} />
        )}
      </div>
    </div>
  );
};
