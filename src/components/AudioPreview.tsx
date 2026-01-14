import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";
import { AudioWaveform } from "./AudioWaveform";

interface AudioPreviewProps {
  label: string;
  audioSource: File | Blob | null;
  variant?: "original" | "converted";
}

export const AudioPreview = ({ label, audioSource, variant = "original" }: AudioPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioSource) {
      const url = URL.createObjectURL(audioSource);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioUrl(null);
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
    }
  }, [audioSource]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newProgress: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = (newProgress / 100) * duration;
  };

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!audioSource) return null;

  const isConverted = variant === "converted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        p-4 rounded-lg border space-y-3
        ${isConverted 
          ? "bg-accent/5 border-accent/20" 
          : "bg-muted/50 border-border"
        }
      `}
    >
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className={`
              flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors
              ${isConverted
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
              }
            `}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="truncate max-w-[200px]">{label}</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground flex-shrink-0">
          {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}
        </span>
      </div>
      
      {/* Waveform */}
      <AudioWaveform
        audioUrl={audioUrl}
        progress={progress}
        isPlaying={isPlaying}
        variant={variant}
        onSeek={handleSeek}
      />
    </motion.div>
  );
};
