import React, { useState } from 'react';
import { Trainer, Course, Center } from '../../types';
import { BLACK_INSTRUCTORS_PRESETS, AVATAR_PHOTO_PRESETS, InstructorPreset } from '../../data/trainersPresets';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Star,
  BookOpen,
  Mail,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  Upload,
  Search,
  Filter,
  Check,
  Award,
  Globe,
  Plus,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface AdminInstructorManagementProps {
  trainers: Trainer[];
  courses: Course[];
  activeCenter?: Center;
  onUpdateTrainers: (trainers: Trainer[]) => void;
}

export const AdminInstructorManagement: React.FC<AdminInstructorManagementProps> = ({
  trainers,
  courses,
  activeCenter,
  onUpdateTrainers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [trainerFormStep, setTrainerFormStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSpecialty, setFormSpecialty] = useState('Intelligence Artificielle & NLP');
  const [formAvatar, setFormAvatar] = useState(AVATAR_PHOTO_PRESETS[0].url);
  const [formBio, setFormBio] = useState('');
  const [formRating, setFormRating] = useState(4.95);
  const [formAssignedCourses, setFormAssignedCourses] = useState<string[]>([]);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  // Specialties list
  const specialties = [
    'all',
    'Intelligence Artificielle & NLP',
    'Systèmes Distribués & Cloud Hybride',
    'Fintech, Mobile Money & Sécurité',
    'Cybersécurité Offensive & SOC',
    'Développement Web & Mobile Fullstack',
    'Data Engineering & MLOps',
    'Design & UX/UI Systèmes'
  ];

  const filteredTrainers = trainers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === 'all' || t.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  const resetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormSpecialty('Intelligence Artificielle & NLP');
    setFormAvatar(AVATAR_PHOTO_PRESETS[0].url);
    setFormBio('');
    setFormRating(4.95);
    setFormAssignedCourses([]);
    setCustomAvatarInput('');
    setTrainerFormStep(1);
    setEditingTrainer(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEditModal = (t: Trainer) => {
    setEditingTrainer(t);
    setTrainerFormStep(1);
    setFormName(t.name);
    setFormEmail(t.email);
    setFormSpecialty(t.specialty);
    setFormAvatar(t.avatar);
    setFormBio(t.bio);
    setFormRating(t.rating || 4.95);
    setFormAssignedCourses(t.coursesAssigned || []);
    setCustomAvatarInput(t.avatar);
    setShowAddModal(true);
  };

  const handleApplyPreset = (preset: InstructorPreset) => {
    setFormName(preset.name);
    setFormEmail(`${preset.name.toLowerCase().replace(/[^a-z]/g, '.')}@${activeCenter?.subdomain || 'academia'}.itech.edu`);
    setFormSpecialty(preset.specialty);
    setFormAvatar(preset.avatar);
    setCustomAvatarInput(preset.avatar);
    setFormBio(preset.bio);
    setFormRating(preset.rating);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const finalAvatar = formAvatar.trim() || customAvatarInput.trim() || AVATAR_PHOTO_PRESETS[0].url;

    if (editingTrainer) {
      // Update existing
      const updated = trainers.map((t) =>
        t.id === editingTrainer.id
          ? {
              ...t,
              name: formName,
              email: formEmail,
              specialty: formSpecialty,
              avatar: finalAvatar,
              bio: formBio || 'Formateur certifié auprès de l\'académie.',
              rating: Number(formRating),
              coursesAssigned: formAssignedCourses,
            }
          : t
      );
      onUpdateTrainers(updated);
    } else {
      // Create new trainer
      const newTrainer: Trainer = {
        id: `trainer-${Date.now()}`,
        name: formName,
        email: formEmail,
        specialty: formSpecialty,
        avatar: finalAvatar,
        bio: formBio || 'Formateur certifié d\'excellence auprès de l\'académie.',
        coursesAssigned: formAssignedCourses,
        rating: Number(formRating),
        status: 'active',
      };
      onUpdateTrainers([newTrainer, ...trainers]);
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteTrainer = (trainerId: string) => {
    if (trainers.length <= 1) {
      alert('Le campus doit conserver au moins un formateur actif.');
      return;
    }
    const updated = trainers.filter((t) => t.id !== trainerId);
    onUpdateTrainers(updated);
  };

  const toggleAssignCourse = (courseId: string) => {
    setFormAssignedCourses((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Administration Formateurs
            </span>
            <span className="text-xs text-slate-500 font-semibold">{trainers.length} formateur(s) affilié(s)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Gestion du Corps Enseignant & Formateurs Référents
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Ajoutez, configurez et personnalisez les profils des instructeurs avec leurs photos, expertises et cours attribués.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs shadow-sky-500/20 active:scale-95 transition-all whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>Ajouter un Formateur</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, email ou spécialité..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="all">Toutes les spécialités</option>
            {specialties.filter((s) => s !== 'all').map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trainers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrainers.map((t) => {
          const assignedCoursesList = courses.filter((c) => t.coursesAssigned?.includes(c.id));
          return (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header with Avatar & Details */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80';
                      }}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-100 ring-2 ring-slate-100 group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                      ✓
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900 truncate">{t.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{t.rating || 4.9}</span>
                      </div>
                    </div>
                    <span className="text-xs text-sky-600 font-semibold block truncate">{t.specialty}</span>
                    <span className="text-[11px] text-slate-400 block truncate flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {t.email}
                    </span>
                  </div>
                </div>

                {/* Bio text */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {t.bio}
                </p>

                {/* Assigned Courses Badges */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Formations prises en charge ({t.coursesAssigned?.length || 0}) :
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedCoursesList.length > 0 ? (
                      assignedCoursesList.map((c) => (
                        <span
                          key={c.id}
                          className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-100 text-slate-700 font-medium truncate max-w-[200px]"
                        >
                          {c.title}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Aucune formation assignée</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEditModal(t)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 border border-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Modifier Profil & Photo</span>
                </button>
                <button
                  onClick={() => handleDeleteTrainer(t.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                  title="Retirer le formateur"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT INSTRUCTOR MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {editingTrainer ? 'Modifier le Formateur' : 'Nouveau Formateur Certifié'}
                </h3>
                <p className="text-xs text-slate-500">
                  Sélectionnez une photo haute définition parmi nos experts ou fournissez une URL personnalisée.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setTrainerFormStep(1)}
                className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  trainerFormStep === 1
                    ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  trainerFormStep === 1 ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  1
                </span>
                <span>1. Portrait & Photo</span>
              </button>

              <div className="w-4 h-0.5 bg-slate-300 mx-1 shrink-0" />

              <button
                type="button"
                onClick={() => setTrainerFormStep(2)}
                className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  trainerFormStep === 2
                    ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  trainerFormStep === 2 ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  2
                </span>
                <span>2. Identité & Expertise</span>
              </button>

              <div className="w-4 h-0.5 bg-slate-300 mx-1 shrink-0" />

              <button
                type="button"
                onClick={() => {
                  if (!formName.trim() || !formEmail.trim()) {
                    setTrainerFormStep(2);
                    return;
                  }
                  setTrainerFormStep(3);
                }}
                className={`flex-1 py-1.5 px-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  trainerFormStep === 3
                    ? 'bg-white text-sky-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  trainerFormStep === 3 ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  3
                </span>
                <span>3. Formations Affectées</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* STEP 1: PHOTO & PRESETS */}
              {trainerFormStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Quick Presets Gallery Selector */}
                  <div className="space-y-2 p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        Modèles d'Instructeurs & Photos Panafricaines Disponibles :
                      </span>
                      <span className="text-[11px] text-sky-700">Cliquez pour pré-remplir</span>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                      {BLACK_INSTRUCTORS_PRESETS.map((preset) => {
                        const isSelected = formAvatar === preset.avatar;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleApplyPreset(preset)}
                            className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all group cursor-pointer ${
                              isSelected ? 'border-sky-500 ring-2 ring-sky-300 scale-105' : 'border-slate-200 hover:border-sky-400'
                            }`}
                            title={`${preset.name} - ${preset.specialty}`}
                          >
                            <img
                              src={preset.avatar}
                              alt={preset.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80';
                              }}
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-sky-600/30 flex items-center justify-center text-white">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Photo Preview & Custom URL Input */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="sm:col-span-3 flex flex-col items-center text-center space-y-1.5">
                      <img
                        src={formAvatar || customAvatarInput || AVATAR_PHOTO_PRESETS[0].url}
                        alt="Aperçu Photo"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80';
                        }}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-200 shadow-sm"
                      />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Aperçu Photo</span>
                    </div>

                    <div className="sm:col-span-9 space-y-2">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                        URL de la Photo du Formateur :
                      </label>
                      <input
                        type="url"
                        value={formAvatar}
                        onChange={(e) => {
                          setFormAvatar(e.target.value);
                          setCustomAvatarInput(e.target.value);
                        }}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                      />
                      <p className="text-[11px] text-slate-500">
                        Vous pouvez coller l'URL d'une photo d'identité ou cliquer sur l'un des portraits ci-dessus.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setTrainerFormStep(2)}
                      className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <span>Continuer vers l'Identité</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: IDENTITÉ & BIO */}
              {trainerFormStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Text Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Nom & Titre Académique :</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Ex : Pr. Fatou Sow ou Dr. Landry Bakweto"
                        className="w-full p-2.5 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Email Professionnel :</label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="formateur@mon-centre.edu"
                        className="w-full p-2.5 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Spécialité Principale :</label>
                      <select
                        value={formSpecialty}
                        onChange={(e) => setFormSpecialty(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white"
                      >
                        {specialties.filter((s) => s !== 'all').map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-800">Note & Évaluation Initiale :</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        max="5"
                        value={formRating}
                        onChange={(e) => setFormRating(parseFloat(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Biographie & Titres de Compétences :</label>
                    <textarea
                      rows={3}
                      value={formBio}
                      onChange={(e) => setFormBio(e.target.value)}
                      placeholder="Parcours universitaire, certifications industrielles et réalisations..."
                      className="w-full p-2.5 rounded-xl bg-slate-50 text-slate-900 text-xs border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setTrainerFormStep(1)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Photo & Portrait</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrainerFormStep(3)}
                      className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                    >
                      <span>Affectation Formations</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: AFFECTATION DES FORMATIONS & VALIDATION */}
              {trainerFormStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs space-y-1">
                    <div className="font-bold text-sky-950 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-sky-600" />
                      <span>Récapitulatif : {formName || 'Nouveau Formateur'}</span>
                    </div>
                    <p className="text-slate-600">
                      Spécialité : <strong>{formSpecialty}</strong> • Note : <strong>{formRating}/5</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800 block">
                      Affecter des formations à ce formateur :
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                      {courses.map((course) => {
                        const isAssigned = formAssignedCourses.includes(course.id);
                        return (
                          <button
                            key={course.id}
                            type="button"
                            onClick={() => toggleAssignCourse(course.id)}
                            className={`p-2 rounded-lg text-left text-xs flex items-center gap-2 transition-all cursor-pointer ${
                              isAssigned
                                ? 'bg-sky-50 border border-sky-300 text-sky-900 font-semibold'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                                isAssigned ? 'bg-sky-500 text-white' : 'border border-slate-300'
                              }`}
                            >
                              {isAssigned && '✓'}
                            </div>
                            <span className="truncate">{course.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setTrainerFormStep(2)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Identité & Bio</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-xs shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{editingTrainer ? 'Enregistrer' : 'Créer le Formateur'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
