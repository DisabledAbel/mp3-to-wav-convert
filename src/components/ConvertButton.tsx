import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConvertButtonProps {
  disabled: boolean;
  isConverting: boolean;
  onClick: () => void;
}

export const ConvertButton = ({ disabled, isConverting, onClick }: ConvertButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled || isConverting}
        size="lg"
        className="relative w-full sm:w-auto px-8 py-6 text-lg font-display font-semibold 
          bg-gradient-to-r from-primary to-accent text-primary-foreground
          hover:opacity-90 transition-opacity disabled:opacity-50
          shadow-glow hover:shadow-glow"
      >
        {isConverting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Converting...
          </>
        ) : (
          <>
            Convert to WAV
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </motion.div>
  );
};
