import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";

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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    audio.currentTime = clickPosition * duration;
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
        flex items-center gap-3 p-4 rounded-lg border
        ${isConverted 
          ? "bg-accent/5 border-accent/20" 
          : "bg-muted/50 border-border"
        }
      `}
    >
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}
      
      {/* Play Button */}
      <button
        onClick={togglePlay}
        className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors
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

      {/* Info & Progress */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground truncate">
            <Volume2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{label}</span>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatTime(audioRef.current?.currentTime || 0)} / {formatTime(duration)}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div
          onClick={handleSeek}
          className="relative h-1.5 bg-border rounded-full cursor-pointer overflow-hidden group"
        >
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${
              isConverted ? "bg-accent" : "bg-primary"
            }`}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
          <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  );
};
