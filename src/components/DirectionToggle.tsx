import { motion } from "framer-motion";
import { FileAudio, Waves, ArrowLeftRight } from "lucide-react";
import { ConversionDirection } from "@/lib/audioConverter";

interface DirectionToggleProps {
  direction: ConversionDirection;
  onToggle: () => void;
}

export const DirectionToggle = ({ direction, onToggle }: DirectionToggleProps) => {
  const isMP3toWAV = direction === "mp3-to-wav";

  return (
    <div className="flex items-center justify-center gap-3">
      <motion.div
        layout
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          isMP3toWAV 
            ? "bg-muted text-muted-foreground" 
            : "bg-primary/10 text-primary"
        }`}
      >
        <FileAudio className="w-4 h-4" />
        MP3
      </motion.div>

      <button
        onClick={onToggle}
        className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors group"
        aria-label="Switch conversion direction"
      >
        <motion.div
          animate={{ rotate: isMP3toWAV ? 0 : 180 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ArrowLeftRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.div>
      </button>

      <motion.div
        layout
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          isMP3toWAV 
            ? "bg-primary/10 text-primary" 
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Waves className="w-4 h-4" />
        WAV
      </motion.div>
    </div>
  );
};
