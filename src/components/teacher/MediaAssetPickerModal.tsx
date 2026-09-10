import React, { useState } from 'react';
import {
  UploadCloud,
  ImageIcon,
  Presentation,
  FileText,
  X,
  Check,
  Sparkles,
  Link2,
  FolderOpen,
  Search,
  Filter
} from 'lucide-react';

export interface TechMediaPreset {
  id: string;
  category: 'ia_data' | 'architecture' | 'cloud' | 'cyber' | 'dev' | 'business';
  title: string;
  url: string;
  thumbnail: string;
}

export const CURATED_TECH_PRESETS: TechMediaPreset[] = [
  // IA & Data
  {
    id: 'ai-1',
    category: 'ia_data',
    title: 'Réseau de Neurones & Deep Learning',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'ai-2',
    category: 'ia_data',
    title: 'Data Science & Visualisation de Données',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'ai-3',
    category: 'ia_data',
    title: 'Traitement du Langage Naturel & LLM',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&auto=format&fit=crop&q=80',
  },
  // Architecture & Dev
  {
    id: 'dev-1',
    category: 'architecture',
    title: 'Architecture Logicielle & Code Source',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dev-2',
    category: 'dev',
    title: 'Développement Web Fullstack & API',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dev-3',
    category: 'architecture',
    title: 'Schéma Conceptuel & Design System',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&auto=format&fit=crop&q=80',
  },
  // Cloud & DevOps
  {
    id: 'cloud-1',
    category: 'cloud',
    title: 'Infrastructure Cloud & Serveurs Datacenter',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cloud-2',
    category: 'cloud',
    title: 'Pipelines CI/CD & Automatisation',
    url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&auto=format&fit=crop&q=80',
  },
  // Cyber
  {
    id: 'cyber-1',
    category: 'cyber',
    title: 'Cybersécurité & Protection des Réseaux',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cyber-2',
    category: 'cyber',
    title: 'Cryptographie & Sécurité des Systèmes',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
  },
  // Business
  {
    id: 'bus-1',
    category: 'business',
    title: 'Gestion de Projet Agile & Scrum',
    url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'bus-2',
    category: 'business',
    title: 'Transformation Numérique & Leadership',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=80',
  }
];

interface MediaAssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  targetType?: 'image' | 'presentation' | 'both';
  onSelectImage?: (url: string, caption?: string) => void;
  onSelectPresentation?: (data: {
    fileUrl: string;
    fileName: string;
    fileSize: string;
    format: 'pptx' | 'ppt' | 'pdf';
  }) => void;
}

