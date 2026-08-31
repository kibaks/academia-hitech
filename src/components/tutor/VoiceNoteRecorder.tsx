import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Trash2, Send, Play, Pause, RefreshCw, Volume2, AlertCircle } from 'lucide-react';

interface VoiceNoteRecorderProps {
  onSendVoiceNote: (audioBlob: Blob, durationSecs: number, transcript?: string) => Promise<void> | void;
  languageCode: string;
  isProcessing?: boolean;
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  onSendVoiceNote,
  languageCode,
  isProcessing = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [volumeLevels, setVolumeLevels] = useState<number[]>([15, 25, 45, 60, 30, 20, 50, 70, 40, 20, 35, 65]);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    setMicPermissionError(null);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setLiveTranscription('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Audio visualizer setup
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateWaveform = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            // Sample 12 frequency bars
            const bars = [];
            const step = Math.max(1, Math.floor(dataArray.length / 12));
            for (let i = 0; i < 12; i++) {
              const val = dataArray[i * step] || 0;
              bars.push(Math.max(12, Math.min(100, Math.round((val / 255) * 100))));
            }
            setVolumeLevels(bars);
            animFrameRef.current = requestAnimationFrame(updateWaveform);
          };
          updateWaveform();
        }
      } catch (e) {
        console.warn('Audio Context Visualizer fallback:', e);
      }

      // Try browser speech recognition in parallel for instant live transcription
      try {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = languageCode || 'fr-FR';
          recognition.onresult = (event: any) => {
            let text = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
              text += event.results[i][0].transcript;
            }
            if (text) {
              setLiveTranscription(text);
            }
          };
          recognition.onerror = () => {};
          recognitionRef.current = recognition;
          recognition.start();
        }
      } catch {
        // SpeechRecognition not supported or permission issue
      }

      // MediaRecorder initialization
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        } else {
          mimeType = '';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      recorder.start(200);
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setMicPermissionError(
        'Accès au microphone refusé ou non disponible. Veuillez autoriser le microphone dans votre navigateur.'
      );
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  // Cancel & discard
  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingDuration(0);
    setLiveTranscription('');
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    }
  };

  // Toggle preview playback
  const togglePlayPreview = () => {
    if (!previewAudioRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      previewAudioRef.current = audio;
      audio.onended = () => setIsPlayingPreview(false);
      audio.onerror = () => setIsPlayingPreview(false);
    }

    if (previewAudioRef.current) {
      if (isPlayingPreview) {
        previewAudioRef.current.pause();
        setIsPlayingPreview(false);
      } else {
        previewAudioRef.current.play();
        setIsPlayingPreview(true);
      }
    }
  };

  // Confirm and send voice note
  const handleSend = async () => {
    if (!audioBlob) return;
    const duration = recordingDuration;
    const transcript = liveTranscription;
    cancelRecording();
    await onSendVoiceNote(audioBlob, duration, transcript);
  };

  useEffect(() => {
    return () => {
      cancelRecording();
    };
  }, []);

  return (
    <div className="relative">
      {micPermissionError && (
        <div className="mb-2 p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{micPermissionError}</span>
        </div>
      )}

      {/* State 1: Default / Idle - Trigger Button */}
      {!isRecording && !audioBlob && (
        <button
          type="button"
          onClick={startRecording}
          disabled={isProcessing}
          className="relative group p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          title="Enregistrer un message vocal"
        >
          <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold hidden sm:inline">Vocal</span>
        </button>
      )}

      {/* State 2: Active Recording Mode */}
      {isRecording && (
        <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-2xl bg-slate-900 border border-emerald-500/60 shadow-xl w-full max-w-md">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-rose-600/20 text-rose-500 shrink-0">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 relative" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono font-bold text-emerald-400">{formatTime(recordingDuration)}</span>
              <span className="text-[10px] text-slate-400 truncate">
                {liveTranscription ? `"${liveTranscription.slice(0, 30)}..."` : 'Parlez maintenant...'}
              </span>
            </div>

            {/* Live Frequency Waveform */}
            <div className="flex items-center gap-1 h-5">
              {volumeLevels.map((lvl, idx) => (
                <motion.div
                  key={idx}
                  className="w-1 bg-gradient-to-t from-emerald-500 to-teal-300 rounded-full"
                  animate={{ height: `${lvl}%` }}
                  transition={{ duration: 0.1 }}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={cancelRecording}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 text-slate-400 transition-colors"
              title="Annuler"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={stopRecording}
              className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              title="Terminer l'enregistrement"
            >
              <Square className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>
      )}

      {/* State 3: Recorded Preview Mode - Listen, Discard or Send */}
      {!isRecording && audioBlob && (
        <div className="flex items-center gap-2 sm:gap-3 p-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl w-full max-w-md">
          <button
            type="button"
            onClick={togglePlayPreview}
            className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm"
            title={isPlayingPreview ? 'Pause' : 'Écouter'}
          >
            {isPlayingPreview ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono font-bold text-slate-200">{formatTime(recordingDuration)}</span>
              <span className="text-[10px] text-emerald-400 font-medium">Message vocal prêt</span>
            </div>
            {liveTranscription ? (
              <p className="text-[11px] text-slate-300 italic truncate max-w-[200px]">
                "{liveTranscription}"
              </p>
            ) : (
              <div className="flex items-center gap-1 h-3">
                {[40, 60, 30, 80, 50, 30, 70, 90, 40, 60, 80, 50].map((h, i) => (
                  <div key={i} className="w-1 bg-slate-600 rounded-full" style={{ height: `${h}%` }} />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={cancelRecording}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 text-slate-400 transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={isProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
