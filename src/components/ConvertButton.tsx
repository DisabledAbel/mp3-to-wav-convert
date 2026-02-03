import { motion } from "framer-motion";
import { ArrowRight, Loader2, FileAudio, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversionDirection } from "@/lib/audioConverter";

interface ConvertButtonProps {
  disabled: boolean;
  isConverting: boolean;
  direction: ConversionDirection;
  onClick: () => void;
}

export const ConvertButton = ({ disabled, isConverting, direction, onClick }: ConvertButtonProps) => {
  const inputFormat = direction === "mp3-to-wav" ? "MP3" : "WAV";
  const outputFormat = direction === "mp3-to-wav" ? "WAV" : "MP3";
  const OutputIcon = direction === "mp3-to-wav" ? Waves : FileAudio;
  const isReady = !disabled && !isConverting;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full"
    >
      <motion.div
        animate={isReady ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        transition={isReady ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        <Button
          onClick={onClick}
          disabled={disabled || isConverting}
          size="lg"
          className="relative w-full px-8 py-8 text-xl font-display font-bold 
            bg-gradient-to-r from-primary to-accent text-primary-foreground
            hover:scale-[1.02] transition-all duration-200 disabled:opacity-50
            shadow-glow hover:shadow-glow rounded-2xl"
        >
          {isConverting ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <OutputIcon className="w-6 h-6 mr-3" />
              Convert {inputFormat} → {outputFormat}
              <ArrowRight className="w-6 h-6 ml-3" />
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};
