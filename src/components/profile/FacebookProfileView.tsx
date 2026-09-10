import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Course, EarnedCertificate, ProfilePost, NetworkConnection } from '../../types';
import { INITIAL_PROFILE_POSTS, INITIAL_NETWORK_CONNECTIONS } from '../../data/templatesData';
import { ProfileSettingsTab } from './ProfileSettingsTab';
import { CourseLiveChatTab } from './CourseLiveChatTab';
import { getNetworkForUser, COURSE_NETWORK_DATA } from '../../data/courseNetworkData';
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
  MessageSquareText,
  UserCheck,
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
  Tv,
  Play,
  Upload,
  Image as ImageIcon,
  Trash2,
  FolderOpen,
  X,
  Video as VideoIcon,
  FileText,
  Smile,
  Heart,
  Filter,
  Download,
  Paperclip,
  Eye
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
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'courses' | 'chat' | 'network' | 'badges' | 'settings'>('posts');
  const [posts, setPosts] = useState<ProfilePost[]>(INITIAL_PROFILE_POSTS);
  
  // Dynamic course-scoped network
  const [network, setNetwork] = useState<NetworkConnection[]>(() =>
    getNetworkForUser(currentUser, courses)
  );
  const [networkCourseFilter, setNetworkCourseFilter] = useState<string>('all');
  const [networkRoleFilter, setNetworkRoleFilter] = useState<'all' | 'teacher' | 'learner'>('all');
  const [selectedChatCourseId, setSelectedChatCourseId] = useState<string | undefined>(undefined);
  const [selectedChatTeacherId, setSelectedChatTeacherId] = useState<string | undefined>(undefined);

  // Sync network when current user or courses change
  React.useEffect(() => {
    setNetwork(getNetworkForUser(currentUser, courses));
  }, [currentUser.id, currentUser.role, currentUser.enrolledCourseIds, courses]);

  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  // Hidden File Inputs for Machine Upload
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // Cover photo file upload handler
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("L'image est trop volumineuse. Veuillez choisir un fichier de moins de 10 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUpdateProfile({ coverPhoto: event.target.result as string });
        setIsEditingCover(false);
        showFeedback("Photo de couverture mise à jour depuis votre machine !");
      }
    };
    reader.readAsDataURL(file);
  };

  // Avatar file upload handler
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("L'image est trop volumineuse. Veuillez choisir un fichier de moins de 10 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUpdateProfile({ avatar: event.target.result as string });
        setIsEditingAvatar(false);
        showFeedback("Photo de profil mise à jour depuis votre machine !");
      }
    };
    reader.readAsDataURL(file);
  };

  const showFeedback = (msg: string) => {
    setUploadFeedback(msg);
    setTimeout(() => setUploadFeedback(null), 3500);
  };

  const [shareFeedback, setShareFeedback] = useState(false);
  const handleShareProfile = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setShareFeedback(true);
    showFeedback("Lien du profil copié dans le presse-papier !");
    setTimeout(() => setShareFeedback(false), 2500);
  };

  // New post form state
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'status' | 'code_snippet' | 'project_showcase'>('status');
  const [newPostCode, setNewPostCode] = useState('');

  // Media Attachment State for Post Creation
  const [postMediaUrl, setPostMediaUrl] = useState<string | null>(null);
  const [postMediaType, setPostMediaType] = useState<'image' | 'video' | 'document' | 'link' | null>(null);
  const [postMediaName, setPostMediaName] = useState<string | null>(null);
  const [postMediaSize, setPostMediaSize] = useState<string | null>(null);
  const [postFeeling, setPostFeeling] = useState<string | null>(null);
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlModalType, setUrlModalType] = useState<'image' | 'video'>('image');
  const [urlModalInput, setUrlModalInput] = useState('');
  const [postFeedFilter, setPostFeedFilter] = useState<'all' | 'media' | 'code' | 'certificates'>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Hidden File Inputs for Post Media
  const postImageInputRef = useRef<HTMLInputElement>(null);
  const postVideoInputRef = useRef<HTMLInputElement>(null);
  const postDocInputRef = useRef<HTMLInputElement>(null);

  // Handlers for machine file upload into forum post
  const handlePostImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert("L'image est trop volumineuse (max 20 Mo).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPostMediaUrl(event.target.result as string);
        setPostMediaType('image');
        setPostMediaName(file.name);
        setPostMediaSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
        showFeedback(`Image "${file.name}" prête à être publiée !`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePostVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 80 * 1024 * 1024) {
      alert("La vidéo est trop volumineuse (max 80 Mo).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPostMediaUrl(event.target.result as string);
        setPostMediaType('video');
        setPostMediaName(file.name);
        setPostMediaSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
        showFeedback(`Vidéo "${file.name}" chargée avec succès !`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePostDocFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPostMediaUrl(event.target.result as string);
        setPostMediaType('document');
        setPostMediaName(file.name);
        setPostMediaSize(`${(file.size / 1024).toFixed(0)} KB`);
        showFeedback(`Document "${file.name}" prêt à être publié !`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick preset loader for fast testing
  const handleLoadDemoMedia = (type: 'image' | 'video') => {
    if (type === 'image') {
      setPostMediaUrl('https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80');
      setPostMediaType('image');
      setPostMediaName('atelier-kinshasa-ai.jpg');
      setPostMediaSize('1.8 MB');
      setPostFeeling('partage une photo 📸');
      showFeedback("Image démo chargée !");
    } else {
      setPostMediaUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      setPostMediaType('video');
      setPostMediaName('demo-capsule-itech.mp4');
      setPostMediaSize('8.4 MB');
      setPostFeeling('partage une vidéo 🎥');
      showFeedback("Vidéo démo chargée !");
    }
  };

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
    if (!newPostContent.trim() && !postMediaUrl && !newPostCode) return;

    const newPost: ProfilePost = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      content: newPostContent.trim() || (postMediaType === 'image' ? 'Nouvelle photo partagée 📸' : postMediaType === 'video' ? 'Nouvelle vidéo partagée 🎥' : 'Nouvelle ressource partagée 📁'),
      type: postMediaUrl ? 'project_showcase' : newPostType,
      codeLanguage: newPostType === 'code_snippet' ? 'typescript' : undefined,
      codeContent: newPostType === 'code_snippet' ? newPostCode : undefined,
      mediaUrl: postMediaUrl || undefined,
      mediaType: postMediaType || undefined,
      mediaName: postMediaName || undefined,
      mediaSize: postMediaSize || undefined,
      feeling: postFeeling || undefined,
      timestamp: 'À l\'instant',
      likes: 0,
      isLiked: false,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostCode('');
    setNewPostType('status');
    setPostMediaUrl(null);
    setPostMediaType(null);
    setPostMediaName(null);
    setPostMediaSize(null);
    setPostFeeling(null);
    setShowFeelingPicker(false);
    showFeedback("Publication partagée sur le forum !");
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((p) => p.id !== postId));
    showFeedback("Publication supprimée.");
  };

  const handleSharePost = (post: ProfilePost) => {
    navigator.clipboard?.writeText(window.location.href);
    showFeedback("Lien du post copié dans le presse-papier !");
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
    <div className="w-full max-w-6xl mx-auto min-w-0 overflow-x-hidden space-y-6">
      {/* FACEBOOK STYLE COVER & HEADER CARD */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-52 sm:h-72 lg:h-80 w-full bg-slate-900 overflow-hidden">
          <img
            src={currentCover}
            alt="Photo de couverture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {/* Subtle dark gradient overlay for optimal text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />

          {/* Academic Badge on Cover Photo */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Espace Académique Officiel</span>
            <span className="text-white/40 hidden sm:inline">•</span>
            <span className="text-sky-300 truncate max-w-[160px] sm:max-w-[220px]">
              {currentUser.centerName || 'Academia ITECH Hub'}
            </span>
          </div>

          {/* Hidden file inputs for local machine upload */}
          <input
            type="file"
            ref={coverFileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleCoverFileUpload}
          />
          <input
            type="file"
            ref={avatarFileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFileUpload}
          />

          {/* Upload Feedback Toast */}
          {uploadFeedback && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-xl flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4" />
              <span>{uploadFeedback}</span>
            </div>
          )}

          {/* Change Cover Button */}
          <button
            id="btn-edit-cover-photo"
            onClick={() => setIsEditingCover(!isEditingCover)}
            className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 px-3.5 py-2 rounded-xl bg-black/75 hover:bg-black/95 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 border border-white/25 transition-all shadow-xl cursor-pointer"
          >
            <Camera className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Changer la couverture</span>
          </button>

          {/* Cover Selector / Machine Upload Modal */}
          {isEditingCover && (
            <div className="absolute bottom-16 right-2 sm:right-6 w-[calc(100vw-2rem)] max-w-sm sm:max-w-md p-4 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 z-30 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <ImageIcon className="w-4 h-4 text-sky-600" />
                  <span>Modifier la photo de couverture</span>
                </div>
                <button
                  onClick={() => setIsEditingCover(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Machine Upload Button */}
              <div
                onClick={() => coverFileInputRef.current?.click()}
                className="p-4 rounded-xl border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/60 hover:bg-sky-50 transition-all cursor-pointer text-center space-y-1.5 group"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-sky-950">
                  Importer depuis votre machine (PC / Téléphone)
                </p>
                <p className="text-[10px] text-slate-500">
                  JPG, PNG, WebP • Max 10 Mo
                </p>
              </div>

              {/* Preset Options */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1.5 block">
                  Ou sélectionner un thème de couverture :
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {coverOptions.map((cov, idx) => (
                    <img
                      key={idx}
                      src={cov}
                      alt={`Option ${idx}`}
                      onClick={() => {
                        onUpdateProfile({ coverPhoto: cov });
                        setIsEditingCover(false);
                        showFeedback("Photo de couverture mise à jour !");
                      }}
                      className="w-full h-12 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-sky-500 transition-all hover:scale-105"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Identity Details Header */}
        <div className="px-4 sm:px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 sm:gap-6">
            {/* Avatar + Status Indicator */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left min-w-0 w-full sm:w-auto">
              {/* Only the avatar overlaps the cover with negative margin */}
              <div className="relative shrink-0 -mt-16 sm:-mt-24">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-100 ring-4 ring-sky-200/80">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Online Status Pill */}
                <div 
                  className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow-md border-2 border-white flex items-center gap-1"
                  title="Actuellement connecté sur Academia ITECH"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="hidden sm:inline">En ligne</span>
                </div>

                {/* Avatar Edit Button */}
                <button
                  id="btn-edit-avatar-photo"
                  onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                  className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2.5 rounded-full bg-slate-900 text-white hover:bg-sky-600 border-2 border-white shadow-xl transition-all cursor-pointer hover:scale-105"
                  title="Modifier la photo de profil"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>

                {/* Avatar Options & Upload Modal - Positioned below without overflowing screen */}
                {isEditingAvatar && (
                  <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 top-full mt-3 w-[calc(100vw-2rem)] max-w-sm p-4 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 z-50 space-y-3 animate-fadeIn text-left">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                        <Camera className="w-4 h-4 text-sky-600" />
                        <span>Modifier la photo de profil</span>
                      </div>
                      <button
                        onClick={() => setIsEditingAvatar(false)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Machine Upload Button for Avatar */}
                    <div
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="p-3.5 rounded-xl border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/70 hover:bg-sky-50 transition-all cursor-pointer text-center space-y-1 group"
                    >
                      <div className="w-9 h-9 mx-auto rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                        <Upload className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-black text-sky-950">
                        Importer votre photo (PC / Téléphone)
                      </p>
                      <p className="text-[10px] text-slate-500">
                        JPG, PNG, WebP • Max 10 Mo
                      </p>
                    </div>

                    {/* Preset Avatar Gallery */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 mb-1.5 block">
                        Ou choisir un avatar officiel :
                      </label>
                      <div className="grid grid-cols-6 gap-1.5">
                        {avatarOptions.map((av, idx) => (
                          <img
                            key={idx}
                            src={av}
                            alt={`Avatar ${idx}`}
                            onClick={() => {
                              onUpdateProfile({ avatar: av });
                              setIsEditingAvatar(false);
                              showFeedback("Photo de profil mise à jour !");
                            }}
                            className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-sky-500 hover:scale-105 transition-all border border-slate-200"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Name, Headline & Roles - Dedicated high contrast card */}
              <div className="min-w-0 flex-1 w-full sm:w-auto pt-3 sm:pt-4">
                {/* Person Name - High Contrast, Legible, Bold on elevated protected background */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-xs mb-2 text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight break-words drop-shadow-xs">
                      {currentUser.name}
                    </h1>
                    <span
                      className="p-1.5 rounded-full bg-sky-600 text-white shadow-xs shrink-0 inline-flex items-center justify-center ring-2 ring-white"
                      title="Profil Vérifié Academia ITECH"
                    >
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-slate-900 text-white shadow-2xs shrink-0">
                      ID #{currentUser.id ? currentUser.id.slice(-6).toUpperCase() : 'USER01'}
                    </span>
                  </div>

                  {/* Professional Headline */}
                  <p className="text-sm sm:text-base font-bold text-slate-800 mt-2 max-w-2xl leading-relaxed">
                    {currentUser.headline || 'Étudiant & Praticien en Intelligence Artificielle et Ingénierie Web'}
                  </p>
                </div>

                {/* Metadata Badges: Role, Campus, Email, XP/Level */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3.5">
                  {/* Role Badge */}
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-sky-700 text-white shadow-2xs flex items-center gap-1.5 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-200" />
                    <span>
                      {currentUser.role === 'trainer' ? 'Formateur Certifié' : currentUser.role === 'center_admin' ? 'Chef de Centre' : currentUser.role === 'super_admin' ? 'Administrateur Général' : 'Apprenant Académie'}
                    </span>
                  </span>

                  {/* Campus Badge */}
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 shadow-2xs flex items-center gap-1.5 shrink-0 transition-colors">
                    <Building2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>{currentUser.centerName || 'Campus Central ITECH'}</span>
                  </span>

                  {/* Email Badge for instant clarity */}
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5 shrink-0">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate max-w-[200px] sm:max-w-xs">{currentUser.email}</span>
                  </span>

                  {/* XP & Level Badge */}
                  <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-50 text-amber-950 border border-amber-300 flex items-center gap-1.5 shadow-2xs shrink-0">
                    <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>{currentUser.xp || 0} XP • Niveau {currentUser.level || 1}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-end shrink-0 pt-2 sm:pt-0">
              {currentUser.role === 'trainer' && onOpenStudio && (
                <button
                  onClick={onOpenStudio}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-sky-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Créer un Cours</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('settings')}
                className="px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 border border-sky-200 transition-colors shadow-2xs cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-sky-600" />
                <span>Modifier le profil</span>
              </button>

              <button
                onClick={handleShareProfile}
                title="Partager le lien du profil"
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline">Partager</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                title="Paramètres de compte"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* USER SPACE TAB NAVIGATION - Dedicated full-width bar without negative margin */}
        <div className="bg-slate-50/90 border-t border-slate-200 px-3 sm:px-6 py-2.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'courses', label: currentUser.role === 'trainer' ? 'Cours Créés' : 'Mes Formations', icon: BookOpen, badge: `${userCourses.length}` },
            { id: 'chat', label: 'Forum & Chat Direct', icon: MessageSquareText, badge: 'Live' },
            { id: 'network', label: 'Réseau & Amis', icon: Users, badge: `${network.length}` },
            { id: 'posts', label: 'Journal & Mur', icon: MessageSquare },
            { id: 'about', label: 'Parcours & Infos', icon: Briefcase },
            { id: 'badges', label: 'Vitrine Badges', icon: Award },
            { id: 'settings', label: 'Paramètres du Profil', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-sky-700 shadow-xs border border-slate-200/90 ring-1 ring-sky-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

        {/* ACTIVE COURSE HERO BANNER FOR LEARNER */}
        {currentUser.role === 'learner' && userCourses.length > 0 && (
          <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white border border-sky-500/30 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <img
                  src={userCourses[0].thumbnail}
                  alt={userCourses[0].title}
                  className="w-20 h-20 rounded-xl object-cover border border-sky-400/40 shrink-0 hidden sm:block"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40 uppercase tracking-wider">
                      Cours en Cours
                    </span>
                    <span className="text-xs text-slate-400">{userCourses[0].category}</span>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug break-words">
                    {userCourses[0].title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                    Formateur : {userCourses[0].trainerName} • {userCourses[0].durationHours}h de formation
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end shrink-0">
                <button
                  onClick={() => {
                    setSelectedChatCourseId(userCourses[0].id);
                    setActiveTab('chat');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-200 border border-sky-400/30 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquareText className="w-4 h-4 text-sky-400" />
                  <span>Chatter avec l'Enseignant</span>
                </button>
                <button
                  onClick={() => onNavigateToCourse(userCourses[0].id)}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Reprendre le Cours</span>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-full" style={{ width: '68%' }} />
              </div>
              <span className="text-xs text-sky-300 font-mono font-bold">68%</span>
            </div>
          </div>
        )}

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
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic border-l-2 border-sky-500 pl-3">
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
                  <span className="text-[11px] text-sky-600 font-semibold cursor-pointer" onClick={() => setActiveTab('about')}>
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
                  <span className="text-[11px] text-sky-600 font-semibold cursor-pointer" onClick={() => setActiveTab('courses')}>
                    Tout voir ({currentUser.earnedCertificates.length})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {currentUser.earnedCertificates.slice(0, 2).map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => onOpenCertificateModal(cert)}
                      className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 hover:border-sky-300 cursor-pointer transition-all text-center"
                    >
                      <Award className="w-8 h-8 text-sky-600 mx-auto mb-1" />
                      <p className="font-bold text-[11px] text-slate-900 truncate">{cert.courseTitle}</p>
                      <span className="text-[9px] text-sky-700 font-bold">{cert.distinction}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Create Post & Feed */}
            <div className="lg:col-span-8 space-y-5">
              {/* Hidden machine file pickers */}
              <input
                ref={postImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePostImageFile}
              />
              <input
                ref={postVideoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handlePostVideoFile}
              />
              <input
                ref={postDocInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.zip,.txt"
                className="hidden"
                onChange={handlePostDocFile}
              />

              {/* Create Post Box (Facebook Style with Full Media Support) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-700">
                      <span>{currentUser.name}</span>
                      {postFeeling && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] flex items-center gap-1 font-bold">
                          <span>{postFeeling}</span>
                          <button
                            type="button"
                            onClick={() => setPostFeeling(null)}
                            className="hover:text-red-500 ml-1"
                          >
                            ×
                          </button>
                        </span>
                      )}
                    </div>

                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder={`Que souhaitez-vous partager avec l'académie, ${currentUser.name.split(' ')[0]} ? Partagez une réflexion, une image, un projet vidéo ou une question...`}
                      rows={postMediaUrl || newPostType === 'code_snippet' ? 2 : 3}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    />

                    {newPostType === 'code_snippet' && (
                      <textarea
                        value={newPostCode}
                        onChange={(e) => setNewPostCode(e.target.value)}
                        placeholder="// Collez votre code TypeScript / Python / React ici..."
                        rows={3}
                        className="w-full font-mono text-xs p-3 rounded-xl bg-slate-900 text-emerald-300 border border-slate-800 focus:outline-none"
                      />
                    )}

                    {/* Attached Media Preview Box */}
                    {postMediaUrl && (
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 p-2 text-white">
                        <button
                          type="button"
                          onClick={() => {
                            setPostMediaUrl(null);
                            setPostMediaType(null);
                            setPostMediaName(null);
                            setPostMediaSize(null);
                          }}
                          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/70 hover:bg-black text-white hover:text-red-400 transition-all shadow-md"
                          title="Supprimer ce média"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {postMediaType === 'image' && (
                          <div className="space-y-1.5">
                            <img
                              src={postMediaUrl}
                              alt="Aperçu du média"
                              className="w-full max-h-60 object-contain rounded-xl bg-black/40"
                            />
                            <div className="flex items-center justify-between px-2 text-[11px] text-slate-300">
                              <span className="font-semibold truncate max-w-xs">{postMediaName || 'Image prête'}</span>
                              <span>{postMediaSize || 'Image locale'}</span>
                            </div>
                          </div>
                        )}

                        {postMediaType === 'video' && (
                          <div className="space-y-1.5">
                            <video
                              src={postMediaUrl}
                              controls
                              className="w-full max-h-60 rounded-xl bg-black"
                            />
                            <div className="flex items-center justify-between px-2 text-[11px] text-slate-300">
                              <span className="font-semibold truncate max-w-xs">{postMediaName || 'Vidéo prête'}</span>
                              <span>{postMediaSize || 'Vidéo locale'}</span>
                            </div>
                          </div>
                        )}

                        {postMediaType === 'document' && (
                          <div className="p-4 flex items-center gap-3 bg-slate-900 rounded-xl">
                            <FileText className="w-8 h-8 text-sky-400" />
                            <div>
                              <p className="font-bold text-xs text-white">{postMediaName || 'Document joint'}</p>
                              <p className="text-[10px] text-slate-400">{postMediaSize || 'Fichier'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Feelings popover */}
                {showFeelingPicker && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 flex-wrap animate-fade-in text-xs">
                    <span className="font-bold text-slate-600 text-[11px]">Comment vous sentez-vous ?</span>
                    {[
                      { label: 'se sent inspiré 💡', emoji: '💡' },
                      { label: 'programme un projet 💻', emoji: '💻' },
                      { label: 'se sent motivé 🚀', emoji: '🚀' },
                      { label: 'partage une certification 🎓', emoji: '🎓' },
                      { label: 'en révision d\'examen 📚', emoji: '📚' },
                      { label: 'partage une vidéo 🎬', emoji: '🎬' },
                    ].map((f) => (
                      <button
                        key={f.label}
                        type="button"
                        onClick={() => {
                          setPostFeeling(f.label);
                          setShowFeelingPicker(false);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 hover:text-sky-700 text-slate-700 border border-slate-200 font-medium transition-colors"
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* URL Modal Input Bar */}
                {showUrlModal && (
                  <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl flex items-center gap-2 animate-fade-in">
                    <input
                      type="url"
                      value={urlModalInput}
                      onChange={(e) => setUrlModalInput(e.target.value)}
                      placeholder={urlModalType === 'image' ? 'https://example.com/photo.jpg' : 'https://example.com/video.mp4'}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-sky-300 bg-white text-slate-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (urlModalInput.trim()) {
                          setPostMediaUrl(urlModalInput.trim());
                          setPostMediaType(urlModalType);
                          setPostMediaName(urlModalType === 'image' ? 'Image Web URL' : 'Vidéo Web URL');
                          setShowUrlModal(false);
                          setUrlModalInput('');
                        }
                      }}
                      className="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700"
                    >
                      Valider
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlModal(false)}
                      className="p-1.5 text-slate-500 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Create Post Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    {/* Upload Image Button */}
                    <button
                      type="button"
                      onClick={() => postImageInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      title="Importer une image depuis votre appareil"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Photo</span>
                    </button>

                    {/* Upload Video Button */}
                    <button
                      type="button"
                      onClick={() => postVideoInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
                      title="Importer une vidéo depuis votre appareil"
                    >
                      <VideoIcon className="w-3.5 h-3.5 text-purple-600" />
                      <span>Vidéo</span>
                    </button>

                    {/* Upload Document Button */}
                    <button
                      type="button"
                      onClick={() => postDocInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                      title="Importer un document (PDF, code, zip)"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden sm:inline">Fichier</span>
                    </button>

                    {/* Code Snippet Button */}
                    <button
                      type="button"
                      onClick={() => setNewPostType(newPostType === 'code_snippet' ? 'status' : 'code_snippet')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        newPostType === 'code_snippet'
                          ? 'bg-slate-900 text-emerald-400 border border-slate-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </button>

                    {/* Feeling / Mood Button */}
                    <button
                      type="button"
                      onClick={() => setShowFeelingPicker(!showFeelingPicker)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200 transition-colors"
                    >
                      <Smile className="w-3.5 h-3.5 text-yellow-600" />
                      <span className="hidden sm:inline">Humeur</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Instant Demo Presets dropdown / test buttons */}
                    <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-400">
                      <span>Exemples :</span>
                      <button
                        type="button"
                        onClick={() => handleLoadDemoMedia('image')}
                        className="px-1.5 py-0.5 rounded text-sky-600 hover:bg-sky-50 font-medium"
                      >
                        📸 Photo
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleLoadDemoMedia('video')}
                        className="px-1.5 py-0.5 rounded text-purple-600 hover:bg-purple-50 font-medium"
                      >
                        🎥 Vidéo
                      </button>
                    </div>

                    <button
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim() && !postMediaUrl && !newPostCode}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publier</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Feed Filter Bar */}
              <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filtrer le flux :</span>
                </div>
                <div className="flex items-center gap-1">
                  {[
                    { id: 'all', label: `Tous (${posts.length})` },
                    { id: 'media', label: `Photos & Vidéos (${posts.filter(p => p.mediaUrl).length})` },
                    { id: 'code', label: `Code (${posts.filter(p => p.codeContent).length})` },
                    { id: 'certificates', label: `Certificats (${posts.filter(p => p.certificateRef).length})` },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setPostFeedFilter(f.id as any)}
                      className={`px-2.5 py-1 rounded-lg transition-colors ${
                        postFeedFilter === f.id
                          ? 'bg-sky-500 text-white shadow-xs'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed List */}
              <div className="space-y-4">
                {posts
                  .filter((post) => {
                    if (postFeedFilter === 'media') return Boolean(post.mediaUrl);
                    if (postFeedFilter === 'code') return Boolean(post.codeContent);
                    if (postFeedFilter === 'certificates') return Boolean(post.certificateRef);
                    return true;
                  })
                  .map((post) => {
                    const isMyPost = post.authorId === currentUser.id;
                    return (
                      <div key={post.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                        {/* Post Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={post.authorAvatar}
                              alt={post.authorName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-sm text-slate-900">{post.authorName}</h4>
                                {post.feeling && (
                                  <span className="text-xs text-slate-500 font-medium">
                                    — {post.feeling}
                                  </span>
                                )}
                                {post.isPinned && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    Épinglé 📌
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                                <span>{post.timestamp}</span>
                                <span>•</span>
                                <span className="capitalize">{post.authorRole === 'trainer' ? 'Formateur' : 'Apprenant'}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {isMyPost && (
                              <button
                                type="button"
                                onClick={() => handleDeletePost(post.id)}
                                title="Supprimer ma publication"
                                className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleSharePost(post)}
                              title="Partager le lien"
                              className="text-slate-400 hover:text-sky-600 p-1.5 rounded-lg hover:bg-sky-50 transition-colors"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Post Content */}
                        {post.content && (
                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                            {post.content}
                          </p>
                        )}

                        {/* Media Attachment Rendering (Image / Video / Document) */}
                        {post.mediaUrl && (
                          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">
                            {post.mediaType === 'image' && (
                              <div className="relative group cursor-pointer" onClick={() => setLightboxImage(post.mediaUrl!)}>
                                <img
                                  src={post.mediaUrl}
                                  alt={post.mediaName || 'Média du post'}
                                  className="w-full max-h-[440px] object-cover hover:opacity-95 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="px-3 py-1.5 rounded-xl bg-black/70 text-white text-xs font-bold flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    <span>Agrandir l'image</span>
                                  </span>
                                </div>
                                {post.mediaName && (
                                  <div className="p-2.5 bg-slate-900/90 text-slate-300 text-xs flex items-center justify-between border-t border-slate-800">
                                    <span className="truncate">{post.mediaName}</span>
                                    <span className="text-[10px] text-slate-400">{post.mediaSize || 'Image'}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {post.mediaType === 'video' && (
                              <div>
                                <video
                                  src={post.mediaUrl}
                                  controls
                                  preload="metadata"
                                  className="w-full max-h-[460px] bg-black"
                                />
                                {post.mediaName && (
                                  <div className="p-2.5 bg-slate-900 text-slate-300 text-xs flex items-center justify-between border-t border-slate-800">
                                    <span className="truncate font-medium flex items-center gap-1.5">
                                      <VideoIcon className="w-3.5 h-3.5 text-purple-400" />
                                      <span>{post.mediaName}</span>
                                    </span>
                                    <span className="text-[10px] text-purple-400 font-bold">{post.mediaSize || 'Vidéo MP4'}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {post.mediaType === 'document' && (
                              <div className="p-4 bg-slate-900 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-xs text-white truncate max-w-xs sm:max-w-md">
                                      {post.mediaName || 'Document joint'}
                                    </h5>
                                    <p className="text-[10px] text-slate-400">{post.mediaSize || 'Ressource'}</p>
                                  </div>
                                </div>
                                <a
                                  href={post.mediaUrl}
                                  download={post.mediaName || 'document'}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Télécharger</span>
                                </a>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Certificate Ref Attachment */}
                        {post.certificateRef && (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-purple-50 border border-sky-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
                                <Award className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                                  {post.certificateRef.courseTitle}
                                </h5>
                                <p className="text-[11px] text-sky-700 font-semibold">
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
                          <button
                            onClick={() => {
                              const inputEl = document.getElementById(`comment-input-${post.id}`);
                              inputEl?.focus();
                            }}
                            className="py-2 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center justify-center gap-2 transition-colors"
                          >
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
                                  className="w-7 h-7 rounded-full object-cover shrink-0"
                                />
                                <div className="p-3 rounded-2xl bg-slate-100 text-slate-800 max-w-[85%]">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-slate-900 block">{c.authorName}</span>
                                    <span className="text-[10px] text-slate-500">{c.timestamp}</span>
                                  </div>
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
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <input
                            id={`comment-input-${post.id}`}
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                            placeholder="Écrivez un commentaire... (Entrée pour envoyer)"
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="p-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-400 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Lightbox Modal for enlarged image view */}
              {lightboxImage && (
                <div
                  className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
                  onClick={() => setLightboxImage(null)}
                >
                  <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setLightboxImage(null)}
                      className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <img
                      src={lightboxImage}
                      alt="Zoom média"
                      className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. ABOUT & CAREER TAB */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-8">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-500" />
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
                <GraduationCap className="w-5 h-5 text-sky-500" />
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
                <Globe2 className="w-5 h-5 text-sky-500" />
                <span>Coordonnées & Réseaux Sociaux</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sky-500" />
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
                      className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white shadow-md border border-sky-500/30 flex flex-col justify-between"
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
                          className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm active:scale-95"
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sky-500" />
                  <span>{currentUser.role === 'trainer' ? 'Formations Créées' : 'Mes Formations & Cours'}</span>
                </h3>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  {userCourses.length} {userCourses.length > 1 ? 'cours' : 'cours'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {userCourses.map((c, index) => (
                  <div
                    key={c.id}
                    onClick={() => onNavigateToCourse(c.id)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10 cursor-pointer transition-all bg-white flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative mb-3 overflow-hidden rounded-xl">
                        <img src={c.thumbnail} alt={c.title} className="w-full h-36 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-900/80 backdrop-blur-xs text-white border border-white/20">
                          {c.category}
                        </span>
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500 text-white">
                          {c.level}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug break-words">{c.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{c.trainerName} • {c.centerName}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Progression</span>
                        <span className="font-bold text-sky-600">{index === 0 ? '68%' : '25%'}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: index === 0 ? '68%' : '25%' }} />
                      </div>
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-slate-400 text-[11px]">{c.durationHours}h de contenu</span>
                        <span className="text-sky-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Continuer →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. LIVE CHAT DIRECT & FORUM PAR FORMATION */}
        {activeTab === 'chat' && (
          <CourseLiveChatTab
            currentUser={currentUser}
            courses={courses}
            initialCourseId={selectedChatCourseId}
            initialTeacherId={selectedChatTeacherId}
            onNavigateToCourse={onNavigateToCourse}
          />
        )}

        {/* 5. NETWORK & FRIENDS TAB - CONSTITUÉ SELON LES FORMATIONS */}
        {activeTab === 'network' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
            {/* Header with Title & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-sky-100 text-sky-700">
                    <Users className="w-5 h-5" />
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-950">
                    Réseau Académique & Amis par Formation
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {currentUser.role === 'trainer'
                    ? 'Apprenants inscrits à vos cours et collègues formateurs de vos spécialités'
                    : 'Vos enseignants référents et camarades de promotion dans vos formations suivies'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-sky-50 text-sky-700 border border-sky-200">
                  {network.length} Contacts Liés aux Formations
                </span>
              </div>
            </div>

            {/* Course Filter Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-sky-600" />
                  <span>Filtrer par Formation :</span>
                </span>
                {networkCourseFilter !== 'all' && (
                  <button
                    onClick={() => setNetworkCourseFilter('all')}
                    className="text-xs text-sky-600 hover:text-sky-800 font-bold cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* Course selection chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setNetworkCourseFilter('all')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    networkCourseFilter === 'all'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Toutes mes Formations
                </button>
                {courses.map((c) => {
                  const isSelected = networkCourseFilter === c.id;
                  const countInCourse = network.filter((n) => n.courseId === c.id).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setNetworkCourseFilter(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span className="max-w-[160px] truncate">{c.title}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {countInCourse}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Role filter buttons */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500">Rôle :</span>
                <button
                  onClick={() => setNetworkRoleFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    networkRoleFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setNetworkRoleFilter('teacher')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    networkRoleFilter === 'teacher'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {currentUser.role === 'trainer' ? 'Formateurs Référents' : 'Mes Enseignants'}
                </button>
                <button
                  onClick={() => setNetworkRoleFilter('learner')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                    networkRoleFilter === 'learner'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {currentUser.role === 'trainer' ? 'Apprenants Inscrits' : 'Camarades de Promo'}
                </button>
              </div>
            </div>

            {/* Network Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {network
                .filter((conn) => {
                  if (networkCourseFilter !== 'all' && conn.courseId !== networkCourseFilter) {
                    return false;
                  }
                  if (networkRoleFilter === 'teacher' && conn.role !== 'trainer') {
                    return false;
                  }
                  if (networkRoleFilter === 'learner' && conn.role !== 'learner') {
                    return false;
                  }
                  return true;
                })
                .map((conn) => {
                  const isTeacher = conn.relationshipType === 'teacher' || conn.role === 'trainer';
                  return (
                    <div
                      key={conn.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between shadow-2xs hover:shadow-md ${
                        isTeacher
                          ? 'bg-sky-50/40 border-sky-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div>
                        {/* Course & Relationship Tag Header */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-3">
                          {/* Relationship Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                              conn.relationshipType === 'teacher'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : conn.relationshipType === 'enrolled_student'
                                ? 'bg-sky-100 text-sky-900 border border-sky-300'
                                : conn.relationshipType === 'peer_learner'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-purple-100 text-purple-900 border border-purple-300'
                            }`}
                          >
                            <UserCheck className="w-2.5 h-2.5" />
                            <span>
                              {conn.relationshipType === 'teacher'
                                ? 'Enseignant Référent'
                                : conn.relationshipType === 'enrolled_student'
                                ? 'Apprenant Inscrit'
                                : conn.relationshipType === 'peer_learner'
                                ? 'Camarade de Promo'
                                : 'Co-intervenant'}
                            </span>
                          </span>

                          {conn.isOnline ? (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              En ligne
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Récemment</span>
                          )}
                        </div>

                        {/* User Identity & Avatar */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="relative shrink-0">
                            <img
                              src={conn.avatar}
                              alt={conn.name}
                              className={`w-12 h-12 rounded-full object-cover border-2 shadow-2xs ${
                                isTeacher ? 'border-sky-400 ring-2 ring-sky-200' : 'border-slate-200'
                              }`}
                            />
                            {conn.isOnline && (
                              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <h4 className="font-extrabold text-sm text-slate-950 truncate">
                                {conn.name}
                              </h4>
                              {isTeacher && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-1 leading-snug">
                              {conn.headline}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {conn.centerName}
                            </p>
                          </div>
                        </div>

                        {/* Associated Course Tag */}
                        {conn.courseTitle && (
                          <div className="p-2 rounded-xl bg-white border border-slate-200/90 text-[11px] text-slate-700 flex items-center gap-2 mb-3">
                            <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span className="truncate font-semibold">{conn.courseTitle}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons: Direct Chat & Friend Toggle */}
                      <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                        {/* Direct Chat Button */}
                        <button
                          onClick={() => {
                            if (conn.courseId) setSelectedChatCourseId(conn.courseId);
                            setSelectedChatTeacherId(conn.id);
                            setActiveTab('chat');
                          }}
                          className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                          title="Ouvrir le chat direct pour cette formation"
                        >
                          <MessageSquareText className="w-3.5 h-3.5" />
                          <span>Chat Direct</span>
                        </button>

                        {/* Friend Status Toggle */}
                        <button
                          onClick={() => handleToggleFriend(conn.id)}
                          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            conn.isFriend
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          {conn.isFriend ? 'Ami ✓' : 'Ajouter'}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                  <span className="mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-100 text-sky-800">
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
  );
};
