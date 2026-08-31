import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic, Sparkles, Check, CheckCheck } from 'lucide-react';

interface VoiceNoteBubbleProps {
  audioUrl?: string;
  duration?: number;
  transcription?: string;
  isUser: boolean;
  timestamp: string;
}

export const VoiceNoteBubble: React.FC<VoiceNoteBubbleProps> = ({
  audioUrl,
  duration = 5,
  transcription,
  isUser,
  timestamp,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscription, setShowTranscription] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.onerror = () => {
        setIsPlaying(false);
      };

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Fixed bars for waveform
  const waveformBars = [25, 45, 65, 90, 40, 30, 75, 100, 50, 35, 70, 85, 45, 60, 30, 80, 55, 40, 65, 30];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : isPlaying ? 50 : 0;

  return (
    <div className={`flex flex-col gap-1.5 w-full max-w-[280px] sm:max-w-[320px] ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`flex items-center gap-3 p-3 rounded-2xl shadow-md border ${
          isUser
            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 border-emerald-500/50 text-white rounded-br-none'
            : 'bg-slate-900 border-slate-700 text-slate-100 rounded-bl-none'
        }`}
      >
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 shadow-sm ${
            isUser ? 'bg-white text-emerald-700 hover:bg-slate-100' : 'bg-emerald-500 text-white hover:bg-emerald-400'
          }`}
          title={isPlaying ? 'Pause' : 'Écouter le vocal'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
        </button>

        {/* Waveform & Duration */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-0.5 h-6 mb-1">
            {waveformBars.map((h, i) => {
              const barProgress = (i / waveformBars.length) * 100;
              const isPassed = barProgress <= progressPercent;
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-colors ${
                    isPassed
                      ? isUser
                        ? 'bg-white'
                        : 'bg-emerald-400'
                      : isUser
                      ? 'bg-emerald-300/40'
                      : 'bg-slate-700'
                  }`}
                  style={{ height: `${Math.max(15, h)}%` }}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono opacity-90">
            <span>{isPlaying ? formatTime(currentTime) : formatTime(duration)}</span>
            <div className="flex items-center gap-1">
              <Mic className="w-3 h-3" />
              <span>{timestamp}</span>
              {isUser && <CheckCheck className="w-3.5 h-3.5 text-emerald-200 ml-0.5" />}
            </div>
          </div>
        </div>
      </div>

      {/* Transcription toggle */}
      {transcription && (
        <div className={`text-xs ${isUser ? 'text-right' : 'text-left'}`}>
          <button
            type="button"
            onClick={() => setShowTranscription(!showTranscription)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium underline-offset-2 hover:underline inline-flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>{showTranscription ? 'Masquer la transcription' : 'Voir la transcription'}</span>
          </button>
          {showTranscription && (
            <p className="mt-1 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-[11px] leading-relaxed max-w-[280px]">
              "{transcription}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};