export const MediaAssetPickerModal: React.FC<MediaAssetPickerModalProps> = ({
  isOpen,
  onClose,
  title = 'Sélectionner ou Importer un Média Pédagogique',
  targetType = 'image',
  onSelectImage,
  onSelectPresentation,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'url'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customCaption, setCustomCaption] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadedFilePreview, setUploadedFilePreview] = useState<{
    name: string;
    size: string;
    type: string;
    dataUrl: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const isPresentation =
      file.name.endsWith('.pptx') || file.name.endsWith('.ppt') || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const formattedSize = `${sizeInMb} MB`;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedFilePreview({
        name: file.name,
        size: formattedSize,
        type: isPresentation ? 'presentation' : 'image',
        dataUrl: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirmUpload = () => {
    if (!uploadedFilePreview) return;

    if (uploadedFilePreview.type === 'presentation' && onSelectPresentation) {
      const ext = uploadedFilePreview.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'pptx';
      onSelectPresentation({
        fileUrl: uploadedFilePreview.dataUrl,
        fileName: uploadedFilePreview.name,
        fileSize: uploadedFilePreview.size,
        format: ext as any,
      });
    } else if (onSelectImage) {
      onSelectImage(uploadedFilePreview.dataUrl, customCaption || uploadedFilePreview.name);
    }
    onClose();
  };

  const handleConfirmUrl = () => {
    if (!customUrl.trim()) return;

    if (
      (customUrl.endsWith('.pptx') || customUrl.endsWith('.ppt') || customUrl.endsWith('.pdf')) &&
      onSelectPresentation
    ) {
      const ext = customUrl.toLowerCase().endsWith('.pdf') ? 'pdf' : 'pptx';
      const fileName = customUrl.split('/').pop() || 'support_presentation.pptx';
      onSelectPresentation({
        fileUrl: customUrl,
        fileName,
        fileSize: '3.5 MB',
        format: ext as any,
      });
    } else if (onSelectImage) {
      onSelectImage(customUrl, customCaption);
    }
    onClose();
  };

  const filteredPresets =
    selectedCategory === 'all'
      ? CURATED_TECH_PRESETS
      : CURATED_TECH_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              {targetType === 'presentation' ? (
                <Presentation className="w-4 h-4" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">
                {targetType === 'presentation'
                  ? 'Fichiers PowerPoint (.pptx, .ppt) ou Diaporamas PDF'
                  : 'Images haute résolution, diagrammes et schémas techniques'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'upload'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Importer depuis votre appareil</span>
          </button>

          {targetType !== 'presentation' && (
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'gallery'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Galerie Thématique ITECH</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'url'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Lien direct / URL</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: FILE UPLOAD (DRAG & DROP) */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {!uploadedFilePreview ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
                    dragActive
                      ? 'border-indigo-400 bg-indigo-950/30 scale-[1.01]'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
                    {targetType === 'presentation' ? (
                      <Presentation className="w-8 h-8 text-amber-400" />
                    ) : (
                      <UploadCloud className="w-8 h-8" />
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    Glissez-déposez votre fichier ici
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                    {targetType === 'presentation'
                      ? 'Accepte les fichiers PowerPoint (.pptx, .ppt) et les diaporamas PDF (jusqu\'à 50 MB).'
                      : 'Accepte les images PNG, JPG, JPEG, WEBP, SVG (recommandé : 1200x800 px ou supérieur).'}
                  </p>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-all shadow-md shadow-indigo-950/50">
                    <FolderOpen className="w-4 h-4" />
                    <span>Parcourir mes fichiers</span>
                    <input
                      type="file"
                      className="hidden"
                      accept={
                        targetType === 'presentation'
                          ? '.pptx,.ppt,.pdf'
                          : targetType === 'image'
                          ? 'image/*'
                          : '.pptx,.ppt,.pdf,image/*'
                      }
                      onChange={handleFileInput}
                    />
                  </label>
                </div>
              ) : (
                /* Uploaded File Selected Review */
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Fichier prêt à être inséré
                    </span>
                    <button
                      type="button"
                      onClick={() => setUploadedFilePreview(null)}
                      className="text-xs text-slate-400 hover:text-rose-400"
                    >
                      Changer de fichier
                    </button>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    {uploadedFilePreview.type === 'image' ? (
                      <img
                        src={uploadedFilePreview.dataUrl}
                        alt="Aperçu"
                        className="w-16 h-16 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <Presentation className="w-6 h-6" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-white truncate">
                        {uploadedFilePreview.name}
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        Taille : {uploadedFilePreview.size} • Type : {uploadedFilePreview.type.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {targetType !== 'presentation' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Légende ou Description (Optionnelle)
                      </label>
                      <input
                        type="text"
                        value={customCaption}
                        onChange={(e) => setCustomCaption(e.target.value)}
                        placeholder="Ex: Figure 1.2 : Diagramme de flux de données"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleConfirmUpload}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Valider et insérer dans le cours</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CURATED GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'ia_data', label: 'IA & Data' },
                  { id: 'architecture', label: 'Architecture' },
                  { id: 'dev', label: 'Web & Dev' },
                  { id: 'cloud', label: 'Cloud & DevOps' },
                  { id: 'cyber', label: 'Cybersécurité' },
                  { id: 'business', label: 'Management' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid of presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {filteredPresets.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onSelectImage) {
                        onSelectImage(item.url, item.title);
                        onClose();
                      }
                    }}
                    className="group relative rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500 bg-slate-950 cursor-pointer transition-all hover:scale-[1.02] shadow-sm"
                  >
                    <div className="h-28 overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2.5 bg-slate-950">
                      <p className="text-[11px] font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Adresse URL de la Ressource (Image ou Support PPTX/PDF)
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... ou https://onedrive.live.com/embed..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Légende / Titre descriptif
                </label>
                <input
                  type="text"
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  placeholder="Ex: Schéma fonctionnel du système d'information"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {customUrl.trim() && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-wider font-bold">
                    Aperçu en direct :
                  </p>
                  <img
                    src={customUrl}
                    alt="Aperçu URL"
                    onError={(e) => {
                      (e.target as any).style.display = 'none';
                    }}
                    className="max-h-40 rounded-lg object-contain mx-auto"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmUrl}
                disabled={!customUrl.trim()}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-950/50"
              >
                <Check className="w-4 h-4" />
                <span>Confirmer l'URL et insérer</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
