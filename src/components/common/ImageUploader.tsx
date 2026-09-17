import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Check,
  FolderOpen,
  X,
  AlertCircle
} from 'lucide-react';

export interface ImageUploaderProps {
  value: string;
  onChange: (urlOrBase64: string) => void;
  label?: string;
  description?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  shape?: 'rounded' | 'circle';
  maxSizeMB?: number;
  presets?: { label: string; url: string }[];
  placeholderText?: string;
  className?: string;
  id?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Image',
  description,
  aspectRatio = 'video',
  shape = 'rounded',
  maxSizeMB = 10,
  presets = [],
  placeholderText = 'Glissez-déposez une image ou cliquez pour parcourir',
  className = '',
  id = 'image-uploader',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
    auto: 'min-h-[140px]',
  }[aspectRatio];

  const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  const handleFile = (file: File) => {
    setErrorMessage(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Veuillez sélectionner un fichier image valide (.png, .jpg, .webp, .svg).');
      return;
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`L'image dépasse la taille maximale autorisée de ${maxSizeMB} Mo.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Erreur lors de la lecture du fichier image.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlInputValue.trim()) {
      onChange(urlInputValue.trim());
      setShowUrlInput(false);
      setUrlInputValue('');
      setErrorMessage(null);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id={id} className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {label}
          </label>
          {description && (
            <span className="text-[11px] text-slate-500">{description}</span>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Main Upload Zone or Preview */}
      {value ? (
        <div className="relative group overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-2xl p-2 shadow-xs transition-all">
          <div className={`relative overflow-hidden w-full ${aspectClasses} ${shapeClasses} bg-slate-950 flex items-center justify-center`}>
            <img
              src={value}
              alt="Aperçu"
              className={`w-full h-full object-cover ${shapeClasses}`}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80';
              }}
            />
            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
              >
                <UploadCloud className="w-3.5 h-3.5 text-sky-600" />
                <span>Remplacer</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
                title="Supprimer l'image"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Retirer</span>
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="truncate max-w-[200px] flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Image active chargée</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sky-600 hover:text-sky-700 font-semibold"
              >
                Changer le fichier
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-slate-500 hover:text-slate-700"
              >
                {showUrlInput ? 'Masquer URL' : 'Éditer via URL'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Dropzone State */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
            isDragging
              ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 bg-slate-50/70 dark:bg-slate-900/50 hover:bg-slate-100/70'
          }`}
        >
          <div className={`p-3 rounded-2xl ${isDragging ? 'bg-sky-500 text-white' : 'bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400'} transition-colors`}>
            <UploadCloud className="w-6 h-6 animate-bounce-subtle" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {isDragging ? 'Relâchez pour charger l\'image' : placeholderText}
            </p>
            <p className="text-[11px] text-slate-500">
              Glissez-déposez ou <span className="text-sky-600 font-bold underline">parcourez vos fichiers</span> (PNG, JPG, WEBP jusqu'à {maxSizeMB} Mo)
            </p>
          </div>

          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Choisir un fichier</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(!showUrlInput);
              }}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1"
            >
              <LinkIcon className="w-3 h-3 text-slate-500" />
              <span>Lien URL</span>
            </button>
          </div>
        </div>
      )}

      {/* Optional URL manual input fallback */}
      {showUrlInput && (
        <div className="p-3 bg-sky-50/70 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 rounded-xl space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-bold text-sky-900 dark:text-sky-200">
            <span className="flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-sky-600" />
              <span>Saisir une URL d'image directe :</span>
            </span>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInputValue}
              onChange={(e) => setUrlInputValue(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-sky-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-500 whitespace-nowrap"
            >
              Valider l'URL
            </button>
          </div>
        </div>
      )}

      {/* Error Message if any */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Quick presets gallery if provided */}
      {presets.length > 0 && (
        <div className="pt-1.5 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Ou choisir parmi les modèles prédéfinis :
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setErrorMessage(null);
                }}
                className={`relative rounded-xl overflow-hidden border-2 shrink-0 w-16 h-12 transition-all ${
                  value === preset.url ? 'border-sky-500 ring-2 ring-sky-300 scale-105' : 'border-slate-200 hover:border-sky-400'
                }`}
                title={preset.label}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-slate-950/75 text-[8px] font-bold text-white px-1 truncate text-center">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
